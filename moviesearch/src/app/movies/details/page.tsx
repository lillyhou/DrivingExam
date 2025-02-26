import { getMovieDetails } from "../[imdbId]/DetailsApiClient";
import MovieDetailView from "../[imdbId]//MovieDetailView";
import React from "react";

export default async function Page({ params }: { params: { imdbId: string } }) {
    const { imdbId } = params;
    const movieDetail = await getMovieDetails(imdbId);
    
    if (!movieDetail) return <div>Movie details could not be loaded.</div>;

    return <MovieDetailView movieDetail={movieDetail} />;
}
