import { Movie, MovieDetails, TMDBResponse, Video, Cast } from "@/types/movie";

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "8265bd1679663a7ea12ac168da84d2e8";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getImageUrl = (path: string | null, size: string = "original"): string => {
  if (!path) return "/placeholder-movie.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

const fetchFromTMDB = async <T>(endpoint: string): Promise<T> => {
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${TMDB_API_KEY}`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }

  return response.json();
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>("/trending/movie/week");
  return data.results;
};

export const getPopularMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>("/movie/popular");
  return data.results;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>("/movie/top_rated");
  return data.results;
};

export const getUpcomingMovies = async (): Promise<Movie[]> => {
  const data = await fetchFromTMDB<TMDBResponse<Movie>>("/movie/upcoming");
  return data.results;
};

export const getMovieDetails = async (id: string): Promise<MovieDetails> => {
  return fetchFromTMDB<MovieDetails>(`/movie/${id}`);
};

export const getMovieVideos = async (id: string): Promise<Video[]> => {
  const data = await fetchFromTMDB<{ results: Video[] }>(`/movie/${id}/videos`);
  return data.results;
};

export const getMovieCredits = async (id: string): Promise<Cast[]> => {
  const data = await fetchFromTMDB<{ cast: Cast[] }>(`/movie/${id}/credits`);
  return data.cast;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query.trim()) return [];
  const data = await fetchFromTMDB<TMDBResponse<Movie>>(`/search/movie?query=${encodeURIComponent(query)}`);
  return data.results;
};
