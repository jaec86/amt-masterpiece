<template>
  <div>
    <div class="container relative flex flex-col justify-center items-center mx-auto p-6 lg:max-w-screen-lg h-full">
      <h1 class="flex justify-center">Page Not Found</h1>
      <p class="pt-6 pb-10 text-center">Looks like you're lost, try one of the links below</p>
      <router-link to="/" class="mb-6 font-bold text-sm uppercase tracking-wider">Home</router-link>
      <router-link to="/shader" class="mb-6 font-bold text-sm uppercase tracking-wider">Fragment Shaders</router-link>
      <router-link to="/halftone" class="mb-6 font-bold text-sm uppercase tracking-wider">Halftone Pattern</router-link>
      <router-link to="/noise" class="mb-6 font-bold text-sm uppercase tracking-wider">Perlin Noise</router-link>
      <router-link to="/sound" class="mb-6 font-bold text-sm uppercase tracking-wider">Sound Frequency</router-link>
      <router-link to="/demo" class="font-bold text-sm uppercase tracking-wider">Live Demo</router-link>
      <div class="fixed top-0 left-0 w-full pointer-events-none" :style="{ boxShadow: 'inset 0 0 0.75rem 1rem #e2e8f0' }"></div>
    </div>
  </div>
</template>