from flask import Flask, Response, request, url_for
import requests
from flask.templating import render_template
from werkzeug.sansio.request import Request
from werkzeug.utils import redirect
from werkzeug.wrappers import response
import json

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home_page():
    return render_template('base.html')

@app.route("/procuraPokemon", methods=["POST"])
def procura_pokemon():
    body = request.get_json()
    req = requests.get(f"https://pokeapi.co/api/v2/pokemon/{body['pokemon']}")
    pokemon_json = json.loads(req.text)

    response = {}
    response["sprite"] = pokemon_json['sprites']['front_default']

    return Response(json.dumps(response), status=200, mimetype="application/json")

app.run()