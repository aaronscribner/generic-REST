import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Ancestry } from '../models/ancestry.model';
import { Child } from '../models/child.model';
import { Parent } from '../models/parent.model';
import { AncestryManagementService } from '../services/ancestry.management.service';
import { ParentService } from '../services/parent.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {
  @Input() parent: Parent;
  @Input() ancestry: Ancestry;
  public ancestryForm: FormGroup;

  public constructor(private fb: FormBuilder, private service: AncestryManagementService) { }

  public ngOnInit(): void {
    this.initializeForm();
  }

  public getParent(): Parent {
    return this.parent;
  }

  public updateName(): void {
    this.parent.contact.name = this.ancestryForm.controls.name.value;
    this.service.saveParent(this.parent);
  }

  private initializeForm(): void {
    this.ancestryForm = this.fb.group({
        name: [this.parent.contact.fullName]
      }
    );
  }
}
