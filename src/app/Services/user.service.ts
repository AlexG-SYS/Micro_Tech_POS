import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GlobalComponent } from '../global-component';
import { concatMap, map } from 'rxjs/operators';
import { convertSnaps } from './db-utilities';
import { snapshotEqual } from 'firebase/firestore';
import { User } from '../Data-Model/user';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  getAllUserCredentials() {
    return this.db
      .collection('/' + GlobalComponent.companyNameDB + '/data/users')
      .get()
      .pipe(map((snaps) => convertSnaps<User>(snaps)));
  }

  getUserCredentials(username: string) {
    return this.db
      .collection('/' + GlobalComponent.companyNameDB + '/data/users', (ref) =>
        ref.where('username', '==', username)
      )
      .get()
      .pipe(map((snaps) => convertSnaps<User>(snaps)));
  }

  updateUserCredentials(userID: string, changes: Partial<User>) {
    return from(
      this.db
        .doc('/' + GlobalComponent.companyNameDB + '/data/users/' + userID)
        .update(changes)
    );
  }

  getCompanyInfo() {
    return this.db
      .doc('/' + GlobalComponent.companyNameDB + '/companyInfo')
      .get();
  }

  updateCompanyInfo(companyInfo: any) {
    return from(
      this.db
        .doc('/' + GlobalComponent.companyNameDB + '/companyInfo')
        .set(companyInfo)
    );
  }
}