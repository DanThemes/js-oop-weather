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

    async autocomplete(value) {
        const cities = await this.fetchCities();
        
        const result = [];
        for (let i = 0; i < cities.length; i++) {
            if (cities[i].name.toLowerCase().startsWith(value.toLowerCase())) {
                result.push(cities[i].name);
            }
        }
        console.log(result);
        return result;
    }


}

const weather = new Weather();

const coordsArray = weather.getCoordsFromName('Arad');

const searchEl = document.getElementById('search');
searchEl.addEventListener('keyup', e => weather.autocomplete(e.target.value));