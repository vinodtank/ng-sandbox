import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse  } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { tap, retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class V8DataService {
  private API_URL: string = isDevMode ? 'http://localhost/dataRequestHandler' : '/';

  constructor(private http: HttpClient) { }

  submit(request: string, data: any, dbName?: string) : Observable<any> {
    dbName = dbName === undefined ? '' : dbName + '.dbo.';
    console.log(dbName);
    
    return this.http.post(this.API_URL,
      {
        requestName: dbName + request,
        values: this.normalize(data)
      })
      .pipe(
        // tap(_ => console.info(request + ' data submitted!')),
        catchError(this.handleError)
      );
  }

  edit(tableName: string, id: number, dbName?: string, dbType?: string, dbToken?: string) {
    dbName = dbName === undefined ? '' : dbName + '.dbo.';
    return this.http.post(this.API_URL,
      {
        dbType: dbType,
        dbToekn: dbToken,
        requestName: dbName + 'getEditData',
        values: tableName + ',' + id
      })
      .pipe(
        // tap(_ => console.info(tableName + ' data fetched for edit!')),
        catchError(this.handleError)
      );
  }

  // use for Select list and Dropdown controls
  selectData(tableName: string, sortColumn: string, dbName?: string) {
    dbName = dbName === undefined ? '' : dbName + '.dbo.';
    return this.http.post(this.API_URL,
      {
        requestName: dbName + 'getSelectData',
        values: tableName + ',' + sortColumn
      })
      .pipe(
        // tap(_ => console.info(tableName + ' data fetched for select!')),
        catchError(this.handleError)
      );
  }

  // get custom data
  getData(requestName: string, data: any, dbName?: string, dbType?: string, dbToken?: string) {
    dbName = dbName === undefined ? '' : dbName + '.dbo.';
    return this.http.post(this.API_URL,
      {
        dbType: dbType,
        dbToken: dbToken,
        requestName: dbName + requestName,
        values: this.normalize(data)
      })
      .pipe(
        // tap(_ => console.info('get data fetched!', _)),
        catchError(this.handleError)
      );
  }

  jsonImport(requestName: string, data: any, jsonData: Object, dbName?: string) {
    dbName = dbName === undefined ? '' : dbName + '.dbo.';
    return this.http.post(this.API_URL,
      {
        requestName: dbName + requestName,
        values: data,
        jsonData: jsonData
      })
      .pipe(
        // tap(_ => console.info(requestName + ' json data imported!')),
        catchError(this.handleError)
      );
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage: any;
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = error;
    }
    return throwError(errorMessage);
  }

  private normalize(data) {
    var parser = '';
    for (var key in data) {
      if (key.indexOf('date') > -1 || key.indexOf('Dt') > - 1 || key.indexOf('dt') > - 1) {
        if (data[key] == undefined || data[key] == '') {
          parser += ',';
        } else {
          parser += data[key].slice(6, 10) + '/' + data[key].slice(3, 5) + '/' + data[key].slice(0, 2) + ',';
        }
      } else if (data[key] == null) {
        parser += ',';
      } else {
        parser += String(data[key]).replace(/,/g, ';') + ','; // replace commas
      }
    }
    return parser.replace(/,\s*$/, ""); // remove last comma
  }
}