import { Component, Output, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';
import { GlobalComponent } from '../../global-component';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
})
export class LoginComponentComponent {
  // Output property for error message
  @Output() error = '';

  // ViewChild for first input field and click tracking
  @ViewChild('firstInput') myInputField!: ElementRef;
  clicked = false;

  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private userService: UserService,
    private db: AngularFirestore,
    private router: Router
  ) {
    this.initializeGlobalVariables();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Login form submission
  isLoading = false;
  onLoginSubmit(loginData: NgForm) {

    this.clicked = true;
    this.isLoading = true;



    // Checks for empty fields
    if (
      loginData.value.companyName.trim().length === 0 || // Check for empty or whitespace-only
      loginData.value.username.trim().length === 0 ||
      loginData.value.password.trim().length === 0
    ) {
      // Display error message for empty fields
      this.error = 'Empty Field';
      loginData.resetForm();
      this.clicked = false;
      this.isLoading = false;
      this.myInputField.nativeElement.focus();
    } else {
      // Normalize and set company name for database lookup
      const companyNameDB = loginData.value.companyName.toLowerCase().trim(); // Normalize and remove leading/trailing spaces
      GlobalComponent.companyNameDB = companyNameDB;

      // Check the database for the company name
      this.db
        .collection(companyNameDB)
        .get()
        .subscribe((snaps) => {
          if (snaps.empty) {
            // Display error message for non-existing company name
            this.error = 'Company File Does Not Exist';
            loginData.resetForm();
            this.clicked = false;
            this.isLoading = false;
            this.myInputField.nativeElement.focus();
          } else {
            // Check the database to verify username and password
            this.userService
              .getUserCredentials(loginData.value.username.toLowerCase())
              .subscribe((userData) => {
                if (
                  userData.length != 0 &&
                  userData[0].username ==
                  loginData.value.username.toLowerCase() &&
                  userData[0].password == loginData.value.password
                ) {
                  // Save user info to global variables
                  this.handleSuccessfulLogin(loginData.value, userData[0]);

                  // Navigate to the dashboard page
                  this.router.navigate(['/dashboard/home']);
                } else {
                  // Display error message for incorrect login credentials
                  this.error = 'Incorrect Username or Password';
                  loginData.resetForm();
                  this.clicked = false;
                  this.isLoading = false;
                  this.myInputField.nativeElement.focus();
                }
              });
          }
        });
    }

  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Initialize global variables
  private initializeGlobalVariables() {
    GlobalComponent.companyName = '';
    GlobalComponent.companyNameDB = '';
    GlobalComponent.userName = '';
    GlobalComponent.privilege = '';
    GlobalComponent.companyStreet = '';
    GlobalComponent.companyCityTownVillage = '';
    GlobalComponent.companyCountry = '';
    GlobalComponent.companyPhoneNumber = '';
    GlobalComponent.companyTIN = '';
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handle successful login by updating global variables
  private handleSuccessfulLogin(loginValue: any, userData: any) {
    console.log('LOGIN Successful');

    GlobalComponent.companyName = loginValue.companyName.toLowerCase();
    GlobalComponent.userName = loginValue.username.toLowerCase();
    GlobalComponent.privilege = userData.privilege;
    GlobalComponent.discountLimit = userData.discountLimit;
  }
  // -------------------------------------------------------------------------------------------------------------
}
