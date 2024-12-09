const apiKey = 'b73fdf7389d53df948be4ec175c8a4b7';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const jsonServerBaseUrl = 'http://localhost:3000';

// Função para buscar séries populares do TMDB
async function fetchPopularSeries() {
    const response = await fetch(`${tmdbBaseUrl}/tv/popular?api_key=${apiKey}`);
    const data = await response.json();
    return data.results;
}

// Função para buscar séries novas do TMDB
async function fetchNewSeries() {
    const response = await fetch(`${tmdbBaseUrl}/tv/airing_today?api_key=${apiKey}`);
    const data = await response.json();
    return data.results;
}

// Função para buscar informações do autor do JSON Server
async function fetchAuthorInfo() {
    const response = await fetch(`${jsonServerBaseUrl}/author`);
    const data = await response.json();
    return data;
}

// Função para buscar séries favoritas do JSON Server
async function fetchFavoriteSeries() {
    const response = await fetch(`${jsonServerBaseUrl}/favoriteSeries`);
    const data = await response.json();
    return data;
}

// Função para criar os itens do carrossel
function createCarouselItem(series, isActive = false) {
    const activeClass = isActive ? 'active' : '';
    return `
        <div class="carousel-item ${activeClass}">
            <img src="https://image.tmdb.org/t/p/w500${series.backdrop_path}" class="d-block w-100" alt="${series.name}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${series.name}</h5>
            </div>
        </div>
    `;
}

// Função para criar os cards de séries
function createCard(series) {
    return `
        <div class="col">
            <a class="link-serie" href="serie.html?id=${series.id}">
                <div class="card">
                    <img src="https://image.tmdb.org/t/p/w500${series.poster_path}" class="card-img-top" alt="${series.name}">
                    <div class="card-body">
                        <h5 class="card-title">${series.name}</h5>
                    </div>
                </div>
            </a>
        </div>
    `;
}

// Função para criar a seção de informações do autor
function createAuthorInfo(author) {
    return `
        <div class="info-aluno">
            <img src="${author.avatar}" alt="${author.name}">
            <div class="details">
                <h5>${author.name}</h5>
                <p>${author.bio}</p>
                <p><strong>Curso:</strong> ${author.course}</p>
                <p><strong>Turma:</strong> ${author.class}</p>
                <p><strong>Redes Sociais:</strong> ${author.social}</p>
            </div>
        </div>
    `;
}

// Função para exibir séries favoritas
function displayFavoriteSeries(seriesList) {
    const favoriteSeriesCards = document.getElementById('favorite-series-cards');
    favoriteSeriesCards.innerHTML = '';
    seriesList.forEach(series => {
        favoriteSeriesCards.innerHTML += createCard(series);
    });
}

// Função principal para inicializar a página
async function initializePage() {
    const popularSeries = await fetchPopularSeries();
    const newSeries = await fetchNewSeries();
    const authorInfo = await fetchAuthorInfo();
    const favoriteSeries = await fetchFavoriteSeries();

    // Populando carrossel de séries populares
    const popularSeriesCarousel = document.querySelector('.carousel-inner');
    popularSeries.forEach((series, index) => {
        const isActive = index === 0; // Apenas o primeiro item deve ser ativo
        popularSeriesCarousel.innerHTML += createCarouselItem(series, isActive);
    });

    // Populando cards de novas séries
    const newSeriesCards = document.getElementById('new-series-cards');
    newSeries.forEach(series => {
        newSeriesCards.innerHTML += createCard(series);
    });

    // Populando informações do autor
    const authorInfoSection = document.getElementById('author-info');
    authorInfoSection.innerHTML = createAuthorInfo(authorInfo);

    // Populando cards de séries favoritas
    displayFavoriteSeries(favoriteSeries);
}

// Inicializando a página quando o conteúdo DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializePage);
