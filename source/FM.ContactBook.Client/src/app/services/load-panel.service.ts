import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadPanelService {
  private _setVisible: Subject<boolean> = new Subject();
  public $setVisible: Observable<boolean> = this._setVisible.asObservable();

  public setVisible(visible: boolean): void {
    this._setVisible.next(visible);
  }
}