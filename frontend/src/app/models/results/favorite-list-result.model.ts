import { FavoriteItem } from "../favorite-item.model";

export interface FavoriteListResult {
    message: string;
    success: boolean;
    data?: {
        _embedded: FavoriteItem[];
    }
}