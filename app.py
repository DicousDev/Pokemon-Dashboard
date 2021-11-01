from flask import Flask, Response, request, url_for
import requests
from flask.templating import render_template
from werkzeug.sansio.request import Request
from werkzeug.utils import redirect
from werkzeug.wrappers import response
import json

app = Flask(__name__)
max_pokemon = 16

class PokemonService():
    def search_pokemon(self, name_pokemon):
        req = requests.get(f"https://pokeapi.co/api/v2/pokemon/{name_pokemon}")
        pokemon_json = json.loads(req.text)
        return pokemon_json

    def search_pokemon_all(self):
        req = requests.get(f"https://pokeapi.co/api/v2/pokemon?limit={max_pokemon}")
        pokemon_json = json.loads(req.text)
        return pokemon_json['results']

    def filter_name_pokemon(self, name_pokemon):
        pokemon_name = name_pokemon.strip()
        pokemon_name = pokemon_name.lower()
        return pokemon_name

class Pokemon():
    def __init__(self, name, sprite_url):
        self.name = name
        self.sprite_url = sprite_url

    def to_json(self):
        return {
            "name": self.name,
            "sprite_url": self.sprite_url
        }

def get_process_pokemon_list_json():
    service = PokemonService()
    pokemon_list = service.search_pokemon_all()
    newListPokemon = []

    for pokemon in pokemon_list:
        req = requests.get(url=pokemon["url"])
        pokemon_json = json.loads(req.text)
        pokemon_obj = Pokemon(name=pokemon_json["name"], sprite_url=pokemon_json["sprites"]["front_default"])

        newListPokemon.append(pokemon_obj.to_json())
    return newListPokemon

@app.route("/", methods=["GET"])
def home_page():
    pokemons = get_process_pokemon_list_json()
    return render_template('base.html', pokemon_list=pokemons)

@app.route("/searchPokemon/<pokemon>", methods=["GET"])
def search_pokemon(pokemon):
    service = PokemonService()
    pokemon_name = service.filter_name_pokemon(pokemon)
    pokemon_searched = service.search_pokemon(pokemon_name)

    pokemon_obj = Pokemon(name=pokemon_searched["name"], sprite_url=pokemon_searched["sprites"]["front_default"])
    response = pokemon_obj.to_json()

    return Response(json.dumps(response), status=200, mimetype="application/json")

@app.route("/searchPokemonAll", methods=["GET"])
def search_pokemon_all():
    pokemons = get_process_pokemon_list_json()
    return Response(json.dumps(pokemons), status=200, mimetype="application/json")

app.run()