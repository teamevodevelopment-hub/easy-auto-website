/* =========================================================
   EASY AUTO — step-tab apply form (rebuilt architecture)
   Reuses the same GoHighLevel webhook field mapping as before —
   only the front-end presentation changed, not the data pipeline.
   ========================================================= */

const NO_COMPANY = ['Retired', 'Other benefits income'];

const LEAD_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/9VGMfYkcETBlryI0dWob/webhook-trigger/34dcf050-4c7b-44d5-9789-e610688dcca7';

const VEHICLE_ICONS = {
  'Sedan': '<svg viewBox="0 0 60 30" width="34" height="17" fill="none"><path d="M5 22 L5 16 Q5 13 8 13 L16 13 L21 6 Q22.5 4 26 4 L38 4 Q41.5 4 43 6 L48 13 L52 13 Q55 13 55 16 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><circle cx="15" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="45" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
  'SUV': '<svg viewBox="0 0 60 30" width="34" height="17" fill="none"><path d="M5 22 L5 15 Q5 12 8 12 L14 12 L17 5 Q18 3 21 3 L39 3 Q42 3 43 5 L46 12 L52 12 Q55 12 55 15 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><line x1="21" y1="3" x2="21" y2="12" stroke="#123B8F" stroke-width="1.6"/><line x1="39" y1="3" x2="39" y2="12" stroke="#123B8F" stroke-width="1.6"/><circle cx="15" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="45" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
  'Truck': '<svg viewBox="0 0 60 30" width="34" height="17" fill="none"><path d="M5 22 L5 16 Q5 13 8 13 L11 13 L15 5 Q16 3 19 3 L26 3 Q28 3 28 6 L28 13 L34 13 L34 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M34 13 L52 13 Q55 13 55 16 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="34" y1="13" x2="34" y2="22" stroke="#123B8F" stroke-width="1.6"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><circle cx="14" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="46" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
  'Minivan': '<svg viewBox="0 0 60 30" width="34" height="17" fill="none"><path d="M5 22 L5 10 Q5 4 11 4 L49 4 Q55 4 55 10 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><line x1="18" y1="4" x2="18" y2="14" stroke="#123B8F" stroke-width="1.6"/><line x1="38" y1="4" x2="38" y2="14" stroke="#123B8F" stroke-width="1.6"/><line x1="5" y1="14" x2="55" y2="14" stroke="#123B8F" stroke-width="1.6"/><circle cx="16" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="44" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
  'Not sure yet': '<svg viewBox="0 0 24 24" width="28" height="28" fill="none"><circle cx="12" cy="12" r="9" stroke="#123B8F" stroke-width="2"/><path d="M9 9c0-1.5 1.2-2.5 3-2.5s3 1 3 2.3c0 1.5-1.3 1.8-2 2.5-.5.5-.7 1-.7 1.7" stroke="#123B8F" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="0.9" fill="#123B8F"/></svg>'
};

const state = {
  step: 0,
  data: {},
  sessionId: 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2,8)
};

