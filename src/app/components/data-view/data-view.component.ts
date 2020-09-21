import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { V8DataService } from '../../services/v8-db.service';

@Component({
  selector: 'data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss']
})
export class DataViewComponent implements OnInit {
  @Input() tbl: string;
  @Input() searchStr: string;

  @Output() editEvent = new EventEmitter<number>();

  data: any;
  colHeader: any;

  loading: boolean;
  error: string;

  constructor(private ds: V8DataService) { }

  ngOnInit(): void {
    this.loading = true;    

    this.ds.getData('getSearchData', {tableName: this.tbl, searchStr: this.searchStr})
    .subscribe({
      next: data => {
        this.colHeader = Object.keys(data[0]);
        this.data = data;
        this.loading = false;    
      },
      error: error => {
        this.loading = false;
        this.error = error.error.message;
      }
    });
  }

  edit(id: number) {
    this.editEvent.emit(id);
  }
}
