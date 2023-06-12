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

Seems `create-react-app` doesn't support a Webpack watch/dev mode natively, but https://github.com/facebook/create-react-app/issues/1070#issuecomment-1250252699 provides a solution. To 
get auto-refresh on React file changes, in a second terminal session, while in the `react-app/` dir run `npm run watch`. This will automatically rebuild the React app on any change to 
anything under `react-app/src`. Once the build is complete, refresh the browser and the changes should be live.

### Testing

`npm run test` will run all React tests.
