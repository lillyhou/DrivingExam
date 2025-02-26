"use client";
import { useState } from "react";
import MovieList from "./MovieList";
import SearchForm from "./SearchForm";
import { Movie } from "../types/Movie";


export default function MoviesPage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    return (
        <div>
            <h1>Search for movies</h1>
            <SearchForm setMovies={setMovies}></SearchForm>
            {movies.length > 0 && <MovieList movies={movies}></MovieList>}
        </div>
    )
}