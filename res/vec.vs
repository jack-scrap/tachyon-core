#version 300 es

precision mediump float;

uniform mat4 model;

in vec2 pos;

void main() {
  gl_Position = model * vec4(vec3(pos * 0.5, 0.0) * 0.1, 1.0);
}
