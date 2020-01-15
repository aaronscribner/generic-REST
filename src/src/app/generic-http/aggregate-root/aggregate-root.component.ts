import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RootParent } from '../models/root-parent.model';
import { GenericHttpService } from '../services/generic-http.service';

@Component({
  selector: 'app-aggregate-root',
  templateUrl: './aggregate-root.component.html',
  styleUrls: ['./aggregate-root.component.scss']
})
export class AggregateRootComponent implements OnInit, OnDestroy {
  public parents: RootParent[];
  private subscriptions = new Subscription();

  constructor(private service: GenericHttpService) { }

  ngOnInit() {
    this.service.getAggregateRoot().subscribe(
      data => this.parents = data.rootParents
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
