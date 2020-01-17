import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SubResource } from '../../shared/models/base-classes/sub-resource.model';
import { Ancestry } from '../models/ancestry.model';
import { Child } from '../models/child.model';
import { Grandchild } from '../models/grandchild.model';
import { Parent } from '../models/parent.model';
import { AncestryService } from './ancestry.service';
import { ChildService } from './child.service';
import { GrandchildService } from './grandchild.service';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {
  public ancestry$: BehaviorSubject<Ancestry[]> = new BehaviorSubject<Ancestry[]>(null);
  public ancestry: Ancestry[];

  constructor(
    private ancestryService: AncestryService,
    private rootParentService: ParentService,
    private rootChildService: ChildService,
    private rootGrandchildService: GrandchildService
  ) {
  }

  public getAncestries(): Observable<Ancestry[]> {
    this.ancestryService.list().subscribe(
      data => {
        this.ancestry$.next(data);
        this.ancestry = data;
      },
      error => console.log(error)
    );

    return this.ancestry$;
  }

  public saveAggregateRoot(root: Ancestry): void {

  }

  public saveRootParent(parent: Parent): void {
  }

  public saveRootChild(child: Child): void {

  }

  public saveRootGrandchild(grandchild: Grandchild): void {

  }
}
