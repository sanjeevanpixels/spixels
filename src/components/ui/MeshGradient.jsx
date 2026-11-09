import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from 'motion/react';

const vertexSource = `
  attribute vec2 a_position;
  void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const fragmentSource = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform float u_time;
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  void main() {
    vec2 uv = gl_FragCoord.xy / max(u_resolution, vec2(1.0));
    float t = u_time * 0.035;
    vec2 p1 = vec2(0.22 + sin(t) * 0.08, 0.72 + cos(t * 0.8) * 0.08);
    vec2 p2 = vec2(0.78 + cos(t * 0.72) * 0.08, 0.30 + sin(t * 0.65) * 0.08);
    vec2 p3 = vec2(0.52 + sin(t * 0.46) * 0.12, 0.58 + cos(t * 0.52) * 0.12);
    float a = exp(-length((uv - p1) * vec2(1.0, 1.45)) * 3.4);
    float b = exp(-length((uv - p2) * vec2(1.0, 1.45)) * 3.2);
    float c = exp(-length((uv - p3) * vec2(1.0, 1.45)) * 3.8);
    vec3 color = vec3(0.035, 0.040, 0.085);
    color += vec3(0.16, 0.12, 0.42) * a;
    color += vec3(0.10, 0.24, 0.39) * b;
    color += vec3(0.31, 0.12, 0.34) * c;
    float dither = (hash(gl_FragCoord.xy + u_time) - 0.5) * (2.0 / 255.0);
    color = clamp(color + dither, 0.0, 1.0);
    gl_FragColor = vec4(color, 0.88);
  }
`;

function shader(gl, type, source) {
  const value = gl.createShader(type);
  if (!value) return null;
  gl.shaderSource(value, source);
  gl.compileShader(value);
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    gl.deleteShader(value);
    return null;
  }
  return value;
}

export default function MeshGradient() {
  const canvasRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return undefined;
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' });
    if (!gl) return undefined;

    const vertex = shader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragment = shader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return undefined;
    }
    const program = gl.createProgram();
    if (!program) {
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return undefined;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return undefined;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(program);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const time = gl.getUniformLocation(program, 'u_time');
    const clock = { value: 0 };

    const render = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * ratio));
      const height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolution, width, height);
      }
      gl.uniform1f(time, clock.value);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(render);
    if (resizeObserver) resizeObserver.observe(canvas);
    else window.addEventListener('resize', render);
    render();
    let inViewport = !('IntersectionObserver' in window);
    const animation = gsap.to(clock, { value: 100, duration: 180, ease: 'none', repeat: -1, onUpdate: render, paused: true });
    const updatePlayback = () => {
      if (inViewport && document.visibilityState === 'visible') animation.play();
      else animation.pause();
    };
    const visibilityObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => { inViewport = entry.isIntersecting; updatePlayback(); }, { threshold: 0.01 })
      : null;
    visibilityObserver?.observe(canvas);
    document.addEventListener('visibilitychange', updatePlayback);
    updatePlayback();
    return () => {
      animation.kill();
      visibilityObserver?.disconnect();
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener('resize', render);
      document.removeEventListener('visibilitychange', updatePlayback);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, [reduceMotion]);

  return <><div aria-hidden="true" className="testimonial-mesh-fallback absolute inset-0" /><canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-90" /></>;
}
