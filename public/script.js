document.getElementById('search-button').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value;
    if (!city) {
      alert('Please enter a city name');
      return;
    }
  
    try {
      // Fetch weather data
      const weatherResponse = await fetch(`/api/weather?city=${city}`);
      if (!weatherResponse.ok) throw new Error('Failed to fetch weather data');
      const weatherData = await weatherResponse.json();
  
      // Extract latitude and longitude
      const { lat, lon } = weatherData.coord;
  
      // Initialize Leaflet map
      const map = L.map('map').setView([lat, lon], 13);
  
      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
  
      // Add a marker for the city
      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`<b>${city}</b><br>Latitude: ${lat}, Longitude: ${lon}`)
        .openPopup();
  
      // Update weather section
      document.getElementById('weather-content').innerHTML = `
        <p><strong>Temperature:</strong> ${weatherData.main.temp}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
        <p><strong>Feels Like:</strong> ${weatherData.main.feels_like}°C</p>
        <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
      `;
  
      // Fetch news data
      const newsResponse = await fetch(`/api/news?city=${city}`);
      if (!newsResponse.ok) throw new Error('Failed to fetch news data');
      const newsData = await newsResponse.json();
  
      // Update news section
      const newsContent = newsData.articles.slice(0, 3).map(article => `
        <p><a href="${article.url}" target="_blank">${article.title}</a></p>
      `).join('');
      document.getElementById('news-content').innerHTML = newsContent || '<p>No news found for this city.</p>';
  
      // Fetch exchange rates data
      const exchangeResponse = await fetch(`/api/exchange`);
      if (!exchangeResponse.ok) throw new Error('Failed to fetch exchange rates data');
      const exchangeData = await exchangeResponse.json();
  
      // Update exchange rates section
      const rates = exchangeData.conversion_rates || {};
      const eurRate = rates.EUR ? rates.EUR.toFixed(2) : 'N/A';
      const gbpRate = rates.GBP ? rates.GBP.toFixed(2) : 'N/A';
  
      document.getElementById('exchange-content').innerHTML = `
        <p><strong>1 USD to EUR:</strong> ${eurRate}</p>
        <p><strong>1 USD to GBP:</strong> ${gbpRate}</p>
      `;
    } catch (error) {
      console.error(error);
      alert('An error occurred while fetching data. Please try again.');
    }
  });