/* ---------- webhook payload (same schema/fields as the previous chat engine) ---------- */
function splitName(full){
  const parts = (full || '').trim().split(/\s+/);
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' };
}
function getFirstTouch(){
  try{
    const raw = sessionStorage.getItem('easyauto_first_touch');
    return raw ? JSON.parse(raw) : {};
  }catch(e){ return {}; }
}
function buildWebhookPayload(data, meta){
  const { firstName, lastName } = splitName(data.name);
  const ft = getFirstTouch();
  return {
    "Lead ID": meta.sessionId,
    "First Name": firstName,
    "Last Name": lastName,
    "Phone": data.phone || '',
    "Email": data.email || '',
    "Lead Provider": "Easy Auto Website",
    "Contact Source": "Easy Auto Website",
    "Lead Type": "Finance Application",
    "Lead Assignment": "",
    "Vehicle Images": "",
    "Title Status": "",
    "Accident History": "",
    "Buying Time Frame": "",
    "Consent for Credit Check": "Yes",
    "Date Of Birth": data.dob || '',
    "Social Insurance Number": "",
    "Time at Current Address": "",
    "Residence Type": data.rentOrOwn || '',
    "Monthly Housing Payment": data.housingPayment || '',
    "Previous Address": "",
    "Employer Name": data.employer || '',
    "Employment Status": data.employment || '',
    "Job Title": data.position || '',
    "Time With Employer": data.tenure || '',
    "Monthly Income": data.income || '',
    "Additional Income": "",
    "Previous Employer": "",
    "Estimated Credit Range": data.creditRating || "",
    "Monthly Debt Payments": "",
    "Proof Of Income": "",
    "Credit Notes": "",
    "Target Budget": data.budget ? ('$' + data.budget + '/month') : "",
    "Purchase Type": "",
    "Financing Type": "",
    "Notes": `Lead status: ${meta.status} (${meta.percentComplete}% of form completed)`,
    "Lead Origin URL": ft.landingPageUrl || window.location.href,
    "Drivers License": "",
    "Objection": "",
    "Contact Type": "",
    "Time Zone": (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : "",
    "Website": window.location.hostname,
    "Business Name": "Easy Auto",
    "Quotes": "",
    "Street Address": data.address || '',
    "City": data.city || '',
    "Country": data.city ? "Canada" : "",
    "Postal Code": data.postal || '',
    "Province Code": data.province || '',
    "Province Name": "",
    "Trade Consideration": "", "Trade Reason": "", "Trade Buyout": "", "Trade Payments": "",
    "Trade Year": "", "Trade Make": "", "Trade Model": "", "Trade Trim": "", "Trade Mileage": "",
    "Trade VIN": "", "Trade Min Value": "", "Trade Fair Value": "", "Trade Max Value": "",
    "Trade Condition": "", "Trade Exterior Color": "", "Trade Interior Color": "",
    "Trade Fuel Type": "", "Trade Engine Size": "", "Trade Transmission Type": "",
    "Trade Drive Type": "", "Trade Body Style": "",
    "VOI Stock Number": "", "VOI Year": "", "VOI Make": "", "VOI Model": "", "VOI Trim": "",
    "VOI Price": "", "VOI VIN": "", "VOI Website Link": "", "VOI Mileage": "", "VOI Condition": "",
    "VOI Exterior Color": "", "VOI Interior Color": "", "VOI Fuel Type": "", "VOI Engine Size": "",
    "VOI Transmission Type": "", "VOI Drive Type": "",
    "VOI Body Style": data.vehicleType || "",
    "Requested Test Drive Date": "", "Requested Test Drive Time Preference": "",
    "Assigned To": "",
    "User Agent": navigator.userAgent || '',
    "UTM Source": ft.utmSource || '', "UTM Medium": ft.utmMedium || '',
    "UTM Campaign": ft.utmCampaign || '', "UTM Term": ft.utmTerm || '', "UTM Content": ft.utmContent || '',
    "Landing Page URL": ft.landingPageUrl || window.location.href,
    "Referrer URL": ft.referrerUrl || '',
    "Tracking URL": "",
    "GCLID": ft.gclid || ''
  };
}
function postToWebhook(payload){
  return fetch(LEAD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(err => console.error('Easy Auto webhook failed to send:', err));
}

/* ---------- step navigation ---------- */
function goToStep(n){
  state.step = n;
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.querySelector(`.step-panel[data-panel="${n}"]`).classList.add('active');
  document.querySelectorAll('.step-tab').forEach(t => {
    const i = parseInt(t.dataset.step, 10);
    t.classList.toggle('active', i === n);
    t.classList.toggle('done', i < n);
  });
  window.scrollTo({ top: 0, behavior:'smooth' });
  autosave();
}

function autosave(){
  const total = 4;
  const percentComplete = Math.min(100, Math.round(((state.step) / total) * 100));
  const payload = buildWebhookPayload(state.data, { status:'partial', percentComplete, sessionId: state.sessionId });
  console.log(`Easy Auto PARTIAL lead autosave (${percentComplete}% complete):`, payload);
  try{ localStorage.setItem('easyauto_partial_' + state.sessionId, JSON.stringify(payload)); }catch(e){}
}

/* ---------- chip helper ---------- */
function wireChipRow(rowId, onSelect){
  document.getElementById(rowId).querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      document.getElementById(rowId).querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
      chip.classList.add('selected');
      onSelect(chip.dataset.value);
    });
  });
}

