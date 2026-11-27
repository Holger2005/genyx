import { morphAmount, ringGeometry, renderSize } from "./sculpture-geometry";

const vertexSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform vec2 uAngles;
uniform float uAspect;
uniform float uScale;
uniform float uMorph;
varying vec3 vNormal;

vec3 rotate(vec3 p) {
  float c = cos(uAngles.x);
  float s = sin(uAngles.x);
  p = vec3(p.x, c*p.y-s*p.z, s*p.y+c*p.z);
  c = cos(uAngles.y);
  s = sin(uAngles.y);
  return vec3(c*p.x+s*p.z, p.y, -s*p.x+c*p.z);
}

void main() {
  float angle = atan(aPosition.y, aPosition.x);
  float sector = mod(angle + 0.5235988, 1.0471976) - 0.5235988;
  float polygon = 0.8660254 / cos(sector);
  float shape = mix(1.0, polygon, uMorph);
  vec3 model = vec3(aPosition.xy * shape, aPosition.z * (1.0 + 0.25*uMorph));
  vec3 p = rotate(model * uScale);
  vNormal = rotate(aNormal);
  gl_Position = vec4(p.x*2.1/uAspect, p.y*2.1, -p.z*0.7, 3.4-p.z);
}
`;

const fragmentSource = `
precision mediump float;
varying vec3 vNormal;
uniform float uGlass;
uniform vec2 uLight;

void main() {
  vec3 n = normalize(vNormal);
  vec3 light = normalize(vec3(-0.5 + uLight.x*0.55, 0.8 - uLight.y*0.45, 0.7));
  float fill = max(dot(n, normalize(vec3(0.7,-0.3,0.5))),0.0);
  float diffuse = max(dot(n, light), 0.0);
  float reflection = abs(n.x*0.7+n.y*0.3);
  float edge = pow(1.0-abs(n.z), 3.0);
  float band = pow(0.5+0.5*cos(reflection*17.0), 5.0);
  float specular = pow(max(dot(n, normalize(light+vec3(0.0,0.0,1.0))),0.0),24.0);
  float rim = pow(1.0-abs(n.z), 2.0);
  float metal = 0.09 + diffuse*0.38 + band*0.30 + specular*0.45 + edge*0.12 + fill*0.10;
  float crystal = 0.22 + diffuse*0.20 + rim*0.45 + specular*0.5 + fill*0.10;
  float value = clamp(mix(metal, crystal, uGlass), 0.0, 1.0);
  gl_FragColor = vec4(vec3(value), mix(1.0, 0.32+rim*0.5, uGlass));
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

export function createSculptureRenderer(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: true,
  });
  if (!context) return null;
  const gl = context;

  const vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();

  function dispose() {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
  }

  if (!vertex || !fragment || !program || !buffer) {
    dispose();
    return null;
  }

  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }

  const position = gl.getAttribLocation(program, "aPosition");
  const normal = gl.getAttribLocation(program, "aNormal");
  if (position < 0 || normal < 0) {
    dispose();
    return null;
  }

  const angles = gl.getUniformLocation(program, "uAngles");
  const aspect = gl.getUniformLocation(program, "uAspect");
  const scale = gl.getUniformLocation(program, "uScale");
  const glass = gl.getUniformLocation(program, "uGlass");
  const morph = gl.getUniformLocation(program, "uMorph");
  const light = gl.getUniformLocation(program, "uLight");
  const mesh = ringGeometry(24, 8, 1, 0.16);

  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(position);
  gl.enableVertexAttribArray(normal);
  gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 24, 0);
  gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 24, 12);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 0);

  function draw(x: number, y: number, scroll: number) {
    if (gl.isContextLost()) return false;
    const size = renderSize(canvas.clientWidth, canvas.clientHeight, window.devicePixelRatio);
    if (canvas.width !== size.width) canvas.width = size.width;
    if (canvas.height !== size.height) canvas.height = size.height;
    gl.viewport(0, 0, size.width, size.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(aspect, size.width / size.height);
    const deformation = morphAmount(scroll);
    gl.uniform2f(light, x, y);
    gl.disable(gl.BLEND);
    gl.depthMask(true);

    gl.uniform2f(angles, 0.55 + y * 0.35 + scroll, 0.45 + x * 0.45);
    gl.uniform1f(scale, 1);
    gl.uniform1f(morph, deformation);
    gl.uniform1f(glass, 0);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 6);

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);
    gl.uniform2f(angles, 1.35 + y * 0.3, -0.65 + x * 0.45 - scroll);
    gl.uniform1f(scale, 0.84);
    gl.uniform1f(morph, deformation * 0.85);
    gl.uniform1f(glass, 1);
    gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 6);
    gl.depthMask(true);
    return true;
  }

  return { draw, dispose };
}
