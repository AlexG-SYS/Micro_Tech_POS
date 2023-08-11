import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Account } from 'src/app/Data-Model/account';
import { Items } from 'src/app/Data-Model/item';
import { AccountService } from 'src/app/Services/account.service';
import { ItemService } from 'src/app/Services/item.service';
import { ReceiptService } from 'src/app/Services/receipt.service';

@Component({
  selector: 'app-invoice-component',
  templateUrl: './invoice-component.component.html',
  styleUrls: ['./invoice-component.component.css'],
})
export class InvoiceComponentComponent {}
