/* eslint-disable no-console */
var $ = require('jquery');
var _ = require('lodash');

import constants from './constants.js';
import matrixTransformsApi from './matrixTransformApi';

const initGrid = () => {
  var bw = constants.CANVAS_WIDTH;
  var bh = constants.CANVAS_HEIGHT;
  //padding around grid
  let x;

  $(`#${constants.BOARD_SELECTOR}`).attr({width: bw + 1, height: bh + 1});

  let canvas = document.getElementById(constants.BOARD_SELECTOR);

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

const getCoord = (offset) => {
  return Math.floor(offset/constants.TILE_LENGTH);
}

const renderPolyominoTiles = (coords, ctx) => {
  coords.map(c => ctx.fillRect(c.x, 
    c.y, 
    constants.TILE_LENGTH - 1, 
    constants.TILE_LENGTH - 1)
  )
}

const getTileCoordsToRenderForPlacedTile = (shapeConfig, xCoord, yCoord) => {
  let i, j = 0;
  const coords = [];

  matrixTransformsApi.rotateClockwise(shapeConfig);
  const config = matrixTransformsApi.getMirrorImageByColumns(shapeConfig);

  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      if (config[i][j] === 1) {
        let xDel = 2 - i;
        let yDel = 2 - j;

        coords.push({
          x: ((xCoord + xDel) * constants.TILE_LENGTH) + 1,
          y: ((yCoord + yDel) * constants.TILE_LENGTH) + 1
        });
      }
    }
  }

  return coords;
}

const getTileCoordsToRender = (shapeConfig, xOffSet, yOffset) => {
  let xBox = getCoord(xOffSet);
  let yBox = getCoord(yOffset);

  let i, j = 0;
  const coords = [];
  const indicesShaded = [];

  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      if (shapeConfig[i][j] === 1) {
        let xDel = 2 - i;
        let yDel = 2 - j;

        indicesShaded.push({
          x: xBox + xDel,
          y: yBox + yDel
        });

        coords.push({
          x: ((xBox + xDel) * constants.TILE_LENGTH) + 1,
          y: ((yBox + yDel) * constants.TILE_LENGTH) + 1
        });
      }
    }
  }

  return coords;
}

const isTouchingSameColorHorizontally = (gameConfig, tileX, tileY) => {
  return _.get(gameConfig, `${tileX-1}.${tileY}`) === 1 ||
  _.get(gameConfig, `${tileX+1}.${tileY}`) === 1 ||
  _.get(gameConfig, `${tileX}.${tileY-1}`) === 1 ||
  _.get(gameConfig, `${tileX}.${tileY+1}`) === 1;
}

const isTouchingSameColorDiagonally = (gameConfig, tileX, tileY) => {
  return _.get(gameConfig, `${tileX-1}.${tileY-1}`) === 1 ||
  _.get(gameConfig, `${tileX-1}.${tileY+1}`) === 1 ||
  _.get(gameConfig, `${tileX+1}.${tileY+1}`) === 1 ||
  _.get(gameConfig, `${tileX+1}.${tileY-1}`) === 1;
}

const isOverlappingTile = (gameConfig, tileX, tileY) => {
  return _.get(gameConfig, `${tileX}.${tileY}`) === 1;
}

