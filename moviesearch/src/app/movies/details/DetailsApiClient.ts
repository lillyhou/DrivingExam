"use server"

import { Details } from "../../types/Details";


export async function getMovieDetails(id: string): Promise<Details|undefined> {
    try {
        //title = title.replace(/\s/g, '');
        id = id.trim();
        const response = await fetch(`https://www.omdbapi.com/?apikey=cd2aa4ca&i=${id}&plot=full`);
        const data = await response.json();

        return data as Details; 
    }
    catch(error) {

        console.error("Failed to fetch movie details:", error);
        return undefined;
    }
}
