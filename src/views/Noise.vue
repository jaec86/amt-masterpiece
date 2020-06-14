<template>
  <div class="overflow-scroll scrolling-touch">
    <div class="container mx-auto">
      <div class="p-6" :style="{ minHeight: 'calc(100vh - 72px)' }">
        <h1>Perlin Noise</h1>
        <p>The world have a certain unpredictability in its textures and motions, generally referred as randomness. But randomness is quite chaotic, while nature have an organic flow. This was elegantly solved by Ken Perlin during the production of the original Tron movie while trying to produce more realistic textures. Perlin noise has a more organic appearance because it produces a naturally ordered and smooth sequence of pseudo-random numbers.</p>
        <p>The main idea behind Perlin noise is to get a normalized value, between <code>0.0</code> and <code>1.0.</code>, but taking into consideration the previous iteration. Like any regular random function a continuous floating number <code>x</code> is subdivided into its integer <code>i</code> and fractional <code>f</code> values. A regular random function will get a random value for the integer part of <code>x</code>, but Perlin noise interpolates each random value using the fractional <code>f</code> value.</p>
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
float noise(float x) {
  float i = floor(x); <span class="text-gray-600">// integer</span>
  float f = fract(x); <span class="text-gray-600">// fractional</span>
  return mix(rand(i), rand(i + 1.0), smoothstep(0.0, 1.0, f)); <span class="text-gray-600"> //  smooth interpolation</span>
}
          </code></pre>
        </p>
        <p>The function above is a linear implementation of the Perlin Noise algorithm. To get a 2D noise value, instead of interpolating between two points of a line, it interpolates the four corners that compose the area of a plane  like (<code>fract(st)</code>, <code>fract(st) + vec2(1.0, 0.0)</code>, <code>fract(st) + vec2(0.0, 1.0)</code> and <code>fract(st) + vec2(1.0, 1.0)</code>). The same goes for 3D, noise where it interpolates between the eight cornes of a cube. This technique is all about interpolating random values.</p>
        <p>
          <img src="images/3d_noise.png" alt="3D Interpolation" class="mx-auto">
        </p>
        <p>This algorithm was improved in 2001 by Perlin himself. Classic noise algorithm for N dimensions smoothly interpolates 2 to the N points. This means that for 2D and 3D it needs to interpolate 4 and 8 points, and this will increase exponentially. But Perlin noticed that instead of using a square to fill a space is more efficient to use an equilateral triangle, which is the simplest 2D shape. The squared grid is replaced by the simplex grid of equillateral triangles, which means that for N dimensions only N + 1 corners are computed. But when dividing a square by two triangles, the resulting triangles are not equilateral but isosceles, so the grid is skewed until every triangle is equilateral.</p>
        <p>
          <img src="images/simplex_grid.png" alt="Simplex Grid" class="mx-auto" />
        </p>
        <br>
        <h2>Masterpiece Implementation</h2>
        <p>In the vertex shader the <code>x</code> and <code>y</code> coordinates are updated to include some noise, making the particles move slightly from its original position. The <code>z</code> coordinate is also updated with some 2D noise but instead using the time. Manipulating slightly the <code>z</code> value with the grayscale value of the pixel will also give the illusion of scaling of the particle size. <a href="https://github.com/glslify/glslify" target="_blank">Glslify</a> library is used to import the simplex 2D noise function into the shaders.</p>
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

  float pSize = snoise2(vec2(uTime, pindex) * 0.5) + 2.0;
  pSize *= max(gray, 0.2);
  pSize *= uSize;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * pSize;

  gl_Position = vec4(projectionMatrix * mvPosition);
}
          </code></pre>
        </p>
        <p>Because the size of the particle is set on the vertex shader it can be removed from the fragment shader now. To get a more interesting result, the shape of the circle can include some noise. This will result in a dynamic shape of the particle. The function used is a modified version of one of the examples from the <a href="https://thebookofshaders.com/" target="_blank">Book of Shaders</a>.</p>
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
<span class="text-gray-600">// fragment shader</span>
precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

float noiseCircle (vec2 st, float radius) {
  st = vec2(0.5) - st;

  float r = length(st) * 2.0;
  float a = atan(st.y, st.x);
  float m = abs(mod(a + uTime * 2.0, 3.14 * 2.0) - 3.14) / 3.6;
  float f = radius;

  m += snoise2(st + uTime * 0.1) * 0.5;
  f += sin(a * 50.0) * snoise2(st + uTime * 0.2) * 0.1;
  f += (sin(a * 20.0) * 0.1 * pow(m, 2.0));

  return 1.0 - smoothstep(f, f + 0.007, r);
}

void main {
  vec4 originalColor = texture2D(uTexture, vPUv);
  float gray = originalColor.r * 0.21 + originalColor.g * 0.71 + originalColor.b * 0.07;

  float alpha = noiseCircle(vUv, 0.6);

  gl_FragColor = vec4(vec3(gray), alpha);
}
          </code></pre>
        </p>
        <p class="flex items-center mx-auto max-w-screen-lg">
          <img src="images/result3_1.jpg" class="mx-auto w-1/2" />
          <img src="images/result3-2.jpg" class="mx-auto w-1/2" />
        </p>
        <p>Above the image on the left side is the result of applying noise in the coordinates of the particles, including the size. On the right side is the result of applying noise to the circle shape of the particle. In the next section some more motion will be included based on the audio frequency.</p>
      </div>
      <div class="fixed top-0 left-0 w-full pointer-events-none" :style="{ height: 'calc(100vh - 72px)', boxShadow: 'inset 0 0 0.75rem 1rem #e2e8f0' }"></div>
      <div class="sticky bottom-0 flex justify-between items-center px-3 py-6 bg-gray-300">
        <div class="px-3 w-1/3">
          <router-link to="/halftone" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block w-4">
              <g>
                <path fill="currentColor" d="M424 297H137.6L96 256l41.59-41H424c13.3 0 24 11 24 24.63v32.82A24.22 24.22 0 0 1 424 297z" class="opacity-50"></path>
                <path fill="currentColor" d="M201.69 473.48l-.71-.71L7 273.44a25 25 0 0 1 0-34.78L201 39.23a23.38 23.38 0 0 1 33.11-.7c.24.22.47.46.7.7L256.94 62a25.13 25.13 0 0 1-.4 35.18L95.81 256l160.73 158.8a24.94 24.94 0 0 1 .4 35.18l-22.15 22.78a23.38 23.38 0 0 1-33.1.72z"></path>
              </g>
            </svg>
            <span class="ml-3 font-bold text-sm uppercase tracking-wide">Halftone</span>
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
          <router-link to="/sound" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
            <span class="mr-3 font-bold text-sm uppercase tracking-wide">Sound</span>
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
