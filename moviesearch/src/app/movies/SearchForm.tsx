"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { Movie } from "../types/Movie";
import { getMovies } from "./moviesApiClient";

type SearchFormProps = {
    setMovies: Dispatch<SetStateAction<Movie[]>>
}
export default function SearchForm({ setMovies }: SearchFormProps) {
    const [error, setError] = useState<string>("");
    return (
        <div>
            <form onSubmit={async e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const title = formData.get('title') as string;
                const movies = await getMovies(title);
                if (!movies) {
                    setMovies([]);
                    setError("An error occurred while searching for movies.");
                    return;
                }
                setError("");
                setMovies(movies);
            }}>
                <input type="text" name="title" placeholder="Search for a movie" />
                <button type="submit">Search</button>
                <div>{error}</div>
            </form>
        </div>
    )
}