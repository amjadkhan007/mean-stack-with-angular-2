import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessageService: FlashMessagesService
  ) { }

  onLogout() {
    this.authService.logout();
    this.flashMessageService.show('You are Logged out', { cssClass: 'alert-info' });
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}
