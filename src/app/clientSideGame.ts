import { ViewChild } from '@angular/core';
import * as Rx from 'rxjs';
import { SessionService } from '../app/sessionService';

const toXY = {
  UP:    [ 0,  1],
  DOWN:  [ 0, -1],
  LEFT:  [-1,  0],
  RIGHT: [ 1,  0]
}

export class ClientSideGame {
  public game$: Rx.Observable<Event>;
  private keyUpEvents$: Rx.Observable<KeyboardEvent>;
  public moves$: Rx.Observable<string>;
  public userName$: Rx.Observable<any>;

  public cellSize: {x: number, y: number};
  public ctx: CanvasRenderingContext2D;

  constructor (public socket, public settings, public canvas) {
    /* Create observables for event subscriptions */
    this.game$ = Rx.Observable.fromEvent(socket, 'update');
    this.keyUpEvents$ = Rx.Observable.fromEvent(document, 'keyup');

    /* Filter keyEvents to match only Arrow Up, Down, Left and Right */
    this.moves$ = this.keyUpEvents$
      .filter(e => /^Arrow(Up|Down|Left|Right)$/.test(e.key))
      .map(e => e.key.replace(/^Arrow/, ''))
      .map(e => e.toUpperCase());

    this.ctx = this.canvas.getContext('2d');

    /* Make sure the bottom left corner is [0,0] for our gridgame */
    this.ctx.translate(0, this.canvas.height);
    this.ctx.scale(1, -1);

    /* Size of the cells to use in the canvas */
    this.cellSize = {
        x: this.canvas.width / this.settings.gridWidth,
        y: this.canvas.height / this.settings.gridHeight
    };

    /* Call the game.draw function each time a new game state is pushed */
    this.game$.subscribe(state => this.draw(state));

    /* For each Arrow key press, emit the socket:move event and send the direction */
    this.moves$.subscribe(direction => {
      console.log(direction);
        this.socket.emit('move', toXY[direction]);
    });
  }

  private drawPlayer(player) {
    const rgbToString = (rgb) => `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    localStorage.setItem('player', player);

    this.ctx.fillStyle = rgbToString(player.color);
    this.ctx.fillRect(
        // left: posX in grid * cellwidth
        player.position.x * this.cellSize.x,

        // bottom: posY in grid * cellHeight
        player.position.y * this.cellSize.y,

        // width: cellWidth
        this.cellSize.x,

        // height: cellHeigth
        this.cellSize.y
    );
  }

  draw(state) {
    localStorage.setItem('state', state);

    /* clear the canvas before drawing to clear moved or removed cell-values */
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    /* filter new grid so only items with value remain
     * get the values
     * draw each cell on the canvas
     */
    state.grid.matrix.filter(item => !!item.value)
    .map(item => item.value)
    .forEach(player => this.drawPlayer(player));
  }
}
