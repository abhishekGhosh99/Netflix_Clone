// Consts
const apiKey = "7543524441a260664a97044b8e2dc621";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const apiPaths = {
    fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apiKey}`,
    fetchMoviesList: (id) => `${apiEndpoint}/discover/movie?api_key=${apiKey}&with_genres=${id}`,
    fetchTrending: `${apiEndpoint}/trending/all/day?api_key=${apiKey}&language=en-US`,
    searchOnYoutube: (query) => `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyC0SZJkHFX-fQ7NrsxdI4l4mGwYuY4l7P8`
};
// hamburgermenu

const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('main-nav');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active')
    })
}
if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active')
    })
}

// Boots up the app
function init() {
    fetchTrendingMovies()
    fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
    fetchAndbuildMovieSection(apiPaths.fetchTrending, 'Trending Now')
        .then(list => {
            const randomIndex = parseInt(Math.random() * list.length);
            buildBannerSection(list[randomIndex]);
        })
        .catch(err => console.error(err));
}

function buildBannerSection(movie) {
    const bannerContainer = document.getElementById('banner-section')
    bannerContainer.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`
    bannerContainer.classList.add('banner-image');


    const div = document.createElement('div');
    div.innerHTML = `
            <h2 class="banner_title">${movie.title}</h2>
            <p class="banner_info">Trending in movies | Released on ${movie.release_date}</p>
            <p class="banner_overview">${movie.overview && movie.overview.length > 300 ? movie.overview.slice(0,100).trim()+ '...':movie.overview}.</p>
            <div class="action-button-container">
                <button class="action-button"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"> <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/> </svg></span>Play</button>
                <button class="action-button"><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"> <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/> <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg> </span>More Info</button>
            </div>
    `;
    div.className = 'banner-content container'
    bannerContainer.append(div)
}

function fetchAndBuildAllSections() {
    fetch(apiPaths.fetchAllCategories)
        .then(res => res.json())
        .then(res => {
            const categories = res.genres
            if (Array.isArray(categories) && categories.length) {
                categories.forEach(category => {
                    fetchAndbuildMovieSection(apiPaths.fetchMoviesList(category.id), category.name);
                });
            }
            // console.table(movies)
        })
        .catch(err => console.error(err));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName) {
    // console.log(fetchUrl, category)
    return fetch(fetchUrl)
        .then(res => res.json())
        .then(res => {
            // console.log(res.results)
            const movies = res.results;
            if (Array.isArray(movies) && movies.length) {
                buildMoviesSection(movies, categoryName)
            }
            return movies;
        })
        .catch(err => console.error(err))
}

function buildMoviesSection(list, categoryName) {
    // console.log(list, categoryName)
    const moviesContainer = document.getElementById('movies-container')
    const moviesListHTML = list.map(item => {
        return `
        <div class ="movie-item" onmouseenter="searchMovieTrailer('${item.title}', 'yt${item.id}')">
        <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}"/>
        <div class="iframe-wrap" id="yt${item.id}"></div>
        </div>
        `;
    }).join('')
    const moviesSectionHTML = `
            <h2 class="movie-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
            <div class="movies-row">
            ${moviesListHTML}
            </div>
    `
        // console.log(moviesSectionHTML)

    const div = document.createElement('div');
    div.className = "movies-section"
    div.innerHTML = moviesSectionHTML

    //append HTML into movies container
    moviesContainer.append(div)
}

function searchMovieTrailer(movieName, iframId) {
    if (!movieName) return;
    fetch(apiPaths.searchOnYoutube(movieName))
        .then(res => res.json())
        .then(res => {
            const bestResult = res.items[0];
            const elements = document.getElementById(iframId);
            console.log(elements, iframId);
            const div = document.createElement('div');
            div.innerHTML = `<iframe width="245px" height="150px" src="https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0"></iframe>`
            elements.append(div);
        })
        .catch(err => console.log(err));
}

window.addEventListener('load', function() {
    init();
    window.addEventListener('scroll', function() {
        // header ui update
        const header = document.getElementById('header');
        if (window.scrollY > 5) header.classList.add('black-bg')
        else header.classList.remove('black-bg');
    })
})
