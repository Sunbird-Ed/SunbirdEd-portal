import { ICourses } from '@sunbird/core';
import {ICard} from './card';
/**
 * ICaraouselData interface
*/
export interface ICaraouselData {
    /**
    * CaraouselData name
    */
    name: string;
    /**
    * CaraouselData length
    */
    length: number;
    /**
     * CaraouselData content can be of
     * IContents or ICourses
     */
    contents?: Array<ICard> | Array<ICourses>;
}
