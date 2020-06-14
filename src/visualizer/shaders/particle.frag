precision highp float;

uniform sampler2D uTexture;
uniform float uTime;

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
    f += sin(a * 50.0) * snoise2(st + uTime * 0.2)*.1;
    f += (sin(a * 20.0) * 0.1 * pow(m, 2.0));
    return 1.0 - smoothstep(f, f + 0.007, r);
}

void main() {
    vec4 originalColor = texture2D(uTexture, vPUv);
    float gray = originalColor.r * 0.21 + originalColor.g * 0.71 + originalColor.b * 0.07;

    float alpha = noiseCircle(vUv, 0.6);

    gl_FragColor = vec4(vec3(gray), alpha);
} 