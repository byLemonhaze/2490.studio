import './style.css'

let allPortraits = [];
let currentSlide = 0;
let slideInterval = null;
let viewMode = 'slideshow';

const app = document.querySelector('#app');

function createUI() {
  app.innerHTML = `
    <!-- Hero Section with Carousel -->
    <div class="hero-section">
      <div class="hero-overlay">
        <div class="hero-text">
          <h1 class="hero-title">PORTRAIT 2490</h1>
          <p class="hero-subtitle">90 Futuristic Portraits • Sub-300k Inscriptions • March 2023</p>
          
          <div class="hero-description">
            <p class="question">What are we gonna look like down the road?</p>
            <p class="interpretation">This collection captures a pivotal moment in digital art: 90 futuristic portraits of robots and/or humans living in the year 2490 at the intersection of early AI experimentation and Bitcoin's permanent ledger. Each portrait is a time capsule—a 2023 vision of 2490, forever inscribed on-chain. The question it poses is both playful and profound: as we merge with technology, will we recognize ourselves?</p>
          </div>
        </div>
        
        <button class="view-toggle" id="view-toggle" title="View All">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
            <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>View All</span>
        </button>
      </div>

      <div class="slideshow-container">
        <button class="slide-nav prev" id="prev-slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="slideshow" id="slideshow">
          <div class="loading">Loading...</div>
        </div>
        
        <button class="slide-nav next" id="next-slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="slide-info-bar" id="slide-info-bar"></div>

      <div class="footer">
        Portrait 2490 &copy; by Lemonhaze
      </div>
    </div>

    <!-- Grid View (Hidden by default) -->
    <div class="grid-view" id="grid-view" style="display: none;">
      <div class="grid-header">
        <button class="back-btn" id="back-btn" title="Exit">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="search-wrapper">
          <input type="text" id="search" class="search-input" placeholder="Search..." />
        </div>
      </div>
      
      <div class="gallery" id="gallery"></div>
      
      <div class="footer grid-footer">
        Portrait 2490 &copy; by Lemonhaze
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" id="modal">
      <div class="modal-backdrop"></div>
      <div class="modal-content">
        <button class="modal-close" id="modal-close">×</button>
        <div class="modal-body" id="modal-body"></div>
      </div>
    </div>
  `;

  addStyles();
  attachEventListeners();
}

function addStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');

    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      width: 100vw;
      height: 100vh;
      background: #000;
      overflow: hidden;
    }

    .hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      padding: 48px 56px;
      background: linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.65) 35%, transparent 65%);
      pointer-events: none;
      display: flex;
      align-items: center;
    }

    .hero-text {
      max-width: 480px;
      pointer-events: all;
      user-select: text;
    }

    .hero-title {
      font-family: 'Space Mono', monospace;
      font-size: clamp(1.75rem, 4.5vw, 3rem);
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #fff;
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .hero-subtitle {
      font-size: clamp(0.625rem, 1vw, 0.6875rem);
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .hero-description {
      font-size: 0.8125rem;
      font-weight: 300;
      line-height: 1.75;
      color: rgba(255, 255, 255, 0.65);
    }

    .hero-description p {
      margin-bottom: 14px;
    }

    .hero-description .question {
      font-size: 0.9375rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.9);
      font-style: italic;
      margin: 20px 0;
      line-height: 1.6;
    }

    .hero-description .intro {
      font-size: 0.8125rem;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 12px;
    }

    .hero-description .divider {
      border: none;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 16px 0;
    }

    .hero-description .interpretation {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.75rem;
      font-weight: 300;
      line-height: 1.8;
    }

    .view-toggle {
      position: absolute;
      bottom: 40px;
      right: 40px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 24px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
      pointer-events: all;
    }

    .view-toggle:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    /* Slideshow */
    .slideshow-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .slideshow {
      width: 100%;
      height: 100%;
      position: relative;
    }

    .slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 1s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .slide.active {
      opacity: 1;
      z-index: 1;
    }

    .slide-img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
    }

    .slide-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      z-index: 10;
      opacity: 0;
    }

    .slideshow-container:hover .slide-nav {
      opacity: 1;
    }

    .slide-nav:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.8);
      transform: translateY(-50%) scale(1.05);
    }

    .slide-nav svg {
      width: 18px;
      height: 18px;
    }

    .slide-nav.prev { left: 24px; }
    .slide-nav.next { right: 24px; }

    .slide-info-bar {
      position: absolute;
      bottom: 40px;
      left: 40px;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 20px 28px;
      color: #fff;
      z-index: 10;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
    }

    .slide-name {
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      margin-bottom: 6px;
      font-size: 1.25rem;
      color: #ffffff;
      overflow: hidden;
      white-space: nowrap;
    }

    .slide-name.typing {
      animation: typewriter 0.8s steps(20) forwards;
    }

    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }

    .slide-id {
      color: #FFD700; /* Futuristic Gold */
      font-size: 0.75rem;
      font-family: 'Space Mono', monospace;
      text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
      overflow: hidden;
      white-space: nowrap;
    }

    .detail-value.cypher {
      color: #FFD700; /* Futuristic Gold */
      text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
      vertical-align: bottom;
      max-width: 100%;
    }

    @keyframes matrixGlow {
      0%, 100% { 
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.5),
                     0 0 16px rgba(255, 215, 0, 0.3);
      }
      50% { 
        text-shadow: 0 0 12px rgba(255, 215, 0, 0.7),
                     0 0 24px rgba(255, 215, 0, 0.5);
      }
    }

    /* Footer */
    .footer {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255, 255, 255, 0.4);
      font-size: 0.75rem;
      font-weight: 300;
      letter-spacing: 0.1em;
      pointer-events: none;
      z-index: 10;
      width: 100%;
      text-align: center;
    }

    .grid-footer {
      position: relative;
      bottom: auto;
      left: auto;
      transform: none;
      text-align: center;
      margin-top: 60px;
      padding-bottom: 20px;
    }

    /* Grid View */
    .grid-view {
      padding: 40px 40px 0; /* Updated padding */
      min-height: 100vh;
      background: #000;
      position: relative;
    }

    .grid-header {
      max-width: 1600px;
      margin: 0 auto 60px;
      display: flex;
      gap: 20px;
      align-items: center;
      padding-top: 40px; /* Space for exit button if overlay */
    }

    /* Exit Button Top Right */
    .back-btn {
      position: absolute;
      top: 40px;
      right: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      padding: 0;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 50%; /* Circle */
      color: #fff;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.3s;
      z-index: 20;
      backdrop-filter: blur(10px);
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.3);
      transform: rotate(90deg);
    }

    .search-wrapper {
      flex: 1;
      max-width: 400px;
    }

    .search-input {
      width: 100%;
      padding: 12px 20px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 0.875rem;
      outline: none;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }

    .gallery {
      max-width: 1600px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }

    .portrait-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;
    }

    .portrait-card:hover {
      transform: translateY(-4px);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .portrait-img-wrapper {
      aspect-ratio: 1;
      overflow: hidden;
      background: #000;
    }

    .portrait-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .portrait-card:hover .portrait-img {
      transform: scale(1.05);
    }

    .portrait-info {
      padding: 16px;
    }

    .portrait-name {
      font-size: 0.9375rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }

    .portrait-id {
      font-size: 0.6875rem;
      color: rgba(255, 255, 255, 0.4);
    }

    /* Modal */
    .modal {
      position: fixed;
      inset: 0;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .modal.active {
      display: flex;
    }

    .modal-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
    }

    .modal-content {
      position: relative;
      background: #000;
      border: 1px solid rgba(0, 200, 255, 0.3);
      border-radius: 12px;
      max-width: 1200px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0 40px rgba(0, 200, 255, 0.2);
    }

    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      transition: all 0.3s;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }

    .modal-body {
      padding: 48px;
      display: grid;
      grid-template-columns: 1.2fr 1fr;
      gap: 48px;
    }

    .modal-img {
      width: 100%;
      border-radius: 8px;
      border: 1px solid rgba(0, 200, 255, 0.2);
    }

    .modal-info h2 {
      font-size: 2rem;
      color: #fff;
      margin-bottom: 32px;
      letter-spacing: 0.02em;
    }

    .modal-details {
      display: grid;
      gap: 16px;
      margin-bottom: 32px;
    }

    .detail-row {
      padding: 16px;
      background: rgba(0, 200, 255, 0.03);
      border: 1px solid rgba(0, 200, 255, 0.15);
      border-radius: 8px;
      transition: all 0.3s;
    }

    .detail-row:hover {
      background: rgba(0, 200, 255, 0.05);
      border-color: rgba(0, 200, 255, 0.3);
    }

    .detail-label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.5);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .detail-value {
      font-size: 0.875rem;
      color: #fff;
      word-break: break-all;
      font-family: 'Space Mono', monospace;
    }

    .detail-value.cypher {
      color: #00c8ff;
      text-shadow: 0 0 8px rgba(0, 200, 255, 0.5);
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
    }

    .detail-value.cypher.typing {
      animation: typewriter 1.5s steps(40) forwards, matrixGlow 2s ease-in-out 0.5s infinite;
      width: 0;
    }

    .modal-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: #fff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: all 0.3s;
    }

    .modal-link:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .view-toggle {
      position: absolute;
      bottom: 40px;
      right: 40px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 24px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.3s;
      pointer-events: all;
    }

    .view-toggle:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    
    .loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: rgba(255, 255, 255, 0.5);
      font-size: 0.875rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    @media (max-width: 768px) {
      .hero-section {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }

      .hero-overlay {
        position: relative;
        padding: 16px;
        background: rgba(0, 0, 0, 0.98);
        align-items: flex-start;
        justify-content: space-between;
        flex: 0 0 auto;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        flex-direction: row;
        z-index: 20;
      }

      .hero-text {
        max-width: 100%;
        flex: 1;
      }

      .hero-title {
        font-size: 1.25rem;
        margin-bottom: 4px;
        letter-spacing: 0.06em;
      }

      .hero-subtitle {
        font-size: 0.5rem;
        margin-bottom: 8px;
        padding-bottom: 0;
        border-bottom: none;
        line-height: 1.3;
        letter-spacing: 0.08em;
      }

      .hero-description {
        font-size: 0.625rem;
        line-height: 1.4;
        margin-top: 6px;
      }

      .hero-description p {
        margin-bottom: 0;
      }

      .hero-description .question {
        font-size: 0.625rem;
        margin: 0;
        font-style: italic;
        color: rgba(255, 255, 255, 0.8);
      }

      .hero-description .interpretation {
        display: block;
        font-size: 0.5625rem;
        margin-top: 4px;
        line-height: 1.4;
        color: rgba(255, 255, 255, 0.5);
      }

      .view-toggle {
        position: relative;
        bottom: auto;
        right: auto;
        margin-top: 0;
        padding: 8px 12px;
        font-size: 0.625rem;
        gap: 4px;
        flex-shrink: 0;
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 6px;
      }

      .view-toggle span {
        display: none;
      }

      .view-toggle svg {
        width: 16px;
        height: 16px;
      }

      .slideshow-container {
        flex: 1;
        position: relative;
        height: auto;
        overflow: hidden;
      }

      .slideshow {
        height: 100%;
      }

      .slide {
        padding: 20px 0 80px 0;
        justify-content: center;
        align-items: flex-start;
      }

      .slide-img {
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
        display: block;
        object-fit: contain;
      }

      .slide-nav {
        display: none !important;
      }

      .slide-info-bar {
        position: absolute;
        left: 16px;
        right: 16px;
        bottom: 16px;
        padding: 12px 16px;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .slide-name {
        font-size: 0.9375rem;
        margin-bottom: 4px;
      }

      .slide-id {
        font-size: 0.625rem;
      }
  `;
  document.head.appendChild(style);
}

function attachEventListeners() {
  document.getElementById('view-toggle').addEventListener('click', showGrid);
  document.getElementById('back-btn')?.addEventListener('click', showSlideshow);
  document.getElementById('prev-slide').addEventListener('click', () => changeSlide(-1));
  document.getElementById('next-slide').addEventListener('click', () => changeSlide(1));
  document.getElementById('search')?.addEventListener('input', (e) => {
    const filtered = allPortraits.filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase()));
    renderGallery(filtered);
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.querySelector('.modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
  });
}

function showGrid() {
  document.querySelector('.hero-section').style.display = 'none';
  document.getElementById('grid-view').style.display = 'block';
  clearInterval(slideInterval);
  renderGallery(allPortraits);
}

function showSlideshow() {
  document.querySelector('.hero-section').style.display = 'block';
  document.getElementById('grid-view').style.display = 'none';
  startSlideshow();
}

function initSlideshow() {
  const slideshow = document.getElementById('slideshow');
  slideshow.innerHTML = allPortraits.map((p, i) => `
    <div class="slide ${i === 0 ? 'active' : ''}" onclick="openModal('${p.id}')">
      <img class="slide-img" src="https://ordinals.com/content/${p.id}" alt="${p.name}" />
    </div>
  `).join('');
  updateSlideInfo();
  startSlideshow();
}

function changeSlide(dir) {
  const slides = document.querySelectorAll('.slide');
  slides[currentSlide].classList.remove('active');
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  updateSlideInfo();
  resetSlideshow();
}

function updateSlideInfo() {
  const portrait = allPortraits[currentSlide];
  const slideInfoBar = document.getElementById('slide-info-bar');

  slideInfoBar.innerHTML = `
    <div class="slide-name typing">${portrait.name}</div>
    <div class="slide-id typing">${portrait.id.substring(0, 20)}...</div>
  `;

  // Trigger reflow to restart animation
  const nameEl = slideInfoBar.querySelector('.slide-name');
  const idEl = slideInfoBar.querySelector('.slide-id');

  void nameEl.offsetWidth;
  void idEl.offsetWidth;
}

function startSlideshow() {
  slideInterval = setInterval(() => changeSlide(1), 5000);
}

function resetSlideshow() {
  clearInterval(slideInterval);
  startSlideshow();
}

function renderGallery(portraits) {
  document.getElementById('gallery').innerHTML = portraits.map(p => `
    <div class="portrait-card" onclick="openModal('${p.id}')">
      <div class="portrait-img-wrapper">
        <img class="portrait-img" src="https://ordinals.com/content/${p.id}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="portrait-info">
        <div class="portrait-name">${p.name}</div>
        <div class="portrait-id">${p.id.substring(0, 16)}...</div>
      </div>
    </div>
  `).join('');
}

window.openModal = async function (id) {
  const p = allPortraits.find(x => x.id === id);
  document.getElementById('modal-body').innerHTML = `
    <div>
      <img class="modal-img" src="https://ordinals.com/content/${p.id}" alt="${p.name}" />
    </div>
    <div class="modal-info">
      <h2>${p.name}</h2>
      <div class="modal-details">
        <div class="detail-row">
          <div class="detail-label">Inscription ID</div>
          <div class="detail-value cypher typing">${p.id}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Owner</div>
          <div class="detail-value cypher typing" id="modal-owner">Loading...</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Dimensions</div>
          <div class="detail-value cypher typing">${p.dimensions}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Size</div>
          <div class="detail-value cypher typing">${p.size}</div>
        </div>
        <div class="detail-row">
          <div class="detail-label">Inscribed</div>
          <div class="detail-value cypher typing">${p.timestamp}</div>
        </div>
      </div>
      <a href="https://ordinals.com/inscription/${p.id}" target="_blank" class="modal-link glass-btn">
        View on Ordinals →
      </a>
    </div>
  `;

  document.getElementById('modal').classList.add('active');
  document.body.style.overflow = 'hidden';

  // Trigger reflow to restart animation for static elements
  const cypherEls = document.querySelectorAll('.detail-value.cypher');
  cypherEls.forEach(el => void el.offsetWidth);

  // Fetch owner data
  try {
    const response = await fetch(`https://api.hiro.so/ordinals/v1/inscriptions/${p.id}`);
    if (response.ok) {
      const data = await response.json();
      const ownerEl = document.getElementById('modal-owner');
      if (ownerEl) {
        ownerEl.textContent = data.address || 'Unknown';
        // Restart animation for owner
        ownerEl.classList.remove('typing');
        void ownerEl.offsetWidth;
        ownerEl.classList.add('typing');
      }
    } else {
      document.getElementById('modal-owner').textContent = 'Error fetching owner';
    }
  } catch (e) {
    console.error('Error fetching owner:', e);
    const ownerEl = document.getElementById('modal-owner');
    if (ownerEl) ownerEl.textContent = 'Unavailable';
  }
}



