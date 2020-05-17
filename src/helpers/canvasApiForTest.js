/* eslint-disable no-console */
var $ = require('jquery');
var _ = require('lodash');

import constants from './constants.js';

class canvasApiForTest {

  initGrid() {
    var bw = constants.CANVAS_WIDTH;
    var bh = constants.CANVAS_HEIGHT;
    //padding around grid
    let x;

    $(`#${constants.BOARD_SELECTOR}`).attr({width: bw + 1, height: bh + 1});

    let canvas = document.getElementById(constants.BOARD_SELECTOR);

    console.log("canvas: ");
    console.log(canvas);

    let ctx = canvas.getContext("2d");
    for (x = 0; x <= bw; x += constants.TILE_LENGTH) {
      ctx.moveTo(0.5 + x, 0);
      ctx.lineTo(0.5 + x, bh);
    }

    for (x = 0; x <= bh; x += constants.TILE_LENGTH) {
      ctx.moveTo(0, 0.5 + x);
      ctx.lineTo(bw, 0.5 + x);
    }

    ctx.strokeStyle = constants.BLACK;
    ctx.stroke();

    return ctx;
  }

  getCoord(offset) {
    return Math.floor(offset/constants.TILE_LENGTH);
  }

  renderPolyominoTiles(coords, ctx) {
    coords.map(c => ctx.fillRect(c.x, 
      c.y, 
      constants.TILE_LENGTH - 1, 
      constants.TILE_LENGTH - 1)
    )
  }

  getTileCoordsToRender(shapeConfig, xOffSet, yOffset) {
    let xBox = this.getCoord(xOffSet);
    let yBox = this.getCoord(yOffset);

    let i, j = 0;
    const coords = [];

    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        if (shapeConfig[i][j] === 1) {
          let xDel = 2 - i;
          let yDel = 2 - j;

          coords.push({
            x: ((xBox + xDel) * constants.TILE_LENGTH) + 1,
            y: ((yBox + yDel) * constants.TILE_LENGTH) + 1
          });
        }
      }
    }

    return coords;
  }

  isTouchingSameColorHorizontally(gameConfig, tileX, tileY) {
    return _.get(gameConfig, `${tileX-1}.${tileY}`) === 1 ||
    _.get(gameConfig, `${tileX+1}.${tileY}`) === 1 ||
    _.get(gameConfig, `${tileX}.${tileY-1}`) === 1 ||
    _.get(gameConfig, `${tileX}.${tileY+1}`) === 1;
  }

  isTouchingSameColorDiagonally(gameConfig, tileX, tileY) {
    return _.get(gameConfig, `${tileX-1}.${tileY-1}`) === 1 ||
    _.get(gameConfig, `${tileX-1}.${tileY+1}`) === 1 ||
    _.get(gameConfig, `${tileX+1}.${tileY+1}`) === 1 ||
    _.get(gameConfig, `${tileX+1}.${tileY-1}`) === 1;
  }

  isOverlappingTile(gameConfig, tileX, tileY) {
    return _.get(gameConfig, `${tileX}.${tileY}`) === 1;
  }

  isValid(gameConfig, tileConfig, xCoord, yCoord) {  

    let i, j, xCenterOffset, yCenterOffset, tileX, tileY, isTouchingCorner = false;

    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        if (tileConfig[i][j] === 1) {
          xCenterOffset = 2 - i;
          yCenterOffset = 2 - j;

          tileX = xCenterOffset + xCoord;
          tileY = yCenterOffset + yCoord;

          if ((tileX <= 19) && (tileX >= 0) &&
            (tileY <= 19) && (tileY >= 0)) {

              if (this.isTouchingSameColorHorizontally(gameConfig, tileX, tileY)) {
                return false;
              }
              
              if (this.isOverlappingTile(gameConfig, tileX, tileY)) {
                return false;
              }

              if (this.isTouchingSameColorDiagonally(gameConfig, tileX, tileY)) {
                isTouchingCorner = true;
              }
          } else {
            return false;
          }      
        }
      }
    }

    return isTouchingCorner;
  }

  updateGameState(gameConfig, tileConfig, xCoord, yCoord) {
    let i, j;
    if (this.isValid(gameConfig, tileConfig, xCoord, yCoord)) {
      for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
          if (tileConfig[i][j] === 1) {
            let xDel = 2 - i;
            let yDel = 2 - j;
    
            let mapX = xCoord + xDel;
            let mapY = yCoord + yDel;
              
            gameConfig[mapX][mapY] = 1;
          }
        }
      }
    }
    
    return gameConfig;
  }

  updateCanvas(tileConfig, gameConfig, xOffset, yOffset) {
  
    let ctx = this.initGrid();

    ctx.fillStyle = constants.BLUE;

    let i, j = 0;

    const currState = [];

    /* TODO: This should eventually live in its own function */
    for (i = 0; i < 20; i++) {
      for (j = 0; j < 20; j++) {
        if (gameConfig[i][j] === 1) {
          currState.push({
            x: (20 * i) + 1,
            y: (20 * j) + 1
          });
        }
      }
    }

    /* TODO: Coord should just be its own class */
    let xCoord = this.getCoord(xOffset);
    let yCoord = this.getCoord(yOffset);

    const isValidMove = this.isValid(gameConfig, tileConfig, xCoord, yCoord);

    renderPolyominoTiles(currState, ctx);

    if (isValidMove) {
      const coords = this.getTileCoordsToRender(tileConfig, xOffset, yOffset);
      this.renderPolyominoTiles(coords, ctx);
    } else {
      ctx.fillStyle = '#CCE7FF';
      const coords = this.getTileCoordsToRender(tileConfig, xOffset, yOffset);
      this.renderPolyominoTiles(coords, ctx);
    }
  }
}

export default new canvasApiForTest();