import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, tap, throwError } from 'rxjs';
import { Account } from 'src/app/Data-Model/account';
import { AccountService } from 'src/app/Services/account.service';

@Component({
  selector: 'app-add-account-form-component',
  templateUrl: './add-account-form-component.component.html',
  styleUrls: ['./add-account-form-component.component.css'],
})
export class AddAccountFormComponentComponent {
  // Event emitter to signal account list refresh to parent component
  @Output() refreshActiveAccountListEvent: EventEmitter<boolean> =
    new EventEmitter();

  // Reference to the full name input field
  @ViewChild('fullNameInput') searchField!: ElementRef;

  // Properties for error handling, file upload, and button click state
  error = '';
  selectedFile: any = null;
  clicked = false;
  // -------------------------------------------------------------------------------------------------------------
  constructor(
    private accountService: AccountService,
    private snackBar: MatSnackBar,
    private changeDet: ChangeDetectorRef
  ) {}
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // After the view initialization, focus on the full name input field
  ngAfterViewInit() {
    this.focusSearchField();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles form submission for adding a new account
  onNewAccountSubmit(formData: NgForm) {
    this.clicked = true;

    if (formData.valid) {
      const newAccount = { ...formData.value } as Account;
      newAccount.date = new Date().toLocaleDateString();
      newAccount.balance = 0;

      this.accountService
        .addAccount(newAccount)
        .pipe(
          tap((item) => {
            this.handleSuccess(item.id);
            formData.resetForm();
            this.resetInput();
            this.clicked = false;
          }),
          catchError((error) => {
            this.handleError();
            return throwError(error);
          })
        )
        .subscribe();
    } else {
      this.handleInvalidInput();
    }
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Resets the input fields
  resetInput() {
    this.selectedFile = null;
    this.error = '';
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Displays a message to the user
  openSnackBar(message: string, cssStyle: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [cssStyle],
    });
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Focuses on the search field
  private focusSearchField() {
    this.searchField.nativeElement.focus();
    this.changeDet.detectChanges();
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles success after adding an account
  private handleSuccess(accountId: string) {
    console.log('Account Successfully Added! ID:', accountId);
    this.refreshActiveAccountListEvent.emit(true);
    this.openSnackBar('Account Successfully Added!', 'success-snakBar');
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles errors during form submission
  private handleError() {
    this.openSnackBar('An Error Occurred While Saving!', 'error-snakBar');
  }
  // -------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------------------------------------------------------------------
  // Handles invalid input in the form
  private handleInvalidInput() {
    this.error = 'Invalid Input*';
    this.clicked = false;
  }
}
