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
      <div class="promo-sachet" style="background:${p.color}">
        <div class="promo-sachet-word">ADITYAS</div>
        <div class="promo-sachet-name">${p.name.toUpperCase()}</div>
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

// ---------- Build shop grid ----------
function buildShopGrid(){
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  PRODUCTS.forEach(p => {
    const card = document.createElement('a');
    card.href = `#/product/${p.id}`;
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-swatch" style="background:${p.color}"></div>
      <p class="shop-card-deity">${p.deity}</p>
      <p class="shop-card-name">${p.name}</p>
      <p class="shop-card-tag">${p.tagline}</p>
    `;
    grid.appendChild(card);
  });
}

// ---------- Render a product page ----------
function renderProduct(id){
  const p = getProduct(id);
  if(!p){ location.hash = '#/'; return; }

  document.getElementById('product-swatch').style.background = p.color;
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
    alert('Direct shop is coming soon. Email adityasmandala@outlook.com to be notified when ' + p.name + ' launches on our site.');
  };

  document.title = `${p.name} — Adityas Mandala`;
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
