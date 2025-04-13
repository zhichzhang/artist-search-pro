import {Artwork} from "../artwork.model";

export interface ArtworksResult {
    message: string;
    success: string;
    data?: {
        _embedded: Artwork[];
    };
}