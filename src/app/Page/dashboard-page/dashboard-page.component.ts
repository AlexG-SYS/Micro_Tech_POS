import { Component, OnInit } from '@angular/core';
import { GlobalComponent } from '../../global-component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  constructor(private router: Router) {
    if (GlobalComponent.userName.length == 0) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
  }

}
