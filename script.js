// Assign TMDB API variables
const API_URL =
	'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=ce0958d9c881dd6edfe3e889e1afe933&page=1';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API =
	'https://api.themoviedb.org/3/search/movie?api_key=ce0958d9c881dd6edfe3e889e1afe933&query="';

// get elements from the DOM
const form = document.getElementById('search-form');
const search = document.getElementById('search');
const movieCardsContainer = document.getElementById('main');

// Get initial movies
getMovies(API_URL);

// Clear movie cards
function clearMovies() {
	main.innerHTML = '';
}

// Display movies
function showMovies(movies) {
	clearMovies();

	movies.forEach((movie) => {
		const {
			title,
			vote_average: rating,
			poster_path: imgPath,
			overview,
		} = movie;

		const movieEl = document.createElement('div');
		movieEl.classList.add('movie');

		const htmlTemplate = `
				<img
					src="${IMG_PATH + imgPath}"
					alt="\"${title}\" poster"
				/>
				<div class="movie-info">
					<h3>${title}</h3>
					<span class="${getRatingColor(rating)}">${rating}</span>
				</div>
				<div class="overview">
					<h3>Overview</h3>
					<p>
						${overview}
					</p>
				</div>`;

		movieEl.innerHTML = htmlTemplate;

		main.append(movieEl);
	});
}

// Get movies from the database
function getMovies(url) {
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			const movies = data.results;
			console.log(movies);
			showMovies(movies);
		})
		.catch((error) => console.error('Error:', error));
}

// Set the rating color
function getRatingColor(rating) {
	if (rating >= 7) {
		return 'green';
	} else if (rating < 7 && rating > 5) {
		return 'orange';
	} else {
		return 'red';
	}
}

// On search fetch movies
form.addEventListener('submit', (e) => {
	e.preventDefault();

	const searchTerm = search.value;

	if (searchTerm && searchTerm !== '') {
		getMovies(SEARCH_API + searchTerm);

		search.value = '';
	} else {
		window.location.reload();
	}
});
