from flask import Flask
from flask.templating import render_template
from flask.wrappers import Response
import simplejson
import raildar
from flask.globals import request

app = Flask(__name__,)


def json_response(dict_response):
    return Response(
        response=simplejson.dumps(dict_response),
        status=200,
        content_type='application/json')


@app.route("/")
def osmap():
    return render_template('map.html')


@app.route("/line.html")
def line():
    return render_template('line.html')


@app.route("/api/map_generic.json")
def map_generic():
    return Response(
        response=raildar.map_generic(),
        status=200,
        content_type='application/json')


@app.route("/api/line.json")
def api_line():
    return json_response(raildar.line(request.args.get("id_train", None)))


@app.route("/api/gares.json")
def gares():
    return json_response(raildar.gares())


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
