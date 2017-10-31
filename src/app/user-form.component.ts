import { Component } from '@angular/core';
import { AuthService } from './authService';
import { SessionService } from './sessionService';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  constructor(private user: AuthService, private session: SessionService) { }

  onSubmit(name) {
    this.user.login(name);
    this.session.userName = name;
  }
}
