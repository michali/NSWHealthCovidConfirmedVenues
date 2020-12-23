import {Location} from './Location'

export interface ILocationRetriever{
    Get(url: string):Location[];
}

