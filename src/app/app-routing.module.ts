import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponentComponent } from './Component/account-component/account-component.component';
import { HistoryComponentComponent } from './Component/history-component/history-component.component';
import { HomeComponentComponent } from './Component/home-component/home-component.component';
import { InventoryComponentComponent } from './Component/inventory-component/inventory-component.component';
import { InvoiceComponentComponent } from './Component/invoice-component/invoice-component.component';
import { ReceiptComponentComponent } from './Component/receipt-component/receipt-component.component';
import { ReportComponentComponent } from './Component/report-component/report-component.component';
import { DashboardPageComponent } from './Page/dashboard-page/dashboard-page.component';
import { LoginPageComponent } from './Page/login-page/login-page.component';
import { PageNotFoundComponent } from './Page/page-not-found/page-not-found.component';

const routes: Routes = [
  // Routes the application to diffrent components depending on what the user is doing
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', title: 'Login - POS', component: LoginPageComponent },
  {
    path: 'dashboard', title: 'Dashboard - POS', component: DashboardPageComponent,
    children: [
      // Children Routes for Dashboard page
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', title: 'Dashboard - Home', component: HomeComponentComponent },
      { path: 'account', title: 'Dashboard - Account', component: AccountComponentComponent },
      { path: 'inventory', title: 'Dashboard - Inventory', component: InventoryComponentComponent },
      { path: 'receipt', title: 'Dashboard - Receipt', component: ReceiptComponentComponent },
      { path: 'invoice', title: 'Dashboard - Invoice', component: InvoiceComponentComponent },
      { path: 'history', title: 'Dashboard - History', component: HistoryComponentComponent },
      { path: 'report', title: 'Dashboard - Report', component: ReportComponentComponent },
      { path: '**', title: 'Error - POS', component: PageNotFoundComponent }
    ]
  },
  { path: '**', title: 'Error - POS', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const ArrayOfComponents = [LoginPageComponent,
  DashboardPageComponent, HomeComponentComponent,
  InventoryComponentComponent, PageNotFoundComponent]
