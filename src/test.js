import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 10)

const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg")
const doorAoTexture = textureLoader.load("./textures/door/ambientOcclusion.jpg")
//导入置换贴图
const doorHeightTexture = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100)
const material = new THREE.MeshStandardMaterial({
    color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  aoMap: doorAoTexture,
  aoMapIntensity: 1,
  displacementMap: doorHeightTexture,
  displacementScale: 0.1,
})
material.side = THREE.DoubleSide

const cube = new THREE.Mesh(cubeGeometry, material)
scene.add(cube)
cubeGeometry.setAttribute(
    "uv2",
    new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
)