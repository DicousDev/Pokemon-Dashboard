from dotenv import load_dotenv
from flask import Flask, Response, request, url_for
from flask.templating import render_template
from werkzeug.sansio.request import Request
from werkzeug.utils import redirect
from werkzeug.wrappers import response
import requests
import json
import os

app = Flask(__name__)
config = load_dotenv(".env") #load env variables to avoid hardcoding stuff
max_pokemon = 151
pokemon_list = []

class PokemonService():
    def search_pokemon(self, name_pokemon):
        pokemon = self.filter_name_pokemon(name_pokemon) 
        req = requests.get(f"https://pokeapi.co/api/v2/pokemon/{pokemon}")

        if req.status_code == 404:
            return {
                "status_code": 404,
                "body": {"message": "Pokémon não encontrado."}
            }
        
        return {
            "status_code": 200,
            "body": json.loads(req.text)
        }

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
    global pokemon_list
    if len(pokemon_list) > 0:
        return render_template('index.html', pokemon_list=pokemon_list)

    pokemons = get_process_pokemon_list_json()
    pokemon_list = pokemons
    return render_template('index.html', pokemon_list=pokemons)

@app.route("/<pokemon>", methods=["GET"])
def pokemon_page(pokemon):
    service = PokemonService()
    pokemon_searched = service.search_pokemon(pokemon)

    if pokemon_searched['status_code'] == 404:
        return render_template("pokemonNotFound.html", pokemon=pokemon)

    pokemon_json = {
        "name": pokemon_searched["body"]["name"],
        "sprite_url": pokemon_searched["body"]["sprites"]["front_default"],
        "key": pokemon_searched["body"]["id"],
        "element": pokemon_searched["body"]["types"][0]['type']['name'],
        "experience": pokemon_searched["body"]["base_experience"],
        "moves_total": len(pokemon_searched["body"]["moves"])
    }

    return render_template('pokemon.html', pokemon=pokemon_json)

@app.route("/searchPokemon/<pokemon>", methods=["GET"])
def search_pokemon(pokemon):
    service = PokemonService()
    pokemon_searched = service.search_pokemon(pokemon)

    if pokemon_searched['status_code'] == 404:
        return Response(json.dumps(pokemon_searched), status=404, mimetype="application/json")

    pokemon_obj = Pokemon(name=pokemon_searched["body"]["name"], sprite_url=pokemon_searched["body"]["sprites"]["front_default"])
    response = pokemon_obj.to_json()
    return Response(json.dumps(response), status=200, mimetype="application/json")

@app.route("/searchPokemonAll", methods=["GET"])
def search_pokemon_all():
    global pokemon_list
    if len(pokemon_list) > 0:
        return Response(json.dumps(pokemon_list), status=200, mimetype="application/json")

    pokemons = get_process_pokemon_list_json()
    pokemon_list = pokemons 
    return Response(json.dumps(pokemons), status=200, mimetype="application/json")

app.run(host = os.getenv('HOST'), port = os.getenv('PORT'))