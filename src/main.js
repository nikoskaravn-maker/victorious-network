import './style.css';
import gsap from 'gsap';
import * as THREE from 'three';
// GLTFLoader removed since we use procedural modeling now

// ==========================================================================
// VICTORIOUS NETWORK - INTERACTIVE UX CONTROLLER (3D LOGO & INTRO REVEAL)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Systems
  generate3DTextBlocks();
  initGlassShatterShowcase();
  initHeaderScroll();
  revealGlassVault();
  initProjectsSphere();
  initHologramChamber();
});

// ==========================================================================
// 1. Reveal Glass Vault on Page Load
// ==========================================================================
function revealGlassVault() {
  gsap.fromTo('.hero-vault-wrapper',
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
  );
}

// ==========================================================================
// 2. Reveal Hero Content Grid After Shatter
// ==========================================================================
function triggerHeroReveal() {
  gsap.to('.hero-content-grid', {
    opacity: 1,
    pointerEvents: 'auto',
    duration: 0.8,
    ease: 'power2.out'
  });

  gsap.fromTo('.hero-content-grid > *',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', stagger: 0.2 }
  );
}

// ==========================================================================
// 3. Header Scroll background switch
// ==========================================================================
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.remove('bg-transparent');
      header.classList.add('bg-[#010717]/90', 'backdrop-blur-md');
    } else {
      header.classList.add('bg-transparent');
      header.classList.remove('bg-[#010717]/90', 'backdrop-blur-md');
    }
  });
}

