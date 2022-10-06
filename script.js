// Assign TMDB API variables
const API_URL =
	'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=ce0958d9c881dd6edfe3e889e1afe933&page=1';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API =
	'https://api.themoviedb.org/3/search/movie?api_key=ce0958d9c881dd6edfe3e889e1afe933&query="';

// get elements from the DOM
const form = document.getElementById('search-form');
const search = document.getElementById('search');

// Get initial movies
getMovies(API_URL);

function getMovies(url) {
	fetch(url)
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
		})
		.catch((error) => console.error('Error:', error));
}

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
