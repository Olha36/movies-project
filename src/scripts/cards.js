const data = {
    cards: [
      {
        id: 1,
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Movie 1',
        time: '120 min',
        country: 'USA'
      },
      {
        id: 2,
        imageUrl: 'https://via.placeholder.com/150',
        title: 'Movie 2',
        time: '95 min',
        country: 'UK'
      }
    ]
  };
  
  function renderTemplate() {
    fetch('/src/templates/cards.hbs') // Adjust the path based on your structure
      .then(response => response.text()) // Get the template as text
      .then(source => {
        const template = Handlebars.compile(source); // Compile the Handlebars template
        document.getElementById('cards-wrapper').innerHTML = template(data); // Render the HTML
      })
      .catch(error => console.error('Error loading template:', error));
  }
  
  renderTemplate();
  