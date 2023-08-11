import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-app-setting-dialog',
  templateUrl: './copyRight-dialog.component.html',
  styleUrls: ['./copyRight-dialog.component.css'],
})
export class CopyRightDialogComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<CopyRightDialogComponent>) {}

  ngOnInit(): void {}

  // Closes the Dialog
  close() {
    this.dialogRef.close();
  }
}
