import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { RootChild } from '../models/root-child.model';
import { RootGrandchild } from '../models/root-grandchild.model';
import { GenericHttpService } from '../services/generic-http.service';

@Component({
  selector: 'app-root-child',
  templateUrl: './root-child.component.html',
  styleUrls: ['./root-child.component.scss']
})
export class RootChildComponent implements OnInit {
  @Input() child: RootChild;
  private subscription = new Subscription();

  constructor(private service: GenericHttpService) { }

  ngOnInit() {
  }

  public updateChild(): void {
    this.child.id += 2,
    this.service.saveRootChild(this.child);
  }
}
