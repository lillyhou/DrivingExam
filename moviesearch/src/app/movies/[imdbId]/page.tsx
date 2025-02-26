import { getMovieDetails } from "./DetailsApiClient"; 
import MovieDetailView from "./MovieDetailView"; 
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { imdbId: string } }) {
    
    if (!params?.imdbId) {
        return notFound(); 
    }

    const movieDetail = await getMovieDetails(params.imdbId);

    if (!movieDetail) {
        return <div>Movie details could not be loaded.</div>;
    }

    return <MovieDetailView movieDetail={movieDetail} />;
}
