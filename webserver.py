from flask import Flask
from flask.templating import render_template
from flask.wrappers import Response
import simplejson
import raildar

app = Flask(__name__,)


def json_response(dict_response):
    return Response(
        response=simplejson.dumps(dict_response),
        status=200,
        content_type='application/json')


@app.route("/")
def osmap():
    return render_template('map.html')


@app.route("/api/map_generic.json")
def map_generic():
    return json_response(raildar.map_generic())


@app.route("/api/gares.json")
def gares():
    return json_response(raildar.gares())


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
