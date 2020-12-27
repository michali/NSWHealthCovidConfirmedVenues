import {Venue} from './Venue'

export interface IVenueRetriever{
    Get(url: string):Promise<Venue[]>;
}

