let pokemons = [];
const baseUrl = "http://127.0.0.1:5000/";

function searchPokemon() {
    const pokemonName = document.getElementById("pokemonInput").value;

    if(pokemonName != '') {
        fetch(`/searchPokemon/${pokemonName}`)
        .then(response => {
            response.json()
            .then(data => {
                if(data.status_code == 404) {
                    pokemonNotFound();
                    return;
                }

                renderPokemons([data]);
            })
        })
        .catch(e => {
            console.log(e.message)
        })

        return;
    }

    if (pokemons.length > 0) {
        renderPokemons(pokemons);
        return;
    }

    fetch(`/searchPokemonAll`)
    .then(response => {
        response.json()
        .then(data => {
            renderPokemons(data);
            pokemons = data;
        })
    });
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
    window.open(baseUrl + pokemon_name);
}

function renderPokemons(pokemons) {
    const pokemonContainer = document.getElementById("container");
    pokemonContainer.innerHTML = '';

    pokemons.map(pokemon => {
        pokemonContainer.innerHTML += `
            <div class=cardPokemon>
                <h3 class=nomePokemon>${pokemon.name}</h3>
                <div>
                    <a href=${baseUrl + pokemon.name} target=_blank>
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