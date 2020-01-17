import { Component, OnInit } from '@angular/core';
import { Resource } from '../shared/models/base-classes/resource.model';
import { SubResource } from '../shared/models/base-classes/sub-resource.model';
import { Ancestry } from './models/ancestry.model';
import { AncestryService } from './services/ancestry.service';
import { GenericHttpService } from './services/generic-http.service';

@Component({
  selector: 'app-generic-http',
  templateUrl: './ancestry.component.html',
  styleUrls: ['./ancestry.component.scss']
})
export class AncestryComponent implements OnInit {
  public ancestries: Ancestry[];

  constructor(private service: GenericHttpService) {
  }

  public ngOnInit(): void {
    this.subscribeAncestries();
  }

  public getParent(): void {

  }

  public getChild(): void {

  }

  public getGrandchild(): void {

  }

  private subscribeAncestries(): void {
    this.service.getAncestries().subscribe(
      data => this.ancestries = data
    );
  }
}