/* ---------- STEP 1: budget slider ---------- */
const slider = document.getElementById('budget-slider');
const budgetValue = document.getElementById('budget-value');
slider.addEventListener('input', ()=>{
  budgetValue.textContent = slider.value;
  state.data.budget = slider.value;
});
state.data.budget = slider.value;

document.querySelectorAll('.step-next').forEach(btn=>{
  btn.addEventListener('click', ()=> goToStep(parseInt(btn.dataset.next, 10)));
});
document.querySelectorAll('.step-back').forEach(btn=>{
  btn.addEventListener('click', ()=> goToStep(parseInt(btn.dataset.back, 10)));
});
document.querySelectorAll('.step-tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    const target = parseInt(tab.dataset.step, 10);
    if(target <= state.step || tab.classList.contains('done')) goToStep(target);
  });
});

/* ---------- STEP 2: vehicle icons ---------- */
document.querySelectorAll('.vehicle-card').forEach(card=>{
  const val = card.dataset.value;
  const iconSpan = card.querySelector('.vicon');
  iconSpan.innerHTML = VEHICLE_ICONS[val] || '';
  card.addEventListener('click', ()=>{
    document.querySelectorAll('.vehicle-card').forEach(c=>c.classList.remove('selected'));
    card.classList.add('selected');
    state.data.vehicleType = val;
    setTimeout(()=> goToStep(2), 250);
  });
});

/* ---------- STEP 3: about you ---------- */
wireChipRow('credit-chip-row', v => state.data.creditRating = v);

function showError(id, msg){
  const el = document.getElementById(id);
  el.textContent = msg; el.style.display = msg ? 'block' : 'none';
}
document.getElementById('step3-continue').addEventListener('click', ()=>{
  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const dob = document.getElementById('f-dob').value.trim();
  let ok = true;

  if(name.length < 2){ showError('err-name','Please enter your full name.'); ok = false; } else showError('err-name','');
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showError('err-email','Enter a valid email.'); ok = false; } else showError('err-email','');
  if(!/^[\d\s\-\(\)\+]{7,}$/.test(phone)){ showError('err-phone','Enter a valid phone number.'); ok = false; } else showError('err-phone','');
  const dobMatch = dob.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(!dobMatch){ showError('err-dob','Use MM/DD/YYYY.'); ok = false; } else showError('err-dob','');

  if(!ok) return;
  state.data.name = name;
  state.data.email = email;
  state.data.phone = phone;
  state.data.dob = dob;
  goToStep(3);
});

/* ---------- STEP 4: address, housing, employment, income, tenure ---------- */
document.getElementById('manual-address-link').addEventListener('click', (e)=>{
  e.preventDefault();
  document.getElementById('manual-address-fields').style.display = 'block';
});
document.getElementById('f-address').addEventListener('input', (e)=> state.data.address = e.target.value);
document.getElementById('f-city').addEventListener('input', (e)=> state.data.city = e.target.value);
document.getElementById('f-province').addEventListener('change', (e)=> state.data.province = e.target.value);
document.getElementById('f-postal').addEventListener('input', (e)=> state.data.postal = e.target.value);

function attachAddressAutocomplete(){
  if(typeof google === 'undefined' || !google.maps || !google.maps.places) return;
  try{
    const input = document.getElementById('f-address');
    const ac = new google.maps.places.Autocomplete(input, { types:['address'], componentRestrictions:{ country:['ca'] } });
    ac.addListener('place_changed', ()=>{
      const place = ac.getPlace();
      if(place && place.formatted_address){
        input.value = place.formatted_address;
        state.data.address = place.formatted_address;
      }
    });
  }catch(e){}
}
// Called by Google's script itself once it's fully loaded and ready —
// see the callback=initGoogleMapsAutocomplete parameter on the script
// tag in apply.html. This is more reliable than calling this function
// immediately, since that risked running before Google's script had
// actually finished initializing google.maps.places.
window.initGoogleMapsAutocomplete = attachAddressAutocomplete;

