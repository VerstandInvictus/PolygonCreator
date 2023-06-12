from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='react-app/build/static', template_folder='react-app/build')


@app.route('/')
def render_react_page():
    return render_template('index.html')


@app.route('/static/<path:path>')
def serve_react_files(path):
    return send_from_directory('static', path)


if __name__ == '__main__':
    # test
    app.run()
