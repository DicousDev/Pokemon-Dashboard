let pokemons = [];

function searchPokemon() {
    const pokemonName = document.getElementById("pokemonInput").value;

    if(pokemonName != '') {
        $.ajax({
            type: "GET",
            url: `/searchPokemon/${pokemonName}`,
            contentType: "application/json ; charset=utf-8",
            success: function(data) {
                console.log(data);
                renderPokemons([data]);
            },
            error: function(data) {
                pokemonNotFound();
            }
        });
    }
    else {
        if (pokemons.length > 0) {
            renderPokemons(pokemons);
        }
        else {
            $.ajax({
                type: "GET",
                url: "/searchPokemonAll",
                contentType: "application/json ; charset=utf-8",
                success: function(data) {
                    renderPokemons(data);
                    pokemons = data;
                }
            });
        }
    }
}

function pokemonNotFound() {
    const searchInput = document.getElementById("pokemonInput");
    const pokemonContainer = document.getElementById("container");
    pokemonContainer.innerHTML = `
        <div>
            <h3>O pokémon "${searchInput.value}" não foi encontrado. Tente novamente!</h3>
        </div>
    `;

    searchInput.value = '';
}

function details(pokemon_name) {
    console.log(pokemon_name);
    window.open(`http://127.0.0.1:5000/${pokemon_name}`);
}

function renderPokemons(pokemons) {
    const pokemonContainer = document.getElementById("container");
    pokemonContainer.innerHTML = '';

    pokemons.map(pokemon => {
        pokemonContainer.innerHTML += `
            <div class=cardPokemon>
                <h3 class=nomePokemon>${pokemon.name}</h3>
                <div>
                    <a href=http://127.0.0.1:5000/${pokemon.name} target=_blank>
                        <img class=pokemon-sprite src=${pokemon.sprite_url} alt=pokemon/>
                    </a>
                </div>
                <div class=detalhes>
                    <button onclick=details("${pokemon.name}")>DETALHES</button>
                </div>
            </div>
        `;
    });
}