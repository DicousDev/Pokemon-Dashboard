function searchPokemon() {
    const pokemonName = document.getElementById("pokemonInput").value;

    if(pokemonName != '') {
        $.ajax({
            type: "GET",
            url: `/searchPokemon/${pokemonName}`,
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
        pokemonContainer.innerHTML += `
            <div class=cardPokemon>
                <h3 class=nomePokemon>${pokemon.name}</h3>
                <img src=${pokemon.sprite_url} width=96 height=96 alt=pokemon/>
                <div class=detalhes>
                    <button>DETALHES</button>
                </div>
            </div>
        `
    });
}