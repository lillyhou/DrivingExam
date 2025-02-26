import { getMovieDetails } from "./DetailsApiClient";
import MovieDetailView from "./MovieDetailView";

export default async function Page({ params }: { params: { imdbId: string } }) {
    const { imdbId } = params; // Access imdbId directly (no need for await)
    const movieDetail = await getMovieDetails(imdbId);
    
    if (!movieDetail) return <div>Movie details could not be loaded.</div>;

    return <MovieDetailView movieDetail={movieDetail} />;
}
