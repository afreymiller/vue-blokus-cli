/* eslint-disable no-console */
/* eslint-disable no-undef */
let assert = require('assert');
import CanvasApi from '@/helpers/canvasApiForTest.js';
let TileExamples = require('./tileExamples.js');
let GameExamples = require('./gameExamples.js');
import MatrixTransformApi from '@/helpers/matrixTransformApiForTest.js';

describe('CanvasApi', function() {
  describe('getCoord()', function() {
    it('should return 20 when offset is 401', () => {
      let coord = CanvasApi.getCoord(401);

      assert.equal(coord, 20);
    });

    it('should return 20 when offset is 400', () => {
      let coord = CanvasApi.getCoord(400);

      assert.equal(coord, 20);
    });

    it('should return 19 when offset is 399', () => {

      let coord = CanvasApi.getCoord(399);

      assert.equal(coord, 19);
    });

    /* TODO: Double check this test case */
    // it('should return 0 when offset is -19', () => {
    //   //it('should return 20 when offset is 400', () => {
    //     let canvasApi = new CanvasApi();
    //     let coord = canvasApi.getCoord(-19);
  
    //     assert.equal(coord, 0);
    //   //});
    // })
  })

  describe('isValidMove()', function() {

    it('should return is valid for gameConfig 1, tileConfig 1, where cursor corresponds to coord x = 2, y = 3', () => {
      let x = 2;
      let y = 3;


      assert.equal(CanvasApi.isValid(GameExamples.GAME_1, TileExamples.TILE_1, x, y), true);
    });

    it('should return is valid for gameConfig 1, tileConfig 1, where cursor corresponds to coord x = 2, y = 3', () => {
      let x = 1;
      let y = 4;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_1, TileExamples.TILE_1, x, y), true);
    });

    it('should return is valid for gameConfig 1, tileConfig 1, where cursor corresponds to coord x = 2, y = 3', () => {
      let x = 3;
      let y = 2;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_1, TileExamples.TILE_1, x, y), true);
    });

    it('should return is invalid for gameConfig 1, tileConfig 1, where cursor corresponds to coord x = 15, y = 15', () => {
      let x = 15;
      let y = 15;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_1, TileExamples.TILE_1, x, y), false);
    });

    it('should return is valid for gameConfig 3, tileConfig 3, where cursor corresponds to coord x = 1, y = 1', () => {
      let x = 1;
      let y = 1;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_3, TileExamples.TILE_3, x, y), true);
    });

    it('should return is valid for gameConfig 4, tileConfig 4, where cursor corresponds to coord x = 18, y = 18', () => {
      let x = 18;
      let y = 18;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_4, TileExamples.TILE_4, x, y), true);
    });

    it('should return is valid for gameConfig 5, tileConfig 3, where cursor corresponds to coord x = 19, y = 19', () => {
      let x = 19;
      let y = 19;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_5, TileExamples.TILE_3, x, y), true);
    });

    it('should return is valid for gameConfig 5, tileConfig 3, where cursor corresponds to coord x = 10, y = 19', () => {
      let x = 10;
      let y = 19;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_5, TileExamples.TILE_3, x, y), true);
    });

    it('should return is valid for gameConfig 6, tileConfig 3, where cursor corresponds to coord x = 19, y = 12', () => {
      let x = 19;
      let y = 12;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_6, TileExamples.TILE_3, x, y), true);
    });

    it('should return is valid for gameConfig 7, tileConfig 5, where cursor corresponds to coord x = 0, y = 0', () => {
      let x = 0;
      let y = 0;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_7, TileExamples.TILE_5, x, y), true);
    });

    it('should return is valid for gameConfig 8, tileConfig 6, where cursor corresponds to coord x = 0, y = 0', () => {
      let x = 0;
      let y = 0;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_8, TileExamples.TILE_6, x, y), true);
    });

    it('should return is valid for gameConfig 8, tileConfig 6, where cursor corresponds to coord x = 19, y = 19', () => {
      let x = 19;
      let y = 19;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_8, TileExamples.TILE_6, x, y), true);
    });

    it('should return is valid for gameConfig 9, tileConfig 6, where cursor corresponds to coord x = 7, y = 19', () => {
      let x = 7;
      let y = 19;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_9, TileExamples.TILE_6, x, y), true);
    });

    it('should return is invalid for gameConfig 9, tileConfig 6, where cursor corresponds to coord x = -1, y = 19', () => {
      let x = -1;
      let y = 19;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_9, TileExamples.TILE_6, x, y), false);
    });

    it('should return is valid for gameConfig 10, tileConfig 6, where cursor corresponds to coord x = 19, y = 0', () => {
      let x = 19;
      let y = 0;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_10, TileExamples.TILE_6, x, y), true);
    });

    it('should return is valid for gameConfig 11, tileConfig 6, where cursor corresponds to coord x = 0, y = 19', () => {
      let x = 0;
      let y = 19;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_11, TileExamples.TILE_6, x, y), true);
    });

    it('should return is invalid for gameConfig 11, tileConfig 6, where cursor corresponds to coord x = 18, y = 1', () => {
      let x = 18;
      let y = 1;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_11, TileExamples.TILE_6, x, y), false);
    });

    it('should return is invalid for gameConfig 11, tileConfig 6, where cursor corresponds to coord x = 7, y = 19', () => {
      let x = 7;
      let y = 19;

      assert.equal(CanvasApi.isValid(GameExamples.GAME_12, TileExamples.TILE_6, x, y), false);
    });
  });

  describe('updateGameState()', function() {
    it('should update game config 1, tileConfig 1, where cursor corresponds to coord x = 3, y = 2', () => {
      let x = 3;
      let y = 2;
      let i, j;

      let updatedGame = CanvasApi.updateGameState(GameExamples.GAME_1, TileExamples.TILE_1, x, y);

      for (i = 0; i < 20; i++) {
        for (j = 0; j < 20; j++) {
          assert.equal(GameExamples.GAME_2[i][j], updatedGame[i][j]);
        }
      }
    });
  });

  describe('getTileCoordsToRender()', function() {

  });


  describe('MatrixTransformApi', function() {
    it('should properly rotate a matrix 90 degrees clockwise', () => {
      const m1 = [
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [3, 3, 3, 3],
        [4, 4, 4, 4]
      ];

      const m2 = [
        [4, 3, 2, 1],
        [4, 3, 2, 1],
        [4, 3, 2, 1],
        [4, 3, 2, 1]
      ];

      let rotated = MatrixTransformApi.rotateClockwise(m1);

      let i = 0, j = 0;
      for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
          assert.equal(rotated[i][j], m2[i][j]);
        }
      }
    });

    it('should properly rotate a matrix 90 degrees counterclockwise', () => {
      const m1 = [
        [1, 1, 1, 1],
        [2, 2, 2, 2],
        [3, 3, 3, 3],
        [4, 4, 4, 4]
      ];

      const m2 = [
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4],
        [1, 2, 3, 4]
      ];

      let rotated = MatrixTransformApi.rotateCounterclockwise(m1);

      let i = 0, j = 0;
      for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
          assert.equal(rotated[i][j], m2[i][j]);
        }
      }
    });
  });

});
