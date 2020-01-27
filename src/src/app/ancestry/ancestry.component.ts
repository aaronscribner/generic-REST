import { Component, OnInit } from '@angular/core';
import { Resource } from '../shared/models/base-classes/resource.model';
import { SubResource } from '../shared/models/base-classes/sub-resource.model';
import { Ancestry } from './models/ancestry.model';
import { AncestryManagementService } from './services/ancestry.management.service';

@Component({
  selector: 'app-generic-http',
  templateUrl: './ancestry.component.html',
  styleUrls: ['./ancestry.component.scss']
})
export class AncestryComponent implements OnInit {
  public ancestry: Ancestry;

  constructor(private service: AncestryManagementService) {
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
    this.service.getAncestry(82041).subscribe(
      data => this.ancestry = data
    );
  }
}
