import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient } from "@angular/common/http";

import { V8MailService } from "../../app/services/v8-mail.service";

@Component({
  selector: "app-view-cart",
  templateUrl: "./view-cart.component.html",
  styleUrls: ["./view-cart.component.scss"],
})
export class ViewCartComponent implements OnInit {
  IMG_URL = `http://45.114.141.166:5500/products/Soulmate/`;

  orderMailTemplate: string = "";

  order: any = {
    transID: "SO06200011",
    acID: 28508,
    referance: "-",
    spID: 41,
    remarks: "-",
    orderBookedBy: "GautamS",
  };

  selectedCustomer: any = {acID: 28508, name: "SHIVA SHAKTI GARMENTS - Bangalore -", email: "vinodtank.sl@gmail.com"}

  cartCatNSizes: any = [{"category":"Leggings","subCatID":8,"s1":"S","s2":"M","s3":"L","s4":"XL","s5":"2XL","s6":"3XL","s7":"F/S","s8":"4XL","s9":"5XL","s10":"Plus Size","s11":null,"s12":null},{"category":"Kurti","subCatID":27,"s1":"S","s2":"M","s3":"L","s4":"XL","s5":"2XL","s6":"3XL","s7":"4XL","s8":"5XL","s9":"F/S","s10":"6XL","s11":"7XL","s12":"8XL"}];

  cartItems: any = [
    {
      transID: "SO06200071",
      prodName: "JSL-2718",
      color: "Black 01",
      qty1: "4",
      qty2: null,
      qty3: null,
      qty4: null,
      qty5: null,
      qty6: null,
      qty7: null,
      qty8: null,
      qty9: null,
      qty10: null,
      qty11: null,
      qty12: null,
      subCatID: 8,
      groupID: "0000800152",
      totQty: 4,
      mrp: 349,
    },
    {
      transID: "SO06200071",
      prodName: "JSL-2807",
      color: "Black 01",
      qty1: null,
      qty2: null,
      qty3: null,
      qty4: "10",
      qty5: null,
      qty6: null,
      qty7: "15",
      qty8: null,
      qty9: null,
      qty10: null,
      qty11: null,
      qty12: null,
      subCatID: 27,
      groupID: "0000800172",
      totQty: 25,
      mrp: 399,
    },
  ];

  orderItems = {
    submitted: false,
    loading: false,
    success: false,
    error: null,
  };

  constructor(private http: HttpClient, private mail: V8MailService) {}

  ngOnInit(): void {}

  deleteItem(item) {}

  submitOrder() {
    this.orderItems.submitted = true;

    setTimeout(() => {
      this.orderItems.success = true;
    }, 10000);
  }

  sendOrderMail() {
    this.http
    .get('assets/email-templates/order.html', {
      responseType: 'text' as 'text',
    })
    .subscribe((data) => {
      let o = data.toString();

      // order date
      const d = new Date('2010-08-05')
      const yyyy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
      const MM = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
      const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

      // sum of qty
      let sumQty = this.cartItems.reduce(function(a, b) {return a.totQty + b.totQty;});

      // order items with template
      this.http
      .get('assets/email-templates/order-items.html', {
        responseType: 'text' as 'text',
      })
      .subscribe((items) => {
        let it = items.toString();
        let i: string = '';

        this.cartItems.forEach(item => {
          let c = this.cartCatNSizes.find(x => x.subCatID === item.subCatID).category;
          let szQty = this.getItemSizeNQty(item);

          i += it.replace('[category]', c)
                .replace('[groupID]', 'soulmate/' + item.groupID)
                .replace('[prodName]', item.prodName)
                .replace('[color]', item.color)
                .replace('[sizeQty]', szQty)
                .replace('[totQty]', item.totQty);
        });

      this.orderMailTemplate = o.replace('[name]', this.selectedCustomer.name)
                                .replace('[transIDnDt]', this.order.transID + ' - ' + `${dd}-${MM}-${yyyy}`)
                                .replace('[sumQty]', sumQty)
                                .replace("[orderItems]", i);
    });

    (async () => { 
      await this.delay(1000);
    
      this.mail
        .send(
          "vinod@julietinfotech.com",
          "siddharth@julietindia.com",
          "Test Subject",
          this.orderMailTemplate
        )
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (err) => {
            console.log(err);
          },
        });
    })();

    });
  }

  // for email order item template
  getItemSizeNQty(item) {
    let sizeQty = '';

    Object.keys(item).forEach(key => {
      if (key.includes('qty') && parseInt(item[key]) > 0) {
        let k = key.replace('qty', 's');
        sizeQty += this.cartCatNSizes.find(x => x.subCatID === item.subCatID)[k] + ' - ' + item[key] + ', ';
      }
    });

    return sizeQty;
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
