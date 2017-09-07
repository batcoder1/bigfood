import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EventService {

    source = new Subject<boolean>();
    save = new Subject<boolean>();

    displayStream = this.source.asObservable();
    saveStream = this.save.asObservable();

    displayCancel(estado: boolean) {
        this.source.next(estado);
    }
    displaySave(estado: boolean) {
        this.save.next(estado);
    }

}
