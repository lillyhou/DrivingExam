"use client";

import { useState, useEffect } from "react";
import { Details } from "../../types/Details"



export default function MovieDetailView({ movieDetail }: { movieDetail: Details }) {
    const [isClient, setIsClient] = useState(false);
    const [errorMessage] = useState("");

    useEffect(() => {
        setIsClient(true); 
      }, []);
    
      if (!isClient) return null; 

    return (
        <div>
            <h1>{movieDetail.Title}</h1>
            <img src={movieDetail.Poster} alt={movieDetail.Title} />
            <p>{movieDetail.Plot}</p>
            <p> {movieDetail.Ratings}</p>
            {errorMessage && <div>{errorMessage}</div>}
        </div>
    );
}