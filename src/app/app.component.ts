import { Component } from '@angular/core';
import { SessionService } from './sessionService';
import { AuthService } from './authService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public session: SessionService, public user: AuthService) {};

  stopGame() {
    this.session.stop();
    this.user.logout();
  }
}
