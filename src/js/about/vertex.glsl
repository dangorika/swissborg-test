#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: rotateZ = require(glsl-y-rotate/rotateZ)
#pragma glslify: cnoise = require(../lib/noise.glsl)

uniform float time;
varying vec2 vUv;
varying vec2 vUv1;
varying vec3 vPosition;
varying vec2 vNormal;
varying vec3 e;
varying vec3 n;
varying float distanceFactor;


uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D threemounts;
uniform vec2 pixels;
uniform vec2 uvRate1;

uniform vec3 vCameraPosition;


attribute vec3 instancePosition;
attribute float instanceOffset;
attribute float instanceOrder;

void main() {
  vUv = uv;
  float distanceCoefficient = 7.;
  // float distanceCoefficient = 6.5;
  float makebottomflat = step(0., position.y);


  vec4 hm1 = makebottomflat*texture2D(threemounts,vec2(uv.x,0.));
  vec4 hm2 = makebottomflat*texture2D(threemounts,vec2(uv.x,.5));
  vec4 hm3 = makebottomflat*texture2D(threemounts,vec2(uv.x,.9));
  // !!!this changes how fast colors goes off


  distanceFactor = distance(vCameraPosition.z,instancePosition.z)/distanceCoefficient;
  distanceFactor = smoothstep(0.,1.,distanceFactor);

  vec3 newposition = position + instancePosition - 0.5;
  if(distance(instanceOrder,0.)<0.3){
  	newposition.y += hm1.a*3. - 4.;
  }
  if(distance(instanceOrder,1.)<0.3){
  	newposition.y += hm2.a*3. - 3.3;
  }
  if(distance(instanceOrder,2.)<0.3){
  	newposition.y += hm3.a*6. - 2.;
  }

  if(instanceOrder>2.){
  	newposition.y +=  0.3*makebottomflat*cnoise(vec3(newposition.x,0.,3.*instanceOffset));
  }


  newposition.y =  distanceFactor*2.1 + newposition.y;
  // newposition.y =  distanceFactor*2.9 + newposition.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
}
