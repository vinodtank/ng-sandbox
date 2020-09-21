import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

<<<<<<< HEAD
import { HomeComponent } from '../app/components/home/home.component';
import { LoadingComponent  } from '../app/components/loading/loading.component';
import { ViewCartComponent } from '../app/view-cart/view-cart.component';

import { CategoriesComponent } from './modules/general/main/categories/categories.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, children: [
    // general
    { path: 'categories', component: CategoriesComponent, outlet: 'c' }
  ]},
  { path: 'loading', component: LoadingComponent },
  { path: 'view-cart', component: ViewCartComponent },
  { path: 'categories', component: CategoriesComponent }
=======
import { HomeComponent } from '../app/home/home.component';
import { CompanyComponent  } from '../app/company/company.component';
import { OrderComponent  } from '../app/order/order.component';
import { LoadingComponent  } from '../app/components/loading/loading.component';
import { ViewCartComponent } from '../app/view-cart/view-cart.component';

const routes: Routes = [
  { path: '', redirectTo: 'order', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'company', component: CompanyComponent },
  { path: 'order', component: OrderComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'view-cart', component: ViewCartComponent }
>>>>>>> 98b54e39ddcc6f2935fbebe764bc1b0186fff07c
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
