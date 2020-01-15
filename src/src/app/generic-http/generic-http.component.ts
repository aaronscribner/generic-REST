import { Component, OnInit } from '@angular/core';
import { GenericHttpService } from '../services/generic-http.service';

@Component({
  selector: 'app-generic-http',
  templateUrl: './generic-http.component.html',
  styleUrls: ['./generic-http.component.scss']
})
export class GenericHttpComponent {

  constructor(private service: GenericHttpService) {
  }

  public getParent(): void {

  }

  public getChild(): void {

  }

  public getGrandchild(): void {

  }
}
