import * as THREE from 'three';
var OBJLoader = require('three-obj-loader');
OBJLoader(THREE);
import {TimelineMax} from 'gsap';
var OrbitControls = require('three-orbit-controls')(THREE);
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';
import GetImage from './getImage.js';

export default class Sketch{
  constructor(selector){
    this.scene =  new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerWidth);

    this.container = document.getElementById('container');
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001, 1000
    );
    this.camera.position.set( 0, 0, 100 );
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;
    this.loader = new THREE.OBJLoader();



    this.setupResize();

    this.getImage = new GetImage('/img/krupa.png');
    this.getImage.getData().then(data=>{
      this.dotsData = data;
      this.addObjects();
      this.animate();
    });
  }



  setupResize(){
    let that = this;
    window.addEventListener('resize', resize);
    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      that.renderer.setSize( w, h );
      that.camera.aspect = w / h;
      that.camera.updateProjectionMatrix();
    }
  }

  render(){
    this.renderer.render(this.scene, this.camera);
  }


  addInstanced(planebuffer){
    let planeGeo = new THREE.InstancedBufferGeometry();
    // let planebuffer = new THREE.PlaneBufferGeometry( 1,8.5, 1, 1 );

    // planeGeo.index = planebuffer.index;
    planeGeo.attributes.position = planebuffer.attributes.position;
    // planeGeo.attributes.uv = planebuffer.attributes.uv;

    let offsets = new Float32Array(this.dotsData.length*3);
    let j = 0;
    this.dotsData.forEach(v=>{
      offsets[j] = v[0] ;
      offsets[j+1] = v[1] ;
      offsets[j+2] = 0;
      j = j+3;
    })
    planeGeo.addAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3,true, 4));
    let mesh = new THREE.Mesh(planeGeo, this.material);
    mesh.position.y = 30;
    this.scene.add(mesh);
  }


  addObjects(){
    this.material = new THREE.ShaderMaterial( {
      extensions: {
          derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: 'f', value: 0 },
        pixels: {type: 'v2', value: new THREE.Vector2(window.innerWidth,window.innerHeight)},
        accel: {type: 'v2', value: new THREE.Vector2(0.5,2)},
        progress: {type: 'f', value: 0},
        texture: {
          value: THREE.ImageUtils.loadTexture('img/brush.png')
        },
        tMatCap: {
          type: 't',
          value: THREE.ImageUtils.loadTexture( '/img/matcap1.jpg' )
        },
        uvRate1: {
          value: new THREE.Vector2(1,1)
        },
      },
      // wireframe: true,
      transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment
    });

    // this.plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 1, 1 ),this.material);
    // this.scene.add(this.plane);

    // dots - fast
    // this.pointsGeometry = new THREE.Geometry();
    // this.dotsData.forEach(v=>{
    //   this.pointsGeometry.vertices.push(new THREE.Vector3(100*v[0],100*v[1],0))
    // })
    // this.points = new THREE.Points(this.pointsGeometry);
    // this.scene.add(this.points);


    // old SLOW
    // this.dotsData.forEach(v=>{
    //   let plane = new THREE.Mesh(new THREE.PlaneGeometry( 1,1, 1, 1 ),this.material);
    //   plane.position.copy(new THREE.Vector3(100*v[0],100*v[1],0))
    //   plane.rotation.x = 1;
    //   plane.rotation.z = 1;
    //   this.scene.add(plane);
    //   // this.pointsGeometry.vertices.push(new THREE.Vector3(100*v[0],100*v[1],0))
    // })


    // this.addInstanced(new THREE.PlaneBufferGeometry( 1,8.5, 1, 1 ));



    let that = this;
    this.loader.load(
      // resource URL
      '/img/pill.obj',
      // called when resource is loaded
      function ( object ) {
        object.children[0].geometry.scale(0.5,0.5,0.5);
        that.scene.add( object );
        // console.log(object.children[0].geometry.scale(0.5,0.5,0.5));

        // let mesh = new THREE.Mesh(object.children[0].geometry, that.material);
        // mesh.position.y = 30;
        // that.scene.add(mesh);

        that.addInstanced(object.children[0].geometry);
        // that.addInstanced(new THREE.PlaneBufferGeometry( 1,8.5, 1, 1 ));

        console.log(object.children[0].geometry,new THREE.PlaneBufferGeometry( 1,8.5, 1, 1 ));

      }
    );

  }



  animate(){
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }
}

// new Sketch('container');
