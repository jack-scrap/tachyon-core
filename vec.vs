#version 300 es

precision mediump float;

uniform mat4 model;
uniform vec2 loc;

in vec2 pos;

void main() {
  gl_Position = model * vec4(vec3(pos + ((fract(loc) * vec2(4)) + vec2(0, -2)), 0.0) * 0.1, 1.0);
}
