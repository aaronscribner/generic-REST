import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Grandchild } from '../models/grandchild.model';
import { GenericHttpService } from '../services/generic-http.service';

@Component({
  selector: 'app-grandchild',
  templateUrl: './grandchild.component.html',
  styleUrls: ['./grandchild.component.scss']
})
export class GrandchildComponent implements OnInit {
  @Input() grandchild: Grandchild;
  constructor(private service: GenericHttpService) { }

  ngOnInit() {
  }

  public updateGrandchild(): void {
    this.service.saveRootGrandchild(this.grandchild);
  }
}
