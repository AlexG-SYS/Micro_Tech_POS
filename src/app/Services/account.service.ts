import { Injectable } from '@angular/core';
import { Account } from '../Data-Model/account';
import { from, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalComponent } from '../global-component';
import { convertSnaps } from './db-utilities';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private db: AngularFirestore) { }

  getAccountList(status: string): Observable<Account[]> {
    return this.db.collection("/" + GlobalComponent.companyName + "/jodK1Ymec6nYUgcOhf1I-" + GlobalComponent.companyName + "/accounts",
      ref => ref.where("status", "==", status)
    ).get().pipe(
      map(snaps => convertSnaps<Account>(snaps))
    )
  }
}
