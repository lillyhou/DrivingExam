
import { Details } from "../../types/Details"; 

export default function MovieDetailView({ movieDetail }: { movieDetail: Details }) {
    return (
        <div>
            <img src={movieDetail.Poster} alt={movieDetail.Title} />
            <h1>{movieDetail.Title} ({movieDetail.Year})</h1>
            <p>{movieDetail.Plot}</p>
            <ul>
                {movieDetail.Ratings.map((rating, index) => (
                    <li key={index}>
                        <strong>{rating.Source}:</strong> {rating.Value}
                    </li>
                ))}
            </ul>
        </div>
    );
}

