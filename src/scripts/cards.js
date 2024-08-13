const apiUrl = 'https://app.ticketmaster.com/discovery/v2/events?apikey=rkz2H7ZufO9M1MdG7fg5seDugGc8vR5V&locale=*';

function renderTemplate() {
  // Fetch the Handlebars template
  fetch('/src/templates/cards.hbs') // Adjust the path based on your structure
    .then(response => response.text())
    .then(source => {
      const template = Handlebars.compile(source); // Compile the Handlebars template
      
      // Fetch data from the API
      return fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          // Process the API data to match the expected structure
          const cardsData = {
            cards: data._embedded.events.map(event => ({
              id: event.id,
              imageUrl: event.images[0].url,
              title: event.name,
              time: event.dates.start.localTime,
              country: event._embedded.venues[0].country.name
            }))
          };
          
          // Render the HTML
          document.getElementById('cards-wrapper').innerHTML = template(cardsData);
        });
    })
    .catch(error => console.error('Error loading template or API data:', error));
}

renderTemplate();
