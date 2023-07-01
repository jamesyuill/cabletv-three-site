import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from "gsap";
import { GUI } from 'dat.gui';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

document.body.appendChild(renderer.domElement);

//LIGHTS

//overhead RectLight
const rectLightTop = new THREE.RectAreaLight(0xff0000, 10, 5, 1);
const helperTop = new RectAreaLightHelper(rectLightTop);
rectLightTop.position.set(0, 4, 0);
rectLightTop.rotation.set(-(Math.PI / 2), 0, 0);
rectLightTop.add(helperTop);

//Left RectLight
const rectLightBottom = new THREE.RectAreaLight(0x48f7, 10, 3, 1);
const helperBottom = new RectAreaLightHelper(rectLightBottom);
rectLightBottom.position.set(0, 0, 0);
rectLightBottom.rotation.set(Math.PI / 2, 0, 0);
rectLightBottom.add(helperBottom);

//CAMERA CONTROLS
//----------------------------------------------------------------
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.zoomSpeed = 7;
// controls.dynamicDampingFactor = 0.1;
// controls.update();

//GEOMETRY

//Box Geo
const boxGeo = new THREE.BoxGeometry(1.5,1.5,1.5)
const boxMat = new THREE.MeshStandardMaterial()
const boxMesh = new THREE.Mesh(boxGeo, boxMat)

scene.add(boxMesh)









//PLANE

const planeGeometry = new THREE.PlaneGeometry(15, 10, 100, 100);
const planeMaterial = new THREE.MeshStandardMaterial();
const pMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff });
const planeMesh = new THREE.Points(planeGeometry, pMaterial);

// console.log(pointsArray);

planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.set(0, -0.5, 0);

scene.add(planeMesh);

// const size = 15;
// const divisions = 20;
// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);

//FONT LOADER

const loader = new TTFLoader();

const fontLoader = new FontLoader();

loader.load('./public/fonts/Condition-Regular.ttf', function (fnt) {
  let font = fontLoader.parse(fnt);
  const cableGeometry = new TextGeometry('cable', {
    font: font,
    size: 1,
    height: 0.5,
  });
  const tvGeometry = new TextGeometry('tv', {
    font: font,
    size: 1,
    height: 0.5,
  });
  const textMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    metalness: 0.3,
    clearcoat: 0.52,
  });
  const cableMesh = new THREE.Mesh(cableGeometry, textMaterial);
  const tvMesh = new THREE.Mesh(tvGeometry, textMaterial);
  cableMesh.position.set(0, 0, 0);
  tvMesh.position.set(1.2, -1.1, 0);
  logoGroup = new THREE.Group();
  logoGroup.add(cableMesh);
  logoGroup.add(tvMesh);
  logoGroup.position.set(-1.8, 2, 0.5);
  logoGroup.rotation.set(-0.3, 0.4, 0);
  
  scene.add(logoGroup);
  
});

//POSITIONALS
camera.position.set(0, 1.5, 10);
camera.rotation.set(0, 0, 0);

boxMesh.position.set(-10,2,0.5)

//DAT.GUI

const gui = new GUI({ width: 260, color: 0x333333, autoPlace: false });
gui.domElement.id = 'gui';
gui_container.appendChild(gui.domElement);

// gui.add(camera.position, 'x', 0, Math.PI).name('logo X');

const rectLightTopParams = { topLight: rectLightTop.color.getHex() };
gui.addColor(rectLightTopParams, 'topLight').onChange((value) => {
  rectLightTop.color.set(value);
});
const rectLightBottomParams = {
  bottomLight: rectLightBottom.color.getHex(),
};
gui.addColor(rectLightBottomParams, 'bottomLight').onChange((value) => {
  rectLightBottom.color.set(value);
});

//ADD TO SCENE

scene.add(rectLightTop, rectLightBottom);

//GSAP


let boxAnim = gsap
    .to(boxMesh.position, {x:0, duration:1, paused:true})
    .to(logoGroup.position, {x:5,duration:1, paused:true})



const button1 = document.getElementById('button1')
button1.addEventListener('mouseenter', ()=>{
  boxAnim.play();
})




//ANIMATE
const count = planeGeometry.attributes.position.count;

function animate() {
  const now = Date.now() / 300;
  for (let i = 0; i < count; i++) {
    const x = planeGeometry.attributes.position.getX(i);

    const xsin = Math.sin(x + now) * Math.random();
    planeGeometry.attributes.position.setZ(i, xsin);
  }
  planeGeometry.attributes.position.needsUpdate = true;

  requestAnimationFrame(animate);
boxMesh.rotation.x += 0.01
boxMesh.rotation.y += 0.03

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
