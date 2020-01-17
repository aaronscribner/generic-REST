import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Child } from '../models/child.model';
import { Parent } from '../models/parent.model';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {
  @Input() parent: Parent;

  constructor() { }

  ngOnInit() {
  }
}
