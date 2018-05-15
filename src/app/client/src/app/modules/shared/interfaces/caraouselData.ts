import { ICourses } from '@sunbird/core';
import { IContents } from './content';
import {ICard} from './card';
import { IAction } from './action';
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
