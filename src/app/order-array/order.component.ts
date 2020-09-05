import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

import { AngularFireDatabase } from '@angular/fire/database';

import { LocalDataService } from '../services/local-data.service';
import { V8DataService } from '../services/v8-db.service';
import { V8MailService } from "../services/v8-mail.service";

interface ICustomer { 
  ID: number,
  name: string
}

interface ICartItems {
  transID   : string,
  subCatID  : number,
  groupID   : string,
	prodName	: string,
	color			: string,
	qty1			: number,
	qty2			: number,
	qty3			: number,
	qty4			: number,
	qty5			: number,
	qty6			: number,
	qty7			: number,
	qty8			: number,
	qty9			: number,
	qty10			: number,
	qty11			: number,
	qty12			: number,
  totQty    : number,
  mrp       : number
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  IMG_URL = `http://45.114.141.166:5500/products/Juliet/`;
  shareableLink: string;
  orderMailTemplate: string = "";

  showHideNav: boolean = true;

  order = {
    submitted: false,
    loading: false,
    error: null
  }

  orderItems = {
    submitted: false,
    loading: false,
    error: null
  }

  showOrderItems: boolean = false;

  customers: any = [];
  selectedCustomer: any = {};

  categories: any = [];
  selectedCategory: any = {};
  
  itemSequence: any = [];

  sizes: any = [];
  items: any = [];
  itemIdx: number = 0;
  selectedItem: any = {};

  cartCatNSizes: any = [];
  cartItems: any = [];
  viewCart: boolean = false;

  loading = {
    customers: false,
    categories: true,
    items: false
  }

  autoSuggest = {
    customer: ''
  }

  transDt = new Date();
  monthYear = `${('0'+(this.transDt.getMonth() + 1).toString()).slice(-2)}${this.transDt.getFullYear().toString().slice(-2)}`;

  contactForm = new FormGroup({
    acID: new FormControl(),
    name: new FormControl(),
    contactPerson: new FormControl(),
    mob1: new FormControl(),
    mob2: new FormControl(),
    email: new FormControl()
  });

  orderForm = new FormGroup({
    transID: new FormControl('SO' + this.monthYear + this.randomStr(4)),
    acID: new FormControl('', Validators.required),
  	referance: new FormControl('-'),
  	spID: new FormControl(this.ls.currentUser.ID, Validators.required),
	  remarks: new FormControl('-'),
	  orderBookedBy: new FormControl(this.ls.currentUser.name)
  });

  orderItemForm = new FormGroup({
    transID: new FormControl(this.orderForm.controls.transID.value),
    prodName: new FormControl(''),
  	colors: new FormArray([])
  });
  orderItemTotQty: number = 0;

  constructor(
    private route: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient, 
    private mail: V8MailService,
    private db: AngularFireDatabase,
    public ls: LocalDataService,
    private ds: V8DataService
  ) { }

  ngOnInit(): void {
    if (this.ls.currentDiv.db == null) {
      this.route.navigate(['home']);
    }
  }

  toggleNav() {
    this.showHideNav = !this.showHideNav;
  }

  // auto complete
  keyword = 'name';
  selectEvent(item) {
    // do something with selected item
    this.selectedCustomer = item;
    this.orderForm.controls.acID.setValue(item.acID);

    // update contact info
    this.contactForm.patchValue({
      acID: item.acID,
      name: item.name,
      contactPerson: item.contactPerson,
      mob1: item.mob1,
      mob2: item.mob2,
      email: item.email
    });
  }
 
  onCleared(e) {
    this.orderForm.controls.acID.setValue('');
    this.contactForm.reset();
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    if (val.length >= 3 && this.loading.customers == false) {
      this.loading.customers = true;

      this.ds.getData(
        'jwm_getCustomers', 
        {DbCr: 'DR', agentID: this.ls.currentUser.ID, search: val}, 
        this.ls.currentDiv.db
      )
      .subscribe({
        next: data => {
          this.customers = data,
          this.loading.customers = false;
        },
        error: val => alert(`Error while getting Parties.`)
      });
    }
  }
  
  onFocused(e){
    // do something when input is focused
  }

  selectCustomer = (e) => {
    const name = e.target.value;
    const idx = this.customers.findIndex(x => x.name === name);
    this.orderForm.controls.acID.setValue(idx === -1 ? 0 : this.customers[idx].acID);
  }

  getCategories() {
    this.categories = [{"ID":29,"name":"BASIC OFFERD BRA","parentID":1},{"ID":27,"name":"PLAIN & PRINTED PADDED BRA","parentID":1},{"ID":3,"name":"PLAIN MOLD BRA","parentID":1}]
    this.loading.categories = false;
    // this.ds.getData('jwm_getCategories', {parentID: 0}, this.ls.currentDiv.db)
    // .subscribe({
    //   next: data => {
    //     console.log(data);
    //     this.categories = data;
    //     this.loading.categories = false;
    //   },
    //   error: err => {
    //     alert(JSON.stringify(err));
    //   }
    // });
  }

