<template>
  <div id="app">
    <transition enter-class="opacity-0" appear>
      <router-view class="view" />
    </transition>
    <div class="fixed top-0 w-full h-full bg-gray-900" :class="{ 'move-left-delay': $store.state.overlayPos === 'left', 'move-right-delay': $store.state.overlayPos === 'right' }" style="left: -100%"></div>
    <div class="fixed top-0 w-full h-full bg-gray-700" :class="{ 'move-left': $store.state.overlayPos === 'left', 'move-right': $store.state.overlayPos === 'right' }" style="left: -100%"></div>
  </div>
</template>

<script>
  export default {
    methods: {
      setViewHeight: () => {
        document.querySelector(':root').style.setProperty('--vh', window.innerHeight / 100 + 'px')
      }
    },
    mounted () {
      this.setViewHeight()
      window.addEventListener('resize', this.setViewHeight)
    }
  }
</script>