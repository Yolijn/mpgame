import { Component,ViewChild, OnInit } from '@angular/core';
import { SessionService } from './sessionService';

@Component({
  selector: 'game',
  styleUrls: ['./game.component.css'],
  templateUrl: './game.component.html'
})
export class gameComponent implements OnInit{
  @ViewChild('game') private game;

  constructor(private session: SessionService){}

  ngOnInit() {
    this.session.start(this.game.nativeElement);
  }
}
