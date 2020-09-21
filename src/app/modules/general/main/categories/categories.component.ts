import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';

import { V8OneService } from 'src/app/services/v8-one.service';
import { V8DataService } from 'src/app/services/v8-db.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  c: any = {};
  
  data: any = {
    submitted:  false,
    success:    false,
    error:      '',
    viewMode:   false,
    data:       Object
  }

  appForm = new FormGroup({
    ID: new FormControl(0),
    name: new FormControl('', Validators.required),
    icon: new FormControl(''),
    color: new FormControl('')
  })

 constructor(
    public one: V8OneService, 
    private ds: V8DataService
  ) {
    let component = {
      "ID":8,
      "appID":1,
      "parentID":1,
      "name":"Categories",
      "component":"categories",
      "icon":null,
      "sortID":1,
      "tblName":"Categories",
      "opt":null,
      "active":true,
      "prevID":0
    }
    this.one.addComponent(component); 
    
    this.c = this.one.getComponent('categories');
  }

  ngOnInit(): void {
    let ps = this.one.getState('categories');
    if (ps !== undefined) {
      this.data = ps.data;
      this.appForm = ps.formData;
    }
  }

 toggleView() {
    this.data.view = !this.data.view;
  }

  edit(id: number) {
    this.ds.submit('getEditData', {tbl: this.c.tblName, ID: id})
    .subscribe({
      next: data => {
        this.data.view = false;
        const d = data[0];

        this.appForm.patchValue({
          ID: d.ID,
          name: d.name,
          icon: d.icon,
          color: d.color
        });
      },
      error: error => {
        this.data.error = error.error.message;
      }
    });
  }

  onSubmit() {
    this.data.submitted = true;

    if (this.appForm.invalid) {
      return;
    }
    
    this.ds.submit('doCategories', this.appForm.value)
    .subscribe({
      next: data => {
        this.data.success = true;
        this.data.submitted = false;

        this.appForm.disable();
      },
      error: error => {
        this.data.submitted = false;
        this.data.error = error.error.message;
      }
    });
  }

  reset() {
    this.data = {
      submitted:  false,
      success:    false,
      error:      '',
      viewMode:   false,
      data:       Object
    } 

    this.appForm.reset();
    this.appForm.enable();
    this.appForm.controls['ID'].setValue(0);
  }

  ngOnDestroy(): void {
    this.one.addState('categories', this.data, this.appForm);
  }
}
