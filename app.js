// ADITYAS MANDALA — APP LOGIC

const views = {
  splash: document.getElementById('splash-view'),
  product: document.getElementById('product-view'),
  story: document.getElementById('mandala-story-view'),
  shop: document.getElementById('shop-view'),
  quiz: document.getElementById('quiz-view'),
};

function showView(name){
  Object.values(views).forEach(v => v.classList.add('hidden'));
  views[name].classList.remove('hidden');
  window.scrollTo(0,0);
}

// ---------- Leaf icon (matches the mandala artwork's leaf style, upright, recolorable) ----------
function leafSVG(color, size){
  size = size || 100;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 4 C74 22, 86 46, 50 96 C14 46, 26 22, 50 4 Z"
          fill="${color}" stroke="rgba(8,14,24,.45)" stroke-width="1.2"/>
    <path d="M50 12 L50 90" stroke="rgba(8,14,24,.4)" stroke-width="1.3" fill="none"/>
    <path d="M50 30 L34 20 M50 30 L66 20 M50 46 L31 36 M50 46 L69 36 M50 62 L34 54 M50 62 L66 54 M50 76 L40 70 M50 76 L60 70"
          stroke="rgba(8,14,24,.32)" stroke-width="1" fill="none"/>
  </svg>`;
}

// ---------- Build hotspots over the mandala image ----------
// Coordinates calibrated against mandala-hero.jpg's actual leaf positions
// (sampled from the source artwork: leaves sit ~34% of the image radius from center).
function buildMandala(){
  const layer = document.getElementById('mandala-hotspots');
  const radiusPct = 33.9;
  PRODUCTS.forEach(p => {
    const angleDeg = (p.clock % 12) * 30;
    const angleRad = angleDeg * Math.PI / 180;
    const leftPct = 50 + radiusPct * Math.sin(angleRad);
    const topPct = 50 - radiusPct * Math.cos(angleRad);

    const hotspot = document.createElement('a');
    hotspot.href = `#/product/${p.id}`;
    hotspot.className = 'hotspot';
    hotspot.style.left = `${leftPct}%`;
    hotspot.style.top = `${topPct}%`;
    hotspot.setAttribute('aria-label', `${p.name} — ${p.deity}`);
    layer.appendChild(hotspot);
  });
}

// ---------- Promo carousel ----------
let promoIndex = 0;
let promoTimer = null;
const PROMO_INTERVAL = 8000; // 8s: long enough to read a headline + 3 benefits, short enough to keep motion feeling alive

function buildPromoCarousel(){
  const track = document.getElementById('promo-track');
  const dotsWrap = document.getElementById('promo-dots');
  track.innerHTML = '';
  dotsWrap.innerHTML = '';

  PRODUCTS.forEach((p, i) => {
    const slide = document.createElement('div');
    slide.className = 'promo-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML = `
      <div class="promo-sachet-wrap">
        <div class="promo-sachet" style="background:linear-gradient(170deg, ${p.color}33 0%, ${p.color}18 32%, #080E18 78%)">
          <div class="promo-sachet-seal promo-seal-top"></div>
          <div class="promo-sachet-seal promo-seal-bottom"></div>
          <div class="promo-sachet-notch"></div>
          <div class="promo-sachet-inner">
            <div class="promo-sachet-brandmark">
              ${sachetRingSVG(p.color)}
              <div class="promo-sachet-word">ADITYAS</div>
              <div class="promo-sachet-subword">Mandala</div>
            </div>
            <div class="promo-sachet-divider"></div>
            <div>
              <div class="promo-sachet-formula">${p.name.toUpperCase()}</div>
              <div class="promo-sachet-deity">${p.deity}</div>
            </div>
            <div class="promo-sachet-tagline">Ancient Wisdom.<br>Modern Vitality.</div>
          </div>
        </div>
        <p class="promo-sachet-caption">${p.clock} o'clock · ${p.color}</p>
      </div>
      <div class="promo-info">
        <p class="promo-deity">${p.deity}</p>
        <h3 class="promo-name">${p.name}</h3>
        <ul class="promo-benefits">
          ${p.benefits.slice(0,3).map(b => `<li>${b}</li>`).join('')}
        </ul>
        <a class="promo-link" href="#/product/${p.id}">Discover ${p.name} →</a>
      </div>
    `;
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'promo-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show ${p.name}`);
    dot.onclick = () => goToPromo(i);
    dotsWrap.appendChild(dot);
  });

  document.getElementById('promo-prev').onclick = () => goToPromo(promoIndex - 1);
  document.getElementById('promo-next').onclick = () => goToPromo(promoIndex + 1);

  const carousel = document.getElementById('promo-carousel');
  carousel.addEventListener('mouseenter', stopPromoTimer);
  carousel.addEventListener('mouseleave', startPromoTimer);
  carousel.addEventListener('focusin', stopPromoTimer);
  carousel.addEventListener('focusout', startPromoTimer);

  startPromoTimer();
}

