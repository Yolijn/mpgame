import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable()
export class AuthService {
  isLoggedIn: BehaviorSubject<boolean>;

  constructor() {
    this.isLoggedIn = new BehaviorSubject(this.hasName());
  }

  /**
   * if we have a user name the user is logged in
   * @return {boolean}
   */
  private hasName() : boolean {
    return !!localStorage.getItem('userName');
  }

  /**
   * Set localstorage.name and push new isLoggedIn state
   *
   * @param {string} name
   */
  public login(name) : void {
    localStorage.setItem('userName', name);
    this.isLoggedIn.next(true);
  }

  /**
   * Remove localstorage.name and push new isLoggedIn state
   *
   * @param {string} name
   */
  public logout() : void {
    localStorage.removeItem('userName');
    this.isLoggedIn.next(false);
    localStorage.clear();
  }
}
