import * as THREE from 'three'
import gsap from 'gsap'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// --- Objects ---
const group = new THREE.Group()
scene.add(group)

const geometry = new THREE.BoxGeometry(1, 1, 1)

// Block 1 (Red)
const material1 = new THREE.MeshBasicMaterial({ color: 0xcc0000 })
const mesh1 = new THREE.Mesh(geometry, material1)
mesh1.position.x = -2 
group.add(mesh1)

// Block 2 (Green - Center)
const material2 = new THREE.MeshBasicMaterial({ color: 0x00cc00 })
const mesh2 = new THREE.Mesh(geometry, material2)
group.add(mesh2)

// Block 3 (Blue)
const material3 = new THREE.MeshBasicMaterial({ color: 0x0000cc })
const mesh3 = new THREE.Mesh(geometry, material3)
mesh3.position.x = 2 
group.add(mesh3)


// --- Setup: Sizes, Camera ---
const sizes = {
    width: window.innerWidth, // Use dynamic window size
    height: window.innerHeight
}

// CRITICAL FIX: Changing FOV from 100 to 75 degrees 
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5 
scene.add(camera)


// --- Setup: Renderer and Controls ---
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
// Set background clear color
renderer.setClearColor(0x1a1a1a, 1)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true 

// --- Animation ---
gsap.to(group.position, { 
    duration: 2, 
    delay: 1, 
    x: 1.5, 
    ease: "power2.inOut",
    onComplete: () => {
        gsap.to(group.position, { 
            duration: 2, 
            x: 0, 
            ease: "power2.inOut"
        })
    }
})

const clock = new THREE.Clock() 

const tick = () => {
    const elapsedTime = clock.getElapsedTime() 

    // Continuous Rotation: 
    mesh1.rotation.y = elapsedTime * 0.5 
    mesh2.rotation.x = elapsedTime * 0.75 
    mesh3.rotation.z = elapsedTime * 1.0 
    
    // Update Controls (REQUIRED)
    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

// Add event listener for resizing (good practice)
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

tick()
