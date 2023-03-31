import Script from 'next/script';

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
// import * as dat from 'lil-gui';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {SVGLoader} from 'three/examples/jsm/loaders/SVGLoader.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {FXAAShader} from 'three/examples/jsm/shaders/FXAAShader.js';
import {SSAARenderPass} from 'three/examples/jsm/postprocessing/SSAARenderPass';
import {SSAOPass} from 'three/examples/jsm/postprocessing/SSAOPass';
import {VignetteShader} from 'three/examples/jsm/shaders/VignetteShader.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import {SobelOperatorShader} from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import {gsap} from 'gsap';

// import data from './jsonFiles/conway-machines.json' assert {type : 'JSON'};
// ////(data);
import {
  AmbientLight,
  Color,
  HemisphereLightHelper,
  Int8BufferAttribute,
  Light,
  LOD,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  Raycaster,
  RectAreaLight,
  Vector3,
} from 'three';
import * as TWEEN from '@tweenjs/tween.js';
// import {convertArray} from 'three/src/animation/animationutils';
import {defaultSettings, modeldata, pathModel} from 'utils/conway-machines';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/router';
import {Button} from '@/components/Button';
// function component

const ThreeDView = () => {
  const router = useRouter();
  const params = router.query;
  const project = params?.project;
  const [loadingManager, setLoadingManager] = useState<any>();
  // Canvas
  const [canvas, setCanvas] = useState<any>();
  const [canvasModal, setCanvasModal] = useState<any>();
  const [expandBtn, setExpandBtn] = useState<any>();
  const [shrinkBtn, setShrinkBtn] = useState<any>();
  // const [renderer, setRenderer] = useState<any>();

  useEffect(() => {
    let annotation;
    let tooltiptext;
    let tooltipPartName;
    let isClicked = false;
    let oldMaterial;
    let clickedMesh;
    let clickedMaterial;
    let labelRenderer: any;
    let isModalOpen = false;
    let isFullscreen = false;
    var fov = defaultSettings['camera'][0].fov;
    var aspectRatio = defaultSettings['camera'][0].aspect;
    var near = defaultSettings['camera'][0].near;
    var far = defaultSettings['camera'][0].far;
    /**
     * Loader
     */
    const loadingBarElement = document.querySelector('.loading-bar');

    const planerGeometry = new THREE.PlaneGeometry(2, 2);
    const planerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1,
    });

    const loadingManager = new THREE.LoadingManager(
      // Loaded callback
      () => {
        gsap.to(overlayMaterial.uniforms.uAlpha, {duration: 1, value: 0});
        // Hide the loading screen
        document.getElementById('spinner')!.style.display = 'none';
        document.getElementById('fullscreen-overlay')!.style.display = 'none';
      },
      (url, itemsLoaded, itemsTotal) => {
        // Update the progress bar
        const progressRatio = itemsLoaded / itemsTotal;
      }
    );
    loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
      document.getElementById('spinner')!.style.display = 'block';
      document.getElementById('fullscreen-overlay')!.style.display = 'block';
    };

    // Hide spinner once everything has finished loading
    loadingManager.onLoad = function () {
      document.getElementById('spinner')!.style.display = 'none';
      document.getElementById('fullscreen-overlay')!.style.display = 'none';
    };

    function haah() {
      isFullscreen = true;
    }

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/static/draco/');
    const gltfLoaderModal = new GLTFLoader();
    gltfLoaderModal.setDRACOLoader(dracoLoader);
    // gltfLoader.setDRACOLoader(dracoLoader)
    dracoLoader.preload();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    var mDragging = false;
    var mDown = false;

    window.addEventListener('mousedown', function () {
      mDown = true;
    });
    window.addEventListener('mousemove', function () {
      if (mDown) {
        mDragging = true;
      }
    });
    window.addEventListener('mouseup', function () {
      // If not dragging, then it's a click!
      mouseUp();
      // Reset variables
      mDown = false;
      mDragging = false;
    });

    const cameraModal = new THREE.PerspectiveCamera(35, 380 / 310, 0.1, 5);
    cameraModal.position.set(1.1, 0.6, 1.825);
    // cameraModal.position.setLength(1.8);
    /**
     * Base
     */
    // Debug
    // const gui = new dat.GUI()
    const debugObject: any = {};

    debugObject.envMapIntensity = 2;
    // gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(0.001).onChange(()=>{
    //     updateAllMaterials()
    // })

    // Canvas
    let canvas: any = document.querySelector('canvas.webgl');
    let canvasModal: any = document.querySelector('canvas.webgl2');
    // Scene
    const scene = new THREE.Scene();
    const sceneModal = new THREE.Scene();

    const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    const overlayMaterial = new THREE.ShaderMaterial({
      // wireframe: true,
      transparent: true,
      uniforms: {
        uAlpha: {value: 0.8},
      },
      vertexShader: `
            void main()
            {
                gl_Position = vec4(position, 1.0);
            }
        `,
      fragmentShader: `
            uniform float uAlpha;
    
            void main()
            {
                gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
            }
        `,
    });
    // const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
    // scene.add(overlay)
    /**
     * Update all materials
     */
    const updateAllMaterials = () => {
      scene.traverse(child => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.frustumCulled = false;
          child.material.envMap = environmentMap;
          child.material.dispose();
          child.geometry.dispose();
          child.material.envMapIntensity = 2;
          child.material.roughness = 0.3;
          child.material.metalness = 0;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      sceneModal.traverse(child => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.frustumCulled = false;
          child.material.envMap = environmentMapModal;
          child.material.dispose();
          child.geometry.dispose();
          child.material.envMapIntensity = 3;
          child.material.roughness = 0.3;
          child.material.metalness = 0;
          child.material.needsUpdate = true;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    };

    var expandBtn: any = document.getElementById('ex32');
    var shrinkBtn: any = document.getElementById('sh32');

    /**
     * Environment map
     */
    const environmentMap = cubeTextureLoader.load([
      '/static/textures/Studio1/px.png',
      '/static/textures/Studio1/nx.png',
      '/static/textures/Studio1/py.png',
      '/static/textures/Studio1/ny.png',
      '/static/textures/Studio1/pz.png',
      '/static/textures/Studio1/nz.png',
    ]);
    const colorEnv = new THREE.Color('#FfFfFf');
    environmentMap.encoding = THREE.sRGBEncoding;

    scene.environment = environmentMap;
    scene.background = colorEnv;
    const environmentMapModal = cubeTextureLoader.load([
      '/static/textures/Studio1/px.png',
      '/static/textures/Studio1/nx.png',
      '/static/textures/Studio1/py.png',
      '/static/textures/Studio1/ny.png',
      '/static/textures/Studio1/pz.png',
      '/static/textures/Studio1/nz.png',
    ]);
    environmentMapModal.encoding = THREE.sRGBEncoding;

    sceneModal.background = colorEnv;
    sceneModal.environment = environmentMapModal;
    const sizes = {
      width: 833,
      height: 659,
    };

    const camera = new THREE.PerspectiveCamera(fov, 833 / 659, near, far);
    // camera.position.set(1.1, 0.6, 1.825)
    // camera.position.setLength(1.8);

    // camera.view.
    scene.add(camera);

    const directionalLight = new THREE.DirectionalLight('#6cbbff', 0.305);
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.bottom = 5;
    directionalLight.shadow.camera.far = 15;
    directionalLight.shadow.mapSize.set(1024, 1024);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLightModal = new THREE.DirectionalLight('#6cbbff', 0.305);
    directionalLightModal.shadow.camera.near = 0.1;
    directionalLightModal.shadow.camera.far = 100;
    directionalLightModal.shadow.camera.left = -5;
    directionalLightModal.shadow.camera.top = 5;
    directionalLightModal.shadow.camera.right = 5;
    directionalLightModal.shadow.camera.bottom = 5;
    directionalLightModal.shadow.camera.far = 15;
    directionalLightModal.shadow.mapSize.set(1024, 1024);
    directionalLightModal.castShadow = true;
    scene.add(directionalLightModal);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
    // var target = new THREE.Object3D(geometry, material);
    var target = new THREE.Object3D();
    scene.add(target);
    target.position.set(-1, 0.7, 0);
    target.rotation.set(Math.PI, 0, 0);
    directionalLight.target = target;
    target.updateMatrixWorld();
    scene.add(directionalLight.target);

    // const helper = new THREE.DirectionalLightHelper(directionalLight,0.1)
    // scene.add(helper)

    const pointlight2: any = new THREE.PointLight('#c7ccff', 1);
    pointlight2.shadow.camera.near = 0.1;
    pointlight2.shadow.camera.far = 1;
    pointlight2.shadow.camera.left = -1;
    pointlight2.shadow.camera.top = 1;
    pointlight2.shadow.camera.right = 1;
    pointlight2.shadow.camera.bottom = 1;
    pointlight2.shadow.camera.far = 15;
    pointlight2.shadow.mapSize.set(1024, 1024);
    scene.add(pointlight2);
    const pointlight: any = new THREE.PointLight('#ffe0b5', 0.96);
    pointlight.shadow.camera.near = 0.1;
    pointlight.shadow.camera.far = 1;
    pointlight.shadow.camera.left = -1;
    pointlight.shadow.camera.top = 1;
    pointlight.shadow.camera.right = 1;
    pointlight.shadow.camera.bottom = 1;
    pointlight.shadow.camera.far = 15;
    pointlight.shadow.mapSize.set(1024, 1024);
    scene.add(pointlight);
    const sphereSize = 1;

    // const pointLightHelper2 = new THREE.PointLightHelper( pointlight2, 0.2 );
    // scene.add( pointLightHelper2 );
    // const pointLightHelper = new THREE.PointLightHelper( pointlight, 0.2 );
    // scene.add( pointLightHelper );

    const pointlightModal2: any = new THREE.PointLight('#c7ccff', 1);
    pointlightModal2.shadow.camera.near = 0.1;
    pointlightModal2.shadow.camera.far = 1;
    pointlightModal2.shadow.camera.left = -1;
    pointlightModal2.shadow.camera.top = 1;
    pointlightModal2.shadow.camera.right = 1;
    pointlightModal2.shadow.camera.bottom = 1;
    pointlightModal2.shadow.camera.far = 15;
    pointlightModal2.shadow.mapSize.set(1024, 1024);
    sceneModal.add(pointlightModal2);
    const pointlightModal: any = new THREE.PointLight('#ffe0b5', 0.96);
    pointlightModal.shadow.camera.near = 0.1;
    pointlightModal.shadow.camera.far = 1;
    pointlightModal.shadow.camera.left = -1;
    pointlightModal.shadow.camera.top = 1;
    pointlightModal.shadow.camera.right = 1;
    pointlightModal.shadow.camera.bottom = 1;
    pointlightModal.shadow.camera.far = 15;
    pointlightModal.shadow.mapSize.set(1024, 1024);
    sceneModal.add(pointlightModal);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas as HTMLCanvasElement,
      antialias: true,
    });
    labelRenderer = new CSS2DRenderer();

    const modalRenderer = new THREE.WebGLRenderer({
      canvas: canvasModal as HTMLCanvasElement,
      antialias: true,
    });
    if (isFullscreen == false) {
      sizes.width = 833;
      sizes.height = 659;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.95, 2));
      // renderer.setSize(500,350)
    } else if (isFullscreen == true) {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.95, 2));
    }

    var clock: any, mixer: any;
    clock = new THREE.Clock();

    const mouse = new THREE.Vector2();

    window.addEventListener('mousemove', event => {
      mouse.x = (event.clientX / sizes.width) * 2 - 1;
      mouse.y = -(event.clientY / sizes.height) * 2 + 1;
      // ////(mouse)
    });

    var raycaster = new THREE.Raycaster();
    const rayOrigin = new THREE.Vector3(-3, 0, 0);
    const rayDirection = new THREE.Vector3(10, 0, 0);
    // raycaster.layers.set( 5 );
    rayDirection.normalize();

    // raycaster.set(rayOrigin, rayDirection)
    var loadedobject: any;
    var intersects: any;
    var intersects1;
    let currentIntersect: any = null;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    modalRenderer.physicallyCorrectLights = true;
    modalRenderer.outputEncoding = THREE.sRGBEncoding;
    modalRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    modalRenderer.toneMappingExposure = 0.5;
    modalRenderer.shadowMap.enabled = true;
    modalRenderer.shadowMap.type = THREE.PCFSoftShadowMap;

    animate();
    // var json = require('./jsonFiles/conway-machines.json')

    dracoLoader.setDecoderPath('/draco/');

    // const gltfLoader = new GLTFLoader()
    const sizes2 = {
      width: 380,
      height: 310,
    };

    // const loader = new OBJLoader();
    const loader = new GLTFLoader(loadingManager);
    loader.setDRACOLoader(dracoLoader);
    var shadowMaterial: any = new THREE.ShadowMaterial();
    var planeGeometry = new THREE.PlaneGeometry(200, 200);
    var standardMaterial = new THREE.ShadowMaterial({
      color: colorEnv,
      transparent: true,
    });
    standardMaterial.opacity = 0.1;
    shadowMaterial.blur = 5;

    standardMaterial.name = 'Floor';
    // var planeMaterial = new THREE.ShadowMaterial()
    // planeMaterial.opacity=0.02

    // create the plane
    var plane = new THREE.Mesh(planeGeometry, standardMaterial);
    // position the plane at the center of the canvas
    plane.position.set(0, -0.2, 0);
    // rotate the plane to match the canvas orientation
    plane.rotation.x = -Math.PI / 2;
    // set the plane to receive shadows
    plane.receiveShadow = true;
    plane.customDepthMaterial = shadowMaterial;
    // plane.castShadow=true
    // plane.customDepthMaterial = planeMaterial;
    // plane.customDepthMaterial.color.set(255,255,255)
    // console.log(plane.customDepthMaterial);

    // add the plane to the scene
    scene.add(plane);
    //(plane);
    var shadowModalMaterial: any = new THREE.ShadowMaterial();
    var planeModalGeometry = new THREE.PlaneGeometry(200, 200);
    var standardModalMaterial: any = new THREE.ShadowMaterial({
      color: colorEnv,
      transparent: true,
    });
    standardModalMaterial.opacity = 0.1;
    shadowModalMaterial.blur = 5;

    standardMaterial.name = 'Floor';
    // var planeMaterial = new THREE.ShadowMaterial()
    // planeMaterial.opacity=0.02

    // create the plane
    var planeModal = new THREE.Mesh(planeModalGeometry, standardModalMaterial);
    // position the plane at the center of the canvas
    planeModal.position.set(0, -0.2, 0);
    // roModaltate the plane to match the canvas orientation
    planeModal.rotation.x = -Math.PI / 2;
    // seModalt the plane to receive shadows
    planeModal.receiveShadow = true;
    planeModal.customDepthMaterial = shadowModalMaterial;
    // plane.castShadow=true
    // plane.customDepthMaterial = planeMaterial;
    // plane.customDepthMaterial.color.set(255,255,255)
    // console.log(plane.customDepthMaterial);

    // add the plane to the scene
    sceneModal.add(planeModal);
    const groupA: any = [];
    // scene.add(groupA)
    var f: any = document.getElementById('full');
    f.addEventListener('click', () => {
      isFullscreen = true;
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.95, 2));
    });

    // var parts=[]
    let i;
    let prapa;
    // load a resource
    let basicMaterial;
    let objectsToIntersect = [];
    let text;
    let md: any = [];
    for (let i = 0; i < modeldata['conway-machines'].length; i++) {
      md.push(modeldata['conway-machines'][i].rgb);
    }
    var box, boxSize, boxCenter;
    var loadedobject: any;
    var intersectedObjects: any = [];
    const parent = new THREE.Object3D();
    scene.add(parent);
    var path = pathModel['path'][0].path;
    var model = pathModel['path'][0].model;
    var type = pathModel['path'][0].type;

    loader.load(
      // resource URL
      path + model + type,
      // called when resource is loaded
      function (object) {
        loadedobject = object.scene;

        // console.log(object.scene);
        // object.scene.scale.set(0.0001,0.0001,0.0001)
        modeldata['conway-machines'].forEach(element => {
          let counter = 0;
          scene.traverse(function (child: any) {
            if (child.material instanceof MeshStandardMaterial) {
              child.material.opacity = 1;
              child.material.transparent = true;
              if (child.material.name == element.rgb) {
                objectsToIntersect.push(child);
                child.name = element.rgb + counter;
                basicMaterial = child.material;
              }
            }
          });
        });

        let mat = new THREE.MeshLambertMaterial({
          color: 0xff0000,
        });
        let boxGeom = new THREE.BoxGeometry(1, 1, 1);
        let cube = new THREE.Mesh(boxGeom, mat);
        cube.name = 'newCUBE';
        cube.position.set(3, 1, 0);
        cube.scale.set(2, 2, 2);
        cube.material.fog = false;
        // scene.current.add(cube);
        var mainBounds = new THREE.Box3().setFromObject(cube);
        // console.log('main is >>>>>>>>', mainBounds);

        let bbox = new THREE.Box3().setFromObject(object.scene);
        let newBounds = new THREE.Box3().setFromObject(object.scene);
        // console.log('newBounds is >>>>>>>>', newBounds);

        let lengthSceneBounds = {
          x: Math.abs(mainBounds.max.x - mainBounds.min.x),
          y: Math.abs(mainBounds.max.y - mainBounds.min.y),
          z: Math.abs(mainBounds.max.z - mainBounds.min.z),
        };
        let lengthMeshBounds = {
          x: Math.abs(newBounds.max.x - newBounds.min.x),
          y: Math.abs(newBounds.max.y - newBounds.min.y),
          z: Math.abs(newBounds.max.z - newBounds.min.z),
        };

        // Calculate length ratios
        let lengthRatios = [
          lengthSceneBounds.x / lengthMeshBounds.x,
          lengthSceneBounds.y / lengthMeshBounds.y,
          lengthSceneBounds.z / lengthMeshBounds.z,
        ];

        // Select smallest ratio in order to contain the model within the scene
        let minRatio = Math.min(...lengthRatios);

        // If you need some padding on the sides
        let padding = 0;
        minRatio -= padding;
        // Use smallest ratio to scale the model
        object.scene.scale.set(minRatio, minRatio, minRatio);
        // Set the scale of the object

        const box: any = new THREE.Box3().setFromObject(object.scene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);
        // Calculate the scale factor for each dimension
        const scaleFactor = 1 / maxDimension;
        // Set the scale of the object

        const distance = Math.max(size.x, size.y, size.z) * 1.25;
        // const fov = 45;
        // const aspect = window.innerWidth / window.innerHeight;
        // const near = -10;
        // const far = 100;

        // var helper = new THREE.BoundingBoxHelper(object.scene, 0xff0000);
        // scene.add(helper);
        pointlight.position.set(box.min.x, box.max.y, box.min.z);
        controls.target.set(center.x, center.y, center.z);
        pointlight2.position.set(box.max.x, box.min.y, box.min.z);
        directionalLight.position.set(box.x + 1, box.y, box.z);
        // Set camera position and look at center of object
        camera.position.set(
          center.x + distance,
          center.y + distance / 2,
          center.z + distance
        );
        // Adjust camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.lookAt(center);

        camera.updateProjectionMatrix();

        // object.material.name="dadaad"

        parent.add(object.scene);
        scene.add(object.scene);

        updateAllMaterials();
      }
    );

    gltfLoaderModal.load(
      // resource URL
      path + model + type,
      // called when resource is loaded
      function (object) {
        loadedobject = object.scene;

        sceneModal.add(object.scene);
        console.log(object.scene);
        // object.scene.scale.set(0.0001,0.0001,0.0001)
        modeldata['conway-machines'].forEach(element => {
          let counter = 0;
          scene.traverse(function (child: any) {
            if (child.material instanceof MeshStandardMaterial) {
              child.material.opacity = 1;
              child.material.transparent = true;
              if (child.material.name == element.rgb) {
                objectsToIntersect.push(child);
                child.name = element.rgb + counter;
                basicMaterial = child.material;
              }
            }
          });
        });

        let mat = new THREE.MeshLambertMaterial({
          color: 0xff0000,
        });
        let boxGeom = new THREE.BoxGeometry(1, 1, 1);
        let cube = new THREE.Mesh(boxGeom, mat);
        cube.name = 'newCUBE';
        cube.position.set(3, 1, 0);
        cube.scale.set(2, 2, 2);
        cube.material.fog = false;
        // scene.current.add(cube);
        var mainBounds = new THREE.Box3().setFromObject(cube);
        // console.log('main is >>>>>>>>', mainBounds);

        let bbox = new THREE.Box3().setFromObject(object.scene);
        let newBounds = new THREE.Box3().setFromObject(object.scene);
        // console.log('newBounds is >>>>>>>>', newBounds);

        let lengthSceneBounds = {
          x: Math.abs(mainBounds.max.x - mainBounds.min.x),
          y: Math.abs(mainBounds.max.y - mainBounds.min.y),
          z: Math.abs(mainBounds.max.z - mainBounds.min.z),
        };
        let lengthMeshBounds = {
          x: Math.abs(newBounds.max.x - newBounds.min.x),
          y: Math.abs(newBounds.max.y - newBounds.min.y),
          z: Math.abs(newBounds.max.z - newBounds.min.z),
        };

        // Calculate length ratios
        let lengthRatios = [
          lengthSceneBounds.x / lengthMeshBounds.x,
          lengthSceneBounds.y / lengthMeshBounds.y,
          lengthSceneBounds.z / lengthMeshBounds.z,
        ];

        // Select smallest ratio in order to contain the model within the scene
        let minRatio = Math.min(...lengthRatios);

        // If you need some padding on the sides
        let padding = 0;
        minRatio -= padding;
        // Use smallest ratio to scale the model
        object.scene.scale.set(minRatio, minRatio, minRatio);

        // object.scene.scale.x = object.scene.scale.y = object.scene.scale.z = 1;
        const root = object.scene;

        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        pointlightModal.position.set(box.min.x, box.max.y, box.min.z);

        pointlightModal2.position.set(box.max.x, box.min.y, box.min.z);
        directionalLightModal.position.set(center.x + 1, center.y, center.z);
        // Calculate distance from camera to object
        const distance = Math.max(size.x, size.y, size.z) * 2;
        const fov = 45;
        const aspect = window.innerWidth / window.innerHeight;
        const near = -1;
        const far = 100;

        // Set camera position and look at center of object
        cameraModal.position.set(
          center.x + distance / 1.2,
          center.y + distance,
          center.z + distance / 1.2
        );
        cameraModal.lookAt(center);
        // Adjust camera aspect ratio
        cameraModal.updateProjectionMatrix();

        // object.material.name="dadaad"

        updateAllMaterials();
      }
    );

    /**
     * SVG
     */

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // const rectAreaLight = new THREE.RectAreaLight(0xffffff,1,2,5)
    // rectAreaLight.rotation.set(Math.PI/2,Math.PI,0)
    // rectAreaLight.position.set(0,0.2,0)
    // scene.add(rectAreaLight)
    // var geth = new RectAreaLightHelper(rectAreaLight)
    // rectAreaLight.add(geth)

    // const directionalLight = new THREE.DirectionalLight(0xffffff,1)
    // directionalLight.shadow.mapSize.set(1024, 1024)
    // directionalLight.shadow.camera.near = 0.1
    // directionalLight.shadow.camera.far = 100

    // directionalLight.shadow.camera.left = -5
    // directionalLight.shadow.camera.top = 5
    // directionalLight.shadow.camera.right =5
    // directionalLight.shadow.camera.bottom=5
    // directionalLight.position.set(6,1, -8)
    // scene.add(directionalLight)
    // directionalLight.castShadow=true
    // directionalLight.shadow.bias=-0.0001

    // const topDirectionalLight = new THREE.DirectionalLight(0xffffff, 1)
    // topDirectionalLight.shadow.mapSize.set(1024, 1024)
    // topDirectionalLight.shadow.camera.near = 0.1
    // topDirectionalLight.shadow.camera.far = 100
    // topDirectionalLight.shadow.camera.far = 100
    // topDirectionalLight.shadow.camera.left = - 10
    // topDirectionalLight.shadow.camera.top = 10
    // topDirectionalLight.shadow.camera.right = 10
    // topDirectionalLight.position.set(15, 15,-10)
    // topDirectionalLight.castShadow=true
    // topDirectionalLight.shadow.bias=-0.0001

    // scene.add(topDirectionalLight)

    // const bottomDirectionalLight = new THREE.DirectionalLight(0xffffff, 1)
    // bottomDirectionalLight.shadow.mapSize.set(1024, 1024)
    // bottomDirectionalLight.shadow.camera.near = 0.1;
    // bottomDirectionalLight.shadow.camera.far = 100
    // bottomDirectionalLight.shadow.camera.left = - 10
    // bottomDirectionalLight.shadow.camera.top = 10
    // bottomDirectionalLight.shadow.camera.right = 10
    // bottomDirectionalLight.position.set(-6, 20,8)
    // bottomDirectionalLight.castShadow=true
    // bottomDirectionalLight.shadow.bias=-0.0001
    // scene.add(bottomDirectionalLight)
    // const bottomHelper = new THREE.DirectionalLightHelper(bottomDirectionalLight, 5);
    // scene.add(bottomHelper);

    // const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(helper);

    var zoomend;
    zoomend = 4;

    const earthDiv = document.createElement('div');
    earthDiv.className = 'label';
    earthDiv!.style.color = '#ffffff';
    earthDiv!.style.background = '#000000cc';
    earthDiv!.style.width = '200px';
    earthDiv!.style.borderRadius = '5em';
    earthDiv!.style.fontSize = '18px';
    earthDiv!.style.lineHeight = '0.8';
    earthDiv!.style.padding = '1em';
    const earthLabel = new CSS2DObject(earthDiv);

    function selectObject() {
      if (loadedobject && isClicked == false && isFullscreen == true) {
        intersects = raycaster.intersectObjects(loadedobject.children, true);

        // console.log(loadedobject);

        for (let n = 0; n < modeldata['conway-machines'].length; n++) {
          if (
            intersects[0] &&
            modeldata['conway-machines'][n].rgb ==
              intersects[0].object.material.name
          ) {
            setTimeout(() => {}, 1000);
            text = 'Item number:' + modeldata['conway-machines'][n]['item-no'];
            var text1 =
              'Part number:' + modeldata['conway-machines'][n]['part-number'];
            var text2 =
              'Description:' + modeldata['conway-machines'][n].description;
            document.getElementById('partNo')!.innerHTML = text1;
            document.getElementById('desc')!.innerHTML = text2;
            document.getElementById('itemNo')!.innerHTML = text;

            currentIntersect == true;

            modeldata['conway-machines'].forEach(element => {
              // ////(element.description);
            });
            if (intersects.length > 0) {
              // get the first intersected object
              var object = intersects[0].object;

              // check if the object is not already in the array
              if (intersectedObjects.indexOf(object) === -1) {
                // add the object to the array
                intersectedObjects.push(object);
                // console.log(intersectedObjects);
              } else {
                // object is already in array, remove it
                intersectedObjects.splice(
                  intersectedObjects.indexOf(object),
                  1
                );
                // console.log(intersectedObjects);
              }
            }

            const box1 = new THREE.Box3().setFromObject(intersects[0].object);
            const boxSize1 = box1.getSize(new THREE.Vector3()).length();
            const boxCenter1 = box1.getCenter(new THREE.Vector3());
            // intersects[0].object.material.emissive.set('#191919')
            intersects[0].object.material.opacity = 1;
            intersects[0].object.visible = true;

            var intersectPoint = intersects[0].point;

            document.getElementById('mySidebar')!.style.width = '397px';
            document.getElementById('ex32')!.style.display = 'block';

            document.body!.style.cursor = 'default';
            scene.add(cameraModal);
            sceneModal.add(cameraModal);
            shrinkBtn.style.display = 'none';

            sizes2.width = 380;
            sizes2.height = 310;
            modalRenderer.setSize(380, 300);
            modalRenderer.setPixelRatio(
              Math.min(window.devicePixelRatio * 0.95, 2)
            );
            document.getElementById('textDiv')!.style.marginLeft = '0rem';
            document.getElementById('textDiv')!.style.top = '0rem';
            document.getElementById('btnDiv')!.style.marginLeft = '0rem';
            document.getElementById('btnDiv')!.style.top = '0rem';

            // canvas!.style.display="none"
            isModalOpen = true;
            const box = new THREE.Box3().setFromObject(intersects[0].object);
            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            const spriteMaterial = new THREE.SpriteMaterial({
              alphaTest: 0.5,
              transparent: true,
              depthTest: false,
              depthWrite: false,
            });

            const distance = boxSize / Math.tan((Math.PI * camera.fov) / 360);

            var vFOV = (camera.fov * Math.PI) / 180;
            var aspect = window.width / window.height;
            var objectHeight: any;
            var objectDepth: any;

            if (box.max.x > box.min.x && box.max.y > box.min.y) {
              objectHeight = box.max.y - box.min.y;
              objectDepth = box.max.x - box.min.x;
            }
            if (box.max.x < box.min.x && box.max.y < box.min.y) {
              objectHeight = box.min.y - box.max.y;
              objectDepth = box.min.x - box.max.x;
            }
            if (box.max.z - box.min.z > box.max.y - box.min.y) {
              objectHeight = box.max.z - box.min.z;
              objectDepth = box.max.x - box.min.x;
            }
            var zoomValue = objectHeight / 2 / Math.tan(vFOV / 2) - objectDepth;

            intersects[0].object.material.emissive.set('#000000');
            loadedobject.traverse(function (child: any) {
              if (
                intersects[0] != null &&
                child.material instanceof MeshStandardMaterial &&
                child.material.name != intersects[0].object.material.name
              ) {
                child.material.emissive.set('#000000');
                child.material.opacity = 0;
                child.visible = false;
              }
            });
            if (zoomValue < 0.01) {
              zoomValue = zoomValue * 1000;
            }
            if (-zoomValue < 0) {
              zoomValue = -zoomValue * 2;
            }
            if (-zoomValue > 4) {
              zoomValue = zoomValue / 500;
            }
            gsap.to(cameraModal.position, {
              duration: 0,
              x: boxCenter.x,
              y: boxCenter.y + 0.1,
              z: boxCenter.z + distance * 0.5,
              onUpdate: function () {
                // console.log("Zooom je trenutno:"+camera.zoom);
                camera.updateProjectionMatrix();
              },
            });

            gsap.to(controls1.target, {
              duration: 0,
              x: boxCenter.x,
              y: boxCenter.y,
              z: boxCenter.z,
              onUpdate: function () {
                controls1.update();
                camera.updateProjectionMatrix();
              },
            });

            shrinkBtn.addEventListener('click', () => {
              document.getElementById('mySidebar')!.style.width = '397px';
              document.getElementById('ex32')!.style.display = 'block';
              shrinkBtn!.style.display = 'none';

              sizes2.width = 380;
              sizes2.height = 310;
              modalRenderer.setSize(380, 310);
              modalRenderer.setPixelRatio(
                Math.min(window.devicePixelRatio * 0.95, 2)
              );
              document.getElementById('textDiv')!.style.marginLeft = '0rem';
              document.getElementById('textDiv')!.style.top = '0rem';
              document.getElementById('btnDiv')!.style.marginLeft = '0rem';
              document.getElementById('btnDiv')!.style.top = '0rem';
            });

            expandBtn.addEventListener('click', () => {
              document.getElementById('mySidebar')!.style.width = '100%';
              document.getElementById('textDiv')!.style.marginLeft = '70rem';
              document.getElementById('textDiv')!.style.top = '-38rem';
              document.getElementById('btnDiv')!.style.marginLeft = '70rem';
              document.getElementById('btnDiv')!.style.top = '-38rem';
              expandBtn!.style.display = 'none';
              shrinkBtn!.style.display = 'block';

              sizes2.width = 1000;
              sizes2.height = 588;
              modalRenderer.setSize(1000, 588);
              modalRenderer.setPixelRatio(
                Math.min(window.devicePixelRatio * 0.95, 2)
              );
            });

            var closeBtn: any = document.getElementById('closebtn');
            closeBtn.addEventListener('click', () => {
              document.getElementById('mySidebar')!.style.width = '0';
              // modal.style.display = 'none';
              document.getElementById('canvas1')!.style.display = 'block';
              document.getElementById('ex32')!.style.display = 'none';
              expandBtn!.style.display = 'block';
              shrinkBtn!.style.display = 'none';

              isModalOpen = false;
            });
          } else {
            if (intersects[0] != null) {
              if (!md.includes(intersects[0].object.material.name)) {
                intersects[0] = null;
                // buttonLabel.visible=false
              }
              loadedobject.traverse(function (child: any) {
                if (
                  intersects[0] != null &&
                  child.material instanceof MeshStandardMaterial &&
                  child.material.name != intersects[0].object.material.name &&
                  project == 'gray'
                ) {
                  child.material.emissive.set('#000000');
                  child.material.opacity = 1;
                  child.visible = true;
                  // buttonDiv!.style.display="none"
                }
              });
            }
          }
        }
      }
    }

    /**
     * Sizes
    
     */
    // if (isFullscreen == true) {
    //   window.addEventListener('resize', () => {
    //     // Update sizes
    //     sizes.width = window.innerWidth;
    //     sizes.height = window.innerHeight;

    //     // Update camera
    //     camera.aspect = sizes.width / sizes.height;
    //     camera.updateProjectionMatrix();

    //     // Update renderer
    //     renderer.setSize(sizes.width, sizes.height);
    //     renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.95, 2));
    //   });
    // } else if (isFullscreen == false) {
    //   window.addEventListener('resize', () => {
    //     // Update sizes
    //     sizes.width = 833;
    //     sizes.height = 659;

    //     // Update camera
    //     camera.aspect = sizes.width / sizes.height;
    //     camera.updateProjectionMatrix();

    //     // Update renderer
    //     renderer.setSize(sizes.width, sizes.height);
    //     renderer.setPixelRatio(Math.min(window.devicePixelRatio * 0.95, 2));
    //   });
    // }
    window.addEventListener('dblclick', () => {});

    window.addEventListener('mousedown', event => {
      selectObject();
    });

    function mouseUp() {
      if (mDragging === false && !isModalOpen) {
        intersects = raycaster.intersectObjects(loadedobject.children);
        // intersects[0].object.material.emissive.set('#ffcb06')
        // scene.remove(earthLabel)
        if (intersects[0] == undefined) {
          isClicked = false;
          clickedMesh = null;
          scene.remove(earthLabel);
        } else {
          if (isClicked && intersects[0]) {
            // isClicked = false

            // clickedMesh = null
            scene.traverse(function (child: any) {
              if (child.material instanceof MeshStandardMaterial) {
                child.material.emissive.set('#000000');
                child.material.opacity = 0.1;
                intersects[0].object.material.emissive.set('#ffcb06');
                intersects[0].object.material.color.setHex('#000000');

                intersects[0].object.material.opacity = 1;
                scene.add(earthLabel);
              }
            });
          }
        }
      }
    }

    /**
     * Camera
     */
    // Base camera

    // Controls
    // const controls = new OrbitControls(camera, canvas)
    // controls.enableDamping = true
    const controls1 = new OrbitControls(cameraModal, canvasModal);
    controls1.minDistance = 0.15;
    controls1.maxDistance = 1;
    controls1.enableDamping = true;

    const controls = new OrbitControls(camera, canvas);
    controls.minDistance = -1000;
    controls.maxDistance = 4.4;
    controls.enableDamping = true;
    controls.addEventListener('start', () => {});
    // controls.addEventListener('change',()=>{
    //     isControlling=true
    //     ////("change");

    //     })
    controls.addEventListener('end', ev => {
      intersects = raycaster.intersectObjects(loadedobject.children);
      // clickedMesh = null
    });
    // co

    /**
     * Renderer
     */

    let hex;
    /**
     * Animate
     */

    let group1 = new THREE.Group();
    let intersects2;
    // var i;
    let sprite;
    const spriteMaterial = new THREE.SpriteMaterial({
      alphaTest: 0.5,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(250, 250, 250);
    sprite.scale.set(60, 60, 1);
    scene.add(sprite);
    window.addEventListener('mouseover', () => {
      console.log('dada');
      hover();
    });

    function hover() {
      if (loadedobject && isClicked == false && isFullscreen == true) {
        intersects = raycaster.intersectObjects(loadedobject.children);

        for (let n = 0; n < modeldata['conway-machines'].length; n++) {
          if (
            intersects[0] &&
            modeldata['conway-machines'][n].rgb ==
              intersects[0].object.material.name
          ) {
            setTimeout(() => {}, 1000);
            // text = "Item number:" + modeldata['conway-machines'][n]['item-no']
            // var text1 = "Part number:" + modeldata['conway-machines'][n]['part-number']
            // var text2 = "Description:" + modeldata['conway-machines'][n].description
            // document.getElementById("partNo").innerHTML = text1;
            // document.getElementById("desc").innerHTML = text2;
            // document.getElementById("itemNo").innerHTML = text;

            currentIntersect == true;
            // ////(scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0));
            // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.color.set('#ffffff')
            //     if(scene.children.material instanceof MeshStandardMaterial){
            // scene.children.material.emissive.set('#ffffff')
            //     }
            // loade
            modeldata['conway-machines'].forEach(element => {
              // ////(element.description);
            });

            // tooltipPartName = document.getElementById("name").innerHTML = modeldata['conway-machines'][1]['part-number']

            // tooltiptext = document.getElementById("description").innerHTML = modeldata['conway-machines'][1].description

            const box1 = new THREE.Box3().setFromObject(intersects[0].object);
            const boxSize1 = box1.getSize(new THREE.Vector3()).length();
            const boxCenter1 = box1.getCenter(new THREE.Vector3());
            // intersects[0].object.material.emissive.set('#00ff00')
            // intersects[0].object.material.opacity = 1
            // intersects[0].object.visible = true
            document.body!.style.cursor = 'pointer';

            // text = modeldata['conway-machines'][n]['item-no'] + '<br>' + modeldata['conway-machines'][n]['part-number'] + '<br>' + modeldata['conway-machines'][n].description
            // earthDiv.innerHTML = text;
            // earthLabel.position.set(box1.max.x, box1.max.y, box1.max.z);
            // scene.add(buttonLabel);
            // var intersectPoint=intersects[0].point
            //         buttonDiv!.style.display="block"
            //         if(intersectPoint.z<0){
            //     buttonLabel.position.set(boxCenter1.x,boxCenter1.y,box1.min.z)

            //         }
            //          if(intersectPoint.z>0){
            //     buttonLabel.position.set(boxCenter1.x,boxCenter1.y,box1.max.z)

            //         }x

            // earthLabel.layers.set(0);
            //   firstIntersectedObject = intersects[0].object;
            //     firstIntersectPoint = intersects[0].point;
            //     buttonLabel.position.set(firstIntersectPoint.x, firstIntersectPoint.y, firstIntersectPoint.z);
            // buttonLabel.visible = true;
            // handle clicking on the object
            //
            // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.emissive.set('#FFCB06')
            // scene.traverse(function (child) {
            //     if (child.material instanceof MeshStandardMaterial) {
            //         if(child.material.name == modeldata['conway-machines'][n].rgb){
            //             ////("asoijasjoiajso");
            //             child.material.emissive.set('#FFCB06')
            //         }
            //         else{
            //             child.material.emissive.set('#000000')

            //         }
            // }})
            // for(let x=0;x<modeldata['conway-machines'][n].group.length;x++){
            //     ////(modeldata['conway-machines'][n].group[x].material);
            //     // modeldata['conway-machines'][n].group[x].material.emissive.set('#FFCB06')
            // }
          } else {
            if (intersects[0] != null) {
              if (!md.includes(intersects[0].object.material.name)) {
                intersects[0] = null;
              }
              loadedobject.traverse(function (child: any) {
                if (
                  intersects[0] != null &&
                  child.material instanceof MeshStandardMaterial &&
                  child.material.name != intersects[0].object.material.name &&
                  project == 'gray'
                ) {
                  child.material.emissive.set('#000000');
                  child.material.opacity = 1;
                  child.visible = true;
                  // buttonDiv!.style.display="none"
                }
                if (
                  intersects[0] != null &&
                  child.material instanceof MeshStandardMaterial &&
                  child.material.name != intersects[0].object.material.name &&
                  project == 'transparent'
                ) {
                  child.material.emissive.set('#000000');
                  child.material.opacity = 0;
                  // child.visible=false
                  scene.add(earthLabel);
                }
              });
              // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.emissive.set('#ffffff')
              // annotation!.style.display = "block"
            } else {
              // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.emissive.set('#000000')

              loadedobject.traverse(function (child: any) {
                if (child.material instanceof MeshStandardMaterial) {
                  child.material.emissive.set('#000000');
                  child.material.opacity = 1;
                  // child.visible = true
                  child.material.transparent = true;
                  // buttonLabel.visible=false
                  // buttonDiv!.style.display="None"
                  document.body!.style.cursor = 'default';
                }
              });
              // annotation!.style.display = "none"
              // ////("sadsadasdasd");
            }
          }
          // }
        }
      }
    }
    function hoverSmall() {
      if (loadedobject && isClicked == false && isFullscreen == false) {
        intersects = raycaster.intersectObjects(loadedobject.children);

        for (let n = 0; n < modeldata['conway-machines'].length; n++) {
          if (
            intersects[0] &&
            modeldata['conway-machines'][n].rgb ==
              intersects[0].object.material.name
          ) {
            setTimeout(() => {}, 1000);
            // text = "Item number:" + modeldata['conway-machines'][n]['item-no']
            // var text1 = "Part number:" + modeldata['conway-machines'][n]['part-number']
            // var text2 = "Description:" + modeldata['conway-machines'][n].description
            // document.getElementById("partNo").innerHTML = text1;
            // document.getElementById("desc").innerHTML = text2;
            // document.getElementById("itemNo").innerHTML = text;

            currentIntersect == true;
            // ////(scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0));
            // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.color.set('#ffffff')
            //     if(scene.children.material instanceof MeshStandardMaterial){
            // scene.children.material.emissive.set('#ffffff')
            //     }
            // loade
            modeldata['conway-machines'].forEach(element => {
              // ////(element.description);
            });

            // tooltipPartName = document.getElementById("name").innerHTML = modeldata['conway-machines'][1]['part-number']

            // tooltiptext = document.getElementById("description").innerHTML = modeldata['conway-machines'][1].description

            const box1 = new THREE.Box3().setFromObject(intersects[0].object);
            const boxSize1 = box1.getSize(new THREE.Vector3()).length();
            const boxCenter1 = box1.getCenter(new THREE.Vector3());
            intersects[0].object.material.emissive.set('#ff0000');

            document.body!.style.cursor = 'pointer';
            // intersects[0].object.material.opacity = 1
            // intersects[0].object.visible = true
            // text = modeldata['conway-machines'][n]['item-no'] + '<br>' + modeldata['conway-machines'][n]['part-number'] + '<br>' + modeldata['conway-machines'][n].description
            // earthDiv.innerHTML = text;
            // earthLabel.position.set(box1.max.x, box1.max.y, box1.max.z);
            // scene.add(buttonLabel);
            // var intersectPoint=intersects[0].point
            //         buttonDiv!.style.display="block"
            //         if(intersectPoint.z<0){
            //     buttonLabel.position.set(boxCenter1.x,boxCenter1.y,box1.min.z)

            //         }
            //          if(intersectPoint.z>0){
            //     buttonLabel.position.set(boxCenter1.x,boxCenter1.y,box1.max.z)

            //         }x

            // earthLabel.layers.set(0);
            //   firstIntersectedObject = intersects[0].object;
            //     firstIntersectPoint = intersects[0].point;
            //     buttonLabel.position.set(firstIntersectPoint.x, firstIntersectPoint.y, firstIntersectPoint.z);
            // buttonLabel.visible = true;
            // handle clicking on the object
            //
            // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.emissive.set('#FFCB06')
            // scene.traverse(function (child) {
            //     if (child.material instanceof MeshStandardMaterial) {
            //         if(child.material.name == modeldata['conway-machines'][n].rgb){
            //             ////("asoijasjoiajso");
            //             child.material.emissive.set('#FFCB06')
            //         }
            //         else{
            //             child.material.emissive.set('#000000')

            //         }
            // }})
            // for(let x=0;x<modeldata['conway-machines'][n].group.length;x++){
            //     ////(modeldata['conway-machines'][n].group[x].material);
            //     // modeldata['conway-machines'][n].group[x].material.emissive.set('#FFCB06')
            // }
          } else {
            if (intersects[0] != null) {
              if (!md.includes(intersects[0].object.material.name)) {
                intersects[0] = null;
              }
              loadedobject.traverse(function (child: any) {
                if (
                  intersects[0] != null &&
                  child.material instanceof MeshStandardMaterial &&
                  child.material.name != intersects[0].object.material.name
                ) {
                  child.material.emissive.set('#000000');
                  child.material.opacity = 1;
                  child.visible = true;
                  // buttonDiv!.style.display="none"
                }
                if (
                  intersects[0] != null &&
                  child.material instanceof MeshStandardMaterial &&
                  child.material.name != intersects[0].object.material.name &&
                  project == 'transparent'
                ) {
                  child.material.emissive.set('#000000');
                  child.material.opacity = 0;
                  // child.visible=false
                  scene.add(earthLabel);
                }
              });
              // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.emissive.set('#ffffff')
              // annotation!.style.display = "block"
            } else {
              // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.emissive.set('#000000')

              loadedobject.traverse(function (child: any) {
                if (child.material instanceof MeshStandardMaterial) {
                  child.material.emissive.set('#000000');
                  child.material.opacity = 1;
                  // child.visible = true
                  child.material.transparent = true;
                  // buttonLabel.visible=false
                  // buttonDiv!.style.display="None"
                  document.body!.style.cursor = 'default';
                }
              });
              // annotation!.style.display = "none"
              // ////("sadsadasdasd");
            }
          }
          // }
        }
      }
    }

    // const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);
    // var n;
    function render() {
      renderer.render(scene, camera);
    }
    // function AutoRotate() {

    //     controls.autoRotate = true;
    //     controls.autoRotateSpeed = 4;
    // }
    const tick = () => {
      // Update controls
      controls.update();
      raycaster.set(rayOrigin, rayDirection);
      annotation = document.getElementById('annotation');

      // ////(camera.position);
      // Render
      renderer.render(scene, camera);
      // composer.render()
      modalRenderer.render(sceneModal, cameraModal);
      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
      // ////(groupA.length);
      raycaster.setFromCamera(mouse, camera);

      //   ////(modeldata['conway-machines'][0].hex)

      hex = modeldata['conway-machines'][0].hex;
      const objectsToTest = groupA;
      // ////(objectsToTest);
      // for(let n=0;n<modeldata['conway-machines'].length;n++){
      // intersects = raycaster.intersectObjects(modeldata['conway-machines'][n].group)

      // }
      let intersects;
      hover();
      hoverSmall();
    };

    // scene.getObjectByName(modeldata['conway-machines'][n].rgb + 0).material.emissive.set('#00ff00')

    tick();

    var id;

    function animate() {
      id = requestAnimationFrame(animate);

      var delta = clock.getDelta();

      if (mixer) mixer.update(delta);
      // interactionManager.update();
      TWEEN.update();
      // renderer.render(scene, camera,composer);
      labelRenderer.render(scene, camera);
      modalRenderer.render(sceneModal, cameraModal);
      // composer.render()
      renders();
    }

    function renders() {
      const time = Date.now() * 0.0005;

      renderer.render(scene, camera);

      modalRenderer.render(sceneModal, cameraModal);
    }
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.0.5/gsap.min.js"></Script>
      <div id="loadingModal" className="modals">
        <div className="modal-dialog">
          <div className="modal-contents">
            <div className="modal-body">
              <div className="spinner-border" role="status">
                <div className="loader"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="image-container">
        <div className="move"></div>
        <div className="scroll"></div>
        <div className="pan"></div>
        <div className="selectModel"></div>
      </div>

      {/* <!-- <div className="popup-container">
  <div className="popup-content">
    <div className="selectModel"></div>
    <div className="scroll"></div>
    <div className="pan"></div>


    <button className="close-btn">&times;</button>
  </div>
</div> --> */}

      <div id="mySidebar" className="sidebar" style={{alignItems: 'center'}}>
        <div
          style={{
            backgroundColor: '#ffe583',
            top: '-4rem',
            position: 'relative',
            height: '4rem',
            display: 'flex',
          }}
        >
          <h1
            style={{
              top: '1.2rem',
              marginLeft: '1rem',
              position: 'relative',
              fontSize: 'large',
            }}
          >
            Part information
          </h1>
          <button
            className="expandbtn"
            id="ex32"
            style={{
              width: '20px',
              height: '20px',
              border: 'none',
              backgroundColor: '#ffe583',
            }}
          ></button>{' '}
          <button
            className="shrink"
            id="sh32"
            style={{
              width: '20px',
              height: '20px',
              border: 'none',
              position: 'absolute',
              backgroundColor: '#ffe583',
            }}
          ></button>{' '}
          <a className="closebtn" id="closebtn">
            ×
          </a>
        </div>
        <canvas className="webgl2" id="canvas2"></canvas>
        <br />
        <br />
        <div id="textDiv" style={{position: 'relative'}}>
          <label
            id="partNo"
            style={{marginLeft: '1rem', position: 'relative'}}
          ></label>
          <br />
          <br />
          <label
            id="desc"
            style={{marginLeft: '1rem', position: 'relative'}}
          ></label>
          <br />
          <br />
          <label
            id="itemNo"
            style={{marginLeft: '1rem', position: 'relative'}}
          ></label>
          <br />
          <br />
          <p
            style={{
              marginLeft: '1rem',
              lineHeight: '1.25',
              alignItems: 'center',
              position: 'relative',
            }}
            id="para"
          >
            Conway End fitting Operator Side that goes
            <br />
            into the gripper bars for Bobst die cutters
            <br />
            SP 900 E and SP 900 ER; SP1080 E and
            <br />
            SP 1080 EEG; SPO 1080 E and SPO 1080 EEG; Contact us for a quote.
          </p>
          <br />
          <br />
        </div>
        <div id="btnDiv" style={{position: 'relative'}}>
          <button
            id="decrement"
            style={{
              width: '2rem',
              height: '3rem',
              marginLeft: '3rem',
              marginTop: '5rem',
            }}
          >
            -
          </button>{' '}
          <input
            id="number"
            defaultValue="0"
            style={{
              width: '2rem',
              height: '2.7rem',
              textAlign: 'center',
              position: 'relative',
              left: '-.25rem',
            }}
          />{' '}
          <button
            id="increment"
            style={{
              width: '2rem',
              height: '3rem',
              marginLeft: '0',
              position: 'relative',
              left: '-.25rem',
            }}
          >
            +
          </button>
          <button
            className="addCart"
            id="rfq"
            style={{
              width: '10rem',
              height: '3rem',
              marginLeft: '3rem',
              fontSize: 'large',
            }}
          >
            ADD TO RFQ
          </button>
        </div>
      </div>
      <canvas className="webgl" id="canvas1"></canvas>
      <div id="fullscreen-overlay">
        <p className="loadingtypo" id="typo">
          Loading...
        </p>
        <div id="spinner"></div>
      </div>
      <Button id="full" className="full">
        Full screen
      </Button>

      <div id="modal" className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <span className="close">&times;</span>
            <h2 id="modal_header">Conway Machines</h2>
          </div>
          <div className="modal-body">
            <canvas className="webgl2" id="canvas2"></canvas>
            <div>
              <label id="partNo" style={{marginLeft: '1rem'}}></label>
              <br />
              <br />
              <label id="desc" style={{marginLeft: '1rem'}}></label>
              <br />
              <br />
              <label id="itemNo" style={{marginLeft: '1rem'}}></label>
              <br />
              <br />
              <label style={{marginLeft: '1rem'}}>Amount:</label>{' '}
              <button
                id="decrement"
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  marginLeft: '1rem',
                  backgroundColor: '#f1e204',
                }}
              >
                -
              </button>
              <input
                id="number"
                defaultValue="0"
                style={{width: '1.5rem', height: '1.5rem', textAlign: 'center'}}
              />
              <button
                id="increment"
                style={{
                  width: '1.5rem',
                  height: '1.5rem',
                  marginLeft: '.2rem',
                  backgroundColor: '#f1e204',
                }}
              >
                +
              </button>
              <br />
              <br />
              <button
                className="addCart"
                style={{width: '3rem', height: '3rem'}}
              ></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThreeDView;
