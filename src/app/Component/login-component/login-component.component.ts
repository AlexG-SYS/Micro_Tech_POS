import { Component, Output, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import{ GlobalComponent } from '../../global-component';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login-component',
  templateUrl: './login-component.component.html',
  styleUrls: ['./login-component.component.css']
})
export class LoginComponentComponent {

  constructor(private db: AngularFirestore, private router: Router) {
    // Sets the Global Variables to NULL
    GlobalComponent.companyName = "";
    GlobalComponent.userName = "";
    GlobalComponent.privilege = "";

  }

  @Output() error = "";
  @ViewChild("firstInput") myInputField!: ElementRef;

  onLoginSubmit(loginData: NgForm) {
    // Checks input fields for empty string
    if (loginData.value.companyName.length == 0 || loginData.value.username.length == 0 || loginData.value.password.length == 0) {
      // If empty returns an error message
      this.error = "Empty Field"
    }
    else {
      // If not empty checks the database for company name
      this.db.collection(loginData.value.companyName.toLowerCase()).get().subscribe(snaps => {
        if (snaps.empty) {
          // If company name does not exist return error
          this.error = "Company File Does Not Exist"
          loginData.resetForm();
          this.myInputField.nativeElement.focus();
        }
        else {
          // If company name does exist verifies username and password
          this.db.collection("/" + loginData.value.companyName.toLowerCase() + "/jodK1Ymec6nYUgcOhf1I-" + loginData.value.companyName.toLowerCase() + "/users").get().subscribe(snaps => {
            snaps.forEach(snap => {
              if (snap.get("username") == loginData.value.username.toLowerCase() && snap.get("password") == loginData.value.password) {
                // If login credentials are correct it saves the Company name and Username to global variable
                console.log("LOGIN Successful")
                GlobalComponent.companyName = loginData.value.companyName.toLowerCase();
                GlobalComponent.userName = loginData.value.username.toLowerCase();
                GlobalComponent.privilege = snap.get("privilege");
                // Resets the form and navigates to Dashboard page
                loginData.resetForm();
                this.error = "";
                this.router.navigate(['/dashboard/home']);
              }
              else {
                // If login credentials are not correct then reset form and show error message
                this.error = "Incorrect Username or Password"
                loginData.resetForm();
                this.myInputField.nativeElement.focus();
              }
            })
          })
        }
      })
    }
  }

}
