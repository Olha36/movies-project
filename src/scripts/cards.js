let postsData = [];
let template;
let currentPage = 1;
const postsPerPage = 3;
document.addEventListener('DOMContentLoaded', () => {
  const apiUrl =
    'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=rkz2H7ZufO9M1MdG7fg5seDugGc8vR5V';

  async function renderEvents(query = '') {
    let searchUrl = apiUrl;

    if (query) {
      searchUrl += `&keyword=${encodeURIComponent(query)}`;
    }

    try {
      const templateResponse = await fetch('/src/templates/cards.hbs');
      if (!templateResponse.ok) {
        throw new Error(`Failed to load template. Status: ${templateResponse.status}`);
      }
      const templateSource = await templateResponse.text();
      template = Handlebars.compile(templateSource);

      const response = await fetch(searchUrl);
      if (!response.ok) {
        throw new Error(`Network Error: ${response.status}`);
      }
      const data = await response.json();

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

      postsData = cardsData;
      console.log('Posts Data:', postsData);

      if (template) {
        document.getElementById('cards-wrapper').innerHTML = template(cardsData);
      } else {
        console.error('Template function is not defined.');
      }

      const searchInput = document.querySelector('.search-inputs input[type="text"]');

      function queryEvent(e) {
        const query = e.target.value.trim();
        console.log('Search Query:', query);
        renderEvents(query);
      }

      searchInput.addEventListener(
        'input',
        _.debounce(queryEvent, 500, {
          leading: true,
          trailing: false,
        })
      );
    } catch (error) {
      console.error('Error fetching or processing data:', error);
    }
  }

  renderEvents();
});
