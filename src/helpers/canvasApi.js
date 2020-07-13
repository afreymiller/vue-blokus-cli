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

const isValidClick = (gameConfig, tileConfig, xCoord, yCoord) => {  

  let i, j, xCenterOffset, yCenterOffset, tileX, tileY, isTouchingCorner = false;

  let allTiles = [];

  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {
      if (tileConfig[i][j] === 1) {
        xCenterOffset = 2 - i;
        yCenterOffset = 2 - j;

        tileX = xCenterOffset + xCoord;
        tileY = yCenterOffset + yCoord;

        allTiles.push({x: tileX, y: tileY});
      }
    }
  }
  
  for (let k = 0; k < allTiles.length; k++) {

    let xTile = allTiles[k].x;
    let yTile = allTiles[k].y;

    if ((xTile <= 19) && (xTile >= 0) &&
        (yTile <= 19) && (yTile >= 0)) {

        if (isTouchingSameColorHorizontally(gameConfig, yTile, xTile)) {
          return false;
        }
        
        if (isOverlappingTile(gameConfig, yTile, xTile)) {
          return false;
        }

        if (isTouchingSameColorDiagonally(gameConfig, yTile, xTile)) {
          isTouchingCorner = true;
        }
    } else {
      return false;
    } 
  }

  return isTouchingCorner;
}

const isValid = (gameConfig, tileConfig, xCoord, yCoord) => {  

  let i, j, xCenterOffset, yCenterOffset, tileX, tileY, isTouchingCorner = false;

  for (i = 0; i < 5; i++) {
    for (j = 0; j < 5; j++) {

      if (tileConfig[i][j] === 1) {
        xCenterOffset = 2 - i;
        yCenterOffset = 2 - j;

        tileX = xCoord + xCenterOffset;
        tileY = yCoord + yCenterOffset;

        if ((tileX <= 19) && (tileX >= 0) &&
          (tileY <= 19) && (tileY >= 0)) {
 
            if (isTouchingSameColorHorizontally(gameConfig, tileY, tileX)) {
              return false;
            }
            
            if (isOverlappingTile(gameConfig, tileY, tileX)) {
              return false;
            }

            if (isTouchingSameColorDiagonally(gameConfig, tileY, tileX)) {
              isTouchingCorner = true;
            }
        } else {
          //debugger
          return false;
        }      
      }
    }
  }

  return isTouchingCorner;
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
    },
    0: {
      1: [[0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 1, 0],
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
  isValidClick,
  getGameBoard,
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
      },
      0: {
        1: [[0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 1, 1, 0],
          [0, 0, 0, 0, 0]
        ],
        2: [[0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 1, 1, 1, 0],
          [0, 1, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ],
        3: [[0, 0, 0, 0, 0],
          [0, 1, 1, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 0, 0, 0]
        ],
        4: [[0, 0, 0, 0, 0],
          [0, 0, 0, 1, 0],
          [0, 1, 1, 1, 0],
          [0, 0, 0, 0, 0],
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