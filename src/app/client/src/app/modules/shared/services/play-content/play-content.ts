import {Subject} from 'rxjs';


export class PlayContent {
        public subject = new Subject<{id: string, title: string}>();

}
