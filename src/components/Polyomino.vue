<template>
  <div 
    class="wrapper"
    v-bind:class="getClass()"
  >
    <polyomino-row
      class="inner"
      v-for="(row, index) in config"
      v-bind:key="index"
      :row="row"
    />
  </div>
</template>

<script>
import PolyominoRow from './PolyominoRow.vue'
import { mapMutations, mapState } from 'vuex'

export default {
  name: 'Polyomino',
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
      }
    })
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