// Simple 3D Obby Game using Three.js

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.164/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, player, controls;
let platforms = [];
let velocityY = 0;
const gravity = -0.01;
let isOnGround = false;
let keys = {};

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 3, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
  const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  player = new THREE.Mesh(playerGeometry, playerMaterial);
  player.position.set(0, 1, 0);
  scene.add(player);

  const platformGeometry = new THREE.BoxGeometry(3, 0.5, 3);
  const platformMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  for (let i = 0; i < 10; i++) {
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.set((i - 5) * 4, 0, 0);
    scene.add(platform);
    platforms.push(platform);
  }

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableKeys = false;

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("keydown", (e) => keys[e.code] = true);
  window.addEventListener("keyup", (e) => keys[e.code] = false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  let speed = 0.1;

  if (keys["KeyA"]) player.position.x -= speed;
  if (keys["KeyD"]) player.position.x += speed;
  if (keys["KeyW"]) player.position.z -= speed;
  if (keys["KeyS"]) player.position.z += speed;
  if (keys["Space"] && isOnGround) velocityY = 0.15;

  velocityY += gravity;
  player.position.y += velocityY;
  isOnGround = false;

  for (let platform of platforms) {
    if (
      Math.abs(player.position.x - platform.position.x) < 1.5 &&
      Math.abs(player.position.z - platform.position.z) < 1.5 &&
      player.position.y <= 1 &&
      player.position.y >= 0.5
    ) {
      player.position.y = 1;
      velocityY = 0;
      isOnGround = true;
    }
  }

  controls.target.copy(player.position);
  controls.update();

  renderer.render(scene, camera);
}
