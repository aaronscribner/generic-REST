import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AggregateRoot } from '../models/aggregate-root.model';
import { RootChild } from '../models/root-child.model';
import { RootGrandchild } from '../models/root-grandchild.model';
import { RootParent } from '../models/root-parent.model';
import { AggregateRootService } from './aggregate-root.service';
import { RootChildService } from './root-child.service';
import { RootGrandchildService } from './root-grandchild.service';
import { RootParentService } from './root-parent.service';

@Injectable({
  providedIn: 'root'
})
export class GenericHttpService {
  public aggregateRoot$: BehaviorSubject<AggregateRoot> = new BehaviorSubject<AggregateRoot>(null);

  constructor(
    private aggregateRootService: AggregateRootService,
    private rootParentService: RootParentService,
    private rootChildService: RootChildService,
    private rootGrandchildService: RootGrandchildService
  ) {
  }

  public getAggregateRoot(): Observable<AggregateRoot> {
    const result = this.aggregateRootService.read(1).subscribe(
      data => this.aggregateRoot$.next(data)
    );

    return this.aggregateRoot$;
  }

  public saveAggregateRoot(root: AggregateRoot): void {

  }

  public saveRootParent(parent: RootParent): void {
  }

  public saveRootChild(child: RootChild): void {

  }

  public saveRootGrandchild(grandchild: RootGrandchild): void {

  }
}
