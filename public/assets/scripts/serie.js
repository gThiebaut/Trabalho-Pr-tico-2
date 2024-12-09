const apiKey = 'b73fdf7389d53df948be4ec175c8a4b7';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
const jsonServerBaseUrl = 'http://localhost:3000';

// Função para buscar detalhes da série
async function fetchSeriesDetails(seriesId) {
    const response = await fetch(`${tmdbBaseUrl}/tv/${seriesId}?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    return data;
}

// Função para buscar elenco da série
async function fetchSeriesCast(seriesId) {
    const response = await fetch(`${tmdbBaseUrl}/tv/${seriesId}/credits?api_key=${apiKey}&language=pt-BR`);
    const data = await response.json();
    return data.cast;
}

// Função para buscar séries favoritas do JSON Server
async function fetchFavoriteSeries() {
    const response = await fetch(`${jsonServerBaseUrl}/favoriteSeries`);
    const data = await response.json();
    return data;
}

// Função para salvar série como favorita
async function saveFavoriteSeries(series) {
    const response = await fetch(`${jsonServerBaseUrl}/favoriteSeries`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(series)
    });
    return response.json();
}

// Função para remover série dos favoritos
async function removeFavoriteSeries(seriesId) {
    // Buscar a série nos favoritos para obter o ID correto do JSON Server
    const favoriteSeries = await fetchFavoriteSeries();
    const favoriteSeriesItem = favoriteSeries.find(series => series.id === seriesId);
    if (!favoriteSeriesItem) {
        console.warn('Série não encontrada nos favoritos.');
        return;
    }
    const response = await fetch(`${jsonServerBaseUrl}/favoriteSeries/${favoriteSeriesItem.id}`, {
        method: 'DELETE'
    });
    if (response.status === 404) {
        console.warn('Série não encontrada nos favoritos.');
        return;
    }
    return response.json();
}

// Função para criar o card de elenco
function createCastCard(actor) {
    const actorImage = actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : './assets/img/imagem-indisponivel.png';
    return `
        <div class="card">
            <img src="${actorImage}" class="card-img-top" alt="${actor.name}">
            <div class="card-body">
                <h5 class="card-title">${actor.name}</h5>
                <p class="card-text"><small class="text-muted">${actor.character}</small></p>
            </div>
        </div>
    `;
}

// Função para exibir elenco
function displayCast(cast) {
    const castContainer = document.getElementById('cast');
    castContainer.innerHTML = '';
    cast.forEach(actor => {
        castContainer.innerHTML += createCastCard(actor);
    });
}

// Função para exibir detalhes da série
function displaySeriesDetails(series, isFavorited) {
    const overviewContainer = document.getElementById('overview');
    const seriesImage = series.poster_path ? `https://image.tmdb.org/t/p/w500${series.poster_path}` : './assets/img/imagem-indisponivel.png';
    overviewContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <img src="${seriesImage}" class="img-fluid mb-4" alt="${series.name}">
                <h5 class="card-title">${series.name}</h5>
                <p class="card-text">${series.overview}</p>
                <p><strong>Data de Lançamento:</strong> ${series.first_air_date}</p>
                <p><strong>Nota:</strong> ${series.vote_average}</p>
                <button class="btn btn-primary" onclick="addToFavorites(${series.id})">Curtir</button>
            </div>
        </div>
    `;
}

// Função para exibir temporadas
function displaySeasons(series) {
    const seasonsContainer = document.getElementById('seasons');
    seasonsContainer.innerHTML = '';
    series.seasons.forEach(season => {
        const seasonImage = season.poster_path ? `https://image.tmdb.org/t/p/w200${season.poster_path}` : './assets/img/imagem-indisponivel.png';
        seasonsContainer.innerHTML += `
            <div class="card">
                <img src="${seasonImage}" class="card-img-top" alt="${season.name}">
                <div class="card-body">
                    <h5 class="card-title">${season.name}</h5>
                    <p class="card-text">Episódios: ${season.episode_count}</p>
                </div>
            </div>
        `;
    });
}

// Função para adicionar série aos favoritos
async function addToFavorites(seriesId) {
    const seriesDetails = await fetchSeriesDetails(seriesId);
    await saveFavoriteSeries(seriesDetails);
    alert('Série adicionada aos favoritos!');
    initializePage(); // Recarregar a página para atualizar o botão
}

// Função para remover série dos favoritos
async function removeFromFavorites(seriesId) {
    await removeFavoriteSeries(seriesId);
    alert('Série removida dos favoritos!');
    initializePage(); // Recarregar a página para atualizar o botão
}

// Função principal para inicializar a página
async function initializePage() {
    const urlParams = new URLSearchParams(window.location.search);
    const seriesId = Number(urlParams.get('id')); // Obtém o ID da série a partir da URL e converte para número

    const [seriesDetails, seriesCast, favoriteSeries] = await Promise.all([
        fetchSeriesDetails(seriesId),
        fetchSeriesCast(seriesId),
        fetchFavoriteSeries()
    ]);

    const isFavorited = favoriteSeries.some(favSeries => favSeries.id === seriesDetails.id);

    displaySeriesDetails(seriesDetails, isFavorited);
    displayCast(seriesCast);
    displaySeasons(seriesDetails);
}

// Inicializando a página quando o conteúdo DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializePage);
