/* =========================================================
   EASY AUTO — shared page utilities
   ========================================================= */

/* ---- scroll reveal ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold:0.15 });
  revealEls.forEach(el=>io.observe(el));

  /* ---- mobile nav ---- */
  const hamburger = document.getElementById('hamburger');
  if(hamburger){
    hamburger.addEventListener('click', ()=>{
      const links = document.querySelector('.nav-links');
      const isOpen = links.style.display === 'flex';
      links.style.display = isOpen ? 'none' : 'flex';
      links.style.cssText += isOpen ? '' : 'position:absolute; top:100%; left:0; right:0; background:#fff; flex-direction:column; padding:20px 24px; border-bottom:1px solid var(--line); gap:18px;';
    });
  }
});

/* ---- reusable gauge draw (used on hero + chat success screen) ----
   target: 0-100 number. arcEl / needleEl / numEl are SVG/DOM elements. */
function drawGauge(arcEl, needleEl, numEl, target, duration){
  duration = duration || 2200;
  const len = 377;
  requestAnimationFrame(()=>{
    arcEl.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(.2,.8,.2,1)`;
    arcEl.style.strokeDashoffset = len - (len * (target/100));
    const angle = -90 + (180 * (target/100));
    needleEl.style.transition = `transform ${duration}ms cubic-bezier(.2,.8,.2,1)`;
    needleEl.style.transform = `rotate(${angle}deg)`;
  });
  if(numEl){
    const start = performance.now();
    function step(t){
      const p = Math.min(1,(t-start)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      numEl.textContent = Math.round(eased*target);
      if(p<1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
}

/* ---- hero gauge trigger ---- */
window.addEventListener('load', ()=>{
  const arc = document.getElementById('gauge-arc');
  const needle = document.getElementById('gauge-needle');
  const num = document.getElementById('gauge-number');
  if(arc && needle){ setTimeout(()=>drawGauge(arc, needle, num, 88), 400); }
});

/* ---- marquee content ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const track = document.getElementById('marquee');
  if(track){
    const items = ['92% Match Rate','40+ Lenders','No Credit? No Problem','Repos Welcome','Bankruptcy OK','Newcomers to Canada','Same-Day Approvals','Reports To Both Bureaus'];
    track.innerHTML = [...items, ...items].map(t=>`<div class="marquee-item"><b>${t}</b></div>`).join('');
  }
});

/* ---- AI console type-on ---- */
const consoleLines = [
  { tag:'[scan]', text:'Reading applicant profile…' },
  { tag:'[bureau]', text:'Cross-checking credit factors (no hard pull)' },
  { tag:'[match]', text:'Querying lender network — 40+ lenders' },
  { tag:'[filter]', text:'Removing lenders with incompatible risk bands' },
  { tag:'[rank]', text:'Ranking by approval likelihood + rate' },
  { tag:'[ok]', text:'3 lenders return pre-qualified match', ok:true },
  { tag:'[plan]', text:'Generating 12-month credit-building path' },
  { tag:'[done]', text:'Ready to hand off to your finance manager', ok:true },
];
document.addEventListener('DOMContentLoaded', ()=>{
  const consoleSection = document.getElementById('ai-section');
  if(!consoleSection) return;
  function runConsole(){
    const body = document.getElementById('console-body');
    body.innerHTML = '';
    consoleLines.forEach((l, i)=>{
      const div = document.createElement('div');
      div.className = 'console-line';
      div.style.animationDelay = (i*0.45)+'s';
      div.innerHTML = `<span class="tag">${l.tag}</span><span class="${l.ok?'ok':''}">${l.text}</span>`;
      body.appendChild(div);
    });
    const cursor = document.createElement('div');
    cursor.innerHTML = '<span class="console-cursor"></span>';
    cursor.style.opacity = '0';
    cursor.style.animation = `typeIn .5s forwards ${consoleLines.length*0.45}s`;
    body.appendChild(cursor);
  }
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ runConsole(); obs.disconnect(); } });
  }, { threshold:0.3 });
  obs.observe(consoleSection);
});

/* ---- credit chart draw ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const chartSection = document.getElementById('credit');
  if(!chartSection) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const path = document.getElementById('credit-path');
        if(path){ path.style.transition = 'stroke-dashoffset 1.8s ease'; path.style.strokeDashoffset = 0; }
        obs.disconnect();
      }
    });
  }, { threshold:0.3 });
  obs.observe(chartSection);
});

/* ---- back-to-prime tier track fill ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const track = document.getElementById('tier-fill');
  if(!track) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ track.style.width = '100%'; obs.disconnect(); }
    });
  }, { threshold:0.3 });
  obs.observe(track);
});

/* ---- stat count-up (hero numbers) ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const stats = document.querySelectorAll('[data-count-to]');
  if(!stats.length) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.suffix || '';
      const start = performance.now(), dur = 1400;
      function step(t){
        const p = Math.min(1,(t-start)/dur);
        const eased = 1 - Math.pow(1-p,3);
        const val = target < 10 ? (eased*target).toFixed(1) : Math.round(eased*target);
        el.textContent = val + suffix;
        if(p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold:0.5 });
  stats.forEach(el=>obs.observe(el));
});

/* ---- gauge card subtle tilt (pointer/mouse devices only — skipped on touch for perf) ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const card = document.querySelector('.gauge-card');
  if(!card || !window.matchMedia('(pointer:fine)').matches) return;
  card.style.transition = 'transform .3s ease';
  card.addEventListener('mousemove', (e)=>{
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${px*6}deg) rotateX(${-py*6}deg)`;
  });
  card.addEventListener('mouseleave', ()=>{ card.style.transform = 'none'; });
});

