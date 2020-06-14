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

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = st - floor(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main() {
    vUv = uv;
    vPUv = offset.xy / uTextureSize;

    vec4 originalColor = texture2D(uTexture, vPUv);
    float gray = originalColor.r * 0.21 + originalColor.g * 0.71 + originalColor.b * 0.07;

    vec3 displaced = offset;
    displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
    displaced.xy -= uTextureSize * 0.5;

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