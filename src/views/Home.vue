<template>
  <div class="overflow-scroll scrolling-touch">
    <div class="container mx-auto lg:max-w-screen-lg">
      <div class="main">
        <h1>AMT Masterpiece</h1>
        <p>This is the final project for the course <strong>Art, Mathemathics and Technology</strong>, which is part of the <strong>Interaction Technology</strong> master at the <strong>University of Twente</strong>. The main idea of this project is to use some of the concepts discussed during the course, combine them and create a final piece. The result piece is an audio visualizer based on several movie posters and their respective soundtrack, where the images are displayed with a dynamic particle system using a halftone pattern. Each particle will displace on the z-axis based on the sound frequency extracted from the soundtrack playing, while the x-axis and y-axis are defined by a noise pattern.</p>
        <p>This document also serves as a step-by-step guide for the final piece, providing a detailed explanation of the theory behind each topic. The sections of this document are as folows:</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">1.</span><router-link to="/shaders">WebGL Shaders</router-link></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">2.</span><router-link to="/halftone">Halftone Pattern</router-link></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">3.</span><router-link to="/noise">Perlin Noise</router-link></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">4.</span><router-link to="/sound">Sound Frequency</router-link></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">5.</span><router-link to="/demo">Live Demo</router-link></p>
        <br>
        <br>
        <br>
        <h2>References and Credits</h2>
        <p>Previous pieces developed during the past workshops of the course served as inspiration and are listed below:</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">1.</span><span>Gemotery: Texture Projection (<a href="https://jaec86.github.io/amt-workshop1/" target="_blank">demo</a> and <a href="https://github.com/jaec86/amt-workshop1" target="_blank">code</a>)</span></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">2.</span><span>Symmetry: Kaleidoscope (<a href="https://jaec86.github.io/amt-workshop2/" target="_blank">demo</a> and <a href="https://github.com/jaec86/amt-workshop2" target="_blank">code</a>)</span></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">3.</span><span>Rules and Pattern: Voronoi 3D Object (<a href="https://jaec86.github.io/amt-workshop3/" target="_blank">demo</a> and <a href="https://github.com/jaec86/amt-workshop3" target="_blank">code</a>)</span></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">4.</span><span>Motion: Verlet Integration Motion (<a href="https://jaec86.github.io/amt-workshop4/" target="_blank">demo</a> and <a href="https://github.com/jaec86/amt-workshop4" target="_blank">code</a>)</span></p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">5.</span><span>Sound: Generative Melodies and Webcam Audio Visualizer (<a href="https://jaec86.github.io/amt-workshop5/" target="_blank">demo</a> and <a href="https://github.com/jaec86/amt-workshop5" target="_blank">code</a>)</span></p>
        <p>This project uses a javascript package called <a href="https://threejs.org/" target="_blank" class="font-bold">Three.js</a>, which simplifies the manipulation of 2D and 3D graphics on a web browser. Also the website is developed with a frontend framework called <a href="https://vuejs.org/" target="_blank" class="font-bold">Vue.js</a> and a CSS utility-first framework called <a href="https://tailwindcss.com/" target="_blank" class="font-bold">Tailwind</a>.</p>
      </div>
      <div class="main-shadow"></div>
      <div class="nav">
        <div class="px-3 w-1/3"></div>
        <div class="px-3 w-1/3 text-center">
          <router-link to="/" class="text-gray-600">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="home-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="inline-block w-6">
              <g>
                <path fill="currentColor" d="M336 463.58v-95.64a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v95.71a16 16 0 0 1-15.92 16l-112.08.29a16 16 0 0 1-16-16V300.05L280.39 148.2a12.19 12.19 0 0 1 15.3 0L480 299.94v164a16 16 0 0 1-16 16l-112-.31a16 16 0 0 1-16-16.05z" class="opacity-50"></path>
                <path fill="currentColor" d="M530.92 300.94L295.69 107.2a12.19 12.19 0 0 0-15.3 0L45.17 300.94a12 12 0 0 1-16.89-1.64l-25.5-31a12 12 0 0 1 1.61-16.89l253.1-208.47a48 48 0 0 1 61 0l253.13 208.47a12 12 0 0 1 1.66 16.89l-25.5 31a12 12 0 0 1-16.86 1.64z"></path>
              </g>
            </svg>
          </router-link>
        </div>
        <div class="flex flex-row-reverse px-3 w-1/3">
          <router-link to="/shaders" class="flex items-center text-gray-600">
            <span class="mr-3 font-bold text-sm uppercase tracking-wide">Shaders</span>
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
