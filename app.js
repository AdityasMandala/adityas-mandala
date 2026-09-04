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

// ---------- Build the mandala ring ----------
function buildMandala(){
  const ring = document.getElementById('mandala-ring');
  PRODUCTS.forEach((p, i) => {
    // wrap points "down" (south) at 0deg by default (transform-origin is at its top).
    // Adding 180deg makes clock=0 (12 o'clock) point up/north, then +30deg per hour, clockwise.
    const wrapAngle = (p.clock * 30 + 180) % 360;

    const wrap = document.createElement('div');
    wrap.className = 'petal-wrap';
    wrap.style.transform = `rotate(${wrapAngle}deg)`;

    const inner = document.createElement('a');
    inner.href = `#/product/${p.id}`;
    inner.className = 'petal-inner';
    // counter-rotate the leaf+label so they stay upright regardless of wrap angle
    inner.style.setProperty('--counter-rotate', `${-wrapAngle}deg`);
    inner.style.setProperty('--pulse-delay', `${i * 0.4}s`);
    inner.setAttribute('aria-label', `${p.name} — ${p.deity}`);

    const shape = document.createElement('div');
    shape.className = 'petal-shape';
    shape.style.background = p.color;

    const label = document.createElement('span');
    label.className = 'petal-label';
    label.textContent = p.name.replace('Golden ', '');

    inner.appendChild(shape);
    inner.appendChild(label);
    wrap.appendChild(inner);
    ring.appendChild(wrap);
  });
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
  document.getElementById('story-intro-text').textContent = STORY_INTRO;
  window.addEventListener('hashchange', router);
  router();
});
