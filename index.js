import moment from './node_modules/moment/dist/moment.js';

class Weather {
    async fetchCities() {
        const response = await fetch('./cities.json')
        const data = await response.json();

        return data;
    }

    async fetchCityData(cityName) {
        const [lat, lng] = await this.getCoordsFromName(cityName);

        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m`);

        const { hourly, hourly_units } = await response.json();
        
        console.log(hourly, hourly_units);

        this.generateChart(hourly, hourly_units);

        return [hourly, hourly_units];
    }



    // Add BFS alogrithm here instead
    async getCoordsFromName(cityName = 'Arad') {
        const cities = await this.fetchCities();

        for (let i = 0; i < cities.length; i++) {
            if (cities[i].name.toLowerCase() === cityName.toLowerCase()) {
                const result = [cities[i].lat, cities[i].lng];

                console.log(result);
                return result;
            }
        }
    }

    // Return an array of cities
    async searchCities(value) {
        // Get a list of all the cities
        const cities = await this.fetchCities();
        
        // Keep only the cities starting with the search query
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
        // autocompleteEl.removeEventListener('click', e => this.selectCity(e));

        // Value should be at least 1 character
        if (value.trim().length === 0) {
            if (autocompleteEl.classList.contains('active')) {
                autocompleteEl.classList.remove('active');
            }

            this.showError('Enter at least 1 character.')
            return;
        }

        // Make the element visible
        if (!autocompleteEl.classList.contains('active')) {
            autocompleteEl.classList.add('active');
        }

        // Get the results
        const cities = await this.searchCities(value);

        // Display the results inside an element
        cities.map(city => {
            const cityEl = document.createElement('li');
            cityEl.id = city.toLowerCase().replace(' ', '-');
            cityEl.textContent = city;
            autocompleteEl.appendChild(cityEl);
        });

        autocompleteEl.querySelectorAll('li').forEach(li => {
            li.onclick = e => {
                const cityName = e.target.textContent;
                autocompleteEl.textContent = '';
                const searchEl = document.getElementById('search');
                searchEl.value = cityName;
                this.fetchCityData(cityName);
            }

        })
    }

    // selectCity(e) {
    //     console.log(e.target);
    // }

    // Show an error message
    showError(message) {
        const error = document.getElementById('error');
        error.innerHTML = message;

        setTimeout(() => {
            error.innerHTML = '';
        }, 3000)
    }

    async generateChart(hourly, hourly_units) {
        const tempsEl = document.querySelector('#temps');

        const formattedTimes = await hourly.time.map(time => {
            return moment.utc(time).calendar()
        })

        const config = {
            type: 'line',
            data: {
                labels: formattedTimes,
                datasets: [{
                    data: await hourly.temperature_2m,
                    borderColor: [],
                    backgroundColor: [],
                    tension: 0.5
                }]
              },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero:false
                    }
                },
                plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: false,
                    },
                  }
            },
        };
        
        // Destroy the existing chart, if there is one defined
        let chartStatus = Chart.getChart("tempsChart");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
        
        const ctx = document.getElementById('tempsChart').getContext('2d');
        const tempsChart = new Chart(ctx, config);

        // hourly.temperature_2m.map(item => {
        //     const itemEl = document.createElement('p');
        //     itemEl.textContent = item;
        //     tempsEl.appendChild(itemEl);
        // });
    }

}

const weather = new Weather();

const coordsArray = weather.getCoordsFromName('Arad');

const searchEl = document.getElementById('search');

searchEl.addEventListener('keyup', e => weather.autocomplete(e.target.value));


console.log(moment("2022-09-20T00:00", "YYYY-MM-DDTmm:ss").calendar())
console.log(moment("2022-09-20T01:00", "YYYY-MM-DDTm:ss").calendar())
console.log(moment.utc("2022-09-20T01:00").calendar())