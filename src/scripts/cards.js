let eventsData = [];
let template;
let currentPage = 1;
const eventsPerPage = 20;

document.addEventListener('DOMContentLoaded', () => {
  const apiUrl =
    'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=rkz2H7ZufO9M1MdG7fg5seDugGc8vR5V';

  function pagination() {
    const start = (currentPage - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const paginatedEvents = eventsData.slice(start, end);

    const paginatedData = { cards: paginatedEvents };
    document.querySelector('#cards-wrapper').innerHTML = template(paginatedData);
    
  }

  function showPreviousPage() {
    if (currentPage > 1) {
      currentPage--;
      pagination();
    }
  }

  function showNextPage() {
    const totalPages = Math.ceil(eventsData.length / eventsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      pagination();
    }
  }
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

      eventsData = data._embedded.events.map((event) => {
        const images = event.images;
        const imageUrl = images[Math.floor(Math.random() * images.length)].url;
        return {
          id: event.id,
          imageUrl: imageUrl,
          title: event.name,
          time: event.dates.start.localTime,
          country: event._embedded.venues[0].country.name,
        };
      });

      console.log('Events Data:', eventsData);

      pagination();

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

      pagination();
      document.getElementById('prev-page').addEventListener('click', showPreviousPage);
  document.getElementById('next-page').addEventListener('click', showNextPage);
    } catch (error) {
      console.error('Error fetching or processing data:', error);
    }
  }

  renderEvents();
  
});
