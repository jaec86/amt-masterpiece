<template>
  <div>
    <div class="container mx-auto lg:max-w-screen-lg">
      <div class="main">
        <h1>WebGL</h1>
        <p>Usually using vector tools like Illustrator or even paper and pencil, the drawing process starts by tracing a series of dots, lines and shapes until the desire image is composed. This is a linear process where every task is done after another, and doing it this way on a computer may require some heavy processing power. This is not optimal for an application running on a browser and because of this WebGL (Web Graphics Library) was created, which is a rasterization engine for Javascript to compose and manipulate 2D and 3D graphics.</p>
        <p>What sets WebGL apart from common drawing tools is that every pixel is drawn at the same time in parallel using threads. In the <a href="https://thebookofshaders.com" target="_blank">Book of Shaders</a> the CPU process in a computer is described as a factory line where every task pass through a pipe and is done in a sequence. On the other hand WebGL is desdribed as set of pipes, known as threads, to process every pixel in parallel. This is very convenient because the function to draw each pixel can increase its complexity without affecting its performance and this is know as GPU (Graphic Processor Unit).</p>
        <div class="flex items-center mx-auto py-2 w-full max-w-screen-md">
          <div>
            <img src="/images/cpu_pipe.png" alt="Book of Shaders CPU" />
            <div class="font-bold text-xs uppercase tracking-wider text-center">CPU</div>
          </div>
          <div>
            <img src="/images/gpu_pipes.png" alt="Book of Shaders GPU" />
            <div class="font-bold text-xs uppercase tracking-wider text-center">GPU</div>
          </div>
        </div>
        <p>Every thread in the GPU is independent, which means they are blind to what the other threads are doing and when they are reused they are not aware of what they were doing before. The GPU needs two functions to render a pixel known as vertex and fragment shaders and they are written in a strong typed C/C++ like language. The shaders can receive read only variables called attributes and uniforms, which can be passed from the buffer and the main script respectively to the shaders but they cannot be modified. The vertex shader can also share data with the fragment shader with varying variables and they can be modified. Most of the variables in the shaders, such as coordinates and colors, are normalized which means they go from <code>0.0</code> to <code>1.0</code>.</p>
        <br>
        <h2>Vertex Shader</h2>
        <p>The vertex shader is a piece of code that handles the vertex position of a pixel. The main goal of a vertex shader is to set the position of a pixel in a coordinate system. Below is the basic structure of a vertex shader.</p>
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
<span class="text-gray-600">// level of rendering precision</span>
precision highp float;

<span class="text-gray-600">// an attribute will receive data from a buffer</span>
attribute vec4 aPosition;

<span class="text-gray-600">// an uniform will receive data from main script</span>
uniform float uTime;

<span class="text-gray-600">// a varying will be shared with the fragment shader</span>
varying vec4 vColor;

<span class="text-gray-600">// all shaders have a main function</span>
void main {
  <span class="text-gray-600">// gl_Color is the primary color of the vertex</span>
  vColor = gl_Color;

  <span class="text-gray-600">// gl_Position sets the position of the vertex</span>
  gl_Position = aPosition;
}
          </code></pre>
        </p>
        <br>
        <h2>Fragment Shader</h2>
        <p>A mesh is formed by multiple triangles, and the surface of each triangle is called fragment. The fragment shader is a piece of code that sets the color of every pixel in each fragment. Below is the basic structure of a fragment shader.</p>
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
<span class="text-gray-600">// level of rendering precision</span>
precision highp float;

<span class="text-gray-600">// an uniform will receive data from main script</span>
uniform float uTime;

<span class="text-gray-600">// a varying will be shared with the fragment shader</span>
varying vec4 vColor;

<span class="text-gray-600">// all shaders have a main function</span>
void main {
  <span class="text-gray-600">// gl_FragColor sets the color of the fragment</span>
  gl_FragColor = vColor;
}
          </code></pre>
        </p>
        <br>
        <h2>Masterpiece Implementation</h2>
        <p>The first step of the masterpiece is to build a particle system based on the pixel data of an image, where every particle will have a circle shape. In order to achieve this particle system a Javascript library will be used called <a href="https://threejs.org/" target="_blank" class="font-bold">Three.js</a>, which provides an API that simplifies graphic manipulation. Basically the particle system is a shader composed of multiple shaders but instead of creating a particle for every pixel, a single instanced shader will be created and rendered as many times is needed.</p>
        <p>The vertex shader will receive the UVs, which are markers to map which pixels on the texture corresponds to which vertex. The texture will be the image itself and its size is passed to the shader as uniform. The modelViewMatrix and projectionMatrix are uniforms created by Three, which are useful for transformations. The product of the position, modelViewMatrix and projectionMatrix will position the pixel in the correct perspective.</p>
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
precision highp float;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 offset;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform vec2 uTextureSize;
uniform float uSize;

varying vec2 vPUv;
varying vec2 vUv;

void main {
  vUv = uv;

  vPUv = offset.xy / uTextureSize;

  vec3 displaced = offset;
  displaced.xy -= uTextureSize * 0.5;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * uSize;

  gl_Position = vec4(projectionMatrix * mvPosition);
}
          </code></pre>
        </p>
        <p>The fragment shader will receive the image as uniform and the position and UVs as varying variables from the vertex shader. The color of the pixel is extracted from the texture and position . To make the circle shape the the alpha value of the color will be <code>0</code> (making it transparent) if the distance of the pixel from the center is greater than <code>0.5</code>.</p>
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

void main {
  vec4 colA = texture2D(uTexture, vPUv);

  float dist = 0.5 - distance(vUv, vec2(0.5));

  colA.a = smoothstep(0.0, 0.3, dist);

  gl_FragColor = colA;
}
          </code></pre>
        </p>
        <div class="py-2">
          <img src="/images/result1.jpg" alt="Custom Shader Implementation" class="mx-auto" />
        </div>
        <p>The image above is an example of the resulting canvas displayed. For now the circle shape of the particles is barely visible but this will be fixed applying a halftone pattern in the next section.</p>
      </div>
      <div class="main-shadow"></div>
      <div class="nav">
        <div class="px-3 w-1/3">
          <router-link to="/" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block w-4">
              <g>
                <path fill="currentColor" d="M424 297H137.6L96 256l41.59-41H424c13.3 0 24 11 24 24.63v32.82A24.22 24.22 0 0 1 424 297z" class="opacity-50"></path>
                <path fill="currentColor" d="M201.69 473.48l-.71-.71L7 273.44a25 25 0 0 1 0-34.78L201 39.23a23.38 23.38 0 0 1 33.11-.7c.24.22.47.46.7.7L256.94 62a25.13 25.13 0 0 1-.4 35.18L95.81 256l160.73 158.8a24.94 24.94 0 0 1 .4 35.18l-22.15 22.78a23.38 23.38 0 0 1-33.1.72z"></path>
              </g>
            </svg>
            <span class="ml-3 font-bold text-sm uppercase tracking-wide">Home</span>
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
          <router-link to="/halftone" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
            <span class="mr-3 font-bold text-sm uppercase tracking-wide">Halftone</span>
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