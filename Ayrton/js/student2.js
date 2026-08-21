const API_URL = "http://127.0.0.1:8000";

const characterSelect = document.getElementById("character-select");
const charactersContainer = document.getElementById("characters");


function showLoading(message) {
    charactersContainer.innerHTML = `
        <div class="text-center p-4">
            <div class="spinner-border text-warning" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">${message}</p>
        </div>
    `;
}


function showError(message) {
    charactersContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <strong>Error:</strong> ${message}
        </div>
    `;
}


function createCharacterCard(character) {
    const card = document.createElement("article");

    card.className = "character card";

    card.innerHTML = `
        <div class="card-body">

            <h2>${character.name}</h2>

            <div class="row g-4">

                <div class="col-12 col-lg-6">
                    <h3>Character Information</h3>

                    <table class="character-table">
                        <tbody>
                            <tr>
                                <th>Name</th>
                                <td>${character.name}</td>
                            </tr>

                            <tr>
                                <th>Race</th>
                                <td>${character.race ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Class</th>
                                <td>${character.class ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Level</th>
                                <td>${character.level ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Alignment</th>
                                <td>${character.alignment ?? "Unknown"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div class="col-12 col-lg-6">
                    <h3>Ability Scores</h3>

                    <table class="character-table">
                        <tbody>
                            <tr>
                                <th>Strength</th>
                                <td>${character.strength ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Dexterity</th>
                                <td>${character.dexterity ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Constitution</th>
                                <td>${character.constitution ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Intelligence</th>
                                <td>${character.intelligence ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Wisdom</th>
                                <td>${character.wisdom ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Charisma</th>
                                <td>${character.charisma ?? "Unknown"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div class="col-12 col-lg-6">
                    <h3>Other Stats</h3>

                    <table class="character-table">
                        <tbody>
                            <tr>
                                <th>Perception</th>
                                <td>${character.perception ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Armor Class</th>
                                <td>${character.armor_class ?? "Unknown"}</td>
                            </tr>

                            <tr>
                                <th>Hit Points</th>
                                <td>${character.hit_points ?? "Unknown"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>


                <div class="col-12 col-lg-6">
                    <h3>Equipment</h3>

                    <p>
                        ${character.equipment ?? "No equipment listed."}
                    </p>
                </div>


                <div class="col-12">
                    <h3>Backstory</h3>

                    <p>
                        ${character.backstory ?? "No backstory available."}
                    </p>
                </div>

            </div>
        </div>
    `;

    return card;
}


/*
 * GET REQUEST 1
 * Get all characters
 */
async function loadAllCharacters() {

    showLoading("Loading all characters...");

    try {

        const response = await fetch(
            `${API_URL}/characters/`
        );

        if (!response.ok) {
            throw new Error(
                `Server returned status ${response.status}`
            );
        }

        const characters = await response.json();

        charactersContainer.innerHTML = "";

        characterSelect.innerHTML = `
            <option value="all">All characters</option>
        `;

        if (characters.length === 0) {

            charactersContainer.innerHTML = `
                <div class="alert alert-info" role="alert">
                    No characters were found.
                </div>
            `;

            return;
        }

        characters.forEach(function (character) {

            const card = createCharacterCard(character);

            charactersContainer.appendChild(card);


            const option = document.createElement("option");

            option.value = character.name;
            option.textContent = character.name;

            characterSelect.appendChild(option);
        });

    } catch (error) {

        console.error(
            "Error loading characters:",
            error
        );

        showError(
            "The characters could not be loaded. Please try again later."
        );
    }
}


/*
 * GET REQUEST 2
 * Get one character by name
 */
async function loadCharacterByName(name) {

    showLoading(`Loading ${name}...`);

    try {

        const response = await fetch(
            `${API_URL}/characters/search?name=${encodeURIComponent(name)}`
        );

        if (!response.ok) {

            if (response.status === 404) {
                throw new Error("Character not found.");
            }

            throw new Error(
                `Server returned status ${response.status}`
            );
        }

        const character = await response.json();

        charactersContainer.innerHTML = "";

        const card = createCharacterCard(character);

        charactersContainer.appendChild(card);

    } catch (error) {

        console.error(
            "Error loading character:",
            error
        );

        showError(
            `The character "${name}" could not be loaded.`
        );
    }
}


/*
 * Character selection
 */
if (characterSelect) {

    characterSelect.addEventListener(
        "change",
        function () {

            const selectedCharacter = characterSelect.value;

            if (selectedCharacter === "all") {

                loadAllCharacters();

            } else {

                loadCharacterByName(selectedCharacter);
            }
        }
    );
}


/*
 * Load all characters when the page opens
 */
if (charactersContainer && characterSelect) {

    loadAllCharacters();
}