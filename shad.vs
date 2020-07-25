attribute vec2 pos;

uniform mat4 model;

void main() {
  gl_Position = model * vec4(vec3(pos, 0.0) * 0.1, 1.0);
}
