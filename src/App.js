import "./App.css";
import moment from "moment";
import React, { useState, useEffect } from "react";
import logo from "./images/logo.svg";
import close from "./images/close-icon.svg";
import useMovies from "./hooks/useMovies";

function App() {
  const [modal, setModal] = useState(false);
  const [movie, setMovie] = useState({});

  const { movies, loading, error, searchByName } = useMovies();

  function debounce(callback, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback.apply(this, args), delay);
    };
  }

  const debouncedSearch = debounce(function (searchTerm) {
    searchByName(searchTerm);
  }, 500);

  const Movie = ({ movie }) => {
    return (
      <div
        key={movie.id}
        className="movie-card"
        onClick={() => {
          setModal(true);
          setMovie(movie);
        }}
      >
        <img
          src={`${process.env.REACT_APP_API_BASE_IMAGE_URL}/${movie.poster_path}`}
          alt={movie.title}
        />
        <h3>{movie.title}</h3>

        <span className="movie-rating">
          <label>{movie?.vote_average}</label>
        </span>
      </div>
    );
  };

  return (
    <div className="movie-list">
      <header className="search-row">
        <img src={logo} alt="Timescale" />

        <span>
          <input
            className="search-input"
            placeholder="Search for a movie"
            onChange={(e) => {
              debouncedSearch(e.target.value);
            }}
          />
        </span>
      </header>

      <hr style={{ marginTop: 20, border: "0.5px solid #C0C4CC" }} />
      <h1>Most Recent Movies</h1>

      {loading && <p>Loading...</p>}
      {!loading && (
        <div className="movie-grid">
          {movies.map((movie) => (
            <React.Fragment key={movie.id}>
              <Movie movie={movie} />
            </React.Fragment>
          ))}
        </div>
      )}

      <div
        id="modal"
        className="modal"
        style={{ display: modal ? "block" : "none" }}
      >
        <div className="modal-content">
          <span
            className="close"
            onClick={() => {
              setModal(false);
              setMovie({});
            }}
          >
            <img src={close} className="close-icon" />
          </span>

          <h2 id="modal-title">{movie.title}</h2>

          <div className="modal-row">
            <span>
              <img
                id="modal-image"
                alt=""
                src={`${process.env.REACT_APP_API_BASE_IMAGE_URL}/${movie.poster_path}`}
              />
            </span>

            <span style={{ marginLeft: 20 }}>
              <p id="modal-date">
                <b> Release date: </b>
                {moment(movie.release_date).format("MMM DD,YYYY")}
              </p>
              <p>{movie.overview}</p>

              <span>
                <b>{movie.vote_average} </b>/ 10 ({movie.vote_count} total
                votes)
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
