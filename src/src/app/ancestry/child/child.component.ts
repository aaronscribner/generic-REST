import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Child } from '../models/child.model';
import { Grandchild } from '../models/grandchild.model';
import { GenericHttpService } from '../services/generic-http.service';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent implements OnInit {
  @Input() child: Child;
  private subscription = new Subscription();

  constructor(private service: GenericHttpService) { }

  ngOnInit() {
  }

  public updateChild(): void {
    this.service.saveRootChild(this.child);
  }
}
