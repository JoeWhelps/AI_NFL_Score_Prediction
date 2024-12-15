// AI NFL Game Prediction
// Jack Decker and Joe Whelpley

// Cloned by Joe Whelpley on 25 Nov 2024 from World "ImagiGen" by Loone 


// Add custom style elements for the page
const style = document.createElement("style");
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Smooch&display=swap');

  /* Styling for the body of the document */
  body {
    background-image: url('uploads/jwhelple/backgroundnfl.jpg');
    background-size: cover;
    background-position: center;
    margin: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* Main heading styles */
  h1 {
    color: #f0f1fa;
    text-align: center;
    margin-bottom: 20px;
    font-size: 60px;
  }

  /* Subheading styles */
  h3 {
    color: #f0f1fa;
    text-align: center;
    margin-bottom: 20px;
    font-size: 20px;
  }

  /* Container for all form elements */
  .container {
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center; /* Centers horizontally */
    justify-content: center; /* Centers vertically if necessary */
    width: 100%;
    max-width: 700px;
  }

  /* Horizontal container for team selectors */
  .horizontal-container {
    display: flex;
    justify-content: space-between;
    gap: 50px; /* Adds spacing between the two inputs */
    width: 100%;
    max-width: 700px;
  }

  /* Styles for inputs, buttons, and selects */
  input[type="text"], input[type="number"], select, button {
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #dedede;
    margin: 10px 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  /* Button-specific styles */
  button {
    background-color: #2b2d42;
    color: white;
    cursor: pointer;
    margin-top: 10px;
  }

  /* Hover effect for buttons */
  button:hover {
    background-color: #274C77;
  }

  /* Output container for predictions and loading spinner */
  #output {
    text-align: center;
    margin-top: 20px;
  }

  #loading {
    text-align: center;
    margin-top: 20px;
  }

  /* Loading spinner styles */
  #loading img {
    width: 50px;
  }

  /* Styles for displaying prediction information */
  #prediction-info {
    text-align: center;
    margin-top: 20px;
    font-weight: bold;
  }

  /* Flexbox container for displaying predictions */
  .prediction-box-container {
      display: flex;
      justify-content: space-between; /* Separate the boxes horizontally */
      gap: 20px; /* Space between the boxes */
      width: 100%;
      max-width: 900px; /* Adjust max-width to accommodate all boxes */
      margin-top: 20px; /* Space from other elements */
  }

  /* Individual prediction box styling */
  .prediction-box {
      background-color: #2b2d42;
      color: white;
      padding: 20px;
      border-radius: 5px;
      width: 100%;
      max-width: 250px; /* Adjust width of each box */
      text-align: center;
      margin: 10px;
      flex-grow: 1; /* Ensures that the boxes grow equally */
  }