// ==========================================================================
// 4. Interactive Glass-Shattering Component & 3D Parallax Tilt
// ==========================================================================
function initGlassShatterShowcase() {
  const container = document.getElementById('glass-vault-container');
  const shardsWrapper = document.getElementById('glass-shards-wrapper');
  const logo = document.getElementById('glass-logo-element');
  const glassFace = document.getElementById('glass-face');

  if (!container || !shardsWrapper || !logo) return;

  logo.classList.add('glass-logo-bouncing');

  let isShattered = false;

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const rotateY = (x / (rect.width / 2)) * 20; 
    const rotateX = -(y / (rect.height / 2)) * 20;
    
    gsap.to(container, {
      rotationY: rotateY,
      rotationX: rotateX,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(container, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  };

  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);

  container.addEventListener('click', () => {
    if (isShattered) return;
    isShattered = true;

    logo.classList.remove('glass-logo-bouncing');
    if (glassFace) {
      glassFace.style.animation = 'none';
    }

    const width = 320; 
    const height = 320;
    
    const shardCount = 35;
    for (let i = 0; i < shardCount; i++) {
      const shard = document.createElement('div');
      shard.className = 'glass-shard';

      const shardWidth = Math.random() * 50 + 20;
      const shardHeight = Math.random() * 50 + 20;
      const left = Math.random() * (width - shardWidth);
      const top = Math.random() * (height - shardHeight);

      const p1 = Math.random() * 100;
      const p2 = Math.random() * 100;
      const p3 = Math.random() * 100;
      const p4 = Math.random() * 100;
      shard.style.clipPath = 'polygon(' + p1 + '% 0%, 100% ' + p2 + '%, ' + p3 + '% 100%, 0% ' + p4 + '%)';

      shard.style.width = shardWidth + 'px';
      shard.style.height = shardHeight + 'px';
      shard.style.left = left + 'px';
      shard.style.top = top + 'px';

      shardsWrapper.appendChild(shard);

      const angle = Math.random() * Math.PI * 2;
      const force = Math.random() * 320 + 180;
      const tx = Math.cos(angle) * force;
      const ty = Math.sin(angle) * force;
      const tz = Math.random() * 450 + 150;
      const rotX = (Math.random() - 0.5) * 540;
      const rotY = (Math.random() - 0.5) * 540;
      const rotZ = (Math.random() - 0.5) * 540;

      gsap.to(shard, {
        x: tx,
        y: ty,
        z: tz,
        rotationX: rotX,
        rotationY: rotY,
        rotationZ: rotZ,
        opacity: 0,
        scale: 0.2,
        duration: Math.random() * 0.9 + 0.7,
        ease: 'power3.out',
        onComplete: () => shard.remove()
      });
    }

    container.classList.add('shattered');

    gsap.to('.hero-vault-wrapper', {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      pointerEvents: 'none',
      ease: 'power2.out',
      onComplete: () => {
        const vault = document.querySelector('.hero-vault-wrapper');
        if (vault) vault.style.display = 'none';
      }
    });

    triggerHeroReveal();
  });
}

// ==========================================================================
// 4b. Interactive Hologram 3D Parallax Tilt
// ==========================================================================
function initHologramChamber() {
  const container = document.getElementById('hologram-vault-container');
  const avatar = document.getElementById('hologram-interactive-avatar');
  const canvasContainer = document.getElementById('hologram-3d-webgl-container');
  
  if (!container || !avatar || !canvasContainer) return;

  // 1. Setup Three.js Scene, Camera, and Renderer
  const width = canvasContainer.clientWidth || 380;
  const height = canvasContainer.clientHeight || 450;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 8); // Perfect framing distance

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  canvasContainer.appendChild(renderer.domElement);

  // Hide the default canvas element initially
  renderer.domElement.style.opacity = 0;

  // 2. Setup Lighting (Premium studio lighting)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); // Base ambient illumination
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 4.0); // Bright directional lighting for metal highlights
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  const backLight = new THREE.DirectionalLight(0xeebc58, 2.5); // Golden backlight to match the brand color
  backLight.position.set(-5, 3, -5);
  scene.add(backLight);

  // 3. Procedural Modeling: Build Sophia Head Assembly
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    metalness: 0.95,
    roughness: 0.1
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.9,
    roughness: 0.2
  });

  const darkTitanium = new THREE.MeshStandardMaterial({
    color: 0x161c24,
    metalness: 0.8,
    roughness: 0.4
  });

  const cyanGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    emissive: 0x00a8ff,
    emissiveIntensity: 2.5,
    roughness: 0.3
  });

  const robotHeadGroup = new THREE.Group();
  scene.add(robotHeadGroup);

  // --- SKULL BASE ---
  const skullGeom = new THREE.SphereGeometry(1, 32, 32);
  const skull = new THREE.Mesh(skullGeom, darkTitanium);
  skull.scale.set(1, 1.2, 0.9);
  robotHeadGroup.add(skull);

  // --- FACE MASK PLATE ---
  const facePlateGeom = new THREE.SphereGeometry(0.95, 32, 16, 0, Math.PI, 0, Math.PI);
  const facePlate = new THREE.Mesh(facePlateGeom, chromeMaterial);
  facePlate.position.set(0, 0.1, 0.1);
  facePlate.scale.set(0.95, 1.1, 0.95);
  facePlate.rotation.y = Math.PI / 2;
  robotHeadGroup.add(facePlate);

  // --- ROBOTIC FOREHEAD COVER ---
  const foreheadGeom = new THREE.BoxGeometry(1.2, 0.4, 0.5);
  const forehead = new THREE.Mesh(foreheadGeom, goldMaterial);
  forehead.position.set(0, 0.7, 0.45);
  forehead.rotation.x = -0.3;
  robotHeadGroup.add(forehead);

  // --- JAW / CHIN PLATE ---
  const chinGeom = new THREE.BoxGeometry(0.5, 0.4, 0.4);
  const chin = new THREE.Mesh(chinGeom, goldMaterial);
  chin.position.set(0, -0.85, 0.45);
  chin.rotation.x = 0.2;
  robotHeadGroup.add(chin);

  // --- NOSE ASSEMBLY ---
  const noseGeom = new THREE.ConeGeometry(0.12, 0.5, 4);
  const nose = new THREE.Mesh(noseGeom, chromeMaterial);
  nose.position.set(0, -0.1, 0.95);
  nose.rotation.x = -0.1;
  robotHeadGroup.add(nose);

  // --- EYE SOCKETS & GLOWING EYES ---
  const eyeSocketGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.05, 32);
  const eyeBallGeom = new THREE.SphereGeometry(0.12, 16, 16);
  
  // Left Eye
  const leftSocket = new THREE.Mesh(eyeSocketGeom, darkTitanium);
  leftSocket.position.set(-0.35, 0.25, 0.8);
  leftSocket.rotation.x = Math.PI / 2;
  leftSocket.rotation.z = -0.15;
  robotHeadGroup.add(leftSocket);

  const leftEyeBall = new THREE.Mesh(eyeBallGeom, cyanGlowMaterial);
  leftEyeBall.position.set(-0.35, 0.25, 0.83);
  robotHeadGroup.add(leftEyeBall);

  // Right Eye
  const rightSocket = new THREE.Mesh(eyeSocketGeom, darkTitanium);
  rightSocket.position.set(0.35, 0.25, 0.8);
  rightSocket.rotation.x = Math.PI / 2;
  rightSocket.rotation.z = 0.15;
  robotHeadGroup.add(rightSocket);

  const rightEyeBall = new THREE.Mesh(eyeBallGeom, cyanGlowMaterial);
  rightEyeBall.position.set(0.35, 0.25, 0.83);
  robotHeadGroup.add(rightEyeBall);

  // --- CHEEKS & MOUTH LINE ---
  const cheekGeom = new THREE.BoxGeometry(0.35, 0.4, 0.2);
  const leftCheek = new THREE.Mesh(cheekGeom, chromeMaterial);
  leftCheek.position.set(-0.45, -0.3, 0.7);
  leftCheek.rotation.y = 0.25;
  robotHeadGroup.add(leftCheek);

  const rightCheek = leftCheek.clone();
  rightCheek.position.x = 0.45;
  rightCheek.rotation.y = -0.25;
  robotHeadGroup.add(rightCheek);

  const mouthGeom = new THREE.BoxGeometry(0.5, 0.05, 0.15);
  const mouth = new THREE.Mesh(mouthGeom, darkTitanium);
  mouth.position.set(0, -0.5, 0.75);
  robotHeadGroup.add(mouth);

  // --- CYBERNETIC BACK OF HEAD ---
  const skullRing1Geom = new THREE.TorusGeometry(0.9, 0.04, 8, 48);
  const skullRing1 = new THREE.Mesh(skullRing1Geom, goldMaterial);
  skullRing1.position.set(0, 0, -0.25);
  skullRing1.rotation.y = Math.PI / 2;
  robotHeadGroup.add(skullRing1);

  const skullRing2 = skullRing1.clone();
  skullRing2.position.set(0, 0.25, -0.35);
  skullRing2.scale.set(0.85, 0.85, 0.85);
  robotHeadGroup.add(skullRing2);

  // Mechanical ear ports / pivot joints
  const earPortGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.15, 32);
  const leftEar = new THREE.Mesh(earPortGeom, chromeMaterial);
  leftEar.position.set(-0.95, 0.1, -0.1);
  leftEar.rotation.z = Math.PI / 2;
  robotHeadGroup.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.x = 0.95;
  robotHeadGroup.add(rightEar);

  // Processor / Brain
  const processorGeom = new THREE.BoxGeometry(0.4, 0.4, 0.1);
  const processor = new THREE.Mesh(processorGeom, goldMaterial);
  processor.position.set(0, 0.3, -0.85);
  processor.rotation.y = Math.PI;
  robotHeadGroup.add(processor);

  const brainNodeGeom = new THREE.SphereGeometry(0.12, 16, 16);
  const brainNode = new THREE.Mesh(brainNodeGeom, cyanGlowMaterial);
  brainNode.position.set(0, 0.3, -0.92);
  robotHeadGroup.add(brainNode);

  // --- NECK & MECHANICAL STRUTS ---
  const neckGeom = new THREE.CylinderGeometry(0.28, 0.32, 1.2, 32);
  const neck = new THREE.Mesh(neckGeom, chromeMaterial);
  neck.position.set(0, -1.5, 0.0);
  robotHeadGroup.add(neck);

  const pistonGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16);
  const leftPiston = new THREE.Mesh(pistonGeom, darkTitanium);
  leftPiston.position.set(-0.35, -1.5, -0.1);
  leftPiston.rotation.z = 0.15;
  robotHeadGroup.add(leftPiston);

  const rightPiston = leftPiston.clone();
  rightPiston.position.x = 0.35;
  rightPiston.rotation.z = -0.15;
  robotHeadGroup.add(rightPiston);

  // --- SHOULDER ASSEMBLY BASE ---
  const shoulderGeom = new THREE.BoxGeometry(2.4, 0.25, 0.8);
  const shoulderBase = new THREE.Mesh(shoulderGeom, darkTitanium);
  shoulderBase.position.set(0, -2.1, 0.0);
  robotHeadGroup.add(shoulderBase);

  const shoulderJointGeom = new THREE.SphereGeometry(0.2, 16, 16);
  const leftShoulderJoint = new THREE.Mesh(shoulderJointGeom, goldMaterial);
  leftShoulderJoint.position.set(-1.1, -2.1, 0.0);
  robotHeadGroup.add(leftShoulderJoint);

  const rightShoulderJoint = leftShoulderJoint.clone();
  rightShoulderJoint.position.x = 1.1;
  robotHeadGroup.add(rightShoulderJoint);

  // Center group and scale to fit cleanly within the HUD borders
  robotHeadGroup.position.y = -0.3;
  robotHeadGroup.scale.set(1.15, 1.15, 1.15);

  // Fade in the WebGL renderer container
  renderer.domElement.style.opacity = 1;

  // 4. Mouse Interactivity and Normalized Mouse Coordinates
  const mouse = { x: 0, y: 0 };
  const targetRotation = { x: 0, y: 0 };
  const currentRotation = { x: 0, y: 0 };

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // 2D Tilt calculation for SVG overlays
    const rotateY = (x / (rect.width / 2)) * 15; 
    const rotateX = -(y / (rect.height / 2)) * 15;
    
    gsap.to(avatar, {
      rotationY: rotateY,
      rotationX: rotateX,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Normalized mouse positions for WebGL LookAt (-1 to 1)
    mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Define target rotation limits (max 35 degrees = ~0.6 radians)
    targetRotation.y = mouse.x * 0.65;
    targetRotation.x = mouse.y * 0.45;
  };

  const handleMouseLeave = () => {
    // Reset SVG overlays
    gsap.to(avatar, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Reset WebGL rotations
    targetRotation.x = 0;
    targetRotation.y = 0;
  };

  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);

  // 5. Animation Render Loop with Linear Interpolation (Lerp) and clock
  const clock = new THREE.Clock();
  let reqId = null;

  const animate = () => {
    reqId = requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Apply linear interpolation (lerp) for ultra-smooth head transitions
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.06;
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.06;

    robotHeadGroup.rotation.y = currentRotation.y;
    robotHeadGroup.rotation.x = -currentRotation.x; // invert X axis for natural look-down/up

    // Ambient mechanical breathing / float motion
    robotHeadGroup.position.y = -0.3 + Math.sin(time * 1.5) * 0.05;

    // Brain status LED pulsing effect
    const pulse = 1.8 + Math.sin(time * 4.0) * 0.7;
    cyanGlowMaterial.emissiveIntensity = pulse;

    renderer.render(scene, camera);
  };
  animate();

  // 6. Handle Resizing
  const handleResize = () => {
    const w = canvasContainer.clientWidth;
    const h = canvasContainer.clientHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);
}

