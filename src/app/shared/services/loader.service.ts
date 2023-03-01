import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

 private _loadingStatus = new BehaviorSubject<boolean>(false)
  public readonly _loading$ = this._loadingStatus.asObservable()
  constructor() { }

  show(){
      this._loadingStatus.next(true)
  }
  hide(){
    this._loadingStatus.next(false)
  }
}