  selectCategory = (e) => {
    const name = e.target.value;
    const idx = this.categories.findIndex(x => x.name == name);
    this.selectedCategory = this.categories[idx];
  }

  getProductSequence() {
    this.showHideNav = false;

    // get sizes
    this.ds.getData('jwm_getCategorySizes', {subCatID: this.selectedCategory.ID}, this.ls.currentDiv.db)
    .subscribe({
      next: data => {
        this.sizes = data[0];
      },
      error: err => {
        alert(JSON.stringify(err));
      }
    });

    this.ds.getData('jwm_getSequence', {catID: this.selectedCategory.ID, rate: 0}, this.ls.currentDiv.db)
    .subscribe({
      next: data => {
        this.itemSequence = data;
        this.itemIdx = 1;
        this.selectedItem = this.itemSequence[0];
        
        this.getProduct();
      },
      error: err => {
        alert(JSON.stringify(err));
      }
    });
  }

  getProduct() {
    this.loading.items = true;

    this.ds.getData('jwm_getItemSequence', {prodName: this.selectedItem.prodName}, this.ls.currentDiv.db)
    .subscribe({
      next: data => {
        this.items = data;
        this.bindItems(data);
        this.loading.items = false;
      },
      error: err => {
        alert(JSON.stringify(err));
      }
    });
  }

  updateContactInfo() {
    this.ds.submit('jwm_doLedgerContacts', this.contactForm.value, 'Finance')
    .subscribe({
      next: data => {
        alert('Contact Information updated successfully!');
      },
      error: err => {
        alert(JSON.stringify(err));
      }
    });
  }

