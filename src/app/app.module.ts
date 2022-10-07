import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatSortModule} from '@angular/material/sort';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './Page/login-page/login-page.component';
import { LoginComponentComponent } from './Component/login-component/login-component.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DashboardPageComponent } from './Page/dashboard-page/dashboard-page.component';
import { SidenavComponentComponent } from './Component/sidenav-component/sidenav-component.component';
import { HomeComponentComponent } from './Component/home-component/home-component.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { PageNotFoundComponent } from './Page/page-not-found/page-not-found.component';
import { InventoryComponentComponent } from './Component/inventory-component/inventory-component.component';
import { ReceiptComponentComponent } from './Component/receipt-component/receipt-component.component';
import { SettingsComponentComponent } from './Component/settings-component/settings-component.component';
import { ReportComponentComponent } from './Component/report-component/report-component.component';
import { HistoryComponentComponent } from './Component/history-component/history-component.component';
import { AddItemFormComponentComponent } from './Component/add-item-form-component/add-item-form-component.component';
import { EditItemDialogComponent } from './Component/edit-item-dialog/edit-item-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    LoginComponentComponent,
    DashboardPageComponent,
    SidenavComponentComponent,
    HomeComponentComponent,
    PageNotFoundComponent,
    InventoryComponentComponent,
    ReceiptComponentComponent,
    SettingsComponentComponent,
    ReportComponentComponent,
    HistoryComponentComponent,
    AddItemFormComponentComponent,
    EditItemDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
    AngularFirestoreModule,
    MatListModule,
    MatTableModule,
    MatMenuModule,
    MatSelectModule,
    MatChipsModule,
    MatSortModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSlideToggleModule
  ],
  providers: [
    ScreenTrackingService,UserTrackingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
