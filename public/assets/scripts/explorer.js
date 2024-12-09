const apiKey = 'b73fdf7389d53df948be4ec175c8a4b7';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';

// Função para buscar séries populares no Brasil
async function fetchPopularSeriesBrazil() {
    const response = await fetch(`${tmdbBaseUrl}/tv/popular?api_key=${apiKey}&language=pt-BR&region=BR`);
    const data = await response.json();
    return data.results;
}

// Função para buscar séries do TMDB com base no termo de pesquisa
async function searchSeries(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value;
    const response = await fetch(`${tmdbBaseUrl}/search/tv?api_key=${apiKey}&query=${query}&language=pt-BR`);
    const data = await response.json();
    displaySeries(data.results);
}

// Função para criar os cards de séries
function createCard(series) {
    return `
        <div class="col">
            <a class="link-serie" href="serie.html?id=${series.id}">
                <div class="card h-100">
                    <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" class="card-img-top" alt="${series.name}">
                    <div class="card-body">
                        <h5 class="card-title">${series.name}</h5>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted">${series.overview}</small>
                    </div>
                </div>
            </a>
        </div>
    `;
}

// Função para exibir as séries pesquisadas
function displaySeries(seriesList) {
    const seriesCards = document.getElementById('series-cards');
    seriesCards.innerHTML = '';
    seriesList.forEach(series => {
        seriesCards.innerHTML += createCard(series);
    });
}

// Função principal para inicializar a página
async function initializePage() {
    const popularSeries = await fetchPopularSeriesBrazil();
    displaySeries(popularSeries);
}

// Inicializando a página quando o conteúdo DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializePage);
