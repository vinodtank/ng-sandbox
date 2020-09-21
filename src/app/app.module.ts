import { BrowserModule, HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import "hammerjs"; // HAMMER TIME

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { FilterPipe } from './pipes/filter.pipe';

<<<<<<< HEAD
import { HomeComponent } from './components/home/home.component';
=======
import { HomeComponent } from './home/home.component';
import { CompanyComponent } from './company/company.component';
import { OrderComponent } from './order/order.component';
>>>>>>> 98b54e39ddcc6f2935fbebe764bc1b0186fff07c
import { ViewCartComponent } from './view-cart/view-cart.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { SumPipe } from './pipes/sum.pipe';
<<<<<<< HEAD
import { CategoriesComponent } from './modules/general/main/categories/categories.component';
import { DataViewComponent } from './components/data-view/data-view.component';
import { ContentsComponent } from './components/contents/contents.component';
=======
>>>>>>> 98b54e39ddcc6f2935fbebe764bc1b0186fff07c

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    HomeComponent,
<<<<<<< HEAD
    LoadingComponent,
    ViewCartComponent,
    SafeHtmlPipe,
    SumPipe,
    CategoriesComponent,
    DataViewComponent,
    ContentsComponent
=======
    CompanyComponent,
    OrderComponent,
    LoadingComponent,
    ViewCartComponent,
    SafeHtmlPipe,
    SumPipe
>>>>>>> 98b54e39ddcc6f2935fbebe764bc1b0186fff07c
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HammerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AutocompleteLibModule
  ],
  providers: [{ 
                    provide: HAMMER_GESTURE_CONFIG, 
                    useClass: HammerGestureConfig 
                } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
