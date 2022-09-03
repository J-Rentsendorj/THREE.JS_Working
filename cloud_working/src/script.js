import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, .3)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, .1)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

const flash = new THREE.PointLight(0x062d89, 30, 500, 1.7)
flash.position.set(200,300,100);
scene.add(flash)

gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(flash, 'intensity').min(0).max(30).step(0.001)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(60, sizes.width / sizes.height, 1, 1000)
camera.position.z = 2.5
camera.position.y = -6.5
camera.rotation.x = 1.16
camera.rotation.y = 1
camera.rotation.z = 0.27
scene.add(camera)

// // Rain Particles 
// const rainGeometry = new THREE.BufferGeometry()
// const rainCount = 1500
// const positions = new Float32Array(rainCount * 3)

// for(let i = 0; i < rainCount * 3; i++) 
// {
//     positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
// }
// rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 

// //Rain Material
// const rainMaterial = new THREE.PointsMaterial({
//     size: 0.015, 
//     color: 0xaaaaaa,
//     transparent: true
// })

// // Points
// const rain = new THREE.Points(rainGeometry, rainMaterial)
// scene.add(rain)

let rainGeometry = new THREE.BufferGeometry()
const rainCount = 1500 
for(let i = 0; i < rainCount; i++) {
    let rainDrop = new THREE.Vector3(
        Math.random() * 400 - 200,
        Math.random() * 500 - 250,
        Math.random() * 400 - 200,
        )
        rainDrop.velocity = {}
        rainDrop.velocity = 0
        // rainGeometry.push(rainDrop)
    }
    const rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.1,
        transparent: true
    })

const rain = new THREE.Points(rainGeometry, rainMaterial)
scene.add(rain)

const cloudParticles = []
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
textureLoader.load('/textures/particles/smoke_05.png', function(texture) {
    const cloudGeometry = new THREE.PlaneGeometry(400, 400)
    const cloudMaterial = new THREE.MeshLambertMaterial({ 
        map: texture,
        transparent: true,
        // alphaMap: texture,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    })
    for(let p = 0; p < 25; p++) {
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
        cloud.position.set(
            Math.random()*800 -400,
            500,
            Math.random()*500 - 450
        )
        cloud.rotation.x = 1.16
        cloud.rotation.y = -0.12
        cloud.rotation.z = Math.random()*360
        cloud.material.opacity = .6
        cloudParticles.push(cloud)
        scene.add(cloud)
    }
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Cloud rotation
    cloudParticles.forEach(p => {
        p.rotation.z -= 0.002
    })

    // // Rain Drops
    // rainy.forEach(p => {
    //     p.velocity -= 0.1 + Math.random() * 0.1;
    //     p.y += p.velocity;
    //     if (p.y < -200) {
    //         p.y = -200;
    //         p.velocity = 0
    //     }
    // })
    // rainGeometry.verticesNeedUpdate = true
    // rain.rotation.y +=0.002;

    // Flash 
    if(Math.random() > 0.93 || flash.power > 100){
        if(flash.power < 100) flash.power
        flash.position.set(
            Math.random()*400,
            300 + Math.random() *200,
            100
        )
        flash.power = 50 + Math.random() * 500
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()