// Consolidated Style Injection: Dark Turquoise Theme & Fixes
const finalStyle = document.createElement('style');
finalStyle.textContent = `
    /* Dark Turquoise Theme & Typography */
    /* Using a bright turquoise for text legibility, glowing with the requested #038A86 */
    .slide-id {
        color: #59f9f4 !important;
        font-size: 0.75rem;
        font-family: 'Space Mono', monospace;
        text-shadow: 0 0 10px #038A86, 0 0 20px #038A86 !important;
        overflow: hidden;
        white-space: nowrap;
    }

    .detail-value {
      font-family: 'Space Mono', monospace;
      color: #fff;
      font-size: 0.875rem;
    }

    .detail-value.cypher {
        color: #59f9f4 !important; 
        text-shadow: 0 0 10px #038A86, 0 0 20px #038A86; 
        display: inline-block;
        vertical-align: bottom;
        max-width: 100%;
        width: auto;
        opacity: 1 !important;
        clip-path: none !important;
    }

    /* Animation */
    .detail-value.cypher.typing,
    .detail-value.cypher.typing-reverse,
    .slide-id.typing {
        animation: simpleFadeIn 0.5s ease-in-out forwards, turquoiseGlow 3s ease-in-out 0.5s infinite;
        white-space: pre-wrap; 
        word-break: break-all;
    }

    @keyframes simpleFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes turquoiseGlow {
        0%, 100% {
            text-shadow: 0 0 10px #038A86, 0 0 20px #038A86;
        }
        50% {
            text-shadow: 0 0 15px #038A86, 0 0 30px #038A86, 0 0 40px #59f9f4;
        }
    }

    /* Modal Contour Fix */
    .modal-content {
        border: 1px solid rgba(3, 138, 134, 0.4) !important;
        box-shadow: 0 0 40px rgba(3, 138, 134, 0.2) !important;
    }

    /* Footer Fix */
    .footer {
        z-index: 5 !important;
        pointer-events: none;
    }
    
    .slide-info-bar {
        bottom: 30px !important;
    }

    /* View Toggle - Move to Top Right & Clean Style */
    .view-toggle {
        position: absolute;
        top: 40px; 
        right: 40px;
        bottom: auto !important; 
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        background: rgba(255, 255, 255, 0.05); 
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 20;
        text-transform: uppercase;
        font-family: 'Space Mono', monospace;
        letter-spacing: 0.1em;
        pointer-events: all;
    }

    .view-toggle:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: #038A86;
        color: #59f9f4;
        transform: translateY(-2px);
    }

    .view-toggle span {
        display: block !important;
    }

    /* Exit Button - Icon Only */
    .back-btn {
        position: absolute;
        top: 40px;
        right: 40px;
        width: 44px; /* Back to circular/square container for icon */
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 20;
    }
    
    .back-btn::before, .back-btn::after {
        display: none !important;
    }

    .back-btn:hover {
        background: rgba(255, 255, 255, 0.12);
        border-color: #038A86;
        color: #59f9f4;
        transform: translateY(-2px);
    }

    /* Mobile Overrides */
    @media (max-width: 768px) {
        .modal {
            padding: 10px !important;
            align-items: center !important;
            justify-content: center !important;
        }
        .modal-content { 
            width: 95% !important; 
            max-width: 95% !important; 
            margin: 0 auto !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
        }
        .modal-body { 
            grid-template-columns: 1fr !important; 
            display: grid !important; 
            padding: 24px 20px !important; 
            gap: 24px !important; 
        }
        .detail-value { 
            word-break: break-word !important; 
            white-space: normal !important; 
            font-size: 0.75rem !important; 
        }
        .detail-value.cypher, 
        .detail-value.cypher.typing, 
        .detail-value.cypher.typing-reverse { 
            width: 100% !important; 
            display: block !important; 
            opacity: 1 !important;
            clip-path: none !important;
            animation: turquoiseGlow 3s ease-in-out infinite !important;
        }
        .modal-img { 
            max-height: 35vh !important; 
            width: 100% !important;
            object-fit: contain !important;
            border: 1px solid rgba(0, 210, 255, 0.2) !important;
        }
        .modal-info h2 {
            font-size: 1.5rem !important;
            margin-bottom: 20px !important;
            text-align: center !important;
        }
        /* Mobile Buttons Positioning */
        .view-toggle, .back-btn {
            top: 15px;
            right: 15px;
            padding: 8px 14px;
            font-size: 0.7rem;
        }
        .footer {
            bottom: 10px !important;
            font-size: 0.6rem !important;
        }
    }
`;
document.head.appendChild(finalStyle);


function closeModal() {
  document.getElementById('modal').classList.remove('active');
  document.body.style.overflow = '';
}

async function loadData() {
  const res = await fetch('/portrait2490.json');
  allPortraits = await res.json();
  initSlideshow();
}

createUI();
loadData();