wireChipRow('rentown-chip-row', v=>{
  state.data.rentOrOwn = v;
  const wrap = document.getElementById('housing-payment-wrap');
  const label = document.getElementById('housing-payment-label');
  if(v === 'Live with family'){
    wrap.style.display = 'none';
  } else {
    wrap.style.display = 'block';
    label.textContent = v === 'Own' ? 'Monthly mortgage payment' : 'Monthly rent payment';
  }
});
document.getElementById('f-housing-payment').addEventListener('input', e=> state.data.housingPayment = e.target.value);

wireChipRow('employment-chip-row', v=>{
  state.data.employment = v;
  const wrap = document.getElementById('employer-fields-wrap');
  const label = document.getElementById('employer-label');
  if(NO_COMPANY.includes(v)){
    wrap.style.display = 'none';
  } else {
    wrap.style.display = 'block';
    label.textContent = v === 'Self Employed' ? 'Business name' : 'Employer';
  }
});
document.getElementById('f-employer').addEventListener('input', e=> state.data.employer = e.target.value);
document.getElementById('f-position').addEventListener('input', e=> state.data.position = e.target.value);
document.getElementById('f-income').addEventListener('input', e=> state.data.income = e.target.value);
wireChipRow('tenure-chip-row', v => state.data.tenure = v);

/* ---------- final submit ---------- */
document.getElementById('final-submit').addEventListener('click', ()=>{
  const income = document.getElementById('f-income').value.trim();
  if(!/^\$?\d[\d,]*$/.test(income)){
    showError('err-income', 'Enter your gross monthly income as a number.');
    return;
  }
  showError('err-income','');
  state.data.income = income;

  const btn = document.getElementById('final-submit');
  btn.disabled = true;
  btn.textContent = 'Scanning the lender network…';

  const payload = buildWebhookPayload(state.data, { status:'complete', percentComplete:100, sessionId: state.sessionId });
  console.log('Easy Auto COMPLETE lead captured:', payload);
  try{ localStorage.removeItem('easyauto_partial_' + state.sessionId); }catch(e){}

  postToWebhook(payload).finally(()=>{
    setTimeout(renderSuccess, 1200);
  });
});

function renderSuccess(){
  document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
  document.querySelector('.step-panel[data-panel="success"]').classList.add('active');
  document.getElementById('step-tabs').style.display = 'none';

  const fname = (state.data.name || '').trim().split(/\s+/)[0] || 'there';
  const mount = document.getElementById('success-mount');
  mount.innerHTML = `
    <div class="success-screen">
    <svg class="success-gauge" viewBox="0 0 300 170">
      <path d="M 30 150 A 120 120 0 0 1 270 150" fill="none" stroke="#DEEEFF" stroke-width="20" stroke-linecap="round"/>
      <path id="succ-arc" d="M 30 150 A 120 120 0 0 1 270 150" fill="none" stroke="url(#succGrad)" stroke-width="20" stroke-linecap="round" stroke-dasharray="377" stroke-dashoffset="377"/>
      <defs><linearGradient id="succGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#E85C5C"/><stop offset="50%" stop-color="#E8A23A"/><stop offset="100%" stop-color="#1FA968"/>
      </linearGradient></defs>
      <line id="succ-needle" x1="150" y1="150" x2="150" y2="45" stroke="#123B8F" stroke-width="4" stroke-linecap="round" style="transform-origin:150px 150px; transform:rotate(-90deg);"/>
      <circle cx="150" cy="150" r="8" fill="#123B8F"/>
    </svg>
    <h3>You're pre-matched, ${fname}. 🎉</h3>
    <p>We found lenders likely to approve your profile. A real Easy Auto finance manager will call or text ${state.data.phone || 'you'} shortly to walk through your options.</p>
    <div class="success-stat-row">
      <div class="success-stat"><div class="v">98%</div><div class="l">Approval odds</div></div>
      <div class="success-stat"><div class="v">12</div><div class="l">Lenders matched</div></div>
      <div class="success-stat"><div class="v">~15 min</div><div class="l">Callback window</div></div>
    </div>
    <a href="index.html" class="btn btn-primary" style="width:100%; justify-content:center;">Done</a>
    </div>
  `;
  setTimeout(()=>{
    const arc = document.getElementById('succ-arc');
    const needle = document.getElementById('succ-needle');
    if(arc && needle && typeof drawGauge === 'function') drawGauge(arc, needle, null, 98, 1800);
  }, 200);
}
