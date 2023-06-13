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

### Refreshing after changes
If run with `flask run --debug`, changes to Python files will automatically restart the server with the changes.

Seems `create-react-app` doesn't support a Webpack watch/dev mode natively. As such, `npm run build` after making changes, wait, and reload. I tried to find a quick workaround for this, 
but no dice so far.

### Testing

`npm run test` will run all React tests.


### Additional Frameworks/Tools:
* https://create-react-app.dev/ - bootstrapping a skeleton for the React side.
* https://cloudscape.design/ - component library and "sensible default" CSS. The previous version of this is AWS UI, which I've used a lot internally; it's what I'm most familiar with, so I 
  used it here to save time. This could easily be Material UI or whatever other component library, or (in a pinch) just full custom CSS with something like styled-components.
* https://reactrouter.com/ - Page routing. We've only got two pages, but it still simplifies things pretty substantially.
* https://typescript-eslint.io/ - linting for Typescript