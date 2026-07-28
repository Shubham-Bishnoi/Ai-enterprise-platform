import * as THREE from 'three';
import './style.css';

const canvas = document.querySelector('#forge');
const shell = canvas.parentElement;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0.05, 8.8);

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const world = new THREE.Group();
scene.add(world);
const emblem = new THREE.Group();
world.add(emblem);

const hex = new THREE.Shape();
for (let i = 0; i < 6; i++) {
  const a = Math.PI / 6 + i * Math.PI / 3;
  const x = Math.cos(a) * 1.72, y = Math.sin(a) * 1.72;
  i ? hex.lineTo(x, y) : hex.moveTo(x, y);
}
hex.closePath();
const body = new THREE.Mesh(
  new THREE.ExtrudeGeometry(hex, { depth: .42, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: .055, bevelThickness: .055 }),
  new THREE.MeshStandardMaterial({ color: 0x060a12, metalness: .9, roughness: .19 })
);
body.geometry.center();
emblem.add(body);

const edges = new THREE.LineSegments(
  new THREE.EdgesGeometry(body.geometry, 18),
  new THREE.LineBasicMaterial({ color: 0x8ab9ff, transparent: true, opacity: .34 })
);
emblem.add(edges);

const texture = new THREE.TextureLoader().load('/assets/gff-emblem.png');
texture.colorSpace = THREE.SRGBColorSpace;
texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
const faceGeometry = new THREE.PlaneGeometry(3.64, 3.64);
const faceMaterial = new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .02, toneMapped: false, side: THREE.FrontSide });
const front = new THREE.Mesh(faceGeometry, faceMaterial);
front.position.z = .271;
emblem.add(front);
const back = new THREE.Mesh(faceGeometry, faceMaterial.clone());
back.rotation.y = Math.PI;
back.position.z = -.271;
emblem.add(back);

const red = new THREE.PointLight(0xff183d, 14, 10, 2); red.position.set(-2.5, 1.2, 2.8);
const blue = new THREE.PointLight(0x087dff, 18, 10, 2); blue.position.set(2.5, .4, 3.2);
const rim = new THREE.DirectionalLight(0xd8e7ff, 2.2); rim.position.set(0, 3, 4);
scene.add(red, blue, rim, new THREE.AmbientLight(0x172033, 1.6));

const network = new THREE.Group();
world.add(network);
const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x4ba4ff });
const nodeGeo = new THREE.SphereGeometry(.022, 10, 10);
const lines = [];
for (let i = 0; i < 22; i++) {
  const side = i % 2 ? 1 : -1;
  const y = (Math.random() - .5) * 5.2;
  const z = -1.1 - Math.random() * 2.8;
  const points = [
    new THREE.Vector3(side * (1.7 + Math.random() * .3), y * .38, z),
    new THREE.Vector3(side * (2.35 + Math.random() * .45), y * .72, z - .25),
    new THREE.Vector3(side * (3.1 + Math.random() * .8), y, z - .55)
  ];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const color = side < 0 ? 0xff2447 : 0x118cff;
  const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .16 }));
  network.add(line);
  const node = new THREE.Mesh(nodeGeo, nodeMaterial.clone());
  node.material.color.setHex(color); node.position.copy(points[2]); network.add(node);
  lines.push({ line, node, phase: Math.random() * Math.PI * 2 });
}

let targetY = .28, targetX = -.05, dragging = false, lastX = 0, auto = true;
canvas.addEventListener('pointerdown', e => { dragging = true; auto = false; lastX = e.clientX; canvas.setPointerCapture(e.pointerId); document.querySelector('.hint').style.opacity = 0; });
canvas.addEventListener('pointermove', e => { if (dragging) { targetY += (e.clientX - lastX) * .008; lastX = e.clientX; } else { const r = canvas.getBoundingClientRect(); targetX = ((e.clientY-r.top)/r.height-.5)*.18; } });
canvas.addEventListener('pointerup', () => dragging = false);
canvas.addEventListener('pointerleave', () => { if (!dragging) targetX = -.05; });

const clock = new THREE.Clock();
function resize() {
  const w = shell.clientWidth, h = shell.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  emblem.scale.setScalar(w < 620 ? .72 : .82);
}
new ResizeObserver(resize).observe(shell); resize();

function animate() {
  const t = clock.getElapsedTime();
  if (auto && !matchMedia('(prefers-reduced-motion: reduce)').matches) targetY = .28 + t * .23;
  emblem.rotation.y += (targetY - emblem.rotation.y) * .045;
  emblem.rotation.x += (targetX - emblem.rotation.x) * .04;
  emblem.position.y = Math.sin(t * .65) * .055;
  const intro = Math.min(1, t / 1.8);
  emblem.scale.multiplyScalar(1); emblem.visible = intro > .02;
  emblem.position.z = -1.2 * (1 - (1 - Math.pow(1-intro, 3)));
  lines.forEach(({ line, node, phase }, i) => {
    const pulse = .28 + .72 * Math.max(0, Math.sin(t * 1.35 + phase));
    node.scale.setScalar(.7 + pulse * 1.45);
    node.material.opacity = .35 + pulse * .65; node.material.transparent = true;
    line.material.opacity = .07 + pulse * .13;
  });
  red.intensity = 12 + Math.sin(t * 1.1) * 2;
  blue.intensity = 16 + Math.sin(t * 1.1 + 1.8) * 2;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
