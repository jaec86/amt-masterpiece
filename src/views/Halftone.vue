<template>
  <div class="overflow-scroll scrolling-touch">
    <div class="container mx-auto">
      <div class="main">
        <h1>Halftone Pattern</h1>
        <p>A halftone pattern is an image formed with discrete dots rather than continuous tones. When viewed from a distance, the dots blur together, creating the illusion of continuous lines and shapes. This pattern creates some white space between dots, making it more efficient to render. Because of this halftone pattern is comonly used as printing technique as it results in less ink used. Like any image the quality will depend heavely in its resolution, so the higher the resolution the more details the resulting image will have.</p>
        <p>
          <img src="/images/halftone_color.png" alt="Halftone Color Example" class="mx-auto max-w-sm" />
        </p>
        <p>Usually to print a full color halftone pattern the size of the dots varies depending on the red, green, blue and black values. The image above is an example of how a full color halftone pattern can be obtained. For the masterpiece instead of using the full color of a pixel, the grayscale value will be used. The brighter the pixel is, the larger the particle is.</p>
        <p>There are three common methods to compute the grayscale value: lightness, average and luminosity. The three methods produce a very similar result, even though the luminosity method is proven to work best overall, so this will be the method used in the masterpiece. The formula for the luminosity method is <code>0.21R + 0.72G + 0.07B</code>.</p>
        <br>
        <h2>Masterpiece Implementation</h2>
        <p>To implement a halftone pattern to the particle system only the fragment shader needs to be updated. The first thing to do is get the grayscale value of the pixel based on the texture position. Then instead of assigning the color of the pixel, a new color is set with the green, red, and blue value set as the grayscale. Finally the alpha value of this new color will be also based on the distance from the center, but this time the radius will be <code>0.5*gray</code>.</p>
        <p>
          <pre class="px-6 rounded bg-gray-800 text-sm text-gray-100 overflow-x-scroll scrolling-touch"><code>
<span class="text-gray-600">// fragment shader</span>
precision highp float;

uniform sampler2D uTexture;

varying vec2 vPUv;
varying vec2 vUv;

void main {
  vec4 originalColor = texture2D(uTexture, vPUv);
  float gray = originalColor.r * 0.21 + originalColor.g * 0.71 + originalColor.b * 0.07;

  float dist = 0.5 * gray - distance(vUv, vec2(0.5));
  float alpha = smoothstep(0.0, 0.3, dist);

  gl_FragColor = vec4(vec3(gray), alpha);
}
          </code></pre>
        </p>
        <div class="py-2">
          <img src="/images/result2.jpg" alt="Custom Shader Implementation" class="mx-auto" />
        </div>
        <p>The image above is the result of the updated shaders. The particle system is starting to look better but the spacing is not really taken into consideration, even though this was intended. In order to consider the spacing and add some motion to the particles Perlin Noise will be applied in the next section.</p>
      </div>
      <div class="main-shadow"></div>
      <div class="nav">
        <div class="px-3 w-1/3">
          <router-link to="/shaders" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
            <svg aria-hidden="true" focusable="false" data-prefix="fad" data-icon="arrow-left" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="inline-block w-4">
              <g>
                <path fill="currentColor" d="M424 297H137.6L96 256l41.59-41H424c13.3 0 24 11 24 24.63v32.82A24.22 24.22 0 0 1 424 297z" class="opacity-50"></path>
                <path fill="currentColor" d="M201.69 473.48l-.71-.71L7 273.44a25 25 0 0 1 0-34.78L201 39.23a23.38 23.38 0 0 1 33.11-.7c.24.22.47.46.7.7L256.94 62a25.13 25.13 0 0 1-.4 35.18L95.81 256l160.73 158.8a24.94 24.94 0 0 1 .4 35.18l-22.15 22.78a23.38 23.38 0 0 1-33.1.72z"></path>
              </g>
            </svg>
            <span class="ml-3 font-bold text-sm uppercase tracking-wide">Shaders</span>
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
          <router-link to="/noise" class="flex items-center text-gray-600 hover:text-gray-800 focus:text-gray-800 outline-none transition-all duration-500">
            <span class="mr-3 font-bold text-sm uppercase tracking-wide">Noise</span>
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
