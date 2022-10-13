import { Injectable }    from '@angular/core';
import { CanDeactivate } from '@angular/router';

import { Observable, of }   from 'rxjs';
 
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
 
@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): Observable<boolean> {
    if(component.canDeactivate()){
      return of(true);
    }
    return of(false);
  }
}