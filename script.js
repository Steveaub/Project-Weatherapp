const API_KEY = 'V8MNLHK4F742B6D2UQCUYF7JF'; // Your Visual Crossing API key

// Function to fetch weather data for a given location
async function getWeather(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    const processedData = processWeatherData(data); // Process the raw data
    console.log(processedData); // Ensure it's processed correctly
    return processedData; // Return the processed data
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
  }
}

// Function to process weather data
function processWeatherData(data) {
  const weather = {
    city: data.resolvedAddress,
    currentTemp: data.days[0].temp,
    highTemp: data.days[0].tempmax,
    lowTemp: data.days[0].tempmin,
    description: data.days[0].conditions, // Using `conditions` for better accuracy
    precipitation: data.days[0].precipprob,
  };

  console.log(weather); // Log the processed weather object
  return weather;
}

// Function to change background dynamically
function changeBackground(description) {
  const body = document.body;

  // Reset background to default first
  body.style.backgroundImage = '';
  body.style.backgroundColor = '#f0f8ff';

  // Make conditions more flexible
  if (description.includes('rain') || description.includes('drizzle') || description.includes('shower')) {
    body.style.backgroundImage = "url('./images/rain.jpg')";
  } else if (description.includes('cloud') || description.includes('overcast') || description.includes('partly')) {
    body.style.backgroundImage = "url('./images/cloud.jpg')";
  } else if (description.includes('sun') || description.includes('clear') || description.includes('bright')) {
    body.style.backgroundImage = "('./images/sun.jpg')";
  } else if (description.includes('snow') || description.includes('sleet') || description.includes('flurry')) {
    body.style.backgroundImage = "url('./images/snow.jpg')";
  } else {
    body.style.backgroundColor = '#e0e0e0'; // Default fallback
  }

  // Add styling for background
  body.style.backgroundSize = 'cover';
  body.style.backgroundPosition = 'center';
  body.style.backgroundRepeat = 'no-repeat';
}

// Event listener for the form
document.getElementById('location-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const location = document.getElementById('location-input').value; // Get the input value
  if (location) {
    const data = await getWeather(location); // Fetch and process the weather data
    if (data) {
      displayWeather(data); // Pass the processed data to displayWeather
    }
  }
});

// Function to display weather data
function displayWeather(data) {
    console.log("Weather description (conditions):", data.description.toLowerCase());

  const weatherDiv = document.getElementById('weather-display');

  // Update the weather display
  weatherDiv.innerHTML = `
    <h2>Weather in ${data.city}</h2>
    <p>${data.description}</p>
    <p>Current Temperature: ${data.currentTemp}°C</p>
    <p>High: ${data.highTemp}°C, Low: ${data.lowTemp}°C</p>
    <p>Chance of Rain: ${data.precipitation}%</p>
  `;

  console.log("Weather description:", data.description.toLowerCase()); // Debug the description
  changeBackground(data.description.toLowerCase()); // Change the background dynamically
}
