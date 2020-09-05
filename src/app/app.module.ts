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

import { HomeComponent } from './home/home.component';
import { CompanyComponent } from './company/company.component';
import { OrderComponent } from './order/order.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { LoadingComponent } from './components/loading/loading.component';
import { SumPipe } from './pipes/sum.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FilterPipe,
    HomeComponent,
    CompanyComponent,
    OrderComponent,
    LoadingComponent,
    ViewCartComponent,
    SafeHtmlPipe,
    SumPipe
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
