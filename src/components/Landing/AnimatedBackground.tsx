import type p5 from 'p5'
import Sketch from 'react-p5'

const vectorShader = `
attribute vec3 aPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}`

const fragmentShader = `
#ifdef GL_ES
precision highp float;
#endif

uniform float uTime;
uniform float uSpeedColor;
uniform vec2 uResolution;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
uniform vec3 uColor5;

const int AMOUNT = 2;
const float scale = 2.0;

vec3 blendExclusion(vec3 base, vec3 blend) {
    return base + blend - 2.0 * base * blend;
}

vec3 blendExclusion(vec3 base, vec3 blend, float opacity) {
    return (blendExclusion(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLighten(float base, float blend) {
    return max(blend, base);
}

vec3 blendLighten(vec3 base, vec3 blend) {
    return vec3(blendLighten(base.r, blend.r), blendLighten(base.g, blend.g), blendLighten(base.b, blend.b));
}

vec3 blendLighten(vec3 base, vec3 blend, float opacity) {
    return (blendLighten(base, blend) * opacity + base * (1.0 - opacity));
}

float blendDarken(float base, float blend) {
    return min(blend, base);
}

vec3 blendDarken(vec3 base, vec3 blend) {
    return vec3(blendDarken(base.r, blend.r), blendDarken(base.g, blend.g), blendDarken(base.b, blend.b));
}

vec3 blendDarken(vec3 base, vec3 blend, float opacity) {
    return (blendDarken(base, blend) * opacity + base * (1.0 - opacity));
}

float blendPinLight(float base, float blend) {
    return (blend < 0.5) ? blendDarken(base, (2.0 * blend)) : blendLighten(base, (2.0 * (blend - 0.5)));
}

vec3 blendPinLight(vec3 base, vec3 blend) {
    return vec3(blendPinLight(base.r, blend.r), blendPinLight(base.g, blend.g), blendPinLight(base.b, blend.b));
}

vec3 blendPinLight(vec3 base, vec3 blend, float opacity) {
    return (blendPinLight(base, blend) * opacity + base * (1.0 - opacity));
}


float blendOverlay(float base, float blend) {
    return base < 0.5?(2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend));
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}

vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
    return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLinearDodge(float base, float blend) {
    // Same implementation as BlendAddf
    return min(base + blend, 1.0);
}

vec3 blendLinearDodge(vec3 base, vec3 blend) {
    // Same implementation as BlendAdd
    return min(base + blend, vec3(1.0));
}

vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
    return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
}


float blendLinearBurn(float base, float blend) {
    // Same implementation as BlendSubtractf
    return max(base + blend - 1.0, 0.0);
}

vec3 blendLinearBurn(vec3 base, vec3 blend) {
    // Same implementation as BlendSubtract
    return max(base + blend - vec3(1.0), vec3(0.0));
}

vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
    return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
}

float blendLinearLight(float base, float blend) {
    return blend < 0.5 ? blendLinearBurn(base, (2.0 * blend)) : blendLinearDodge(base, (2.0 * (blend - 0.5)));
}

vec3 blendLinearLight(vec3 base, vec3 blend) {
    return vec3(blendLinearLight(base.r, blend.r), blendLinearLight(base.g, blend.g), blendLinearLight(base.b, blend.b));
}

vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
    return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
}


float blendScreen(float base, float blend) {
    return 1.0 - ((1.0 - base) * (1.0 - blend));
}

vec3 blendScreen(vec3 base, vec3 blend) {
    return vec3(blendScreen(base.r, blend.r), blendScreen(base.g, blend.g), blendScreen(base.b, blend.b));
}

vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
    return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
}

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float createLen() {
  float time = 10.0 + uTime / 1.0;

  vec2 coord = scale * (gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x);

  float len;
  for(int i = 0; i < AMOUNT; i++) {
    len = length(vec2(coord.x, coord.y));

    coord.x = coord.x + cos(coord.y - sin(len)) - cos(time / 9.1);
    coord.y = coord.y + sin(coord.y + cos(len)) + sin(time / 12.0);
  }

  return len;
}

float createLen2(float x,  float y, float speed, float offset) {
  float time = offset + uTime / speed;

  vec2 coord =  scale * (gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x);

  float len;

  for(int i = 0; i < AMOUNT; i++) {
    len = length(vec2(coord.x, coord.y));
    coord.x = coord.x + sin(coord.y + cos(len) * cos(len)) + sin(time / x);
    coord.y = coord.y - cos(coord.y + sin(len) * sin(len)) + cos(time / y);
  }

  return len;
}

float createLen3(float x,  float y, float speed, float offset) {
  float time = offset + uTime / speed;

  vec2 coord = scale * (gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x);

  float len;

  for(int i = 0; i < AMOUNT; i++) {
    len = length(vec2(coord.x, coord.y));

    coord.y = coord.y + sin(coord.y + cos(len)) + sin(time / y);
  }

  return len;
}

float createLen4(float x,  float y, float speed, float offset) {
  float time = offset + uTime / speed;

  vec2 coord = scale * (gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x);

  float len;

  for(int i = 0; i < AMOUNT; i++) {
    len = length(vec2(coord.x, coord.y));

    coord.x = coord.x - cos(coord.y + sin(len)) + cos(time / x);
  }

  return len;
}

vec3 createCircle(vec2 position, vec3 color, float size, float blur) {
  vec2 pos = (gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x) - position;
  float circle = sqrt(pow(pos.x, 3.0) + pow(pos.y, 2.0));
  circle = smoothstep(size, size + blur, 1.0 - circle);
  return color * circle;
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 coord = scale * (gl_FragCoord.xy - uResolution.xy) / min(uResolution.y, uResolution.x);

  float len = createLen();
  float len2 = createLen2(10.0, 10.0, 8.0, 20.0);
  float len3 = createLen3(2.0, 2.0, 10.0, 30.0);
  float len4 = createLen4(5.0, 20.0, 5.0, 40.0);

  vec3 blue = uColor1 + cos(len) * 0.25 + 0.25;

  vec3 turquoise = uColor2 + cos(len2) * 0.5 + 0.75;

  vec3 pink = uColor3 + cos(len3) * 0.5 + 0.75;
  vec3 peach = uColor4 + cos(len4) * 0.75 + 0.95;

  float pinkValue = min(1.0, max(0.0, 1.2 - (pink[0] / 1.2)));

  float peachValue = min(1.0, max(0.0, 1.5 - (peach[0] / 1.2)));

  float turquoiseValue = min(1.0, max(0.0, 1.5 - (turquoise[2] / 1.1)));

  vec3 blend = blue;
  blend = mix(blend, turquoise, turquoiseValue);
  blend = mix(blend, peach, peachValue);
  blend = mix(blend, pink, pinkValue);

  vec3 lightercolor = blendLinearBurn(blend, peach);
  blend = mix(blend, lightercolor, max(1.0 - lightercolor[0], 0.0));

  blend = blendOverlay(blend, vec3(0.0, 0.0, 0.0));

  vec3 color = blend;

  float r = color[0];
  float g = color[1];
  float b = color[2];

  vec3 hsb = rgb2hsv(vec3(r, g, b));
  hsb[1] -= rand(coord) * 0.15;
  vec3 rgb = hsv2rgb(hsb);

  gl_FragColor = vec4(rgb, 1.0);
}`

