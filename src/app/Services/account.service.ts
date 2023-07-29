import { Injectable } from '@angular/core';
import { Account } from '../Data-Model/account';
import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalComponent } from '../global-component';
import { convertSnaps } from './db-utilities';
import { map } from 'rxjs/operators';
import { payments } from '../Data-Model/payments';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private db: AngularFirestore) {}

  getAccountList(status: string): Observable<Account[]> {
    return this.db
      .collection(
        '/' + GlobalComponent.companyNameDB + '/data/accounts',
        (ref) => ref.where('status', '==', status)
      )
      .get()
      .pipe(map((snaps) => convertSnaps<Account>(snaps)));
  }

  getAccount(accountID: string | null) {
    return this.db
      .doc('/' + GlobalComponent.companyNameDB + '/data/accounts/' + accountID)
      .get();
  }

  getAccountWithName(accountName: string) {
    return this.db
      .collection(
        '/' + GlobalComponent.companyNameDB + '/data/accounts',
        (ref) => ref.where('fullName', '==', accountName)
      )
      .get()
      .pipe(map((snaps) => convertSnaps<Account>(snaps)));
  }

  addAccount(newAccount: Partial<Account>) {
    let save$: Observable<any>;
    save$ = from(
      this.db
        .collection('/' + GlobalComponent.companyNameDB + '/data/accounts')
        .add(newAccount)
    );
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
        };
      })
    );
  }

  // Updates an account on the databse
  updateAccount(accountID: string, changes: Partial<Account>): Observable<any> {
    return from(
      this.db
        .doc(
          '/' + GlobalComponent.companyNameDB + '/data/accounts/' + accountID
        )
        .update(changes)
    );
  }

  //Adds payment with reference to account
  receivePaymentForAccount(paymentData: Partial<payments>) {
    let save$: Observable<any>;
    save$ = from(
      this.db
        .collection('/' + GlobalComponent.companyNameDB + '/data/payments')
        .add(paymentData)
    );
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
        };
      })
    );
  }

  updatePaymentForAccount(
    paymentID: string,
    paymentData: Partial<payments>
  ): Observable<any> {
    return from(
      this.db
        .doc(
          '/' + GlobalComponent.companyNameDB + '/data/payments/' + paymentID
        )
        .update(paymentData)
    );
  }

  // Retrieves all payments for a specific account ID
  getPaymentsForAccount(accountID: string): Observable<payments[]> {
    {
      return this.db
        .collection(
          '/' + GlobalComponent.companyNameDB + '/data/payments',
          (ref) => ref.where('accountID', '==', accountID)
        )
        .get()
        .pipe(map((snaps) => convertSnaps<payments>(snaps)));
    }
  }
}
