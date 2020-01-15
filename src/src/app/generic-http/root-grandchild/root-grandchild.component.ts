import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RootGrandchild } from '../models/root-grandchild.model';
import { GenericHttpService } from '../services/generic-http.service';

@Component({
  selector: 'app-root-grandchild',
  templateUrl: './root-grandchild.component.html',
  styleUrls: ['./root-grandchild.component.scss']
})
export class RootGrandchildComponent implements OnInit {
  @Input() grandchild: RootGrandchild;
  constructor(private service: GenericHttpService) { }

  ngOnInit() {
  }

  public updateGrandchild(): void {
    this.grandchild.id += 1;
    this.service.saveRootGrandchild(this.grandchild);
  }
}
