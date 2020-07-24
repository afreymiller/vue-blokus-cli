<template>
  <div class="row">
    <polyomino-image
      v-for="(polyomino, index) in tiles"
      v-bind:key="index"
      :tileId="polyomino.id"
      class="col-md-1"
    />
  </div>
</template>

<script>
import PolyominoImage from './PolyominoImage.vue'
import tileOrientations from '../helpers/tileOrientations.js'
import { mapState } from 'vuex'

export default {
  name: 'Bag',
  components: {
    PolyominoImage
  },
  props: {
    selection: Number
  },
  computed: {
    ...mapState({
      tiles: state => state.playerOne.tiles.filter(e => !e.hasBeenPlaced)
    })
  }
}
</script>