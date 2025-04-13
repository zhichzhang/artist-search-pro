import { SearchItem } from '../search-item.model'

export interface SimilarArtistsResult {
    message: string;
    success: boolean;
    data?: {
        _embedded: SearchItem[];
    }
}
