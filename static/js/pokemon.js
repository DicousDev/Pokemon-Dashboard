// Creates a context to avoid exposing functions and variables to the global scope
(() => {

    // Generic function to handle response from fetch requests
    const handleFetchResponse = (response) => {
        if (!response.ok) {
            return response.json()
                .catch(() => {
                    // Couldn't parse the JSON
                    throw new Error(response.status);
                })
                .then(({ msg }) => {
                    // Got valid JSON with error response, use it
                    throw new Error(msg || response.status);
                });
        }
        // Successful response, parse the JSON and return the data
        return response.json();
    }

    // Render a card based on the template provided
    const renderPokemonCardNode = (pokemon) => {
        const template = document.getElementsByTagName("template")[0];

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

    // Update view with content nodes
    const updateView = (newContent) => {
        const viewContainer = document.getElementById('container');
        // Replace all view content with new content
        viewContainer.replaceChildren(newContent);
    }

    // Update the main view with multiple card nodes
    const updateViewWithPokemonCardNodes = (nodes = []) => {
        // Creates a fragment to hold all of our nodes
        // See "Usage notes": https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
        const fragment = new DocumentFragment();
        nodes.forEach((node) => {
            fragment.appendChild(node);
        });

        // Append card nodes to the view
        updateView(fragment);
    }

    // Update the main view with the provided error message
    const updateViewWithError = (msg) => {
        // Creates a fragment to hold all of our nodes
        // See "Usage notes": https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment
        const fragment = new DocumentFragment();
        
        const divNode = document.createElement('div');
        const errorNode = document.createElement('h3');
        errorNode.textContent = msg;

        divNode.appendChild(errorNode);
        fragment.appendChild(divNode);

        // Append card node to the view
        updateView(fragment);
    }

    // Set up event listener for search form
    const searchPokemonEventListener = () => {
        document.getElementById('search').addEventListener('click', () => {
            const query = document.getElementById("pokemonInput").value;

            if(!!query){
                fetch(`api/pokemon/${query}`)
                    .then((response) => handleFetchResponse(response))
                    .then((pokemon) => {
                        console.log('pokemon', pokemon);

                        const node = renderPokemonCardNode(pokemon);
                        updateViewWithPokemonCardNodes([node]);
                    })
                    .catch((error) => {
                        console.log(error);
                        updateViewWithError(error);
                    })
                    .finally(() => {
                        // Always clear search input
                        const searchInput = document.getElementById("pokemonInput");
                        searchInput.value = '';
                    });
            }
        });
    }
    
    // Attach event listener
    searchPokemonEventListener();

    // Initialize the app by loading the initial list of pokemons from the server
    fetch('api/pokemon/all')
        .then((response) => handleFetchResponse(response))
        .then((pokemonsList) => {
            console.log('pokemonsList', pokemonsList);
            
            const cardNodes = pokemonsList.map(renderPokemonCardNode);
            updateViewWithPokemonCardNodes(cardNodes);
        })  
        .catch((error) => {
            console.log(error);
            updateViewWithError(error);
        });
})()