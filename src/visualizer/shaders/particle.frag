precision highp float;

uniform sampler2D uTexture;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

varying vec2 vPUv;
varying vec2 vUv;

void main() {
    // vec4 color = vec4(0.0);
    // vec2 uv = vUv;
    // vec2 puv = vPUv;

    // vec4 colA = texture2D(uTexture, puv);

    // float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
    // vec4 colB = vec4(grey, grey, grey, 1.0);

    // float border = 0.3;
    // float radius = 0.5;
    // float dist = radius - distance(uv, vec2(0.5));
    // float t = smoothstep(0.0, border, dist);

    // color = colB;
    // color.a = t;

    // gl_FragColor = color;

    vec4 colA = texture2D(uTexture, vPUv);
    float dist = 0.5 - distance(vUv, vec2(0.5));
    colA.a = smoothstep(0.0, 0.3, dist);
    gl_FragColor = colA;
} 