from dotenv import load_dotenv
from flask import Flask, Response, request, url_for
from flask.templating import render_template
from werkzeug.sansio.request import Request
from werkzeug.utils import redirect
from werkzeug.wrappers import response
import requests
import json
import os

config = load_dotenv(".env") #load env variables to avoid hardcoding stuff

class PokemonApiClient():
    def __init__(self, api_url, max_pokemon = 5):
        self.api_url = api_url
        self.max_pokemon = max_pokemon # Allows for custom value to be defined when new client is instantiated 
        self.pokemon_list_cache = [] # Cache the API respose so repeated requests are retrieved from cache

    def get_by_name(self, name):
        pokemon = self.filter_name_pokemon(name) 
        req = requests.get(f"{self.api_url}/{pokemon}")

        if req.status_code == 200:
            return json.loads(req.text);
        
        return False

    def get_all(self):
        if len(self.pokemon_list_cache) > 0: # If data is already cached, returns it
            return self.pokemon_list_cache
        else: # Get data from API and cache the result
            req = requests.get(f"{self.api_url}?limit={self.max_pokemon}")
            data = json.loads(req.text)

            for entry in data['results']:
                req = requests.get(url=entry["url"])
                pokemon_data = json.loads(req.text)
                
                pokemon = Pokemon(
                    name=pokemon_data["name"],
                    sprite_url=pokemon_data["sprites"]["front_default"]
                )

                self.pokemon_list_cache.append(pokemon.to_json())
            
            return self.pokemon_list_cache

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

app = Flask(__name__)

# Have a single instance of the client shared by the whole application. Helps with data caching as well
pokemonApiClient = PokemonApiClient(os.getenv('POKEAPI_URL')); 

# Return the index page
@app.route("/", methods=["GET"])
def home_page():
    return render_template('index.html')

# Return page for the requested pokemon 
@app.route("/pokemon/<name>", methods=["GET"])
def pokemon_page(name):
    result = pokemonApiClient.get_by_name(name)

    if result != False:
        response = {
            "name": result["name"],
            "sprite_url": result["sprites"]["front_default"],
            "key": result["id"],
            "element": result["types"][0]['type']['name'],
            "experience": result["base_experience"],
            "moves_total": len(result["moves"])
        }

        return render_template('pokemon.html', pokemon=response)
        
    return render_template("pokemonNotFound.html", pokemon=name)    

# Return a JSON list of all pokemons
@app.route("/api/pokemon/all", methods=["GET"])
def pokemon_api_get_all():
    return Response(json.dumps(pokemonApiClient.get_all()), status=200, mimetype="application/json")

@app.route("/api/pokemon/<pokemon>", methods=["GET"])
def search_pokemon(pokemon):
    result = pokemonApiClient.get_by_name(pokemon);

    if result != False:
        response = {
            "name": result["name"],
            "sprite_url": result["sprites"]["front_default"],
            "key": result["id"],
            "element": result["types"][0]['type']['name'],
            "experience": result["base_experience"],
            "moves_total": len(result["moves"])
        }
        return Response(json.dumps(response), status=200, mimetype="application/json")
    
    else :
        response = {
            "msg": "O pokémon não foi encontrado"
        }

    return Response(json.dumps(response), status=404, mimetype="application/json")

app.run(host = os.getenv('HOST'), port = os.getenv('PORT'))