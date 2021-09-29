import * as THREE from 'three';
import PubSub from 'pubsub-js';
import {TimelineMax} from 'gsap';
import noise from './lib/perlin';
import throttleFunc from './lib/throttle.js';

var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './about/fragment.glsl';
import vertex from './about/vertex.glsl';
import Scroller from './about/scroller.js';
import {DOC, G} from './_globals';
import Header from './components/Header.js';
import './about/aboutSvgAnimations.js';
import {topLine, midLine, botLine} from './about/data200.js';
const {detect} = require('detect-browser');
const browser = detect();

import mountHeightMap from './about/getThreeMounts';



import * as dat from 'dat.gui';
let screensCount = $('.js-screen').length;
let mountCount = screensCount* 3;
let isTouch = is_touch_device();
mountCount = isTouch ? 20: mountCount;

let endSlideViewFactor = screensCount*2.2;

class Sketch {
  constructor(selector, mountCount) {
    this.renderer = new THREE.WebGLRenderer({ alpha: true } );
    this.renderer.setClearColor( 0x000000, 0 );


    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerWidth);

    this.container = document.getElementById('container');
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    let cameraFar = 1000;
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001, cameraFar
    );

    this.camera.position.set(0, 0.5, 3);
    this.camera.lookAt(0, 0, -1);
    // this.gui = new dat.GUI();
    // this.gui.add( this.camera.position , 'z', -40, 10, 1);
    // this.gui.add( this.camera.position , 'y', -10, 10, 0.1);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.gradientBgEl = $('.js-gradient-element');
    this.screensCount = screensCount;
    this.mountCount = mountCount;
    this.windowW = window.innerWidth;
    this.windowH = window.innerHeight;
    this.docH = $(document).height();
    this.init();
  }

  init() {
    this.resize();
    this.setupResize();
    this.addObjects();
    this.animate();
    this.startShow();
    if(isTouch) {
      this.mobileScroll();
    }
  }

  mobileScroll() {
    let self = this;
    let throttle = throttleFunc(scrollCallback, 70);
    let startPoint = 3;
    let endPoint = 20;

    function scrollCallback() {
      let scrollPercent = ($(window).scrollTop() / (self.docH - self.windowH)) * 100;
      let pos = -(scrollPercent * (startPoint + endPoint) / 100) + startPoint;

      self.fly(pos);
    }

    $(document).scroll((e) => {
      throttle();
    });
  }

  startShow() {
    this.gradientBgEl.addClass('prepared');
    $(this.container).addClass('prepared');

  }

  fly(progress = 3, time = 1.2) {
    let tl = new TimelineMax();
    tl.to(this.camera.position, time,{z:progress, ease: Power2.easeOut});
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.windowW = window.innerWidth;
    this.windowH = window.innerHeight;
    this.docH = $(document).height();

    this.gradientBgEl.css({width: this.windowW, height: this.windowH});
    this.renderer.setSize(this.windowW, this.windowH);
    this.camera.aspect = this.windowW / this.windowH;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  addObjects() {
    let heightmap = new mountHeightMap();
    let texture = new THREE.Texture(heightmap.element);
    texture.needsUpdate = true;

    this.material = new THREE.ShaderMaterial( {
      extensions: {
        deriovatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
        accel: {type: 'v2', value: new THREE.Vector2(0.5,2)},
        progress: {type: 'f', value: 0},
        threemounts: {type: 't', value: texture},
        vCameraPosition: {type: 'v3', value: new THREE.Vector3(0,0,0)},
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });


    let instances = this.mountCount ;
    console.log({slides: this.screensCount, mountCount: instances});
    let instancePositions = [];
    let instanceOffset = [];
    let instanceOrder = [];
    let geo = isTouch ? new THREE.PlaneBufferGeometry(30, 4, 130, 1) : new THREE.PlaneBufferGeometry(23, 4, 130, 1);

    for (var i = 0; i < instances; i++) {
      instanceOffset.push(Math.random());
      instancePositions.push(
        0,
        -2.1,
        -i*1.5
      );
      instanceOrder.push(i);
    }

    let instancedGeometry = new THREE.InstancedBufferGeometry();

    var vertices = geo.attributes.position.clone();
    instancedGeometry.addAttribute( 'position', vertices );
    instancedGeometry.attributes.normal = geo.attributes.normal;
    instancedGeometry.attributes.uv = geo.attributes.uv;
    instancedGeometry.index = geo.index;
    instancedGeometry.addAttribute( 'instancePosition', new THREE.InstancedBufferAttribute( new Float32Array( instancePositions ), 3 ) );
    instancedGeometry.addAttribute( 'instanceOffset', new THREE.InstancedBufferAttribute( new Float32Array( instanceOffset ), 1 ) );
    instancedGeometry.addAttribute( 'instanceOrder', new THREE.InstancedBufferAttribute( new Float32Array( instanceOrder ), 1 ) );
    this.instancedMesh = new THREE.Mesh( instancedGeometry, this.material );
    this.instancedMesh.frustumCulled = false;
    this.scene.add( this.instancedMesh );
  }

  // topLine.length, midLine.length, botLine.length
  // makeMountains(obj, j) {
  //   let factorBot =  0.004;
  //   let factorMid =  0.0045;
  //   let factorTop =  0.005;
  //   let startCoords = 25;
  //   let endCoords = 175;
  //   let vertices = obj.geometry.vertices;
  //   // console.log(vertices.length / 2);
  //   if (j === 0) {
  //     for (var i = 0; i < vertices.length / 2; i++) {
  //       let v = vertices[i];
  //       if (i > startCoords && i < endCoords) {
  //         v.y = botLine[i - startCoords][1] * factorBot;
  //       } else {
  //         v.y = noise(v.x + j, i/10, 0) / 2;
  //       }
  //     }
  //   }else if (j === 1) {
  //     for (var i = 0; i < vertices.length / 2; i++) {
  //       let v = vertices[i];
  //       if (i > startCoords && i < endCoords) {
  //         v.y = midLine[i - startCoords][1] * factorMid;
  //       } else {
  //         v.y = noise(v.x + j, i/10, 0) / 2;
  //       }
  //     }
  //   }else if (j === 2) {
  //     for (var i = 0; i < vertices.length / 2; i++) {
  //       let v = vertices[i];
  //       if (i > startCoords && i < endCoords) {
  //         v.y = topLine[i - startCoords][1] * factorTop;
  //       } else {
  //         v.y = noise(v.x + j, i/10, 0) / 2;
  //       }
  //     }
  //   }else {
  //     for (var i = 0; i < vertices.length / 2; i++) {
  //       let v = vertices[i];
  //       v.y = noise(v.x + j, i/10, 0) / 2;

  //     }
  //   }

  // }

  animate() {
    this.time += 0.05;

    if(this.instancedMesh) {
      this.instancedMesh.material.uniforms.vCameraPosition.value = this.camera.position;
    }

    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
}


$(document).ready(function() {

  const initHeader = () => {
    G.HEADER = new Header('.js-header');
    G.HEADER.init();
  };
  initHeader();

  setTimeout(() => {

    if (!isTouch) {
      let scroller = new Scroller('.js-scroller', browser);
    }
    if($('#container')[0]) {
      var scrollerWawes = new Sketch('container', mountCount);
    }

    let token = PubSub.subscribe('scrollerEvent', mySubscriber);
    let prevSlide = 0;
    function mySubscriber(msg, data) {


      let startPoint = 3;
      let endPoint = -endSlideViewFactor;
      let step = (startPoint + Math.abs(endPoint)) / screensCount;
      let pos = startPoint - step * data.currentSlide -3.3;
      if (data.currentSlide === 0 && prevSlide === 1) {
        // с второго на первый
        // console.log('с второго на первый 3');
        scrollerWawes.fly(3, 1.5);
      }else if(data.currentSlide === 1 && prevSlide === 0) {
        // c первого на второй
        // console.log('c первого на второй -3.3');
        scrollerWawes.fly(-3.3, 1.5);
      }else{
        scrollerWawes.fly(pos);
        // console.log(`${pos}`);
      }
      prevSlide = data.currentSlide;
      // console.log(prevSlide);
    }
  }, 300);

});

function is_touch_device() {
  return 'ontouchstart' in document.documentElement
        || (navigator.msMaxTouchPoints > 0);
};

















// drawLines();

// function drawLines() {
//   console.log(topLine.length, midLine.length, botLine.length);
//   var c = document.getElementById('myCanvas');
//   if(!c ) return;
//   var ctx = c.getContext('2d');
//   console.log(c);
//   c.width = 1440;
//   c.height = 900;

//   ctx.strokeStyle='#fff';
//   ctx.beginPath();
//   ctx.moveTo(botLine[0][0],botLine[0][1]);
//   for (var i = 0; i < botLine.length; i++) {
//     ctx.lineTo(botLine[i][0],botLine[i][1]);5;
//   }
//   ctx.stroke();
//   ctx.closePath();

//   ctx.strokeStyle='red';
//   ctx.beginPath();
//   ctx.moveTo(midLine[0][0],midLine[0][1]);
//   for (var i = 0; i < midLine.length; i++) {
//     ctx.lineTo(midLine[i][0],midLine[i][1]);
//   }
//   ctx.stroke();
//   ctx.closePath();



//   ctx.strokeStyle='green';
//   ctx.beginPath();
//   ctx.moveTo(topLine[0][0],topLine[0][1]);
//   for (var i = 0; i < topLine.length; i++) {
//     ctx.lineTo(topLine[i][0],topLine[i][1]);
//   }
//   ctx.stroke();
//   ctx.closePath();
// }
