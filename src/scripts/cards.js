document.addEventListener('DOMContentLoaded', () => {
  const apiUrl =
    'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=rkz2H7ZufO9M1MdG7fg5seDugGc8vR5V';

  function renderEvents(query = '') {
    let searchUrl = apiUrl;

    // Only add the keyword parameter if there is a query
    if (query) {
      searchUrl += `&keyword=${encodeURIComponent(query)}`;
    }

    fetch('/src/templates/cards.hbs')
      .then((response) => response.text())
      .then((source) => {
        const template = Handlebars.compile(source);

        return fetch(searchUrl)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then((data) => {
            if (!data._embedded || !data._embedded.events || data._embedded.events.length === 0) {
              document.getElementById('cards-wrapper').innerHTML = '<p>No events found.</p>';
              return;
            }

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

     
            const searchInput = document.querySelector('.search-inputs input[type="text"]');

            function queryEvent(e) {
              const query = e.target.value.trim();
              console.log(query);

              renderEvents(query);
            }

            searchInput.addEventListener(
              'input',
              _.debounce(queryEvent, 500, {
                leading: true,
                trailing: false,
              })
            );
          })
          .catch((error) => console.error('Error loading template or API data:', error));
      })
      .catch((error) => console.error('Error loading template or API data:', error));
  }


  renderEvents();
});
