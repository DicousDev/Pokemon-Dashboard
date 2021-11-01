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

function details() {
    alert("Details");
    console.log("Details");
}

function renderPokemons(pokemons) {
    const pokemonContainer = document.getElementById("container");
    pokemonContainer.innerHTML = '';

    pokemons.map(pokemon => {
        pokemonContainer.innerHTML += `
            <div class=cardPokemon>
                <h3 class=nomePokemon>${pokemon.name}</h3>
                <div>
                    <a href=https://github.com/DicousDev target=_blank>
                        <img class=pokemon-sprite src=${pokemon.sprite_url} alt=pokemon/>
                    </a>
                </div>
                <div class=detalhes>
                    <button onclick="details()">DETALHES</button>
                </div>
            </div>
        `
    });
}