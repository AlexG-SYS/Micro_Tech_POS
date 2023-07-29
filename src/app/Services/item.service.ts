import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { Items } from '../Data-Model/item';
import { map } from 'rxjs/operators';
import { convertSnaps } from './db-utilities';
import { GlobalComponent } from '../global-component';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private db: AngularFirestore) {}

  // Retrieves an array of items from the databse
  getItemList(status: string): Observable<Items[]> {
    return this.db
      .collection('/' + GlobalComponent.companyNameDB + '/data/items', (ref) =>
        ref.where('status', '==', status)
      )
      .get()
      .pipe(map((snaps) => convertSnaps<Items>(snaps)));
  }
  // Add an item to the databse
  addItem(newItem: Partial<Items>, image: any) {
    let save$: Observable<any>;
    save$ = from(
      this.db
        .collection('/' + GlobalComponent.companyNameDB + '/data/items')
        .add(newItem)
    );
    return save$.pipe(
      map((res) => {
        return {
          id: res.id,
        };
      })
    );
  }

  // Updates an items on databse
  updateItem(itemID: string, changes: Partial<Items>): Observable<any> {
    return from(
      this.db
        .doc('/' + GlobalComponent.companyNameDB + '/data/items/' + itemID)
        .update(changes)
    );
  }
}
