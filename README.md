### Design decisions

#### Data storage 
It's local JSON, as discussed. I did break the data handling out to a class, which would allow easy replacement with an equivalent handler for a database or whatever other 
  data store.

#### Thumbnails
Konva made it really easy to just use smaller canvases. Going into this I was thinking thumbnails would be the most complex part, that I'd maybe have to generate SVGs in Python with 
Shapely or something like that, then have a folder structure for them, then serve them back, and so on. Nope - just make a small noninteractive canvas, display the same points, and scale 
the whole thing. It was actually one of the most straightforward parts of the build. It's always nice when that happens, something you thought would be a nightmare ends up actually 
pleasant to do.
* I did note in a comment in `StaticPolygonThumbnail` that it could be combined with the larger, interactive canvas in a single component to cut down on redundancy. That's something 
  that if I were maintaining this long term I'd want to do early.
* There are a couple other "future effort" comments in various places - they're also me thinking "what if I was treating this as a real prod app, what would I be looking to improve soon".

#### Convex polygons
  It's actually easier with Konva to support any kind of geometry than it would be to restrict only to convex polygons. I'm not sure if that would change if we were 
  restricted to just vanilla Canvas, but there's not a lot of reason I can see that we'd want to use that instead of Konva; it's pretty deep and there's a lot of cool stuff that it 
  enables (drag and drop images, animations, operations on shapes, etc).
  * If we did want to restrict to convex polygons, basically I'd expand `pointClickHandler` in `PolygonCanvas` to validate, before it places a new point, that the boundary drawn so far 
    is potentially convex, so you can't draw anything else. Then I'd expand `handleDragMove` to do the same with drag events - could maybe even do something nifty like use the interior of 
    the polygon as a bounding box and test if the drag is going into it, then cut off the event if so. 
  * Similarly, I don't like that this allows self-intersecting polygons; I'm not sure why I don't like it, actually, but maybe it's because I doubt many real fields have 
    self-intersection going on. I was kind of looking forward to probing Konva's math capabilities to calculate if the line intersects itself and disallow the change if it does, but I 
    didn't get time to do it.

#### Geographical flag
There's a field in the data model for "is this a geographical shape". That's just me sort of spitballing on what kind of fields we'd want if this were a real use case - I wanted 
something other than just a bunch of text fields, for variety. 
* It's a boolean, and if `true` it requires that `centroid` also be set, which is just lat/long coordinates for whatever centroid we might want to use to locate the shape in the world .
  * I don't really have GIS experience, but I do know "whatever centroid" is potentially a whole big can of worms; that'd be a PM/feedback-gathering effort in a real app.
* I chose to require numeric coordinates because I know they can easily be plugged into other services - Google Maps or similar, or any other GIS system we'd want. I don't actually 
  have experience dealing with coords, so I don't know if they're really that much harder to work with in alphanumeric, but I kind of figure it's like the way I usually choose to handle 
  time and date - store the data as the most convenient/solid/machine-friendly option (a unix timestamp, in that case) and handle whatever format the user wants to see it in as close to the 
  UI as you can.
    * So, if we wanted to support both types, the right thing to do would probably be to convert them to numeric in the data model, but also record what format the user chose to enter 
      them in, and display them back in that format. Or have a preference setting per-user for "how do you want your coords displayed" and use that universally, saving us the complexity 
      of recording what they used on entry.
      
#### Python/React split
This ended up being a seriously frontend-heavy project. I had anticipated maybe having to do more shape handling on the backend, but React-router's client side routing and Konva's 
canvas power made it really compelling to just do everything in the frontend. I would not normally say I'm this much of a frontend dev, and I don't want this codebase to imply that I'm 
more comfortable in frontend - I wouldn't really describe myself as more comfortable in either place, though I would absolutely say I'm more comfortable in Python than JS or Typescript. 
You just can't reasonably do frontend UI in Python (yet - there are always projects), so it is what it is. 

In general, I would characterize myself as pretty close to 50/50 frontend/backend, and I do try to kind of stay in that balance.

### Installation
```
(clone and set up desired venv/conda env/etc - built against python 3.10.6)
pip install -r requirements.txt
cd react-app
npm install
npm run build
```

### Running the app
`flask run`, from the project root directory - runs the app in the Flask dev server, bound by default to http://localhost:5000.

Everything is served by Flask, no React/Node run/serve commands required.

If you have no `data/polygons.json` file, one will be created automatically the first time you create a polygon.

### Refreshing after changes
If run with `flask run --debug`, changes to Python files will automatically restart the server with the changes.

Seems `create-react-app` doesn't support a Webpack watch/dev mode natively. As such, `npm run build` after making changes, wait, and reload. I tried to find a quick workaround for this, 
but no dice so far.

If the Flask server is accessed while NPM is building, it will throw TemplateNotFound, since NPM deletes the old build. This could be caught, but realistically it would never occur in a 
real prod pipeline.

### Linting
Not enforcing consistency on myself was gnawing at me, so I added linters and turned on most of their rules. I've got the rules in `.eslintrc.js` 90% conforming to a style I prefer, 
which is enough - this is a little bit verbose with the linebreaks in React compared to what I'd naturally do. There are some justifications for some of the settings in comments where they 
might be controversial opinions. 

* `npm run lint` runs ESlint.
* `flake8` runs Flake8.
* `black app.py` runs Black in autoformat mode. `black -diff app.py` will show what it's going to do.

Note that ESlint does run on build and will fail the build. This is a create-react-app internal default.

### Testing
`npm run test` will run all React tests. Sadly there's only one - the default "does this render at all" test that came with create-react-app.

I had really hoped to have more tests for this, but decided to use the time on functionality instead. Given another day I could probably get them pretty comprehensive; I'd start with React, 
since there's a lot more functionality in the frontend with this one - at the minimum, each major component needs to have a test, the frontend validation needs to be tested, and it'd be 
good to test some of the little edge cases, especially around the canvas and the first point/event filter stuff.

There's not a lot to even test on the Flask side; basically all that could be done would be to isolate the Flask app itself from the data handler class, come up with some kind of 
interface testing harness, and poke at them independently. I could also feed it some invalid data and add better error handling; right now I'm relying on the tight coupling of the UI and 
the backend, and the frontend validation not passing anything bad to the backend. In prod, that would be a no-go - as a general rule I assume the user has total control of anything sent 
from the browser, which means CSRF, doubling up all the frontend validation with equivalent backend validation, input sanitization on the data handler, and so on. 

### Additional Frameworks/Tools:
* https://create-react-app.dev/ - bootstrapping a skeleton for the React side.
* https://cloudscape.design/ - component library and "sensible default" CSS. The previous version of this is AWS UI, which I've used a lot internally; it's what I'm most familiar with, so I 
  used it here to save time. This could easily be Material UI or whatever other component library, or (in a pinch) just full custom CSS with something like styled-components.
* https://reactrouter.com/ - Page routing. We've only got two pages, but it still simplifies things pretty substantially, and taking full advantage of client side routing is 
  fast/responsive/clean.
* https://typescript-eslint.io/ - linting for Typescript.
* https://axios-http.com/ - API call handling.
* https://konvajs.org/docs/react/Intro.html - Canvas component and handlers.
* https://flake8.pycqa.org/en/latest/index.html#quickstart - standard Python linter.
* https://black.readthedocs.io/en/stable/index.html - Python autoformatter/opinonated linter.