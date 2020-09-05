import { Component, OnInit } from '@angular/core';

import { V8DataService } from '../services/v8-db.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any;

  constructor(private ds: V8DataService) { }

  ngOnInit(): void {
    this.ds.getData('getTestData', {opt: 0}, 'Server2.testDB')
    .subscribe({
      next:data => {
        console.log(data),
        this.data = data;
      },
      error: error => console.log(error)
    })
  }

}
