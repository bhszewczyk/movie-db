// Assign TMDB API variables
const API_URL =
	'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=ce0958d9c881dd6edfe3e889e1afe933&page=1';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API =
	'https://api.themoviedb.org/3/search/movie?api_key=ce0958d9c881dd6edfe3e889e1afe933&query="';
const API_KEY = 'ce0958d9c881dd6edfe3e889e1afe933&';

// get elements from the DOM
const form = document.getElementById('search-form');
const search = document.getElementById('search');
const movieCardsContainer = document.getElementById('main');
const movieCards = document.querySelectorAll('.movie');

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

main.addEventListener('click', (e) => {
	const closestDiv = e.target.closest('div.movie');

	if (!closestDiv) {
		return;
	}

	main.innerHTML = '';

	const title = closestDiv.children[1].children[0].innerText;
	const query = title.toLowerCase().split(' ').join('+');

	getMovieDetails(query);
});

async function getMovieDetails(query) {
	const response = await fetch(`${SEARCH_API}&query=${query}`);
	const movie = await response.json();

	const movieId = movie.results[0].id;

	const movieDetailsRequest = await fetch(
		`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
	);

	const movieDetailsRes = await movieDetailsRequest.json();

	console.log(movieDetailsRes);

	const {
		genres,
		original_title: orgTitle,
		release_date: releaseDate,
		runtime: duration,
		vote_average: rating,
		vote_count: votes,
		poster_path: imgPath,
	} = movieDetailsRes;

	const movieDetails = {
		orgTitle,
		releaseDate,
		duration,
		genres,
		imgPath,
		rating,
		votes,
	};

	const templateMovieDetails = `
	<div class="movie-container">
		<img
					src="${IMG_PATH + movieDetails.imgPath}"
					alt="${movieDetails.orgTitle} poster"
					class="poster"
		/>
		<h1 class="title">${movieDetails.orgTitle}</h1>
		<div class="movie-details">
			<div class="movie-detail">
				<span class="movie-detail--label">Release date:</span>
				<span class="movie-detail--data">${movieDetails.releaseDate}</span>
			</div>
			<div class="movie-detail">
				<span class="movie-detail--label">Duration:</span>
				<span class="movie-detail--data">${movieDetails.duration} mins</span>
			</div>
			<div class="movie-detail movie-detail--genre">
				<span class="movie-detail--label">Genres:</span>
				<span class="movie-detail--data">
					${getGenresButtonsFunc(movieDetails.genres)}
				</span>
				
			</div>
		</div>
		<div class="movie-rating">
			9.8 out of 123984 votes
		</div>
	</div>
	`;

	const movieCardEl = document.createElement('div');

	movieCardEl.innerHTML = templateMovieDetails;

	main.append(movieCardEl);
}

function getGenresButtonsFunc(genresObj) {
	console.log(genresObj);
	let genresHtml = '';

	for (const genre in genresObj) {
		const genreEl = document.createElement('button');

		genreEl.classList.add('btn-genre');

		genreEl.innerText = genresObj[genre].name;

		console.log(genreEl);

		genresHtml += genreEl.outerHTML;
	}

	return genresHtml;
}
