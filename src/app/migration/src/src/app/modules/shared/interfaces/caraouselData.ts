import {IContents} from './content';
import {IAction} from './action';
export interface ICaraouselData {
    name: string;
    length: number;
    contents?: Array<IContents>;
}