const isValid = (gameConfig, tileConfig, xCoord, yCoord) => {  

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

            if (isTouchingSameColorHorizontally(gameConfig, tileX, tileY)) {
              return false;
            }
            
            if (isOverlappingTile(gameConfig, tileX, tileY)) {
              return false;
            }

            if (isTouchingSameColorDiagonally(gameConfig, tileX, tileY)) {
              console.log("gameConfig: ");
              console.log(gameConfig);
              console.log("tileX: ");
              console.log(tileX);
              console.log("tileY: ");
              console.log(tileY);
              //debugger
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

const updateGameState = (gameConfig, tileConfig, xCoord, yCoord) => {
  let i, j;

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
  
  return gameConfig;
}

const getGameBoard = (gameConfig) => {

  let board = [[
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ], [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
  ]];

  const tilesDictionary = {
    1: {
      1: [[0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ]
    },
    2: {
      1: [[0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0]
      ]
    }
  }

  let boxesToSetToOne = [];

  gameConfig.forEach(config => {

    let tmpConfig = tilesDictionary[config.tileId][config.orientationId]

    matrixTransformsApi.rotateClockwise(tmpConfig);
    const transformedConfig = matrixTransformsApi.getMirrorImageByColumns(tmpConfig);
   
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (transformedConfig[i][j] === 1) {
          let xDel = 2 - i;
          let yDel = 2 - j;

          boxesToSetToOne.push({x: xDel + config.xCoord, y: yDel + config.yCoord});

          //board[xDel][yDel] = 1;
        }
      }
    }
  });


  boxesToSetToOne.forEach(box => {
    board[box.y][box.x] = 1;
  });

  return board;
}

const canvasApi = {
  isValid,
  updateGameState,
  getCoords: (x) => {
    return getCoord(x);
  },
  updateCanvas: (tileConfig, gameConfig, xOffset, yOffset) => {
  
    let ctx = initGrid();

    ctx.fillStyle = constants.BLUE;

    let i, j = 0;

    const currState = [];

    const tilesDictionary = {
      1: {
        1: [[0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ]
      },
      2: {
        1: [[0, 0, 0, 0, 0],
          [0, 0, 1, 1, 0],
          [0, 0, 1, 0, 0],
          [0, 1, 1, 0, 0],
          [0, 0, 0, 0, 0]
        ]
      }
    }

    let coords = [];
    //let coordsToAdd = [];

    gameConfig.forEach(config => {
      let coordsToAdd = getTileCoordsToRenderForPlacedTile(tilesDictionary[config.tileId][config.orientationId], config.xCoord, config.yCoord);

      coordsToAdd.forEach(elem => {
        coords.push(elem);
      })
    })

    // const coords1 = getTileCoordsToRenderForPlacedTile(tilesDictionary[1][1], 0, 0);

    // coords1.forEach(elem => {
    //   coords.push(elem);
    // })

    // const coords2 = getTileCoordsToRenderForPlacedTile(tilesDictionary[2][1], 5, 6);

    // coords2.forEach(elem => {
    //   coords.push(elem);
    // })

    // for (const placedTile of gameConfig) {

    //   coordsToAdd = getTileCoordsToRenderForPlacedTile(tilesDictionary[placedTile.tileId][placedTile.orientationId], placedTile.xCoord, placedTile.yCoord);


    //   for (const coordToAdd of coordsToAdd) {
    //     coords.push(coordToAdd);
    //   }
    // }

    // coords = [
    //   {x: 1, y: 1},
    //   {x: 61, y: 61},
    //   {x: 61, y: 41},
    //   {x: 21, y: 21} , 
    //   {x: 41, y: 41},
    //   {x: 21, y: 41}
    // ]

    // for (i = 0; i < 20; i++) {
    //   for (j = 0; j < 20; j++) {
    //     if (gameConfig[i][j] === 1) {
    //       currState.push({
    //         x: (20 * i) + 1,
    //         y: (20 * j) + 1
    //       });
    //     }
    //   }
    // }

    renderPolyominoTiles(coords, ctx);

    /* TODO: Coord should just be its own class */
    let xCoord = getCoord(xOffset);
    let yCoord = getCoord(yOffset);

    const gameBoard = getGameBoard(gameConfig);

    const isValidMove = isValid(gameBoard, tileConfig, xCoord, yCoord);

    // renderPolyominoTiles(currState, ctx);

    //matrixTransformsApi.rotateCounterclockwise(tileConfig);
    //atrixTransformsApi.rotateClockwise(tileConfig);

    //const transformedConfig = matrixTransformsApi.getMirrorImageByColumns(tileConfig);

    if (isValidMove) {
      const coords = getTileCoordsToRender(tileConfig, xOffset, yOffset);
      renderPolyominoTiles(coords, ctx);
    } else {
      ctx.fillStyle = '#CCE7FF';
      const coords = getTileCoordsToRender(tileConfig, xOffset, yOffset);
      renderPolyominoTiles(coords, ctx);
    }
  }
}

export default canvasApi;