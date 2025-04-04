document.addEventListener('DOMContentLoaded', async () => {
    const propertyList = document.getElementById('property-list');
    const searchInput = document.getElementById('search');
    let properties = [];
  
    // Fetch properties from API
    async function fetchProperties() {
      try {
        const response = await fetch('http://localhost:3000/properties');
        if (!response.ok) throw new Error('Failed to fetch properties');
        properties = await response.json();
        renderProperties(properties);
      } catch (error) {
        console.error('Error:', error);
        propertyList.innerHTML = '<p style="color: red;">Failed to load properties. Please try again later.</p>';
      }
    }
  
    function renderProperties(list) {
      propertyList.innerHTML = '';
      list.forEach(property => {
        const div = document.createElement('div');
        div.className = 'property';
        div.innerHTML = `
          <img src="${property.image}" alt="${property.name}">
          <h3>${property.name}</h3>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Price:</strong> ${property.price}</p>
          <button class="favorite" data-id="${property.id}">
            ${property.isFavorite ? '❤ Favorited' : '♡ Favorite'}
          </button>
        `;
        propertyList.appendChild(div);
      });
  
      // Attach event listeners for favorite buttons
      document.querySelectorAll('.favorite').forEach(button => {
        button.addEventListener('click', toggleFavorite);
      });
    }
  
    async function toggleFavorite(event) {
      const button = event.target;
      const id = button.dataset.id;
      const property = properties.find(p => p.id == id);
  
      if (property) {
        property.isFavorite = !property.isFavorite;
        button.textContent = property.isFavorite ? '❤ Favorited' : '♡ Favorite';
  
        try {
          await fetch(`http://localhost:3000/properties/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isFavorite: property.isFavorite })
          });
        } catch (error) {
          console.error('Error updating favorite:', error);
          alert('Failed to update favorite status.');
        }
      }
    }
  
    // Search functionality
    searchInput.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = properties.filter(p => p.location.toLowerCase().includes(value));
      renderProperties(filtered);
    });
  
    fetchProperties();
  });