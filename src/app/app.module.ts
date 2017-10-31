import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AuthService } from './authService';
import { SessionService } from './sessionService';

import { AppComponent } from './app.component';
import { UserFormComponent } from './user-form.component';
import { gameComponent } from './game.component';

@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    gameComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    AuthService,
    SessionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
