import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const gameModule = {
  state: {
    boardConfig: [
      {
        tileId: 1,
        orientationId: 1,
        xCoord: 0,
        yCoord: 0
      },
      {
        tileId: 2,
        orientationId: 1,
        xCoord: 1,
        yCoord: 2
      }
    ]
  },
  mutations: {
    updateBoardConfig: (state, payload) => state.boardConfig.push(payload)
  },
  namespaced: true
}

const playerOneModule = {
  state: {
    score: 1,
    tiles: [
      {
        id: 0,
        selected: true,
        stateId: 1,
        config: [
          [0, 0, 0, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 1, 0, 0],
          [0, 0, 1, 1, 0],
          [0, 0, 0, 0, 0]
        ]
      },
      {
         id: 1,
         selected: false,
         stateId: 1,
         config: [
           [0, 0, 0, 0, 0],
           [0, 1, 0, 1, 0],
           [0, 1, 1, 1, 0],
           [0, 0, 0, 0, 0],
           [0, 0, 0, 0, 0]
         ]
      },
      // {
      //   id: 2,
      //   selected: false,
      //   config: [
      //     [0, 0, 0, 0, 0],
      //     [0, 1, 0, 0, 0],
      //     [0, 1, 1, 1, 0],
      //     [0, 0, 0, 1, 0],
      //     [0, 0, 0, 0, 0]
      //   ]
      // }
    ]
  },
  mutations: {
    updateRotation: (state, {i, newConfig}) => {
      state.tiles[i].config = newConfig;
    },
    updateStateId: (state, {i, positionIndex}) => {
      state.tiles[i].stateId = positionIndex;
    },
    placeTile: (state, {i}) => {
      let index = state.tiles.findIndex(e => e.id === i)
      state.tiles.splice(index, 1);
    },
    updateScore: (state, {config}) => {
      let total = 0;
      let i, j = 0;

      for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
          if (config[i][j] !== 0) {
            total += 1;
          }
        }
      }

      state.score += total;
    },
    setSelected: (state, {i}) => {
      if (i !==  null) {
        let index = 0;

        for (index = 0; index < state.tiles.length; index++) {
          if (state.tiles[index].id === i) {
            state.tiles[index].selected = true;
          } else {
            state.tiles[index].selected = false;
          }
        }
      } else {
        state.tiles[0].selected = true;
      }
      
    }
  },
  namespaced: true
}

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    game: gameModule,
    playerOne: playerOneModule
  }
})
