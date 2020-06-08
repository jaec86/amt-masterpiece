<template>
  <div>
    <canvas ref="visualizer"></canvas>
  </div>
</template>

<script>
  import Visualizer from '@/visualizer'

  export default {
    data () {
      return {
        visualizer: null
      }
    },
    mounted () {
      this.visualizer = new Visualizer(this.$refs.visualizer)
      this.visualizer.init()
    },
    beforeRouteLeave (to, from, next) {
      this.visualizer.destroy()
      next()
    }
  }
</script>