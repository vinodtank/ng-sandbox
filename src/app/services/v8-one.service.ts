import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface IApp {
  ID:     number,
  name:   string,
  icon:   string,
  color:  string
}

interface IComponent {
  ID:         number,
  appID:      number,
  parentID:   number,
  name:       string,
  component:  string,
  icon:       string,
  tblName:    string,
  opt:        string,
  active:     boolean,
  prevID:     number
}

interface IPageState {
  appID:      number,
  name:       string,
  data:       any,
  formData:   any
}

@Injectable({
  providedIn: 'root'
})
export class V8OneService {
  app: IApp = {ID: 1, name: 'sandbox', icon: null, color: null};
  components: IComponent[] = [];
  pageState: IPageState[] = [];

  colors = ['#5fc7ea', '#68e6ac', '#e6d068', '#e68568', 'hotpink', 'mediumslateblue', '#6fad5e', '#9d518a'];

  apps: Object = [];
  dbs: Object = [];

  menuHeads: any[] = [
    {
      "id": 0,
      "name": "Admin",
      "icon": "fa-tree",
      "active": false
    },
    {
      "id": 1,
      "name": "Main",
      "icon": "fa-th",
      "active": false
    },
    {
      "id": 2,
      "name": "Transactions",
      "icon": "fa-tree",
      "active": false
    },
    {
      "id": 3,
      "name": "Reports",
      "icon": "fa-tree",
      "active": false
    }
  ];

  modules : any = [];

  constructor(private router: Router) { }

  selectApp(app: IApp) {
    this.app = app;
  }

  toggle(h) {
    h.active = !h.active;
  }

  // components //
  addComponent(c: IComponent) {
    if (this.components.indexOf(c) == -1) {
      this.components.push(c);
    }

    this.selectComponent(c);
  }
  
  delComponent(c: IComponent) {
    let pIdx = this.pageState.findIndex(p => p.appID === this.app.ID && p.name === name);
    this.pageState.splice(pIdx, 1);

    let idx = this.components.indexOf(c);
    this.components.splice(idx, 1);
    
    // this.pageState.find(p => p.appID == this.app.ID && p.name == c.component);
    
    this.deactiveComponents();

    // find max id of component and active
    idx = Math.max.apply(Math, this.components.filter(c => c.appID == this.app.ID).map(i => i.ID));
    if (isFinite(idx) === true) {
      let c = this.components.filter(c => c.ID == idx)[0];
      c.active = true;
      this.router.navigate(['/home', {outlets: {'c': [c.component]}}]);
    } else {
      // if no components found then redirect
      this.router.navigate(['/home']);
    }
  }

  selectComponent(c: IComponent) {
    this.deactiveComponents();

    c.active = true;
    this.router.navigate(['/home', {outlets: {'c': [c.component]}}]);
  }

  // set false to all active components of particular selected app
  deactiveComponents() {
    let appID = this.app.ID;

    // components
    this.components.filter(c => c.appID == appID).forEach(i => i.active = false);

    // modules
    this.modules.filter(m => m.appID == appID && m.active == true).forEach(i => i.active = false);
  }

  getComponent(cName: string) {
    return this.components.filter(c => c.appID == this.app.ID && c.component == cName && c.active == true)[0];
  }

  addState(name: string, data: any, formData: any) {
    if (this.components.filter(c => c.appID == this.app.ID && c.component == name).length) {
      if ( this.pageState.filter(p => p.appID == this.app.ID && p.name == name).length ) {
        let ps = this.pageState.filter(ps => ps.appID == this.app.ID && ps.name == name)[0];
        ps.data = data;
        ps.formData = formData;
      } else {
        let ps = {appID: this.app.ID, name: name, data: data, formData: formData};
        this.pageState.push(ps);
      }
    }
  }

  getState(name: string) {
    if (this.pageState.filter(p => p.appID == this.app.ID && p.name == name).length) {
      return this.pageState.filter(p => p.appID == this.app.ID && p.name == name)[0];
    } else {
      return undefined;
    }
  }
}
