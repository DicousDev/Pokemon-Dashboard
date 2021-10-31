from flask import Flask, Response, request, url_for
import requests
from flask.templating import render_template
from werkzeug.sansio.request import Request
from werkzeug.utils import redirect
from werkzeug.wrappers import response
import json

app = Flask(__name__)

class PokemonService():
    def search_pokemon(self, name_pokemon):
        req = requests.get(f"https://pokeapi.co/api/v2/pokemon/{name_pokemon}")
        pokemon_json = json.loads(req.text)
        return pokemon_json

    def search_all_pokemon(self):
        req = requests.get("https://pokeapi.co/api/v2/pokemon?limit=16")
        pokemon_json = json.loads(req.text)
        return pokemon_json['results']

    def filter_name_pokemon(self, name_pokemon):
        pokemon_name = name_pokemon.strip()
        pokemon_name = pokemon_name.lower()
        return pokemon_name

@app.route("/", methods=["GET"])
def home_page():
    service = PokemonService()
    pokemon_list = service.search_all_pokemon()
    newListPokemon = []

    for pokemon in pokemon_list:
        req = requests.get(pokemon["url"])
        pokemon_json = json.loads(req.text)

        pokemon_obj = {
            "name": pokemon_json["name"],
            "sprite": pokemon_json["sprites"]["front_default"]
        }

        newListPokemon.append(pokemon_obj)

    return render_template('base.html', pokemon_list=newListPokemon)

@app.route("/searchPokemon", methods=["POST"])
def search_pokemon():
    service = PokemonService()
    pokemon_name = json.loads(request.data)["pokemon"]
    pokemon_name = service.filter_name_pokemon(pokemon_name)
    pokemon = service.search_pokemon(pokemon_name)

    response = {
        "name": pokemon["name"],
        "sprite": pokemon["sprites"]["front_default"]
    }

    return Response(json.dumps(response), status=200, mimetype="application/json")

@app.route("/searchPokemon/<pokemon>", methods=["GET"])
def search_pokemon_specif(pokemon):
    service = PokemonService()
    pokemon_name = service.filter_name_pokemon(pokemon)
    pokemon_searched = service.search_pokemon(pokemon_name)
    
    response = {
        "name": pokemon_searched["name"],
        "sprite": pokemon_searched["sprites"]["front_default"]
    }

    return Response(json.dumps(response), status=200, mimetype="application/json")

@app.route("/searchPokemonAll", methods=["GET"])
def search_pokemon_all():
    service = PokemonService()
    pokemon_list = service.search_all_pokemon()
    newListPokemon = []

    for pokemon in pokemon_list:
        req = requests.get(pokemon["url"])
        pokemon_json = json.loads(req.text)

        pokemon_obj = {
            "name": pokemon_json["name"],
            "sprite": pokemon_json["sprites"]["front_default"]
        }

        newListPokemon.append(pokemon_obj)

    return Response(json.dumps(newListPokemon), status=200, mimetype="application/json")

app.run()