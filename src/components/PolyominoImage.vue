<template>
  <div 
    class="wrapper"
    v-bind:class="getClass()"
  >
    <img :src="imageUrl"> 
  </div>
</template>

<script>
import PolyominoRow from './PolyominoRow.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'PolyominoImage',
  components: {
    PolyominoRow
  },
  props: {
    tileId: {
      type: Number,
      default: -1
    }
  },
  computed: {
    ...mapState({
      isSelected: function(state) {
        return state.playerOne.tiles.filter(e => e.id === this.tileId)[0].selected;
      },
      config: function(state) {
        return state.playerOne.tiles.filter(e => e.id === this.tileId)[0].config;
      },
      stateId: function(state) {
        return state.playerOne.tiles.filter(e => e.id === this.tileId)[0].stateId;
      }
    }),
    imageUrl() {
      return require('../assets/state_1.png');
    }
  },
  methods: {
    ...mapMutations({
      setSelected: 'playerOne/setSelected'
    }),
    onClick: function() {
      this.setSelected({i: this.tileId});
    },
    getClass: function() {
      let classString = '';

      if (this.isSelected) {
        classString += 'selected';
      }

      classString += ' polyomino-' + this.tileId.toString();

      return classString;
    },
    transpose: function(configExample) {
      console.log("transpose it");
      return configExample[0].map((col, i) => configExample.map(row => row[i]));
    }
  },
  mounted() {
    var classname = document.getElementsByClassName('polyomino-' + this.tileId.toString());

    classname[0].addEventListener('click', this.onClick);
    
  }
}
</script>

<style scoped>
  .wrapper {
    max-height: 50px;
    display: grid;
    grid-template-columns: 10px 10px 10px 10px 10px;
    grid-gap: 0px;
    background-color: #fff;
    color: #444;
    margin-bottom: 60px;
  }

  .selected {
    border: 1px solid orange;
  }
</style>