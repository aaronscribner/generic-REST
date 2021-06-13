import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private router: Router) {}

  // I determine if the current route-request is part of a page refresh.
  public isPageRefresh(): boolean {
    // If the router has yet to establish a single navigation, it means that this
    // navigation is the first attempt to reconcile the application state with the
    // URL state. Meaning, this is a page refresh.
    return !this.router.navigated;
  }

  public sortingDataAccessor<S>(data, sortHeaderId): S {
    if (data[sortHeaderId]) {
      if (typeof data[sortHeaderId] === 'object' && data[sortHeaderId].name) {
        return data[sortHeaderId].name.toString().toLocaleLowerCase();
      } else if (typeof data[sortHeaderId] === 'object' && data[sortHeaderId].value) {
        return data[sortHeaderId].value.toString().toLocaleLowerCase();
      } else if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toString().toLocaleLowerCase();
      } else {
        return data[sortHeaderId];
      }
    } else {
      return null;
    }
  }
}