// ==========================================================================
// 5. Dynamic 3D Letter Blocks Generator
// ==========================================================================
function generate3DTextBlocks() {
  const targets = document.querySelectorAll('.text-3d-box');
  targets.forEach(target => {
    const text = target.getAttribute('data-text') || target.textContent.trim();
    target.innerHTML = '';
    
    const depth = 18;
    const chars = text.split('');
    
    chars.forEach(char => {
      if (char === ' ') {
        const space = document.createElement('span');
        space.style.display = 'inline-block';
        space.style.width = '0.4em';
        target.appendChild(space);
        return;
      }
      
      const charBox = document.createElement('span');
      charBox.className = 'letter-3d-box';
      
      for (let i = 0; i < depth; i++) {
        const layer = document.createElement('span');
        layer.className = 'letter-layer';
        layer.textContent = char;
        
        if (i === 0) {
          layer.classList.add('letter-front');
        } else {
          layer.style.transform = 'translateZ(' + (-i) + 'px)';
          
          const isTop = target.classList.contains('logo-title-top');
          const ratio = i / (depth - 1);
          let r, g, b;
          if (isTop) {
            r = Math.round(212 * (1 - ratio) + 42 * ratio);
            g = Math.round(175 * (1 - ratio) + 30 * ratio);
            b = Math.round(55 * (1 - ratio) + 0 * ratio);
          } else {
            r = Math.round(207 * (1 - ratio) + 32 * ratio);
            g = Math.round(212 * (1 - ratio) + 34 * ratio);
            b = Math.round(218 * (1 - ratio) + 36 * ratio);
          }
          layer.style.color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
          layer.style.textShadow = '0 0 1px rgb(' + r + ', ' + g + ', ' + b + ')';
        }
        charBox.appendChild(layer);
      }
      target.appendChild(charBox);
    });
  });
}


