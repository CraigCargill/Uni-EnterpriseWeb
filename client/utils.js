//This file is filled with some helper functions needed across the project

//This function returns the JSON of the popular movies from TMDB APi
export async function returnJSON(page) {
  let result = await fetch(
    "https://api.themoviedb.org/3/movie/popular?api_key=5e8f835586165f79f50e14c3421697c9&language=en-US&page=" +
      page
  ).then((response) => response.json());
  return result;
}

//This function takes in a movieID and returns that movie's JSON
export async function returnSingleMovie(movieID) {
  let result = await fetch(
    `https://api.themoviedb.org/3/movie/${movieID}?api_key=5e8f835586165f79f50e14c3421697c9&language=en-US`
  ).then((response) => response.json());
  return result;
}

//This function takes a movieID created in this project and returns the TMDB ID
export function returnMovieID(movieID) {
  let id = movieID.substring(0, movieID.indexOf("*"));

  return `${id}`;
}

//This function takes in a movieID created in this project and returns the movie title
export function returnMovieTitle(movieID) {
  let title = movieID.substring(movieID.indexOf("*") + 1);

  return `${title}`;
}

//This function returns the first 10 (or max per request) movies from a JSON response
export function returnTenMovies(jsonResponse) {
  var movies = [];
  for (var x = 0; x < jsonResponse.length; x++) {
    let object = jsonResponse[x];
    movies.push(object);
  }
  return movies;
}

//This function gets the URL of a movie poster from the movie object
export function moviePoster(movies) {
  let posterPath = movies.poster_path;
  // var img = new Image();
  let imgSrc = "https://image.tmdb.org/t/p/w500" + posterPath;
  return imgSrc;
}

//This function gets the URL of the movie background from the movie object
export function movieBackground(movies) {
  let backdropPath = movies.backdrop_path;
  // var img = new Image();
  let imgSrc = "https://image.tmdb.org/t/p/w500" + backdropPath;
  return imgSrc;
}
