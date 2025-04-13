import { User } from '../user.model'

export interface RegisterResult {
    message: string;
    success: boolean;
    data?: User;
    // redirect?: String;
}
