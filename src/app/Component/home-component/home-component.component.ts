import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Chart, registerables } from 'chart.js/auto';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { GlobalComponent } from 'src/app/global-component';
import { ReceiptService } from 'src/app/Services/receipt.service';
import { UserService } from 'src/app/Services/user.service';
import { UserSettingDialogComponent } from '../user-setting-dialog/user-setting-dialog.component';
import { CopyRightDialogComponent } from '../copyRight-dialog/copyRight-dialog.component';
import { CompanyUserSettingDialogComponent } from '../company-user-setting-dialog/company-user-setting-dialog.component';
import { CompanySettingDialogComponent } from '../company-setting-dialog/company-setting-dialog.component';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css'],
})
export class HomeComponentComponent implements OnInit {
  // Variables for displaying company name and current date
  companyName: string = '';
  currentDate = new Date();
  isLoading = false;

  // Global privileges and current time
  privilege = GlobalComponent.privilege;
  time = this.currentDate.getHours();

  // Chart instance for daily customer statistics
  chart!: Chart; // Using the Chart class from Chart.js

  // Greeting message based on time of day
  greetingMessage: string = '';

  // -----------------------------------------------------------------------------------------------------------
  constructor(
    private db: AngularFirestore,
    private receiptService: ReceiptService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    Chart.register(...registerables); // Register the chart types and plugins
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  ngOnInit(): void {
    // Get company information
    this.getCompanyInfo();

    // Set greeting message based on time of day
    this.setGreetingMessage();

    this.isLoading = true;
    setTimeout(() => {
      // Create and configure the chart
      this.createChart();

      // Fetch and display graph data
      this.fetchGraphData();
    }, 1000);
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Fetch company information from service
  getCompanyInfo() {
    this.userService.getCompanyInfo().subscribe((data) => {
      const companyInfo: any = data.data();
      this.companyName = companyInfo.name;
      this.updateGlobalCompanyInfo(companyInfo);
    });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Update global company info
  updateGlobalCompanyInfo(companyInfo: any) {
    GlobalComponent.companyName = companyInfo.name;
    GlobalComponent.companyStreet = companyInfo.street;
    GlobalComponent.companyCityTownVillage = companyInfo.city_town_village;
    GlobalComponent.companyCountry = companyInfo.country;
    GlobalComponent.companyTIN = companyInfo.TIN;
    GlobalComponent.companyPhoneNumber = companyInfo.phoneNumber;
    GlobalComponent.companyEmail = companyInfo.email;
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Set greeting message based on time of day
  setGreetingMessage() {
    if (this.time < 12) {
      this.greetingMessage = 'Good Morning, ' + GlobalComponent.userName;
    } else if (this.time >= 12 && this.time < 15) {
      this.greetingMessage = 'Good Afternoon, ' + GlobalComponent.userName;
    } else if (this.time >= 15 && this.time < 18) {
      this.greetingMessage = 'Good Evening, ' + GlobalComponent.userName;
    } else if (this.time >= 18) {
      this.greetingMessage = 'Good Night, ' + GlobalComponent.userName;
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Create and configure the chart
  createChart() {
    this.chart = new Chart('dailyCustomerStats', {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Daily Customers',
            data: [],
            fill: true,
            tension: 0.2,
            borderColor: '#673ab7',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Fetch graph data from the database
  fetchGraphData() {
    const month = this.currentDate.getMonth() + 1;
    const year = this.currentDate.getFullYear();
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the total number of days in the current month

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = month + '/' + day + '/' + year;

      this.receiptService
        .getReceiptList(dateString)
        .subscribe((receiptData) => {
          const monthString = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];

          const xData = monthString[month - 1] + '-' + day;
          const yData = receiptData.length;
          this.addDataToChart(xData, yData);
        });
    }
    this.isLoading = false;
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Add data to the chart and update it
  addDataToChart(label: any, data: any) {
    this.chart.data.labels?.push(label);
    this.chart.data.datasets.forEach((dataset: any) => {
      dataset.data.push(data);
    });
    this.chart.update();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Open copyright dialog
  openCopyrightDialog() {
    const dialogConfig = this.getBaseDialogConfig();
    this.dialog.open(CopyRightDialogComponent, dialogConfig);
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Open user settings dialog
  openUserSettingsDialog() {
    const dialogConfig = this.getBaseDialogConfig();
    this.dialog
      .open(UserSettingDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        this.handleDialogClose(
          val,
          'User Settings Edited',
          'User Settings Was Not Updated!'
        );
      });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Open company user settings dialog
  openCompanyUserSettingsDialog() {
    const dialogConfig = this.getBaseDialogConfig();
    this.dialog
      .open(CompanyUserSettingDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        this.handleDialogClose(
          val,
          'User Settings Edited',
          'User Setting Was Not Updated!'
        );
      });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Open company settings dialog
  openCompanySettingsDialog() {
    const dialogConfig = this.getBaseDialogConfig();
    this.dialog
      .open(CompanySettingDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((val) => {
        this.handleDialogClose(
          val,
          'Company Settings Edited',
          'Company Information Was Not Updated!'
        );
      });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Handle dialog close and show snackbar message
  handleDialogClose(val: any, successMessage: string, errorMessage: string) {
    if (val) {
      if (val.username) {
        this.openSnackBar(
          val.username.toUpperCase() + ' - Settings Updated!',
          'success-snakBar'
        );
      } else {
        this.openSnackBar(val.name + ' - Settings Updated!', 'success-snakBar');
      }
    } else {
      this.openSnackBar(errorMessage, 'error-snakBar');
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Open snackbar
  openSnackBar(message: string, cssStyle: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [cssStyle],
    });
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Create a base dialog configuration
  getBaseDialogConfig() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = '300px';
    dialogConfig.maxWidth = '700px';
    dialogConfig.data = [];
    return dialogConfig;
  }
  // -----------------------------------------------------------------------------------------------------------
}
