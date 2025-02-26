import { Ratings } from "./Ratings"; // Import the Ratings interface

export interface Details {
    Poster: string;
    Title: string;
    Year: string;
    Plot: string;
    Ratings: Ratings[]; // Use the imported Ratings type as an array
}