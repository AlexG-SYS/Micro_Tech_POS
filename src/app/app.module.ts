import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { NgxPrintModule } from 'ngx-print';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginPageComponent } from './Page/login-page/login-page.component';
import { LoginComponentComponent } from './Component/login-component/login-component.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DashboardPageComponent } from './Page/dashboard-page/dashboard-page.component';
import { SidenavComponentComponent } from './Component/sidenav-component/sidenav-component.component';
import { HomeComponentComponent } from './Component/home-component/home-component.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { PageNotFoundComponent } from './Page/page-not-found/page-not-found.component';
import { InventoryComponentComponent } from './Component/inventory-component/inventory-component.component';
import { ReceiptComponentComponent } from './Component/receipt-component/receipt-component.component';
import { ReportComponentComponent } from './Component/report-component/report-component.component';
import { HistoryComponentComponent } from './Component/history-component/history-component.component';
import { AddItemFormComponentComponent } from './Component/add-item-form-component/add-item-form-component.component';
import { EditItemDialogComponent } from './Component/edit-item-dialog/edit-item-dialog.component';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { PrintReceiptDialogComponent } from './Component/print-receipt-dialog/print-receipt-dialog.component';
import { InvoiceComponentComponent } from './Component/invoice-component/invoice-component.component';
import { AccountComponentComponent } from './Component/account-component/account-component.component';
import { UserSettingDialogComponent } from './Component/user-setting-dialog/user-setting-dialog.component';
import { CopyRightDialogComponent } from './Component/copyRight-dialog/copyRight-dialog.component';
import { CompanyUserSettingDialogComponent } from './Component/company-user-setting-dialog/company-user-setting-dialog.component';
import { AddAccountFormComponentComponent } from './Component/add-account-form-component/add-account-form-component.component';
import { EditAccountDialogComponent } from './Component/edit-account-dialog/edit-account-dialog.component';
import { ReceivePaymentDialogComponent } from './Component/receive-payment-dialog/receive-payment-dialog.component';
import { PrintPaymentDialogComponent } from './Component/print-payment-dialog/print-payment-dialog.component';
import { CompanySettingDialogComponent } from './Component/company-setting-dialog/company-setting-dialog.component';

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
    ReportComponentComponent,
    HistoryComponentComponent,
    AddItemFormComponentComponent,
    EditItemDialogComponent,
    PrintReceiptDialogComponent,
    InvoiceComponentComponent,
    AccountComponentComponent,
    UserSettingDialogComponent,
    CopyRightDialogComponent,
    CompanyUserSettingDialogComponent,
    AddAccountFormComponentComponent,
    EditAccountDialogComponent,
    ReceivePaymentDialogComponent,
    PrintPaymentDialogComponent,
    CompanySettingDialogComponent,
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
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    NgxPrintModule,
    MatToolbarModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [ScreenTrackingService, UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