// ==========================================================================
// 6. Interactive 3D Projects Sphere & HUD Panel Controller
// ==========================================================================

const projectsData = [
  {
    title: "Sophia project GR/CY",
    client: "Hanson Robotics",
    category: "Robotics Exclusivity / PR",
    desc: "Αποκλειστική εκπροσώπηση και διαχείριση της Hanson Robotics στην Ελλάδα και την Κύπρο, οργανώνοντας high-end εκδηλώσεις και media campaigns.",
    img: "/assets/service-clones-B-9Pt5dn.jpg",
    gallery: [
      "/assets/service-clones-B-9Pt5dn.jpg",
      "/sophia_robot_hud.png",
      "/speaker_sophia.png"
    ]
  },
  {
    title: "GenAI Academy",
    client: "Victorious Education",
    category: "AI Workshops & Training",
    desc: "Διοργάνωση και εκτέλεση δύο επιτυχημένων κύκλων εκπαίδευσης για εταιρείες και επαγγελματίες πάνω στην ενσωμάτωση Generative AI ροών.",
    img: "/assets/service-software-Dmk1gJZP.jpg",
    gallery: [
      "/assets/service-software-Dmk1gJZP.jpg",
      "/speaker_tech_guru.png",
      "/assets/service-experience-DX-l-saP.jpg"
    ]
  },
  {
    title: "Beyond Innovation Expo",
    client: "TIF-HELEXPO",
    category: "Event Management / Tech PR",
    desc: "Στρατηγικός σχεδιασμός επικοινωνίας και PR για την μεγαλύτερη έκθεση τεχνολογίας και ψηφιακού μετασχηματισμού στη Νοτιοανατολική Ευρώπη.",
    img: "/BEYOND-Expo.jpg",
    gallery: [
      "/BEYOND-Expo.jpg",
      "/logo.jpg",
      "/assets/service-market-HHuUv8ro.jpg"
    ]
  },
  {
    title: "AIsland Tech Forum",
    client: "AIsland Research",
    category: "Tech Ecosystem Integration",
    desc: "Σύνδεση κορυφαίων developers τεχνητής νοημοσύνης και ρομποτικής με επενδυτές και κρατικούς φορείς σε ένα immersive tech event.",
    img: "/aisland.jpeg",
    gallery: [
      "/aisland.jpeg",
      "/space_bg.png",
      "/assets/service-experience-DX-l-saP.jpg"
    ]
  },
  {
    title: "A&R Expo Exhibition",
    client: "Industrial Automation Association",
    category: "Tech Branding & Marketing",
    desc: "Στρατηγικό branding και media campaign για την κορυφαία έκθεση Ρομποτικής και Αυτοματισμού στην Ελλάδα.",
    img: "/ar26-tv-cover.jpg",
    gallery: [
      "/ar26-tv-cover.jpg",
      "/logo.jpg",
      "/assets/service-software-Dmk1gJZP.jpg"
    ]
  },
  {
    title: "Victorious Innovation Awards",
    client: "Victorious Network Ecosystem",
    category: "Brand Activation / Gala",
    desc: "Η ετήσια γιορτή της καινοτομίας, τιμώντας τις κορυφαίες επιδόσεις στο ψηφιακό marketing και τις AI αυτοματοποιήσεις.",
    img: "/awards.jpg",
    gallery: [
      "/awards.jpg",
      "/speaker_marketing_ninja.png",
      "/assets/service-market-HHuUv8ro.jpg"
    ]
  },
  {
    title: "AI Voice Cloning Pipeline",
    client: "Multinational Enterprise",
    category: "Software Development",
    desc: "Ανάπτυξη custom AI voice-cloning εργαλείων για την αυτόματη μεταγλώττιση εταιρικών βίντεο σε 30+ γλώσσες.",
    img: "/assets/service-experience-DX-l-saP.jpg",
    gallery: [
      "/assets/service-experience-DX-l-saP.jpg",
      "/assets/service-software-Dmk1gJZP.jpg",
      "/sophia_robot_hud.png"
    ]
  },
  {
    title: "Holographic Keynotes",
    client: "Global Tech Summit",
    category: "Experiential Tech",
    desc: "Σχεδιασμός και προβολή 3D ολογραμμάτων ομιλητών για real-time παρουσιάσεις σε συνέδρια υψηλών προδιαγραφών.",
    img: "/assets/service-market-HHuUv8ro.jpg",
    gallery: [
      "/assets/service-market-HHuUv8ro.jpg",
      "/speaker_sophia.png",
      "/assets/service-experience-DX-l-saP.jpg"
    ]
  },
  {
    title: "Sophia Advisory",
    client: "Public Sector Institution",
    category: "AI & Society PR",
    desc: "Διαχείριση της εικόνας και των ομιλιών της Sophia The Robot σε επίσημες κρατικές συναντήσεις και κοινωνικά panels.",
    img: "/assets/service-clones-B-9Pt5dn.jpg",
    gallery: [
      "/assets/service-clones-B-9Pt5dn.jpg",
      "/speaker_sophia.png",
      "/sophia_robot_hud.png"
    ]
  },
  {
    title: "Robotics Retail Integration",
    client: "Luxury Retail Brand",
    category: "Brand Activation",
    desc: "Τοποθέτηση ρομποτικών βοηθών σε καταστήματα λιανικής για τη δημιουργία διαδραστικών και βιωματικών αγοραστικών εμπειριών.",
    img: "/assets/service-market-HHuUv8ro.jpg",
    gallery: [
      "/assets/service-market-HHuUv8ro.jpg",
      "/logo.jpg",
      "/assets/service-software-Dmk1gJZP.jpg"
    ]
  },
  {
    title: "Predictive Neural Analytics",
    client: "Fintech Startup",
    category: "Advanced AI Systems",
    desc: "Ανάπτυξη custom predictive neural tools για την ανάλυση της συμπεριφοράς καταναλωτών και τη βελτιστοποίηση marketing campaigns.",
    img: "/assets/service-software-Dmk1gJZP.jpg",
    gallery: [
      "/assets/service-software-Dmk1gJZP.jpg",
      "/space_bg.png",
      "/assets/service-experience-DX-l-saP.jpg"
    ]
  },
  {
    title: "Ecosystem Portal",
    client: "European Robotics Consortium",
    category: "Web & Apps Development",
    desc: "Σχεδιασμός και ανάπτυξη μιας high-tech πύλης δικτύωσης για ερευνητικά κέντρα, πανεπιστήμια και start-ups.",
    img: "/assets/service-experience-DX-l-saP.jpg",
    gallery: [
      "/assets/service-experience-DX-l-saP.jpg",
      "/logo.jpg",
      "/assets/service-market-HHuUv8ro.jpg"
    ]
  }
];

