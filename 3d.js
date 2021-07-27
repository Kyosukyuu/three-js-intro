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

let land, water, character;
const geoSize = { width: 0.5, height: 0.25, length: 0.5 };
const charSize = { width: 0.125, height: 0.5, length: 0.125 };
const charPos = { x: 0, y: 0.38, z: 0 };
const draw = () => {
  const geometry = new THREE.BoxGeometry(
    geoSize.width,
    geoSize.height,
    geoSize.length
  );
  const charGeo = new THREE.BoxGeometry(
    charSize.width,
    charSize.height,
    charSize.length
  );
  const landMaterial = new THREE.MeshLambertMaterial({
    color: 0x0d5c0c,
  });
  const waterMaterial = new THREE.MeshLambertMaterial({
    color: 0x1974a6,
  });

  const charMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
  });

  const map = [
    ["W", "W", "L", "L", "L"],
    ["L", "W", "W", "L", "L"],
    ["L", "W", "W", "L", "L"],
    ["L", "W", "W", "L", "L"],
    ["L", "L", "W", "W", "L"],
    ["L", "L", "L", "L", "L"],
    ["L", "L", "L", "L", "L"],
  ];

  let counter = 1;
  let { x, y, z } = { x: 0, y: 0, z: 0 };
  map.forEach((row, i) => {
    row.forEach((col, j) => {
      // console.log(counter);

      switch (j) {
        case 0:
          x = 0;
          break;
        default:
          x += geoSize.width;
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

      if (
        counter % map[0].length === 0 &&
        counter > map[0].length - 1
      ) {
        z += geoSize.width;
      }

      counter++;
    });
  });

  character = new THREE.Mesh(charGeo, charMaterial);
  scene.add(character);
  character.position.set(charPos.x, charPos.y, charPos.z);

  camera.position.z = 5;
};

document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
      character.position.z -= 0.125;
      break;
    case "a":
      character.position.x -= 0.125;
      break;
    case "s":
      character.position.z += 0.125;
      break;
    case "d":
      character.position.x += 0.125;
      break;
  }
});

init();
draw();
render();
