<template>
  <div class="overflow-scroll scrolling-touch">
    <div class="container mx-auto">
      <div class="p-6" :style="{ minHeight: 'calc(100vh - 72px)' }">
        <h1 class="font-bold" :key="n" v-for="n in 100">Sound {{ n }}</h1>
      </div>
      <div class="fixed top-0 left-0 w-full pointer-events-none" :style="{ height: 'calc(100vh - 72px)', boxShadow: 'inset 0 0 1rem 1.5rem #e2e8f0' }"></div>
      <div class="sticky bottom-0 flex justify-between items-center px-3 py-6 bg-gray-300">
        <div class="px-3 w-1/3">
          <router-link to="/noise" class="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-500">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block w-4">
              <g>
                <path fill="currentColor" d="M424 297H137.6L96 256l41.59-41H424c13.3 0 24 11 24 24.63v32.82A24.22 24.22 0 0 1 424 297z" class="opacity-50"></path>
                <path fill="currentColor" d="M201.69 473.48l-.71-.71L7 273.44a25 25 0 0 1 0-34.78L201 39.23a23.38 23.38 0 0 1 33.11-.7c.24.22.47.46.7.7L256.94 62a25.13 25.13 0 0 1-.4 35.18L95.81 256l160.73 158.8a24.94 24.94 0 0 1 .4 35.18l-22.15 22.78a23.38 23.38 0 0 1-33.1.72z"></path>
              </g>
            </svg>
            <span class="ml-3 font-bold text-sm uppercase tracking-wide">Noise</span>
          </router-link>
        </div>
        <div class="px-3 w-1/3 text-center">
          <router-link to="/" class="text-gray-600 hover:text-gray-800 transition-all duration-500">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="home-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="inline-block w-6">
              <g>
                <path fill="currentColor" d="M336 463.58v-95.64a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v95.71a16 16 0 0 1-15.92 16l-112.08.29a16 16 0 0 1-16-16V300.05L280.39 148.2a12.19 12.19 0 0 1 15.3 0L480 299.94v164a16 16 0 0 1-16 16l-112-.31a16 16 0 0 1-16-16.05z" class="opacity-50"></path>
                <path fill="currentColor" d="M530.92 300.94L295.69 107.2a12.19 12.19 0 0 0-15.3 0L45.17 300.94a12 12 0 0 1-16.89-1.64l-25.5-31a12 12 0 0 1 1.61-16.89l253.1-208.47a48 48 0 0 1 61 0l253.13 208.47a12 12 0 0 1 1.66 16.89l-25.5 31a12 12 0 0 1-16.86 1.64z"></path>
              </g>
            </svg>
          </router-link>
        </div>
        <div class="flex flex-row-reverse px-3 w-1/3">
          <router-link to="/demo" class="flex items-center text-gray-600 hover:text-gray-800 transition-all duration-500">
            <span class="mr-3 font-bold text-sm uppercase tracking-wide">Demo</span>
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="arrow-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block w-4">
              <g>
                <path fill="currentColor" d="M24 215h286.4l41.6 41-41.59 41H24c-13.3 0-24-11-24-24.63v-32.82A24.22 24.22 0 0 1 24 215z" class="opacity-50"></path>
                <path fill="currentColor" d="M246.31 38.52c.24.23.48.47.71.71L441 238.56a25 25 0 0 1 0 34.78L247 472.77a23.38 23.38 0 0 1-33.11.7c-.24-.22-.47-.46-.7-.7L191.06 450a25.13 25.13 0 0 1 .4-35.18L352.19 256 191.46 97.2a24.94 24.94 0 0 1-.4-35.18l22.15-22.78a23.38 23.38 0 0 1 33.1-.72z"></path>
              </g>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
