precision highp float;

attribute float pindex;
attribute vec3 position;
attribute vec3 offset;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform float uBass;
uniform float uMid;
uniform float uTreble;

varying vec2 vPUv;
varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

float random(float n) {
    return fract(sin(n) * 43758.5453123);
}

void main() {
    vUv = uv;

    vec2 puv = offset.xy / uTextureSize;
    vPUv = puv;

    vec4 colA = texture2D(uTexture, puv);

    float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

    vec3 displaced = offset;
    displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
    float rndz = (random(pindex) + snoise2(vec2(pindex * 0.1, uTime * 0.1)));
    displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
    displaced.xy -= uTextureSize * 0.5;

    if (grey > 0.75) {
        displaced.z += uTreble * 100.0;
    } else if (grey > 0.4) {
        displaced.z += uMid * 100.0;
    } else {
        displaced.z += uBass * 100.0;
    }

    float psize = (snoise2(vec2(uTime, pindex) * 0.5) + 2.0);
    psize *= max(grey, 0.2);
    psize *= uSize;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    mvPosition.xyz += position * psize;
    vec4 finalPosition = projectionMatrix * mvPosition;

    gl_Position = finalPosition;
}