import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