// Small illuminated ring motif for the sachet mark — echoes the mandala without depicting it
function sachetRingSVG(color){
  return `<svg class="promo-sachet-ring" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="46" stroke="${color}" stroke-width="1" opacity="0.5" fill="none"/>
    <circle cx="50" cy="50" r="38" stroke="${color}" stroke-width="0.6" opacity="0.35" fill="none"/>
    ${Array.from({length:12}).map((_,i)=>{
      const isFilled = i===0;
      const angle = i*30;
      return `<ellipse cx="50" cy="50" rx="6" ry="13" transform="translate(0,-24) rotate(${angle} 50 74)"
              fill="${isFilled?color:'none'}" stroke="${color}" stroke-width="0.7" opacity="${isFilled?0.95:0.4}"/>`;
    }).join('')}
    <circle cx="50" cy="50" r="7" fill="${color}" opacity="0.9"/>
  </svg>`;
}

function goToPromo(newIndex){
  const slides = document.querySelectorAll('.promo-slide');
  const dots = document.querySelectorAll('.promo-dot');
  const count = slides.length;
  promoIndex = ((newIndex % count) + count) % count;
  slides.forEach((s, i) => s.classList.toggle('active', i === promoIndex));
  dots.forEach((d, i) => d.classList.toggle('active', i === promoIndex));
}

function startPromoTimer(){
  stopPromoTimer();
  promoTimer = setInterval(() => goToPromo(promoIndex + 1), PROMO_INTERVAL);
}
function stopPromoTimer(){
  if(promoTimer) clearInterval(promoTimer);
}

// ---------- Quiz ----------
function renderQuizStep1(){
  const c = document.getElementById('quiz-container');
  c.innerHTML = `
    <p class="quiz-step-label">Step 1 of 2 — What are you looking to improve?</p>
    <div class="quiz-grid">
      ${QUIZ_TREE.categories.map(cat => `
        <button class="quiz-card" data-cat="${cat.id}">
          <span class="quiz-card-label">${cat.label}</span>
          <span class="quiz-card-desc">${cat.description}</span>
        </button>
      `).join('')}
    </div>
  `;
  c.querySelectorAll('.quiz-card').forEach(btn => {
    btn.onclick = () => renderQuizStep2(btn.dataset.cat);
  });
}

function renderQuizStep2(catId){
  const cat = QUIZ_TREE.categories.find(c => c.id === catId);
  const c = document.getElementById('quiz-container');
  c.innerHTML = `
    <p class="quiz-step-label">Step 2 of 2 — ${cat.label}: which fits best?</p>
    <div class="quiz-grid">
      ${cat.options.map(opt => `
        <button class="quiz-card" data-product="${opt.productId}">
          <span class="quiz-card-label">${opt.label}</span>
        </button>
      `).join('')}
    </div>
    <button class="quiz-back" id="quiz-back-btn">← Choose a different focus</button>
  `;
  c.querySelectorAll('.quiz-card').forEach(btn => {
    btn.onclick = () => renderQuizResult(btn.dataset.product);
  });
  document.getElementById('quiz-back-btn').onclick = renderQuizStep1;
}