// Prepend BASE_URL to absolute asset paths for GitHub Pages compatibility
const baseUrl = import.meta.env.BASE_URL || '/';
projectsData.forEach(project => {
  if (project.img && project.img.startsWith('/')) {
    project.img = baseUrl + project.img.slice(1);
  }
  if (project.gallery) {
    project.gallery = project.gallery.map(img => {
      return (img && img.startsWith('/')) ? baseUrl + img.slice(1) : img;
    });
  }
});

function initProjectsSphere() {
  const wrapper = document.getElementById('sphere-wrapper');
  const viewport = document.getElementById('sphere-viewport');
  const hudTitle = document.getElementById('project-hud-title');
  const hudCategory = document.getElementById('project-hud-category');
  const hudDesc = document.getElementById('project-hud-desc');
  const hudYear = document.getElementById('project-hud-year');
  const hudPanel = document.getElementById('project-details-panel');

  if (!wrapper || !viewport) return;

  const N = projectsData.length;
  
  // Responsive sphere radius (increased for a larger globe)
  const radius = window.innerWidth < 768 ? 125 : 215;
  
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const angleIncrement = Math.PI * 2 * goldenRatio;

  const cards = [];
  let activeProjectIndex = 0; // Keep track of the currently active project

  // 1. Generate Panels with rotation-first positioning (perpendicular layout)
  for (let i = 0; i < N; i++) {
    const project = projectsData[i];
    const card = document.createElement('div');
    card.className = 'sphere-card';
    card.setAttribute('data-id', i);
    card.innerHTML = '<img src="' + project.img + '" alt="' + project.title + '" />';
    
    // Fibonacci sphere coordinates
    const t = i / N;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = angleIncrement * i;

    // Rotate cards to face outward from center (Y rotation, then X rotation, then push out Z)
    const rotY = azimuth * (180 / Math.PI);
    const rotX = (inclination * (180 / Math.PI)) - 90;

    card.style.transform = 'rotateY(' + rotY + 'deg) rotateX(' + (-rotX) + 'deg) translateZ(' + radius + 'px)';
    
    wrapper.appendChild(card);
    cards.push(card);

    // Helper to update active details HUD
    const updateHUD = () => {
      activeProjectIndex = i; // Store the index of the active project
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      hudPanel.classList.add('hud-updating');
      setTimeout(() => {
        hudTitle.textContent = project.title;
        hudCategory.textContent = project.category;
        hudDesc.textContent = project.desc;
        hudYear.textContent = 'PROJECT CLIENT // ' + project.client.toUpperCase();
        hudPanel.classList.remove('hud-updating');
      }, 150);
    };

    card.addEventListener('click', updateHUD);
    card.addEventListener('mouseenter', updateHUD);
  }

  // Set first project active by default
  if (cards.length > 0) {
    cards[0].classList.add('active');
    hudTitle.textContent = projectsData[0].title;
    hudCategory.textContent = projectsData[0].category;
    hudDesc.textContent = projectsData[0].desc;
    hudYear.textContent = 'PROJECT CLIENT // ' + projectsData[0].client.toUpperCase();
  }

  // 2. Drag Interaction (Pitch clamped to prevent gimbal flipping)
  let rotationX = 0;
  let rotationY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isDragging = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let startRotationX = 0;
  let startRotationY = 0;

  viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    startMouseX = e.clientX;
    startMouseY = e.clientY;
    startRotationX = targetRotationX;
    startRotationY = targetRotationY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startMouseX;
    const deltaY = e.clientY - startMouseY;
    
    targetRotationY = startRotationY + deltaX * 0.4;
    // Clamp vertical rotation (pitch) between -85 and +85 degrees
    targetRotationX = Math.max(-85, Math.min(85, startRotationX - deltaY * 0.4));
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Mobile Touch Support with page scroll prevention
  viewport.addEventListener('touchstart', (e) => {
    isDragging = true;
    startMouseX = e.touches[0].clientX;
    startMouseY = e.touches[0].clientY;
    startRotationX = targetRotationX;
    startRotationY = targetRotationY;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    // Prevent default scroll behavior while rotating sphere
    if (e.cancelable) e.preventDefault();
    const deltaX = e.touches[0].clientX - startMouseX;
    const deltaY = e.touches[0].clientY - startMouseY;
    
    targetRotationY = startRotationY + deltaX * 0.4;
    targetRotationX = Math.max(-85, Math.min(85, startRotationX - deltaY * 0.4));
  }, { passive: false });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // 3. Animation Loop (Rotation & Corrected Depth Opacity)
  function updateLoop() {
    if (!isDragging) {
      targetRotationY += 0.08;
      targetRotationX += 0.03;
      // Keep auto-spin clamped as well
      targetRotationX = Math.max(-85, Math.min(85, targetRotationX));
    }

    rotationX += (targetRotationX - rotationX) * 0.1;
    rotationY += (targetRotationY - rotationY) * 0.1;

    wrapper.style.transform = 'rotateX(' + rotationX + 'deg) rotateY(' + rotationY + 'deg)';
    
    cards.forEach(card => {
      const id = parseInt(card.getAttribute('data-id'));
      
      const t = id / N;
      const inclination = Math.acos(1 - 2 * t);
      const azimuth = angleIncrement * id;

      const x = Math.sin(inclination) * Math.cos(azimuth);
      const y = Math.sin(inclination) * Math.sin(azimuth);
      const z = Math.cos(inclination);

      const radX = rotationX * (Math.PI / 180);
      const radY = rotationY * (Math.PI / 180);

      // Relative Z depth in rotated space:
      // Rot Y: z' = z*cos(Y) - x*sin(Y)
      // Rot X: z'' = z'*cos(X) + y*sin(X)
      const zRotY = z * Math.cos(radY) - x * Math.sin(radY);
      const zRotX = zRotY * Math.cos(radX) + y * Math.sin(radX);

      // Map depth to opacity range
      const opacity = 0.35 + (zRotX + 1) * 0.325;
      
      if (!card.classList.contains('active')) {
        card.style.opacity = Math.max(0.2, Math.min(1.0, opacity)).toFixed(2);
      } else {
        card.style.opacity = 1.0;
      }
    });

    requestAnimationFrame(updateLoop);
  }

  requestAnimationFrame(updateLoop);

  // 4. Modal Expansion and Gallery controls
  const expandBtn = document.getElementById('project-hud-expand');
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('project-modal-close');
  const modalTitle = document.getElementById('modal-project-title');
  const modalClient = document.getElementById('modal-project-client');
  const modalCategory = document.getElementById('modal-project-category');
  const modalDesc = document.getElementById('modal-project-desc');
  const modalMainImg = document.getElementById('modal-gallery-main-img');
  const modalThumbs = document.getElementById('modal-gallery-thumbs');

  if (expandBtn && modal) {
    expandBtn.addEventListener('click', () => {
      const project = projectsData[activeProjectIndex];
      modalTitle.textContent = project.title;
      modalClient.textContent = 'PROJECT CLIENT // ' + project.client.toUpperCase();
      modalCategory.textContent = project.category;
      modalDesc.textContent = project.desc;
      
      // Populate gallery
      modalMainImg.src = project.img;
      modalThumbs.innerHTML = '';
      
      const gallery = project.gallery || [project.img];
      gallery.forEach((imgUrl, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'project-modal-gallery-thumb' + (idx === 0 ? ' active' : '');
        thumb.innerHTML = '<img src="' + imgUrl + '" alt="" />';
        thumb.addEventListener('click', () => {
          document.querySelectorAll('.project-modal-gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          modalMainImg.src = imgUrl;
        });
        modalThumbs.appendChild(thumb);
      });
      
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  }

  const closeModal = () => {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Unlock background scrolling
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
}
