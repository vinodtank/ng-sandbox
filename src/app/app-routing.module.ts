import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