function renderQuizResult(productId){
  const p = getProduct(productId);
  const c = document.getElementById('quiz-container');
  c.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-result-leaf">${leafSVG(p.color, 110)}</div>
      <p class="quiz-result-deity">${p.deity}</p>
      <h2 class="quiz-result-name">${p.name}</h2>
      <p class="quiz-result-tagline">${p.tagline}</p>
      <a class="btn btn-primary" href="#/product/${p.id}">See Full Story &amp; Precautions</a>
      <button class="quiz-back" id="quiz-retake-btn">Retake the quiz</button>
    </div>
  `;
  document.getElementById('quiz-retake-btn').onclick = renderQuizStep1;
}

// ---------- Build shop grid ----------
function buildShopGrid(){
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('a');
    card.href = `#/product/${p.id}`;
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-swatch">${leafSVG(p.color, 44)}</div>
      <p class="shop-card-deity">${p.deity}</p>
      <p class="shop-card-name">${p.name}</p>
      <p class="shop-card-tag">${p.tagline}</p>
    `;
    grid.appendChild(card);
  });
}

function getOrderedProducts(){
  return [...PRODUCTS].sort((a,b) => (a.clock===12?0:a.clock) - (b.clock===12?0:b.clock));
}

// ---------- Render a product page ----------
function renderProduct(id){
  const p = getProduct(id);
  if(!p){ location.hash = '#/'; return; }

  document.getElementById('product-swatch').innerHTML = leafSVG(p.color, 120);
  document.getElementById('product-position').textContent = `${p.clock} o'clock · ${p.month}`;
  document.getElementById('product-deity').textContent = p.deity;
  document.getElementById('product-name').textContent = p.name;
  document.getElementById('product-tagline').textContent = p.tagline;
  document.getElementById('product-myth').textContent = p.myth;
  document.getElementById('product-bridge').textContent = p.bridge;
  document.getElementById('product-taste').textContent = p.taste;

  const benefitsEl = document.getElementById('product-benefits');
  benefitsEl.innerHTML = p.benefits.map(b => `<li>${b}</li>`).join('');

  const ingredientsEl = document.getElementById('product-ingredients');
  ingredientsEl.innerHTML = p.ingredients.map(i => `<li>${i}</li>`).join('');

  const precautionsEl = document.getElementById('product-precautions');
  precautionsEl.innerHTML = p.precautions.map(x => `<li>${x}</li>`).join('');

  const pairsEl = document.getElementById('product-pairs');
  pairsEl.innerHTML = p.pairs.map(pid => {
    const pp = getProduct(pid);
    return pp ? `<a class="pair-chip" href="#/product/${pp.id}">${pp.name}</a>` : '';
  }).join('');

  // Amazon: search-query link only — never a fabricated product URL
  const amazonBtn = document.getElementById('buy-amazon');
  const query = encodeURIComponent(`Adityas Mandala ${p.name} turmeric`);
  amazonBtn.href = `https://www.amazon.com/s?k=${query}`;

  const directBtn = document.getElementById('buy-direct');
  directBtn.onclick = () => {
    alert('Direct shop is coming soon. Email info@adityasmandala.com to be notified when ' + p.name + ' launches on our site.');
  };

  document.title = `${p.name} — Adityas Mandala`;

  // Prev/next by clock/month position
  const ordered = getOrderedProducts();
  const idx = ordered.findIndex(x => x.id === p.id);
  const prevP = ordered[(idx - 1 + ordered.length) % ordered.length];
  const nextP = ordered[(idx + 1) % ordered.length];

  document.getElementById('clock-nav-prev').href = `#/product/${prevP.id}`;
  document.getElementById('clock-nav-prev-label').textContent = prevP.name;
  document.getElementById('clock-nav-next').href = `#/product/${nextP.id}`;
  document.getElementById('clock-nav-next-label').textContent = nextP.name;
}

// ---------- Router ----------
function router(){
  const hash = location.hash || '#/';
  const parts = hash.replace('#/', '').split('/').filter(Boolean);

  if(parts.length === 0){
    showView('splash');
  } else if(parts[0] === 'product' && parts[1]){
    renderProduct(parts[1]);
    showView('product');
  } else if(parts[0] === 'mandala'){
    showView('story');
  } else if(parts[0] === 'shop'){
    buildShopGrid();
    showView('shop');
  } else if(parts[0] === 'find-your-aditya'){
    renderQuizStep1();
    showView('quiz');
  } else {
    showView('splash');
  }
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  buildMandala();
  buildPromoCarousel();
  document.getElementById('story-intro-text').textContent = STORY_INTRO;
  window.addEventListener('hashchange', router);
  router();
});
