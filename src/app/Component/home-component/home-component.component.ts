import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  constructor(private db: AngularFirestore) { 
    
  }

  ngOnInit(): void {
  }

  // companyName = "Test";

  // onReadColl(){
  //   this.db.collection(this.companyName).get().subscribe(snaps => {
  //     snaps.forEach(snap => {
  //       console.log(snap.exists);
        
  //     })
  //   })
  // }

}
