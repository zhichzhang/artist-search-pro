import {User} from "../user.model";

export interface LoginResult {
    message: string;
    success: boolean;
    data?: User;
}