`;

// Append the style element to the document's head
document.head.appendChild(style);

// List of stats you want to display
const desiredStats = [
    "fumbles", "fumblesLost", "fumblesForced", "fumblesRecovered", "gamesPlayed", "completionPercentage",
    "interceptions", "passingYardsPerGame", "passerRating", "totalSacks", "totalOffensivePlays", "totalPointsPerGame", 
    "yardsPerGame", "yardsPerPassAttempt", "rushingAttempts", "rushingYardsPerGame", "yardsPerRushAttempt", "defensiveTouchdowns",
    "hurries", "sacks", "sackYards", "tacklesForLoss", "defensiveInterceptions",
    "fieldGoalsMade", "fieldGoalPercentage", "punts", "puntAverage", "kickReturns", "kickReturnYards", "puntReturns", "puntReturnYards",
    "timeOfPossession", "redZoneScoring", "turnoverRatio",
];

// Mapping of NFL teams to their IDs
const nflTeams = [
    { name: "Atlanta Falcons", id: 1 },
    { name: "Buffalo Bills", id: 2 },
    { name: "Chicago Bears", id: 3 },
    { name: "Cincinnati Bengals", id: 4 },
    { name: "Cleveland Browns", id: 5 },
    { name: "Dallas Cowboys", id: 6 },
    { name: "Denver Broncos", id: 7 },
    { name: "Detroit Lions", id: 8 },
    { name: "Green Bay Packers", id: 9 },
    { name: "Tennessee Titans", id: 10 },
    { name: "Indianapolis Colts", id: 11 },
    { name: "Kansas City Chiefs", id: 12 },
    { name: "Las Vegas Raiders", id: 13 },
    { name: "Los Angeles Rams", id: 14 },
    { name: "Miami Dolphins", id: 15 },
    { name: "Minnesota Vikings", id: 16 },
    { name: "New England Patriots", id: 17 },
    { name: "New Orleans Saints", id: 18 },
    { name: "New York Giants", id: 19 },
    { name: "New York Jets", id: 20 },
    { name: "Philadelphia Eagles", id: 21 },
    { name: "Arizona Cardinals", id: 22 },
    { name: "Pittsburgh Steelers", id: 23 },
    { name: "Los Angeles Chargers", id: 24 },
    { name: "San Francisco 49ers", id: 25 },
    { name: "Seattle Seahawks", id: 26 },
    { name: "Tampa Bay Buccaneers", id: 27 },
    { name: "Washington", id: 28 },
    { name: "Carolina Panthers", id: 29 },
    { name: "Jacksonville Jaguars", id: 30 },
    { name: "Baltimore Ravens", id: 33 },
    { name: "Houston Texans", id: 34 },
];

// Function to fetch NFL stats and return them for a specific team and year
function fetchNFLStats(teamId, year) {
    const apiUrl = `https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/${year}/types/2/teams/${teamId}/statistics`;

    showLoading(); // Show loading spinner while fetching data
    return fetch(apiUrl) // Make an API call to fetch stats
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            console.log("API Response:", data); // Log raw API response for debugging
            hideLoading(); // Hide loading spinner after successful fetch
            return combineStats(data); // Combine and format the stats
        })
        .catch((error) => {
            hideLoading(); // Hide spinner if an error occurs
            console.error("Error fetching NFL stats:", error);
            document.querySelector("#output").textContent =
                "Error loading statistics. Please try again later.";
        });
}

// Function to combine stats and format them into a readable string
function combineStats(data) {
    let statsLog = ""; // Initialize a string to store formatted stats
    console.log("Starting to combine stats");

    const splits = data.splits;

    // Check if splits and categories exist and are arrays
    if (splits && splits.categories && Array.isArray(splits.categories)) {
        splits.categories.forEach((category) => {
            if (category.stats && Array.isArray(category.stats)) {
                category.stats.forEach((stat) => {
                    // Check if stat is in the desired stats list
                    if (desiredStats.includes(stat.name)) {
                        // Append stat details to the stats log
                        statsLog += `${stat.displayName || stat.name}: ${stat.displayValue || "N/A"}\n`;
                    }
                });
            }
        });
    }

    return statsLog; // Return the formatted stats string
}




// Function to show loading spinner
function showLoading() {
    document.querySelector("#loading").style.display = "block";
}

// Function to hide loading spinner
function hideLoading() {
    document.querySelector("#loading").style.display = "none";
}

// Function to set API key entered by the user
function setApiKey() {
    apiKey = document.querySelector("#api-key").value.trim();
    const apiKeyMessage = document.querySelector("#api-key-message");

    // Update UI based on whether API key is valid
    if (apiKey) {
        document.querySelector("#api-key").disabled = true;
        apiKeyMessage.textContent = "API key set successfully!";
        apiKeyMessage.style.color = "green";
    } else {
        apiKeyMessage.textContent = "Please enter a valid API key.";
        apiKeyMessage.style.color = "red";
    }
}

// Function to fetch predictions using Hugging Face's CohereForAI API
function fetchPrediction(team1Stats, team2Stats, date) {
    showLoading(); // Display loading spinner

    const prompt = `Based on these stats give me a predicted final score and only a predicted final score\n Away team Stats: ${team1Stats}\n Home team Stats: ${team2Stats} \n ; The final score will be:`;

    const apiUrls = [ // List of API endpoints for predictions
        "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct", 
        "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-1B-Instruct", 
        "https://api-inference.huggingface.co/models/01-ai/Yi-1.5-34B-Chat",
    ];

    const apiParameters = [ // API-specific parameters for predictions
        { max_new_tokens: 60, temperature: 0.35 }, // Qwen
        { max_new_tokens: 32, temperature: 0.40 }, // Llama
        { max_new_tokens: 16, temperature: 0.35 }, // Yi
    ];

    const fetchPromises = apiUrls.map((url, index) =>
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: apiParameters[index],
            }),
        })
        .then((response) => response.json())
        .then((result) => ({ apiIndex: index, result }))
    );

    // Wait for all API calls to complete and process the responses
    Promise.all(fetchPromises)
        .then((responses) => {
            hideLoading(); // Hide loading spinner

            // Handle API errors or display predictions
            const errors = responses.filter((response) => response.result.error);
            if (errors.length > 0) {
                displayError(errors[0].result.error); // Show first error encountered
            } else {
                const sortedResponses = responses.sort((a, b) => a.apiIndex - b.apiIndex);
                const predictions = sortedResponses.map((response) => {
                    const text = response.result[0]?.generated_text || "No prediction available.";
                    return text.split(";")[1]?.trim() || text;
                });
                displayPredictions(predictions); // Display predictions in UI
            }
        })
        .catch((error) => {
            hideLoading(); // Hide spinner in case of error
            document.querySelector("#output").textContent = `Error: Please try again.`;
            console.error("Error fetching predictions:", error);
        });
}

// Function to display the predictions in UI
function displayPredictions(predictions) {
    const outputDiv = document.querySelector("#output");
    outputDiv.innerHTML = ""; // Clear previous content

    const apiLabels = ["Qwen (API 1)", "Meta-Llama (API 2)", "Yi (API 3)"];

    predictions.forEach((prediction, index) => {
        const predictionBox = document.createElement("div");
        predictionBox.classList.add("prediction-box");
        predictionBox.innerHTML = `<h4>${apiLabels[index]}</h4><p>${prediction}</p>`;
        outputDiv.appendChild(predictionBox);
    });
}


// Add the HTML structure into the body
document.body.innerHTML = `
  <h1>AI NFL Game Predictions</h1>
  
  <!-- NFL team dropdowns -->
  <div class="container">
    <h3>Select Teams</h3>
    <div class="horizontal-container">
      <div>
        <h3>Away Team</h3>
        <select id="team1-select">
          ${nflTeams.map((team) => `<option value="${team.id}">${team.name}</option>`).join("")}
        </select>
      </div>
      <div>
        <h3>Home Team</h3>
        <select id="team2-select">
          ${nflTeams.map((team) => `<option value="${team.id}">${team.name}</option>`).join("")}
        </select>
      </div>
    </div>
  </div>
  
  <!-- Year input -->
  <div class="container">
    <h3>Enter Year</h3>
    <input type="number" id="year-input" placeholder="Enter year (2000–2024)" min="2000" max="2024">
    <p id="year-error" style="color: red; display: none;">Year must be between 2000 and 2024.</p>
  </div>
  
  <div class="container">
    <h3>Enter API Key</h3>
    <input type="text" id="api-key" placeholder="Enter your API Key...">
    <p id="api-key-message"></p>
    <button id="set-api-key">Set API Key</button>
  </div>
  <p id="api-key-text" style="display: none;"></p>
  
  <div class="container">
    <button id="submit-prediction">Get Prediction</button>
  </div>

  <div class="container">
    <div id="loading" style="display:none;"><img src="uploads/loone/loading.gif" alt="Loading..." /></div>
    
    <!-- Prediction boxes container -->
    <div id="output" class="prediction-box-container"></div>
    
    <div id="prediction-info"></div>
  </div>
`;

// Event listeners to handle user actions and validate inputs
document.addEventListener("DOMContentLoaded", async function () {
    document.querySelector("#set-api-key").addEventListener("click", setApiKey);
    document.querySelector("#submit-prediction").addEventListener("click", async function () {
        const team1 = document.querySelector("#team1-select").value;
        const team2 = document.querySelector("#team2-select").value;
        const yearInput = document.querySelector("#year-input");
        const year = yearInput.value;
        const yearError = document.querySelector("#year-error");

        yearError.style.display = "none"; // Reset error messages

        if (!apiKey) {
            console.log("Please set your API key before fetching predictions.");
            return;
        }

        if (!year || year < 2000 || year > 2024) {
            yearError.style.display = "block";
            return;
        }

        const team1Stats = await fetchNFLStats(team1, year);
        const team2Stats = await fetchNFLStats(team2, year);

        if (team1Stats && team2Stats) {
            fetchPrediction(team1Stats, team2Stats, year);
        } else {
            document.querySelector("#output").textContent =
                "Error: Could not fetch stats. Please try again.";
        }
    });
});
