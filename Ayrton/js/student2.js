const API_URL = "https://2026-fullstack-retake-ayrton-van-go.vercel.app";

const characterSelect = document.getElementById("character-select");
const charactersContainer = document.getElementById("characters");
const characterForm = document.getElementById("character-form");

console.log("student2.js is geladen");


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


function showSuccess(message) {
    charactersContainer.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="alert alert-success" role="alert">
            <strong>Success:</strong> ${message}
        </div>
        `
    );
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

        console.log("GET all characters");

        const response = await fetch(
            `${API_URL}/characters/`
        );

        if (!response.ok) {

            throw new Error(
                `Server returned status ${response.status}`
            );
        }

        const characters = await response.json();

        console.log("Characters received:", characters);

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

        console.log("GET character:", name);

        const response = await fetch(
            `${API_URL}/characters/search?name=${encodeURIComponent(name)}`
        );

        if (!response.ok) {

            if (response.status === 404) {

                throw new Error(
                    "Character not found."
                );
            }

            throw new Error(
                `Server returned status ${response.status}`
            );
        }

        const character = await response.json();

        console.log("Character received:", character);

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
 * Character selector
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
 * POST REQUEST
 * Create a new character
 */
if (characterForm) {

    characterForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log("FORM SUBMIT DETECTED");

            const submitButton =
                characterForm.querySelector(
                    'button[type="submit"]'
                );

            submitButton.disabled = true;
            submitButton.textContent = "Creating...";


            const formData =
                new FormData(characterForm);


            const characterData = {

                character: {

                    name: formData.get("name"),

                    race: formData.get("race"),

                    class: formData.get("class"),

                    level: Number(
                        formData.get("level")
                    ),

                    alignment:
                        formData.get("alignment"),

                    equipment:
                        formData.get("equipment"),

                    backstory:
                        formData.get("backstory")
                },


                stats: {

                    name: formData.get("name"),

                    strength: Number(
                        formData.get("strength")
                    ),

                    dexterity: Number(
                        formData.get("dexterity")
                    ),

                    constitution: Number(
                        formData.get("constitution")
                    ),

                    intelligence: Number(
                        formData.get("intelligence")
                    ),

                    wisdom: Number(
                        formData.get("wisdom")
                    ),

                    charisma: Number(
                        formData.get("charisma")
                    ),

                    perception: Number(
                        formData.get("perception")
                    ),

                    armor_class: Number(
                        formData.get("armor_class")
                    ),

                    hit_points: Number(
                        formData.get("hit_points")
                    )
                }
            };


            console.log(
                "Data that will be sent:",
                characterData
            );


            try {

                const response = await fetch(
                    `${API_URL}/characters/`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                characterData
                            )
                    }
                );


                console.log(
                    "POST response status:",
                    response.status
                );


                if (!response.ok) {

                    let errorMessage =
                        "Character could not be created.";

                    try {

                        const errorData =
                            await response.json();

                        console.error(
                            "Backend error:",
                            errorData
                        );

                        if (errorData.detail) {

                            errorMessage =
                                errorData.detail;
                        }

                    } catch (error) {

                        console.error(
                            "Could not read error response:",
                            error
                        );
                    }

                    throw new Error(
                        errorMessage
                    );
                }


                const result =
                    await response.json();


                console.log(
                    "Character created:",
                    result
                );


                characterForm.reset();


                showSuccess(
                    `Character "${result.name}" was created successfully!`
                );


                await loadAllCharacters();


            } catch (error) {

                console.error(
                    "Error creating character:",
                    error
                );

                showError(
                    `The character could not be created: ${error.message}`
                );

            } finally {

                submitButton.disabled = false;

                submitButton.textContent =
                    "Create Character";
            }
        }
    );
}


/*
 * Load characters when page opens
 */
if (
    charactersContainer &&
    characterSelect
) {

    loadAllCharacters();
}