  submitOrder() {
    this.order.submitted = true;

    if (this.orderForm.invalid) {
      return;
    }

    if (this.ls.isEqual(this.selectedCustomer, this.contactForm.value) == false 
      && this.ls.validateEmail(this.contactForm.controls.email.value) == true) {
      this.updateContactInfo();
    }

    this.ds.submit('jwm_InsertOrder', this.orderForm.value, this.ls.currentDiv.db)
    .subscribe({
      next: data => {
        this.orderForm.controls.transID.setValue(data[0].transID);
        this.orderForm.disable();
        this.showOrderItems = true;

        this.shareableLink = 'http://jwm.julietapparels.com/#/view-order?ref=' + this.ls.encode(this.ls.currentDiv.db) + '&refId=' + this.ls.encode(data[0].transID);
        // this.shareableLink = 'http://113.193.233.46:5700/#/view-order?ref=' + this.ls.encode(this.ls.currentDB) + '&refId=' + this.ls.encode(data[0].transID);
        this.getCategories();
      },
      error: err => {
        this.order.submitted = false;
        this.order.error = JSON.stringify(err);
        this.orderForm.enable();
      }
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }
  
  // bind items to orderItems form
  bindItems(items) {
    this.orderItems.submitted = false;
    this.orderItemForm.reset();
    this.orderItemTotQty = 0;

    this.orderItemForm.controls.transID.setValue(this.orderForm.controls.transID.value);
    this.orderItemForm.controls.prodName.setValue(this.selectedItem.prodName);
    (<FormArray>this.orderItemForm.get('colors')).clear();

    items.map(i => 
      (<FormArray>this.orderItemForm.get('colors')).push(
        new FormGroup({
          color: new FormControl(i.color),
          qty1: new FormControl(0), qty2: new FormControl(0), qty3: new FormControl(0),
          qty4: new FormControl(0), qty5: new FormControl(0), qty6: new FormControl(0),
          qty7: new FormControl(0), qty8: new FormControl(0), qty9: new FormControl(0),
          qty10: new FormControl(0), qty11: new FormControl(0), qty12: new FormControl(0)
        })
      )
    );

    // update firebase
    // const currentItem = {
    //                   category: this.selectedItem.category,
    //                   groupID: this.selectedItem.groupID,
    //                   prodName: this.selectedItem.prodName,
    //                   color: this.selectedItem.color,
    //                   mrp: this.selectedItem.mrp
    //                 }
    // this.updateFirebaseDB('currentItem', currentItem);
  }

  next = () => {
    this.itemIdx++;
    const idx = this.itemSequence.findIndex(x => x.rowID == this.itemIdx);
    this.selectedItem = this.itemSequence[idx];

    this.getProduct();
    return;
  }

  back = () => {
    this.itemIdx--;
    const idx = this.itemSequence.findIndex(x => x.rowID == this.itemIdx);
    this.selectedItem = this.itemSequence[idx];

    this.getProduct();
    return;
  }

  getItemTotQty() {
    this.orderItemTotQty = 0;

    Object.keys(this.orderItemForm.controls).forEach(key => {
      if (key.includes('qty') && parseInt(this.orderItemForm.controls[key].value) > 0) {
        this.orderItemTotQty += parseInt(this.orderItemForm.controls[key].value);
      }
    });
  }

  addItem() {
    this.orderItems.submitted = true;

    // code for insert ItemTrans
    this.ds.submit('jwm_InsertOrderItemsPivot', this.orderItemForm.value, this.ls.currentDiv.db)
    .subscribe({
      next: data => { 
        let o: any = this.orderItemForm.value;
        o.subCatID = this.selectedItem.subCatID;
        o.groupID = this.selectedItem.groupID;
        o.totQty = this.orderItemTotQty;
        o.mrp = this.selectedItem.mrp;
        
        this.addCartSize();
        this.cartItems.push(o);
        if (this.items.length != this.selectedItem.rowID) {
          this.next();
        } else {
          // this.bindItems();
        }

        this.orderItems.submitted = false;
      },
      error: err => {
        // alert(JSON.stringify(err));
        alert('Ooops! Error in order, kindly try again.');
        // this.bindItems();
        this.orderItems.submitted = false;
      }
    });
  }

  addCartSize() {
    if (this.cartCatNSizes.indexOf(this.sizes) == -1) {
      this.cartCatNSizes.push(this.sizes);
    }
  }

  deleteItem(item) {
    if (confirm('Are you sure want to delete item?')) {
    this.ds.submit(
      'jwm_DeleteOrderItemPivot', 
      {transID: item.transID, prodName: item.prodName, color: item.color}, 
      this.ls.currentDiv.db
    )
    .subscribe({
      next: data => { 
        let idx = this.cartItems.indexOf(item);
        this.cartItems.splice(idx, 1);
      },
      error: err => {
        alert(JSON.stringify(err));
      }
    });
    }
  }

  finishOrder() {
    this.orderItems.submitted = true;

    if (confirm('Confirm submit the Order?')) {
      this.ds.submit('jwm_insertOrderItemTrans', 
        {"type": "SORD", "transID": this.orderForm.controls.transID.value, "stLoc": 0}, 
        this.ls.currentDiv.db
      )
      .subscribe({
        next: data => { 
          this.orderItems.submitted = false;
          
          // send mail and redirect to home
          this.sendOrderMail();
        },
        error: err => {
          // alert(JSON.stringify(err));
          alert('Ooops! Error in finsishing order, kindly try again.');
          // this.bindItems();
          this.orderItems.submitted = false;
        }
      });
    } else {
      this.orderItems.submitted = false;
    }
  }

  // send email to client
  sendOrderMail() {
    this.http
    .get('assets/email-templates/order.html', {
      responseType: 'text' as 'text',
    })
    .subscribe((data) => {
      let o = data.toString();

      // order date
      const d = new Date();
      const yyyy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      const MM = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);

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
                .replace('[groupID]', this.ls.currentDiv.db + '/' + item.groupID)
                .replace('[prodName]', item.prodName)
                .replace('[color]', item.color)
                .replace('[sizeQty]', szQty)
                .replace('[totQty]', item.totQty);
        });

      this.orderMailTemplate = o.replace('[name]', this.selectedCustomer.name)
                                .replace('[transIDnDt]', this.orderForm.controls.transID.value + ' - ' + `${dd}-${MM}-${yyyy}`)
                                .replace('[sumQty]', sumQty)
                                .replace("[orderItems]", i);
    });

    (async () => { 
      await this.delay(1000);
    
      this.mail
        .send(
          this.ls.currentDiv.email,
          this.ls.currentDiv.email,
          "New Order from Juliet Apparels - " + this.orderForm.controls.transID.value + ' - ' + `${dd}-${MM}-${yyyy}`,
          this.orderMailTemplate
        )
        .subscribe({
          next: (response) => {
            alert('Order submitted successfully.');
            this.route.navigate(['home']);
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

  updateFirebaseDB(key: string, data: any) {
    let updates = {};
    updates[`/` + this.ls.currentDiv.db  + `/` + this.orderForm.controls.transID.value + `/${key}/`] = data;

    this.db.database.ref().update(updates);
  }

  copyLink() {
   this.copyToClipboard(this.shareableLink);
   alert("Link copioed");
  }

  sanitize(url:string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  randomStr(length) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = length;
    var randomString = '';
    for (var i=0; i<string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      randomString += chars.substring(rnum,rnum+1);
    }

    return randomString;
  }
}