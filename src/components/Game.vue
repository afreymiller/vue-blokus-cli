<template>
  <div>
    <board/>
    <bag
      :selection=tileId
    />
    <button type="button"
      v-on:click="rotateTile('clockwise')"
    >
      Rotate clockwise
    </button>
    <button type="button"
      v-on:click="rotateTile('counterclockwise')"
    >
      Rotate counterclockwise
    </button>
    <p>Score: {{score}}</p>
    {{top}} {{left}}
  </div>
</template>

<script>
/* eslint-disable no-console */
var $ = require('jquery')
window.jQuery = $
import { mapState, mapMutations } from 'vuex'
import canvasApi from '../helpers/canvasApi.js'
import matrixTransformApi from '../helpers/matrixTransformApi.js'
import Board from './Board.vue'
import Bag from './Bag.vue'

export default {
  name: 'Game',
  components: {
    Board,
    Bag
  },
  data () {
    return {
      left: 0,
      top: 0,
      selected: 3
    }
	},
  computed: {
    ...mapState({
      count: state => state.game.count,
      boardConfig: state => state.game.boardConfig,
      tileConfig: state => state.playerOne.tiles.filter(e => e.selected === true)[0].config,
      tileId: state => state.playerOne.tiles.filter(e => e.selected === true)[0].id,
      stateId: state => state.playerOne.tiles.filter(e => e.selected === true)[0].stateId,
      score: state => state.playerOne.score
    })
  },
  methods:{
    ...mapMutations({
      inc: 'game/increment',
      dec: 'game/decrement',
      update: 'game/updateBoardConfig',
      rotate: 'playerOne/updateRotation',
      placeTile: 'playerOne/placeTile',
      setSelected: 'playerOne/setSelected',
      updateScore: 'playerOne/updateScore',
      setPositionId: 'playerOne/updateStateId'
    }),
    rotateTile: function(orientation) {
      let tmp;
      let newStateId;
      if (orientation == 'clockwise') {
        tmp = matrixTransformApi.rotateClockwise(this.tileConfig);
        newStateId = this.stateId + 1;
      } else {
        newStateId = this.stateId - 1;
        tmp = matrixTransformApi.rotateCounterclockwise(this.tileConfig);
      }

      this.setPositionId({i: this.tileId, positionIndex: newStateId})
      this.rotate({i: this.tileId, newConfig: tmp});
    },
    calculatePosition: function(e) {
      let offset = $("canvas").offset();
      this.left = e.pageX - offset.left;
      this.top = e.pageY - offset.top;

      let transposedConfig = matrixTransformApi.rotateClockwise(this.transpose(this.tileConfig));

      canvasApi.updateCanvas(matrixTransformApi.rotateClockwise(transposedConfig), this.boardConfig, this.left, this.top);
    },
    transpose: function(config) {
      return config[0].map((col, i) => config.map(row => row[i]));
    },
    onClick: function() {
      if (this.left >= 0 && this.left <= 400 && this.top >= 0 && this.top <= 400) {

        let gameBoard = canvasApi.getGameBoard(this.boardConfig);

        // let transposedConfig = matrixTransformApi.rotateClockwise(this.transpose(this.tileConfig));
        // let clockwiseAgain = matrixTransformApi.rotateClockwise(transposedConfig);

        let xCoordClicked = canvasApi.getCoords(this.left);
        let yCoordClicked = canvasApi.getCoords(this.top);


        let configToUse = matrixTransformApi.getMirrorImageByColumns(this.tileConfig);

        configToUse = matrixTransformApi.rotateCounterclockwise(configToUse);

        let isValidMove = canvasApi.isValidClick(gameBoard, configToUse, xCoordClicked, yCoordClicked);

        console.log("isValid: ");
        console.log(isValidMove);

        if (isValidMove) {
          /* TODO: This should take place entirely in apiCanvas and return a game state */

          //alert("is valid")
          // let tmpConfig = canvasApi.updateGameState(this.boardConfig, clockwiseAgain, canvasApi.getCoords(this.left), canvasApi.getCoords(this.top));
          this.update({tileId: this.tileId, orientationId: 1, xCoord: xCoordClicked, yCoord: yCoordClicked});
          this.placeTile({i: this.tileId});
          this.setSelected({i: null});
          this.updateScore({config: this.tileConfig});
        } 
      }
    }
  },
  created() {
    window.addEventListener('mousemove', this.calculatePosition);
    window.addEventListener('mouseup', this.calculatePosition);
    window.addEventListener('click', this.onClick);
    canvasApi.updateCanvas(this.tileConfig, this.boardConfig, 0, 0);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#grid {
  background-color: lightgray;
  height: 300px;
  width: 300px;
}
canvas {
    background: #fff;
    margin: 20px;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
