import {Injectable} from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';

@Injectable()
export class ActiveStateService {

  public name: string;

  constructor(router: Router, route: ActivatedRoute){
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd){

        // Traverse the active route tree
        let snapshot = route.snapshot;
        let activated = route.firstChild;
        if (activated != null) {
          while (activated != null) {
            snapshot = activated.snapshot;
            activated = activated.firstChild;
          }
        }

        // Try finding the 'stateName' from the data
        this.name = snapshot.data['stateName'] || 'unnamed';
      }
    });
  }

  is(name) {
    return this.name === name;
  }
}
