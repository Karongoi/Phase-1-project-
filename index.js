db.json
document.addEventListener('DOMContentLoaded', () => {
    const listEl = document.getElementById('property-list');
    const searchInput = document.getElementById('search');
  
    let properties = [];
  
    fetch('http://localhost:3000/properties')
      .then(res => res.json())
      .then(data => {
        properties = data;
        renderProperties(properties);
      });
  
    searchInput.addEventListener('input', (e) => {
      const value = e.target.value.toLowerCase();
      const filtered = properties.filter(p => p.location.toLowerCase().includes(value));
      renderProperties(filtered);
    });
  
    function renderProperties(list) {
      listEl.innerHTML = '';
      list.forEach(p => {
        const div = document.createElement('div');
        div.className = 'property';
        div.innerHTML = `
          <img src="${p.image}" alt="${p.name}">
          <h3>${p.name}</h3>
          <p>${p.location}</p>
          <p>${p.price}</p>
        `;
        listEl.appendChild(div);
      });
    }
  });