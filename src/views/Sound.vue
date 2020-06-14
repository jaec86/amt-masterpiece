<template>
  <div class="overflow-scroll scrolling-touch">
    <div class="container mx-auto">
      <div class="p-6" :style="{ minHeight: 'calc(100vh - 72px)' }">
        <h1>Sound Frequency</h1>
        <p>When a sound is produced it makes the molecules in the air vibrate. When these vibrations hit the human ear, the ear also vibrates with the same frequency, and finally the brain transforms the vibrations in the air into electrical signal that are interpreted as sound. The frequency refers to the number of times per second a sound wave cycle repeats. The wave patterns of the periodic functions of sine and cosine are normally used to represent these sound waves.</p>
        <p>The audio spectrum represents the range of frequencies that the average human can hear. Audio frequency is measured in hertz (Hz) units and the audible spectrum of an average human is 20Hz to 20,000Hz. This audio spectrum can be divided into seven different frequency bands, where each band can have a different effect on the total sound. The seven frequency bands are:</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">1.</span>Sub-bass: 20Hz to 60Hz</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">2.</span>Bass: 60Hz to 250Hz</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">3.</span>Lower Midrange: 250Hz to 500Hz</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">4.</span>Midrange: 500Hz to 2kHz</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">5.</span>Higher Midrange: 2kHz to 4kHz</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">6.</span>Presence: 4kHz to 6kHz</p>
        <p class="flex pl-6"><span style="min-width: 1.5rem">7.</span>Brilliance: 6kHz to 20kHz</p>
        <p>These ranges can be also be simplified, often on budget equipment or through basic software control. Sub-bass and Bass are grouped together as bass. It is possible to group the midranges together to be just midrange, or sometimes the midrange is left out, with only lower and higher midranges being referenced. The Presence and Brilliance ranges can be grouped together and just called Treble.</p>
        <br>
        <h2>Masterpiece Implementation</h2>
        With the web audio API is possible to extract the frequency data from an audio playing on real time. Using the frequency ranges described before the bands frequency can be isolated. The vertex shader now will include some new uniform variables that are passed from the main script. These new unforms are the bass, midrange and treble frequencies that are updated at every frame. Now the z index of the particles will be updated with the treble, midrange or bass frequency depending on the grayscale value.
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
<span class="text-gray-600">// vertex shader</span>
precision highp float;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 offset;
attribute float pindex;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uTextureSize;
uniform float uSize;
uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uBass;
uniform float uMid;
uniform float uTreble;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

float random(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main {
  vUv = uv;
  vPUv = offset.xy / uTextureSize;

  vec4 originalColor = texture2D(uTexture, vPUv);
  float gray = originalColor.r * 0.21 + originalColor.g * 0.71 + originalColor.b * 0.07;

  vec3 displaced = offset;
  displaced.xy += snoise2(vec2(displaced)) * 2.0;
  displaced.xy -= uTextureSize * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * uSize;

  float randomZ = random(pindex) + snoise2(vec2(pindex * 0.1, uTime * 0.1));
  displaced.z += randomZ * random(pindex) * 2.0 * uDepth;

  if (gray > 0.75) {
    displaced.z += uTreble * 100.0;
  } else if (gray > 0.4) {
    displaced.z += uMid * 100.0;
  } else {
    displaced.z += uBass * 100.0;
  }

  float pSize = snoise2(vec2(uTime, pindex) * 0.5) + 2.0;
  pSize *= max(gray, 0.2);
  pSize *= uSize;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * pSize;

  gl_Position = vec4(projectionMatrix * mvPosition);
}
          </code></pre>
        </p>
        <p>The final result of the masterpiece can be seen on the live demo in the next section. On the live demo section the movie poster and soundtrack can change bu clicking anywhere on the canvas.</p>
      </div>
      <div class="fixed top-0 left-0 w-full pointer-events-none" :style="{ height: 'calc(100vh - 72px)', boxShadow: 'inset 0 0 0.75rem 1rem #e2e8f0' }"></div>
      <div class="sticky bottom-0 flex justify-between items-center px-3 py-6 bg-gray-300">
        <div class="px-3 w-1/3">
          <router-link to="/noise" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
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
          <router-link to="/" class="text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="home-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="inline-block w-6">
              <g>
                <path fill="currentColor" d="M336 463.58v-95.64a16 16 0 0 0-16-16h-64a16 16 0 0 0-16 16v95.71a16 16 0 0 1-15.92 16l-112.08.29a16 16 0 0 1-16-16V300.05L280.39 148.2a12.19 12.19 0 0 1 15.3 0L480 299.94v164a16 16 0 0 1-16 16l-112-.31a16 16 0 0 1-16-16.05z" class="opacity-50"></path>
                <path fill="currentColor" d="M530.92 300.94L295.69 107.2a12.19 12.19 0 0 0-15.3 0L45.17 300.94a12 12 0 0 1-16.89-1.64l-25.5-31a12 12 0 0 1 1.61-16.89l253.1-208.47a48 48 0 0 1 61 0l253.13 208.47a12 12 0 0 1 1.66 16.89l-25.5 31a12 12 0 0 1-16.86 1.64z"></path>
              </g>
            </svg>
          </router-link>
        </div>
        <div class="flex flex-row-reverse px-3 w-1/3">
          <router-link to="/demo" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
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
