import './style.css';
import gsap from 'gsap';

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
  // Fade in the planet orbit views and the glassmorphic readability overlay
  gsap.to('.orbit-desktop-view, .orbit-mobile-view, .planet-overlay', {
    opacity: 1,
    duration: 1.5,
    ease: 'power2.out'
  });

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
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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

    // Unlock body scroll and reveal header & page content
    document.body.classList.remove('is-locked');
    const pageContent = document.getElementById('page-content');
    const header = document.querySelector('header');
    
    if (pageContent) {
      pageContent.classList.remove('hidden');
      gsap.fromTo(pageContent, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.2, ease: 'power2.out' }
      );
    }
    
    if (header) {
      gsap.fromTo(header, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.2, ease: 'power2.out' }
      );
    }

    triggerHeroReveal();
  });
}

// ==========================================================================
// 4b. Interactive Hologram 3D Parallax Tilt
// ==========================================================================
function initHologramChamber() {
  const container = document.getElementById('hologram-vault-container');
  const avatar = document.getElementById('hologram-interactive-avatar');
  
  if (!container || !avatar) return;

  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateY = (x / (rect.width / 2)) * 15; 
    const rotateX = -(y / (rect.height / 2)) * 15;
    
    gsap.to(avatar, {
      rotationY: rotateY,
      rotationX: rotateX,
      duration: 0.5,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(avatar, {
      rotationY: 0,
      rotationX: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  };

  container.addEventListener('mousemove', handleMouseMove);
  container.addEventListener('mouseleave', handleMouseLeave);
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
