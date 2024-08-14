const apiUrl =
  'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=rkz2H7ZufO9M1MdG7fg5seDugGc8vR5V';

function renderTemplate() {
  fetch('/src/templates/cards.hbs')
    .then((response) => response.text())
    .then((source) => {
      const template = Handlebars.compile(source);

      return fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const cardsData = {
            cards: data._embedded.events.map((event) => {
              const images = event.images;
              const imageUrl = images[Math.floor(Math.random() * images.length)].url;
              return {
                id: event.id,
                imageUrl: imageUrl,
                title: event.name,
                time: event.dates.start.localTime,
                country: event._embedded.venues[0].country.name,
              };
            }),
          };

          document.getElementById('cards-wrapper').innerHTML = template(cardsData);
        });
    })
    .catch((error) => console.error('Error loading template or API data:', error));
}

renderTemplate();
