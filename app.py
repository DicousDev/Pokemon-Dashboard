from flask import Flask, Response, request, url_for
import requests
from flask.templating import render_template
from werkzeug.sansio.request import Request
from werkzeug.utils import redirect
from werkzeug.wrappers import response
import json

app = Flask(__name__)

class PokemonService():
    def search_pokemon(name_pokemon):
        req = requests.get(f"https://pokeapi.co/api/v2/pokemon/{name_pokemon}")
        pokemon_json = json.loads(req.text)
        return pokemon_json

    def filter_name_pokemon(name_pokemon):
        pokemon_name = name_pokemon.strip()
        pokemon_name = pokemon_name.lower()
        return pokemon_name        

@app.route("/", methods=["GET"])
def home_page():
    return render_template('base.html')

@app.route("/searchPokemon", methods=["POST"])
def search_pokemon():
    service = PokemonService()
    pokemon_name = json.loads(request.data)["pokemon"]
    pokemon_name = service.filter_name_pokemon(pokemon_name)
    pokemon = service.search_pokemon(pokemon_name)

    response = {
        "name": pokemon["name"],
        "sprite": pokemon['sprites']['front_default']
    }

    return Response(json.dumps(response), status=200, mimetype="application/json")

app.run()