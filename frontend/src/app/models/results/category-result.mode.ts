import {Category} from "../category.model";

export interface CategoryResult {
    message: string;
    success: string;
    data?: {
        _embedded: Category[];
    }
}
