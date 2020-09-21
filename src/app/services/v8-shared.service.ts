import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

interface IUser {
  ID:           number,
  userName:     string,
  displayName:  string,
  profile:      string,
  token:        string,
  response:     string
}

@Injectable({
  providedIn: 'root'
})
export class V8SharedService {
  bg: string = null;

  fcmToken: string = null;
  currentUser: any = null;
  currentDB: any = null;
  currentDiv: any = null;

  data: any = [];
  dataChange: Observable<any>;
  dataChangeObserver: any;

  constructor() {
    this.dataChange = new Observable((observer: Observer<any>) => {
      this.dataChangeObserver = observer;
    });
  }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    });
  }

  keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  encode(inputEncode: string) {
    let output = "";
    let chr1 : any;
    let chr2 : any; 
    let chr3 : any;
    let enc1 : any;
    let enc2 : any; 
    let enc3 : any;
    let enc4 : any;
    let i = 0;
    
    do {
      chr1 = inputEncode.charCodeAt(i++);
      chr2 = inputEncode.charCodeAt(i++);
      chr3 = inputEncode.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
          enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
          enc4 = 64;
      }

      output = output +
          this.keyStr.charAt(enc1) +
          this.keyStr.charAt(enc2) +
          this.keyStr.charAt(enc3) +
          this.keyStr.charAt(enc4);
      chr1 = chr2 = chr3 = "";
      enc1 = enc2 = enc3 = enc4 = "";
    } while (i < inputEncode.length);

    return output;
  }

  decode(inputDecode: string) {
    let output = "";
    let chr1 : any;
    let chr2 : any;
    let chr3 : any;
    let enc1 : any;
    let enc2 : any; 
    let enc3 : any; 
    let enc4 : any;
    let i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    let base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(inputDecode)) {
        window.alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    inputDecode = inputDecode.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = this.keyStr.indexOf(inputDecode.charAt(i++));
        enc2 = this.keyStr.indexOf(inputDecode.charAt(i++));
        enc3 = this.keyStr.indexOf(inputDecode.charAt(i++));
        enc4 = this.keyStr.indexOf(inputDecode.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    } while (i < inputDecode.length);

    return output;
  }
}