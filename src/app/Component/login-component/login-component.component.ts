import { Component, Output, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalComponent } from '../../global-component';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css'],
})
export class LoginComponentComponent {
  constructor(
    private userService: UserService,
    private db: AngularFirestore,
    private router: Router
  ) {
    // Sets the Global Variables to NULL
    GlobalComponent.userName = '';
    GlobalComponent.privilege = '';
  }

  @Output() error = '';
  @ViewChild('firstInput') myInputField!: ElementRef;
  clicked = false;

  onLoginSubmit(loginData: NgForm) {
    this.clicked = true;
    // Checks input fields for empty string
    if (
      loginData.value.username.length == 0 ||
      loginData.value.password.length == 0
    ) {
      // If empty returns an error message
      this.error = 'Empty Field';
      loginData.resetForm();
      this.clicked = false;
      this.myInputField.nativeElement.focus();
    } else {
      // If not empty checks the database to verify username and password
      this.userService
        .getUserCredentials(loginData.value.username.toLowerCase())
        .subscribe((userData) => {
          if (
            userData.length != 0 &&
            userData[0].username == loginData.value.username.toLowerCase() &&
            userData[0].password == loginData.value.password
          ) {
            // If login credentials are correct it saves the Username to global variable
            console.log('LOGIN Successful');
            GlobalComponent.userName = loginData.value.username.toLowerCase();
            GlobalComponent.privilege = userData[0].privilege;
            GlobalComponent.discountLimit = userData[0].discountLimit;

            // Resets the form and navigates to Dashboard page
            loginData.resetForm();
            this.error = '';
            this.router.navigate(['/dashboard/home']);
          } else {
            // If login credentials are not correct then reset form and show error message
            this.error = 'Incorrect Username or Password';
            loginData.resetForm();
            this.clicked = false;
            this.myInputField.nativeElement.focus();
          }
        });
    }
  }
}
