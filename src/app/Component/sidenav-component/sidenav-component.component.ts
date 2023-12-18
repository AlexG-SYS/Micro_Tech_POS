import { Component, OnInit } from '@angular/core';
import { GlobalComponent } from 'src/app/global-component';

@Component({
  selector: 'app-sidenav-component',
  templateUrl: './sidenav-component.component.html',
  styleUrls: ['./sidenav-component.component.css']
})
export class SidenavComponentComponent implements OnInit {

  // Privilege data from global component
  privilege = GlobalComponent.privilege;
  
  constructor() { }

  ngOnInit(): void {
  }

}
