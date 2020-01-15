import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RootChild } from '../models/root-child.model';
import { RootParent } from '../models/root-parent.model';

@Component({
  selector: 'app-root-parent',
  templateUrl: './root-parent.component.html',
  styleUrls: ['./root-parent.component.scss']
})
export class RootParentComponent implements OnInit {
  @Input() parent: RootParent;

  constructor() { }

  ngOnInit() {
  }
}