/* ---- logo image fallback ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.logo-mark img').forEach(img=>{
    img.addEventListener('error', ()=>{
      img.style.display = 'none';
      img.closest('.logo-mark').classList.add('img-missing');
    });
  });
});

/* ---- lender wall render ---- */
document.addEventListener('DOMContentLoaded', ()=>{
  const wall = document.getElementById('lender-wall');
  if(!wall || typeof LENDER_DATA === 'undefined') return;
  wall.innerHTML = LENDER_DATA.map(l=>`
    <div class="lender-tile">
      <div><div class="lt-name">${l.name}</div><div class="lt-type">${l.type}</div></div>
    </div>`).join('');
});

/* ---- gallery render (shared by homepage preview + full gallery page) ----
   Homepage: renders first N with no load-more.
   Gallery page: renders in batches with a "Load more" button. */
document.addEventListener('DOMContentLoaded', ()=>{
  const grid = document.getElementById('gallery-grid');
  if(!grid || typeof GALLERY_DATA === 'undefined') return;

  const previewOnly = grid.dataset.previewCount;
  const batchSize = 8;
  let shown = 0;

  function cardHTML(entry){
    const photoHTML = entry.photo
      ? `<img src="${entry.photo}" alt="${entry.name} with their ${entry.vehicle}" loading="lazy" width="400" height="400">`
      : `<div class="gallery-placeholder">Photo coming<br>soon</div>`;
    return `
      <div class="gallery-card">
        <div class="photo">${photoHTML}</div>
        <div class="g-body">
          <div class="g-name">${entry.name}</div>
          <div class="g-vehicle">${entry.vehicle}</div>
          <div class="g-review">“${entry.review}”</div>
        </div>
      </div>`;
  }

  if(previewOnly){
    const n = parseInt(previewOnly, 10);
    grid.innerHTML = GALLERY_DATA.slice(0, n).map(cardHTML).join('');
    return;
  }

  function renderNextBatch(){
    const next = GALLERY_DATA.slice(shown, shown + batchSize);
    grid.insertAdjacentHTML('beforeend', next.map(cardHTML).join(''));
    shown += next.length;
    const btn = document.getElementById('load-more-btn');
    if(btn){ btn.style.display = shown >= GALLERY_DATA.length ? 'none' : 'inline-flex'; }
  }
  renderNextBatch();
  const loadMoreBtn = document.getElementById('load-more-btn');
  if(loadMoreBtn) loadMoreBtn.addEventListener('click', renderNextBatch);
});
