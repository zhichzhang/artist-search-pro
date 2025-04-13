import {ArtistInfo} from "../artist-info.model";

export interface ArtistInfoResult {
    message: string;
    success: boolean;
    data?: ArtistInfo;
}
