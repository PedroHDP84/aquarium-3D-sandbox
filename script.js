import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AnimationClip,
  GridHelper,
  PointLight,
  PointLightHelper,
  Vector3,
  HemisphereLight,
} from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { CameraRig, ScrollControls, ThreeDOFControls } from 'three-story-controls'
import cameraData from './camera-data.js'

const canvasParent = document.querySelector('.canvas-parent')
const scrollElement = document.querySelector('.scroller')

const scene = new Scene()
const camera = new PerspectiveCamera(45, canvasParent.clientWidth / canvasParent.clientHeight, 0.1, 10000)
const renderer = new WebGLRenderer({alpha: true})
renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight)
canvasParent.appendChild(renderer.domElement)

const light = new HemisphereLight(0xffffbb, 0x080820, 1)
light.position.set(1, 1, 1)
scene.add(light)

// const grid = new GridHelper(100, 50)
// grid.position.set(0, -5, 0)
// scene.add(grid)

const rig = new CameraRig(camera, scene)
rig.setAnimationClip(AnimationClip.parse(cameraData.animationClip))
rig.setAnimationTime(0)

const controls = new ScrollControls(rig, {
  scrollElement,
  dampingFactor: 0.1,
  startOffset: '-50vh',
  endOffset: '-50vh',
  scrollActions: [
    {
      start: '0%',
      end: '15%',
      callback: transitionTop,
    },
    {
      start: '85%',
      end: '100%',
      callback: transitionBottom,
    },
  ],
})

const controls3dof = new ThreeDOFControls(rig, {
  panFactor: Math.PI / 10,
  tiltFactor: Math.PI / 10,
  truckFactor: 0,
  pedestalFactor: 0,
})

function transitionTop(progress) {
  renderer.domElement.style.opacity = progress
}

function transitionBottom(progress) {
  renderer.domElement.style.opacity = 1 - progress
}
controls.enable()
controls3dof.enable()

const cones = [
  {
    meshPosition: new Vector3(0, 0, -30),
    fileName: 'DevilRay.glb',
    scaleFactor: 3
  },
  {
    meshPosition: new Vector3(20, 0, -45),
    fileName: 'AngelFish.glb',
    scaleFactor: .4
  },
  {
    meshPosition: new Vector3(12, 0, -10),
    fileName: 'Baby_Turtule.glb',
    scaleFactor: 1
  },
  {
    meshPosition: new Vector3(30, 0, 20),
    fileName: 'BackwedgedButterflyfish.glb',
    scaleFactor: 1
  },
  {
    meshPosition: new Vector3(-10, 0, 45),
    fileName: 'Dolphin.glb',
    scaleFactor: 1
  },
  {
    meshPosition: new Vector3(-40, 0, 20),
    fileName: 'HumpBack.glb',
    scaleFactor: 2.5
  },
]

const loader = new GLTFLoader().setPath( 'models/' );
					
cones.forEach((item) => {
  loader.load( item.fileName, function ( gltf ) {
    gltf.scene.position.copy(item.meshPosition)
    gltf.scene.scale.setScalar(item.scaleFactor) // scale the baskeball
    scene.add( gltf.scene );
  } );


  const pointLight = new PointLight(0xffffbb )
  pointLight.position.copy(item.meshPosition)
  pointLight.position.setY(3)
  scene.add(pointLight)

  // const spotLightHelper = new PointLightHelper( pointLight );
  // scene.add( spotLightHelper );

})

function render(t) {
  window.requestAnimationFrame(render)
  if (rig.hasAnimation) {
    controls.update(t)
    controls3dof.update(t)
  }
  renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

render()
