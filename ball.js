// Interactive Pixelated 3D Beach Ball
function initBeachBall() {
    const containers = document.querySelectorAll('.ball-demo');
    
    containers.forEach(container => {
        container.innerHTML = ''; 
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
        renderer.setPixelRatio(0.4); 
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        const ballGroup = new THREE.Group();
        scene.add(ballGroup);

        const colors = [0xff3333, 0xffffff, 0xffff33, 0xffffff, 0x3366ff, 0xffffff];
        const sliceAngle = (Math.PI * 2) / 6;

        colors.forEach((color, i) => {
            const sliceGeo = new THREE.SphereGeometry(1, 4, 12, i * sliceAngle, sliceAngle);
            const sliceMat = new THREE.MeshLambertMaterial({ color: color, flatShading: true });
            const slice = new THREE.Mesh(sliceGeo, sliceMat);
            ballGroup.add(slice);
        });

        const capGeo = new THREE.SphereGeometry(0.25, 8, 4);
        const capMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });
        const topCap = new THREE.Mesh(capGeo, capMat);
        topCap.position.y = 0.85;
        ballGroup.add(topCap);
        const bottomCap = topCap.clone();
        bottomCap.position.y = -0.85;
        ballGroup.add(bottomCap);

        const light = new THREE.DirectionalLight(0xffffff, 1.5);
        light.position.set(2, 5, 2);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        camera.position.z = 2.1;

        // Interaction State
        let isDragging = false;
        let previousMouseX = 0;
        let previousMouseY = 0;
        let velocityX = 0.04; // Initial spin
        let velocityY = 0.01;

        container.style.cursor = 'grab';

        container.addEventListener('pointerdown', (e) => {
            isDragging = true;
            container.style.cursor = 'grabbing';
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - previousMouseX;
            const deltaY = e.clientY - previousMouseY;
            
            ballGroup.rotation.y += deltaX * 0.01;
            ballGroup.rotation.x += deltaY * 0.01;
            
            velocityX = deltaX * 0.02;
            velocityY = deltaY * 0.02;
            
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
        });

        window.addEventListener('pointerup', () => {
            isDragging = false;
            container.style.cursor = 'grab';
        });

        function animate() {
            requestAnimationFrame(animate);
            
            if (!isDragging) {
                // Apply inertia
                ballGroup.rotation.y += velocityX;
                ballGroup.rotation.x += velocityY;
                
                // Damping (Slow down to a base speed)
                velocityX *= 0.95;
                velocityY *= 0.95;
                
                // Keep a very slight base rotation
                if (Math.abs(velocityX) < 0.005) velocityX = 0.005;
            }
            
            // PS1 jitter
            ballGroup.position.x = Math.sin(Date.now() * 0.01) * 0.005;
            
            renderer.render(scene, camera);
        }
        animate();
    });
}

window.addEventListener('load', initBeachBall);