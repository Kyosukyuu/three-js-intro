import * as THREE from "https://cdn.jsdelivr.net/npm/three@v0.108.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@v0.108.0/examples/jsm/controls/OrbitControls.js";

// import * as THREE from "https://unpkg.com/browse/three@0.77.0/three.min.js";

let canvas, scene, camera, renderer, controls;
const aspect = window.innerWidth / window.innerHeight;
const width = 10;
const height = width / aspect;

const init = () => {
  canvas = document.getElementById("draw");
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(
    width / -2,
    width / 2,
    height / 2,
    height / -2,
    1,
    100
  );
  scene.add(camera);

  camera.position.set(4, 4, 4);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const ambientLight = new THREE.AmbientLight(0xfffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xfffff, 0.6);
  directionalLight.position.set(10, 20, 0);
  scene.add(directionalLight);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  document.body.appendChild(renderer.domElement);
};

const render = () => {
  requestAnimationFrame(render);
  controls.update();
  renderer.render(scene, camera);
  // cube.rotation.x += 0.02;
  // cube.rotation.y += 0.02;
};

let land, water;
const draw = () => {
  const geometry = new THREE.BoxGeometry(1, 0.25, 1);
  const landMaterial = new THREE.MeshLambertMaterial({
    color: 0x0d5c0c,
  });
  const waterMaterial = new THREE.MeshLambertMaterial({
    color: 0x1974a6,
  });
  const map = [
    ["L", "L", "W", "L"],
    ["L", "W", "L", "L"],
    ["L", "W", "W", "L"],
  ];

  let counter = 1;
  let { x, y, z } = { x: 0, y: 0, z: 0 };
  map.forEach((row, i) => {
    row.forEach((col, j) => {
      console.log(counter);

      switch (j) {
        case 0:
          x = 0;
          break;
        case 1:
        case 2:
        case 3:
          x += 1;
          break;
      }

      if (col === "L") {
        land = new THREE.Mesh(geometry, landMaterial);
        scene.add(land);
        land.position.set(x, y, z);
      } else if (col === "W") {
        water = new THREE.Mesh(geometry, waterMaterial);
        scene.add(water);
        water.position.set(x, y, z);
      }

      if (counter % 4 === 0 && counter > 3) {
        z += 1;
      }

      counter++;
    });
  });

  // land = new THREE.Mesh(geometry, landMaterial);
  // scene.add(land);

  // water = new THREE.Mesh(geometry, waterMaterial);
  // scene.add(water);
  // water.position.set(-1, 0, 0);

  camera.position.z = 5;
};

init();
draw();
render();
