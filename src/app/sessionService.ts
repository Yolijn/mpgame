import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { ClientSideGame } from './clientSideGame';
import{ BehaviorSubject } from 'rxjs';

@Injectable()
export class SessionService {
  private url = 'http://localhost:3000/';
  private socket: io;
  private connected = false;

  public userName = localStorage.getItem('userName');

  public id: string;
  public game: ClientSideGame;

  private hasConnection = () => this.connected;
  private isConnected$ = new BehaviorSubject<boolean>(!!this.hasConnection);

  start(canvas) {
    this.socket = io(this.url);
    this.id = this.socket.id;

    this.socket.on('connected', settings => {
      this.connected = true;
      this.game = new ClientSideGame(this.socket, settings, canvas);
    });

    this.socket.on('disconnected', () => {
      this.connected = false;
    });

    localStorage.setItem('id', this.socket.id);
  }

  stop() {
    this.socket.close();
  }
}