const hex2rgb = (hex: string): [number, number, number] => {
	const r = parseInt(hex.slice(1, 3), 16)
	const g = parseInt(hex.slice(3, 5), 16)
	const b = parseInt(hex.slice(5, 7), 16)

	return [r / 255, g / 255, b / 255]
}

let s
let frameDelta = 0
let frameCount = 0
const totalFrames = 1000
const backgroundColor = '#8e7cc3'
const colors = ['#225ee1', '#28d7bf', '#ac53cf', '#e7a39c']

const AnimatedBackground = ({ className = '' }) => {
	const setup = (p: p5, canvasParentRef: Element) => {
		p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL).parent(canvasParentRef)
		p.noiseSeed(20)
		p.rectMode(p.CENTER)
		p.noStroke()
		s = p.createShader(vectorShader, fragmentShader)
	}

	const windowResize = (p: p5) => {
		p.resizeCanvas(p.windowWidth, p.windowHeight, true)
	}

	const draw = (p: p5) => {
		frameCount += 1
		frameDelta = (2 * Math.PI * (frameCount % totalFrames)) / totalFrames

		p.background(backgroundColor)
		p.shader(s)

		s.setUniform('uResolution', [p.windowWidth, p.windowHeight])
		s.setUniform('uTime', p.millis() / 100)
		s.setUniform('uLowGpu', false)
		s.setUniform('uVeryLowGpu', false)

		s.setUniform('uSpeedColor', 20.0)

		s.setUniform('uColor1', hex2rgb(colors[0]))
		s.setUniform('uColor2', hex2rgb(colors[1]))
		s.setUniform('uColor3', hex2rgb(colors[2]))
		s.setUniform('uColor4', hex2rgb(colors[3]))

		p.rect(0, 0, p.windowWidth, p.windowHeight)
	}

	return <Sketch draw={draw} setup={setup} className={className} windowResized={windowResize} />
}

export default AnimatedBackground
