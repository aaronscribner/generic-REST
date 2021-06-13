import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Ancestry } from '../models/ancestry.model';
import { Child } from '../models/child.model';
import { Grandchild } from '../models/grandchild.model';
import { Parent } from '../models/parent.model';
import { AncestryService } from './ancestry.service';
import { ChildService } from './child.service';
import { GrandchildService } from './grandchild.service';
import { ParentService } from './parent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpCodeMessage } from '@core/services/http-code-message/models/http-code-message.model';

@Injectable({
  providedIn: 'root'
})
export class AncestryManagementService {
  public ancestry$: BehaviorSubject<Ancestry>;
  private ancestry: Ancestry;

  constructor(
    private ancestryService: AncestryService,
    private parentService: ParentService,
    private childService: ChildService,
    private grandchildService: GrandchildService,
    private snackBar: MatSnackBar
  ) {

    this.ancestry = new Ancestry();
    this.ancestry$ = new BehaviorSubject<Ancestry>(this.ancestry);
  }

  public getAncestry(id: number) {
    this.ancestry.id = id;
    this.ancestryService.read(this.ancestry).subscribe(
      data => {
        this.ancestry$.next(data);
        this.ancestry = data;
      },
      error => console.log(error)
    );

    return this.ancestry$;
  }

  public getGrandchildren(child: Child) {
    this.grandchildService.list(child);
  }

  public saveParent(parent: Parent) {
    this.parentService.update(parent).subscribe(
      data => {
        parent = data;
        this.ancestry$.next(this.ancestry);
      }
    );
  }

  public saveChild(child: Child) {
    this.childService.update(child).subscribe(
      data => {
        child = data;
        this.ancestry$.next(this.ancestry);
      }
    );
  }

  public saveGrandchild(grandchild: Grandchild) {
    this.grandchildService.update(grandchild).subscribe(
      data => {
        grandchild = data;
        this.ancestry$.next(this.ancestry);
      },
      (error: HttpCodeMessage) => {
        this.snackBar.open(error.message);
      }
    );
  }
}
