import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

// import { V8OneService } from '../../../services/v8-one.service';
// import { V8SharedService } from '../../../services/v8-shared.service';
import { V8DataService } from '../services/v8-db.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  // c: any = {};
  c: any = {name: 'Company'}
  
  data: any = {
    submitted:  false,
    success:    false,
    error:      ''
  }

  companyForm = new FormGroup({
    ID: new FormControl('0'),
    name: new FormControl('', Validators.required),
    address: new FormControl(''),
    city: new FormControl({value: 'Dombivli', disabled: true}, Validators.required),
    state: new FormControl(''),
    country: new FormControl('')
  })

  constructor(
    // private one: V8OneService,
    private ds: V8DataService
  ) {
    // this.c = this.one.getComponent('company');
  }
  
  ngOnInit(): void {
    // let ps = this.one.getState('company');
    // if ( ps !== undefined ) {
    //   this.data = ps.data;
    //   this.companyForm = ps.formData;
    // }
  }

  onSubmit() {
    this.data.submitted = true;
    this.companyForm.controls.city.setValue('Bihar');
    console.log(this.companyForm.controls.city.value);

    if (this.companyForm.invalid) {
      return;
    }
    
    // this.ds.submit('doCompany', this.companyForm.value)
    // .subscribe({
    //   next: data => {
    //     console.log(data);
    //   },
    //   error: error => {
    //     this.data.submitted = false;
    //     this.data.error = error;
    //   }
    // });
  }

  ngOnDestroy(): void {
    // this.one.addState('company', this.data, this.companyForm);
  }
}
