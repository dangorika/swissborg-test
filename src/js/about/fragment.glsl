uniform float time;
uniform float progress;
uniform sampler2D texture;
uniform vec2 pixels;
uniform vec2 uvRate1;
uniform vec2 accel;

varying vec2 vUv;
varying vec2 vUv1;
varying vec3 e;
varying vec3 n;
varying float distanceFactor;

varying vec2 vNormal;
varying vec3 vPosition;


uniform sampler2D tMatCap;




void main()	{
	vec3 farColor = vec3(0.083, 0.157, 0.238);
    // vec3 closeColor = vec3(1.);
    vec3 closeColor = vec3(0.19, 0.24, 0.32);
	// vec3 closeColor = vec3(0.21, 0.26, 0.35);
    // vec3 closeColor = vec3(0.40, 0.49, 0.70);
	vec3 finalColor = mix(closeColor,farColor,distanceFactor);
	gl_FragColor = vec4( finalColor, 1. );
	// gl_FragColor = vec4( 1.,1.,1., 1. );
}
