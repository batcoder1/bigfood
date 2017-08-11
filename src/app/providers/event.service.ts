import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

export class EventService {

    source = new Subject<boolean>();

    displayStream = this.source.asObservable();

    display(estado: boolean) {
        this.source.next(estado);
    }

}
