let pokemonList = [];

function searchPokemon() {
    const pokemonInput = document.getElementById("pokemonInput");

    $.ajax({
        type: "POST",
        url: "/searchPokemon",
        data: JSON.stringify( {pokemon: pokemonInput.value} ),
        contentType: "application/json ; charset=utf-8",
        success: function(data) {
            pokemonList = [data];
            renderPokemon();
        }
    });
}

function renderPokemon() {
    const pokemonContainer = document.getElementById("container");

    pokemonList.map(pokemon => {
        const divPokemon = document.createElement("div");

        const namePokemon = document.createElement("h3");
        namePokemon.innerText = pokemon.name;

        const pokemonSprite = document.createElement("img");
        pokemonSprite.src = pokemon.sprite;
        pokemonSprite.alt = "pokemon";

        divPokemon.appendChild(namePokemon);
        divPokemon.appendChild(pokemonSprite);
        pokemonContainer.appendChild(divPokemon);
    });
}