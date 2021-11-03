// Creates a context to avoid exposing functions and variables to the global scope
(() => {
    
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

    const renderPokemonCardNode = (pokemon, template) => {
        // Clone the template so we can modify it safely
        const cardNode = template.content.cloneNode(true);

        const pkName = cardNode.querySelectorAll(".nomePokemon")[0];
        const pkSpriteImg = cardNode.querySelectorAll("img")[0];
        const pkProfileLink = cardNode.querySelectorAll("a")[0];
        const pkDetailsBtn = cardNode.querySelectorAll("button")[0];

        pkName.textContent = pokemon.name;
        pkSpriteImg.setAttribute('src', pokemon.sprite_url);
        pkSpriteImg.setAttribute('alt', pokemon.name);
        pkProfileLink.setAttribute('href',`/${pokemon.name}`);

        // Open new window on details btn clicked
        pkDetailsBtn.addEventListener('click', () => {
            window.open(`${window.base_url}/pokemon/${pokemon.name}`);
        });

        return cardNode;
    }

    const updateViewWithPokemonCardNodes = (nodes = []) => {
        const viewContainer = document.getElementById('container');

        // Creates a fragment to hold all of our nodes
        // See "Usage notes": https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
        const fragment = new DocumentFragment();
        nodes.forEach((node) => {
            fragment.appendChild(node);
        });

        // Append card nodes to the view
        viewContainer.replaceChildren(fragment);
    }

    
    const updateViewWithError = (msg) => {
        const viewContainer = document.getElementById('container');

        // Creates a fragment to hold all of our nodes
        // See "Usage notes": https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
        const fragment = new DocumentFragment();
        
        const errorNode = document.createElement('p');
        errorNode.textContent = msg;
        fragment.appendChild(errorNode);

        // Append card nodes to the view
        viewContainer.replaceChildren(fragment);
    }

    const searchPokemonEventListener = () => {
        document.getElementById('search').addEventListener('click', () => {
            const query = document.getElementById("pokemonInput").value;

            if(!!query){
                fetch(`api/pokemon/${query}`)
                    .then((response) => {
                        if (response.status >= 200 && response.status <= 299) {
                            return response.json();
                          } else {
                            throw Error(response.statusText);
                          }
                    })
                    .then((pokemon) => {
                        console.log('pokemon', pokemon);
                        const pokemonCardTemplate = document.getElementsByTagName("template")[0];
                        const node = renderPokemonCardNode(pokemon, pokemonCardTemplate);
                        updateViewWithPokemonCardNodes([node]);
                    })
                    .catch((error) => {
                        console.log(error);
                        updateViewWithError(error.msg);
                    });
            }
        });
    }
    // Initialize the app by loading the initial list of pokemons from the server
    // Attach event listener to search form
    const init = () => {
        searchPokemonEventListener();

        fetch('api/pokemon/all')
            .then((response) => {
                if (response.status >= 200 && response.status <= 299) {
                    return response.json();
                } else {
                    throw Error(response.statusText);
                }
            })
            .then((pokemonsList) => {
                console.log('pokemonsList', pokemonsList);
                
                const pokemonCardTemplate = document.getElementsByTagName("template")[0];
                const cardNodes = pokemonsList.map((pokemon) => renderPokemonCardNode(pokemon, pokemonCardTemplate));
                updateViewWithPokemonCardNodes(cardNodes);
            })  
            .catch((error) => {
                console.log(error);
                updateViewWithError(error.msg);
            });
    }

    init();
})()