class Weather {
    async fetchCities() {
        const response = await fetch('./cities.json')
        const data = await response.json();

        return data;
    }

    // Add BFS alogrithm here instead
    async getCoordsFromName(cityName = 'Arad') {
        const cities = await this.fetchCities();

        for (let i = 0; i < cities.length; i++) {
            if (cities[i].name === cityName) {
                const result = [cities[i].lat, cities[i].lng];
                // console.log(result);
                return result;
            }
        }
    }

    // Return an array of cities
    async searchCities(value) {
        const cities = await this.fetchCities();
        
        const result = [];
        for (let i = 0; i < cities.length; i++) {
            if (cities[i].name.toLowerCase().startsWith(value.toLowerCase())) {
                result.push(cities[i].name);
            }
        }
        return result;
    }

    // Display the autocomplete names in the drop-down
    async autocomplete(value) {
        const autocompleteEl = document.getElementById('autocomplete');
        autocompleteEl.textContent = '';

        // Value should be at least 1 character
        if (value.trim().length === 0) {
            this.showError('Enter at least 1 character.')
            return;
        }

        const cities = await this.searchCities(value);

        cities.map(city => {
            const cityEl = document.createElement('li');
            cityEl.textContent = city;
            autocompleteEl.appendChild(cityEl);
        })
    }

    showError(message) {
        const error = document.getElementById('error');
        error.innerHTML = message;
        setTimeout(() => {
            error.innerHTML = '';
        }, 3000)
    }


}

const weather = new Weather();

const coordsArray = weather.getCoordsFromName('Arad');

const searchEl = document.getElementById('search');

searchEl.addEventListener('keyup', e => weather.autocomplete(e.target.value));