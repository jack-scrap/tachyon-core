attribute vec3 pos;

uniform mat4 model;

void main() {
  gl_Position = model * vec4(pos * 0.1, 1.0);
}
