import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class V8MailService {

  // private API_URL: string = 'http://localhost:5700/smtpRequestHandler';
  private API_URL: string = 'http://136.232.248.14:5700/smtpRequestHandler';

  constructor(private http: HttpClient) { }

  send(to: string, cc: string, subject: string, body: string): Observable<any> {
    return this.http.post(this.API_URL,
      {
        to: to,
        cc: cc,
        subject: subject,
        body: body
      })
      .pipe(
        tap(_ => console.info(`Mail sent to ${to} !`)),
        catchError(err => throwError('Mail send error: ' + JSON.stringify(err)))
      );
  }
}