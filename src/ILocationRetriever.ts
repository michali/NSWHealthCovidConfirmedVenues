import {Location} from './Location'

export interface ILocationRetriever{
    Get(url: string):Location[];
}

// export class LocationRetriever{
//     Get(url: string):Location[]
// }