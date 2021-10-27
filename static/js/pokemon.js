let pokemonList = [];

function searchPokemon() {
    const pokemonName = document.getElementById("pokemonInput").value;

    if(pokemonName != '') {
        $.ajax({
            type: "POST",
            url: "/searchPokemon",
            data: JSON.stringify( {pokemon: pokemonName} ),
            contentType: "application/json ; charset=utf-8",
            success: function(data) {
                renderPokemons([data]);
            }
        });
    }
    else {
        $.ajax({
            type: "GET",
            url: "/searchPokemonAll",
            contentType: "application/json ; charset=utf-8",
            success: function(data) {
                renderPokemons(data);
            }
        });
    }
}

function renderPokemons(pokemons) {
    const pokemonContainer = document.getElementById("container");
    pokemonContainer.innerHTML = '';

    pokemons.map(pokemon => {
        const title = createTitle(pokemon.name);
        const sprite = createImage(pokemon.sprite);
        const details = createDetails();
        
        const divPokemon = document.createElement("div");
        divPokemon.setAttribute("class", "cardPokemon");
        divPokemon.appendChild(title);
        divPokemon.appendChild(sprite);
        divPokemon.appendChild(details);
        pokemonContainer.appendChild(divPokemon);
    });

    function createTitle(pokemon_name) {
        const namePokemon = document.createElement("h3");
        namePokemon.setAttribute("class", "nomePokemon")
        namePokemon.innerText = pokemon_name;
        return namePokemon;
    }

    function createImage(url_sprite) {
        const img = document.createElement("img");
        
        img.setAttribute("class", "pokemon-sprite");
        img.src = url_sprite;
        img.width = "96";
        img.height = "96";
        img.alt = "pokemon";
        
        const div = document.createElement("div");
        div.appendChild(img);
        return div;
    }

    function createDetails() {
        const details = document.createElement("button");
        details.innerText = "DETALHES";

        const div = document.createElement("div");
        div.setAttribute("class", "detalhes");
        
        div.appendChild(details)
        return div;
    }
}