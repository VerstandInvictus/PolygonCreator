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

## Linting
`npm run lint` runs ESlint.
`flake8` runs Flake8.
`black app.py` runs Black in autoformat mode. `black -diff app.py` will show what it's going to do.

Note that ESlint does run on build and will fail the build. This is a create-react-app internal default.

### Testing
`npm run test` will run all React tests.

I had hoped to have more tests for this, but decided to use the time on functionality instead. Given another day I could probably get them pretty comprehensive.

### Additional Frameworks/Tools:
* https://create-react-app.dev/ - bootstrapping a skeleton for the React side.
* https://cloudscape.design/ - component library and "sensible default" CSS. The previous version of this is AWS UI, which I've used a lot internally; it's what I'm most familiar with, so I 
  used it here to save time. This could easily be Material UI or whatever other component library, or (in a pinch) just full custom CSS with something like styled-components.
* https://reactrouter.com/ - Page routing. We've only got two pages, but it still simplifies things pretty substantially, and taking full advantage of client side routing is 
  fast/responsive/clean.
* https://typescript-eslint.io/ - linting for Typescript.  Not enforcing consistency on myself was gnawing at me. I've got the rules 90% conforming to a style I prefer, which is enough.
* https://axios-http.com/ - API call handling.
* https://konvajs.org/docs/react/Intro.html - Canvas component and handlers.
* https://flake8.pycqa.org/en/latest/index.html#quickstart - standard Python linter.
* https://black.readthedocs.io/en/stable/index.html - Python autoformatter/opinonated linter.