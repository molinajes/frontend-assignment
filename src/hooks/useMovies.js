import { useState, useEffect } from "react";

const useMovies = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");

  const fetchMovies = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE_DB_API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();

      if (data) {
        setMovies(data.results);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    return fetchMovies();
  };

  const searchByName = async (input) => {
    if (input.length < 3) {
      if (input.length === 0) return fetchMovies();
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/search/movie?api_key=${process.env.REACT_APP_MOVIE_DB_API_KEY}&query=${input}&language=en-US&page=1`
      );
      const data = await response.json();

      if (data) {
        return setMovies(data.results);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, loading, error, refresh, searchByName };
};

export default useMovies;
