import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalComponent } from 'src/app/global-component';
import { ReceiptService } from 'src/app/Services/receipt.service';
import { Chart, registerables } from 'chart.js/auto';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserSettingDialogComponent } from '../user-setting-dialog/user-setting-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CopyRightDialogComponent } from '../copyRight-dialog/copyRight-dialog.component';
import { CompanyUserSettingDialogComponent } from '../company-user-setting-dialog/company-user-setting-dialog.component';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  companyName: string = "";
  currentDate = new Date();
  privilege = GlobalComponent.privilege;
  time = this.currentDate.getHours();
  chart!: any;
  greetingMessage: string = "";

  constructor(private db: AngularFirestore, private receiptService: ReceiptService, private dialog: MatDialog, private snackBar: MatSnackBar) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.companyName = GlobalComponent.companyName;
    
    if (this.time < 12) {
      this.greetingMessage = "Good Morning, " + GlobalComponent.userName;
    }
    else if (this.time >= 12 && this.time < 15) {
      this.greetingMessage = "Good Afternoon, " + GlobalComponent.userName;
    }
    else if (this.time >= 15 && this.time < 18) {
      this.greetingMessage = "Good Evening, " + GlobalComponent.userName;
    }
    else if (this.time >= 18){
      this.greetingMessage = "Good Night, " + GlobalComponent.userName;
    }

    // Firstly Draws the Graph
    this.chart = new Chart("dailyCustomerStats", {
      type: 'line',
      data: {
        datasets: [
          {
            label: "Daily Customers",
            data: [],
            fill: true,
            tension: 0.2,
            borderColor: '#673ab7'
          }
        ]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }

    });

    // Gets the graph data from the database
    this.getData();
  }

  // -----------------------------------------------------------------------------------------------------------
  // Gets the total number of customers who bought something for the current month
  getData() {
    let month = this.currentDate.getMonth() + 1;
    let year = this.currentDate.getFullYear();

    for (let day = 1; day <= this.currentDate.getDate(); day++) {
      this.receiptService.getReceiptList(month + "/" + day + "/" + year).subscribe(receiptData => {

        let xData = day + "/" + month;
        let yData = receiptData.length;
        this.addData(this.chart, xData, yData);
      }
      )
    }
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Adds passed data to the graph and updates it
  addData(chart: { data: { labels: any[]; datasets: any[]; }; update: () => void; }, label: any, data: any) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset: { data: any[]; }) => {
      dataset.data.push(data);
    });
    chart.update();
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Copyright Dialog is shown with data
  copyright() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "300px";
    dialogConfig.maxWidth = "700px"
    dialogConfig.data = [];

    this.dialog.open(CopyRightDialogComponent, dialogConfig);
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // User settings dialog is shown
  userSettings() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "300px";
    dialogConfig.maxWidth = "700px"
    dialogConfig.data = [];

    this.dialog.open(UserSettingDialogComponent, dialogConfig)
      .afterClosed().subscribe(val => {
        if (val) {
          console.log("User Settings Edited");
          this.openSnackBar(val.username.toUpperCase()+' - Settings Updated!', 'success-snakBar');
        }
        else {
          this.openSnackBar('User Settings Was Not Updated!', 'error-snakBar');
        }
      })
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  // Edit Company user dialog is shown
  editCompanyUsers(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "300px";
    dialogConfig.maxWidth = "700px"
    dialogConfig.data = [];

    this.dialog.open(CompanyUserSettingDialogComponent, dialogConfig)
      .afterClosed().subscribe(val => {
        if (val) {
          console.log("User Settings Edited");
          this.openSnackBar(val.username.toUpperCase()+' - Settings Updated!', 'success-snakBar');
        }
        else {
          this.openSnackBar('User Setting Was Not Updated!', 'error-snakBar');
        }
      })
  }
  // -----------------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------------
  //Displays message to the user
  openSnackBar(message: string, cssStyle: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [cssStyle],
    });
  }
  // -----------------------------------------------------------------------------------------------------------

}
