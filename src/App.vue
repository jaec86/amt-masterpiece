<template>
  <div id="app">
    <transition enter-class="opacity-0">
      <router-view class="fixed inset-0 bg-gray-300 transition-all duration-500 delay-500" />
    </transition>
    <div class="fixed top-0 w-full h-full bg-gray-800" :class="{ 'move-left-delay': $store.state.overlayPos === 'left', 'move-right-delay': $store.state.overlayPos === 'right' }" style="left: -100%"></div>
    <div class="fixed top-0 w-full h-full bg-gray-500" :class="{ 'move-left': $store.state.overlayPos === 'left', 'move-right': $store.state.overlayPos === 'right' }" style="left: -100%"></div>
  </div>
</template>