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
    name_pokemon_request = json.loads(request.data)["pokemon"]
    name_pokemon_request = filter_name_pokemon(name_pokemon_request)
    pokemon = search_pokemon(name_pokemon_request)

    response = {}
    response["sprite"] = pokemon['sprites']['front_default']

    return Response(json.dumps(response), status=200, mimetype="application/json")

def search_pokemon(name_pokemon):
    req = requests.get(f"https://pokeapi.co/api/v2/pokemon/{name_pokemon}")
    pokemon_json = json.loads(req.text)
    return pokemon_json

def filter_name_pokemon(name_pokemon):
    pokemon_name = name_pokemon.strip()
    pokemon_name = pokemon_name.lower()
    return pokemon_name

app.run()