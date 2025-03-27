import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as SceneUtils from 'three/addons/utils/SceneUtils.js';

/**
 * Textures
 */
const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);
//texure loader has optional callbacks corresponding to loadingManager methods
const colorTexture = textureLoader.load(
    './textures/blue-eyes/blue-eyes-texture.jpg'
);
const backTexture = textureLoader.load(
    './textures/blue-eyes/card-back-texture.jpg'
);
backTexture.center = new THREE.Vector2(0.5, 0.5);
backTexture.rotation = Math.PI;
backTexture.flipY = false;

const alphaTexture = textureLoader.load(
    './textures/blue-eyes/blue-eyes-texture-alpha.jpg'
);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */
const geometry = new THREE.PlaneGeometry(1, 1);
//uv attributes are the vertices of all the triangles
// console.log(geometry.attributes.uv);
const material = new THREE.MeshBasicMaterial({
    map: colorTexture,
    alphaMap: alphaTexture,
    transparent: true,
});
const backMaterial = new THREE.MeshBasicMaterial({
    map: backTexture,
    alphaMap: alphaTexture,
    transparent: true,
    side: THREE.BackSide,
});

const materials = [material, backMaterial];

const mesh = SceneUtils.createMultiMaterialObject(
    geometry,
    materials
);

scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
);

camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#333');

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
