// PS1 "Nature Tech" Aesthetic Background
const scene = new THREE.Scene();
const skyColor = new THREE.Color(0x87ceeb); // Classic Sky Blue
scene.background = skyColor;
scene.fog = new THREE.Fog(0x87ceeb, 10, 50);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Low-res rendering setup
const RENDER_SCALE = 0.3; 
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(window.devicePixelRatio * RENDER_SCALE);
renderer.setSize(window.innerWidth, window.innerHeight);

const bgContainer = document.getElementById('three-bg');
if (bgContainer) {
    bgContainer.appendChild(renderer.domElement);
}

// Track/Environment Spline
const trackPoints = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(15, 2, 25),
    new THREE.Vector3(30, -2, 50),
    new THREE.Vector3(10, 5, 75),
    new THREE.Vector3(-15, 0, 50),
    new THREE.Vector3(-10, -3, 25),
    new THREE.Vector3(0, 0, 0)
];

const curve = new THREE.CatmullRomCurve3(trackPoints);
curve.closed = true;

// Visual Track - Checkered Grass Path
const trackGeometry = new THREE.TubeGeometry(curve, 100, 1.2, 8, true);
const trackMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x44aa44, // Grass Green
    wireframe: false,
    flatShading: true
});
const trackMesh = new THREE.Mesh(trackGeometry, trackMaterial);
scene.add(trackMesh);

// Add "Grass Texture" simulation (Checkered wireframe overlay)
const trackWire = new THREE.Mesh(
    trackGeometry,
    new THREE.MeshBasicMaterial({ color: 0x228822, wireframe: true, transparent: true, opacity: 0.3 })
);
scene.add(trackWire);

// Add a "Pixel Sun"
const sunGeo = new THREE.IcosahedronGeometry(4, 0);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sun = new THREE.Mesh(sunGeo, sunMat);
sun.position.set(20, 30, -20);
scene.add(sun);

// Floating Nature-themed Shapes (Flowers/Clouds/Toys)
const shapes = [];
const geometries = [
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.IcosahedronGeometry(1.2, 0),
    new THREE.TorusGeometry(1, 0.4, 6, 8),
    new THREE.OctahedronGeometry(1.5, 0)
];

const colors = [0xffffff, 0xffaa00, 0xff4444, 0x00ffff]; // White, Orange, Red, Cyan

for (let i = 0; i < 50; i++) {
    const material = new THREE.MeshPhongMaterial({ 
        color: colors[Math.floor(Math.random() * colors.length)],
        flatShading: true,
        shininess: 0
    });
    const mesh = new THREE.Mesh(geometries[Math.floor(Math.random() * geometries.length)], material);
    
    const t = Math.random();
    const pos = curve.getPoint(t);
    mesh.position.set(
        pos.x + (Math.random() - 0.5) * 20,
        pos.y + (Math.random() - 0.5) * 20,
        pos.z + (Math.random() - 0.5) * 20
    );
    
    mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    scene.add(mesh);
    shapes.push({
        mesh: mesh,
        rotX: (Math.random() - 0.5) * 0.04,
        rotY: (Math.random() - 0.5) * 0.04
    });
}

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(1, 1, 1);
scene.add(sunLight);
scene.add(new THREE.AmbientLight(0xaaaaaa));

let progress = 0;

function animateBg() {
    requestAnimationFrame(animateBg);
    
    // Move camera along curve
    progress += 0.0004;
    const pos = curve.getPoint(progress % 1);
    const lookAtPos = curve.getPoint((progress + 0.02) % 1);
    
    camera.position.copy(pos);
    camera.position.y += 3.5; // Increased height to avoid clipping
    camera.lookAt(lookAtPos.clone().add(new THREE.Vector3(0, 1.5, 0))); // Look slightly above track
    
    // Rotate shapes
    shapes.forEach(s => {
        s.mesh.rotation.x += s.rotX;
        s.mesh.rotation.y += s.rotY;
        s.mesh.position.y += Math.sin(Date.now() * 0.002 + s.mesh.position.x) * 0.01;
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio * RENDER_SCALE);
});

animateBg();
