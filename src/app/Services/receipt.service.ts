import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators'
import { convertSnaps } from './db-utilities';
import { GlobalComponent } from '../global-component';
import { Receipt } from '../Data-Model/receipt';
import { ItemService } from './item.service';
import { isEmpty } from '@firebase/util';
import { Items } from '../Data-Model/item';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  partItem: any;
  itemList: Items[] = [];

  constructor(private db: AngularFirestore, private itemService: ItemService) { }

  // Adds receipt to the Database
  addReceipt(newReceipt: Partial<Receipt>) {
    return this.db.collection("/" + GlobalComponent.companyName + "/jodK1Ymec6nYUgcOhf1I-" + GlobalComponent.companyName + "/receipts",
      ref => ref.orderBy("receiptNumber", "desc").limit(1))
      .get().pipe(map(result => {
        // if (result.empty) {
        //   console.log("Could not reteive last receipt number")
        //   throw Error('');
        // }

        const lastReceipt = convertSnaps<Receipt>(result)
        const lastReceiptNumber = lastReceipt[0]?.receiptNumber ?? 0;

        const receipt = {
          ...newReceipt,
          receiptNumber: lastReceiptNumber + 1
        }
        let save$: Observable<any>;

        save$ = from(this.db.collection("/" + GlobalComponent.companyName + "/jodK1Ymec6nYUgcOhf1I-" + GlobalComponent.companyName + "/receipts").add(receipt));
        return save$.pipe(
          map(result => {
            return {
              id: result.id,
              ...receipt
            }
          })
        )
      }))
  }

  // Finds a specific Receipt based on the Receipt ID
  findReceipt(recID: string){
    return this.db.doc("/" + GlobalComponent.companyName + "/jodK1Ymec6nYUgcOhf1I-" + GlobalComponent.companyName + "/receipts/" + recID).get()
  }

  // Retrieves an array of Receipts from the databse 
  getReceiptList(date: string): Observable<Receipt[]> {
    return this.db.collection("/" + GlobalComponent.companyName + "/jodK1Ymec6nYUgcOhf1I-" + GlobalComponent.companyName + "/receipts",
      ref => ref.where("date", "==", date)
    ).get().pipe(
      map(snaps => convertSnaps<Receipt>(snaps))
    )
  }
  
}
