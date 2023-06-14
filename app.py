import json
import os
import uuid
from flask import Flask, jsonify, render_template, request, send_from_directory


class PolygonStore:
    # Simple data structure that saves and loads from JSON.
    # Could be replaced easily with a drop-in class implementing any other data store we want.

    # Prefatory note on docstrings: they could easily be added but for this it didn't feel needed.
    # I've added comments where I feel they help.

    def __init__(self):
        self._dataFolder = "data"
        self._datapath = f"{self._dataFolder}/polygons.json"
        self.polygons = {}
        self._load_polygons_from_file()

    def _load_polygons_from_file(self):
        # load file if it exists, if not we'll use an empty dict
        if os.path.isfile(self._datapath):
            try:
                with open(self._datapath, "r") as infile:
                    self.polygons = json.load(infile)
            except json.decoder.JSONDecodeError:
                print(
                    "==WARNING== Unable to load polygons.json file from /data - the file was found, but may be corrupted. "
                )

    def _save_polygons_to_file(self):
        # overwrite the data file with current state.
        # Don't make the file/folder until we have something to write.
        if not os.path.isdir(self._dataFolder):
            os.mkdir(self._dataFolder)
        with open(self._datapath, "w") as outfile:
            # setting indent here makes the file more readable if we ever want to check it manually
            json.dump(self.polygons, outfile, indent=4)

    def store_polygon(self, polygon_data):
        # For simplicity, we can use the same function to edit and create records.
        # In a real use case we might want to be more intentional and edit specific fields,
        # but for simple MVP tasks this is clean/straightforward.
        if not polygon_data.get('polygonId'):
            # this is a new polygon, assign a UUID
            polygon_id = str(uuid.uuid4())
            polygon_data['polygonId'] = polygon_id
        self.polygons[polygon_data['polygonId']] = polygon_data
        # update the datastore immediately in case of interruption
        self._save_polygons_to_file()
        return polygon_data

    def get_specific_polygon(self, polygon_id):
        return self.polygons.get(polygon_id)


polygon_store = PolygonStore()

# this lets us serve everything from Flask, straight out of the React build folder
app = Flask(__name__, static_folder='react-app/build/static', template_folder='react-app/build')


@app.route('/')
@app.route('/<path:path>')
def render_react_page(path=None):
    return render_template('index.html')


@app.route('/static/<path:path>')
def serve_react_files(path):
    return send_from_directory('static', path)


@app.route('/api/polygons/all')
def get_all_polygons():
    return jsonify(list(polygon_store.polygons.values()))


@app.route('/api/polygons/get/<polygon_id>')
def get_specific_polygon(polygon_id):
    return jsonify(polygon_store.get_specific_polygon(polygon_id))


@app.route('/api/polygons/save', methods=["POST"])
def save_polygon():
    polygon_data = request.json
    polygon_store.store_polygon(polygon_data)
    return jsonify({
        "result": "success",
        "data": polygon_data
    })


if __name__ == '__main__':
    app.run()
