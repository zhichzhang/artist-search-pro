import { SearchItem } from '../search-item.model'

export interface SearchResult {
    message: string;
    success: boolean;
    data?: {
        _embedded: SearchItem[];
    }
}