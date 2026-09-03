/* =========================================================
   EASY AUTO — conversational apply form
   Reusable engine mounted into either the popup modal
   (index.html) or the standalone page (apply.html).
   ========================================================= */
const EasyAutoChat = (function(){

  const SECONDS_PER_STEP = 4;
  const NO_COMPANY = ['Retired','Other benefits income'];

  const VEHICLE_ICONS = {
    sedan: '<svg viewBox="0 0 60 30" width="30" height="15" fill="none"><path d="M5 22 L5 16 Q5 13 8 13 L16 13 L21 6 Q22.5 4 26 4 L38 4 Q41.5 4 43 6 L48 13 L52 13 Q55 13 55 16 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><circle cx="15" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="45" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
    suv: '<svg viewBox="0 0 60 30" width="30" height="15" fill="none"><path d="M5 22 L5 15 Q5 12 8 12 L14 12 L17 5 Q18 3 21 3 L39 3 Q42 3 43 5 L46 12 L52 12 Q55 12 55 15 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><line x1="21" y1="3" x2="21" y2="12" stroke="#123B8F" stroke-width="1.6"/><line x1="39" y1="3" x2="39" y2="12" stroke="#123B8F" stroke-width="1.6"/><circle cx="15" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="45" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
    truck: '<svg viewBox="0 0 60 30" width="30" height="15" fill="none"><path d="M5 22 L5 16 Q5 13 8 13 L11 13 L15 5 Q16 3 19 3 L26 3 Q28 3 28 6 L28 13 L34 13 L34 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><path d="M34 13 L52 13 Q55 13 55 16 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="34" y1="13" x2="34" y2="22" stroke="#123B8F" stroke-width="1.6"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><circle cx="14" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="46" cy="22" r="3.5" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
    minivan: '<svg viewBox="0 0 60 30" width="30" height="15" fill="none"><path d="M5 22 L5 10 Q5 4 11 4 L49 4 Q55 4 55 10 L55 22" stroke="#123B8F" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/><line x1="5" y1="22" x2="55" y2="22" stroke="#123B8F" stroke-width="2.2" stroke-linecap="round"/><line x1="18" y1="4" x2="18" y2="14" stroke="#123B8F" stroke-width="1.6"/><line x1="38" y1="4" x2="38" y2="14" stroke="#123B8F" stroke-width="1.6"/><line x1="5" y1="14" x2="55" y2="14" stroke="#123B8F" stroke-width="1.6"/><circle cx="16" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/><circle cx="44" cy="22" r="4" fill="#fff" stroke="#123B8F" stroke-width="2.2"/></svg>',
    question: '<svg viewBox="0 0 24 24" width="26" height="26" fill="none"><circle cx="12" cy="12" r="9" stroke="#123B8F" stroke-width="2"/><path d="M9 9c0-1.5 1.2-2.5 3-2.5s3 1 3 2.3c0 1.5-1.3 1.8-2 2.5-.5.5-.7 1-.7 1.7" stroke="#123B8F" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17" r="0.9" fill="#123B8F"/></svg>'
  };

  /* ------------------------------------------------------------------
     WEBHOOK — every completed application POSTs here automatically.
     This is a GoHighLevel / LeadConnector inbound webhook trigger.
     See the field mapping reference doc for what each key means and
     how to map it inside your GHL workflow.
     ------------------------------------------------------------------ */
  const LEAD_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/9VGMfYkcETBlryI0dWob/webhook-trigger/34dcf050-4c7b-44d5-9789-e610688dcca7';

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

  /* ------------------------------------------------------------------
     Payload shape matches the existing GoHighLevel/LeadConnector field
     schema already in use for other lead sources (see the mapping
     reference doc). Every field from that schema is included here, even
     ones this form doesn't collect — left as "" so the GHL workflow's
     field mapping never hits a missing key. Fields this form genuinely
     doesn't ask about (trade-in details, vehicle-of-interest details,
     SIN, previous address, etc.) are intentionally blank, not omitted.
     ------------------------------------------------------------------ */
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
      "Consent for Credit Check": "",
      "Date Of Birth": data.birthdate || '',
      "Social Insurance Number": "",
      "Time at Current Address": "",
      "Residence Type": "",
      "Monthly Housing Payment": "",
      "Previous Address": "",
      "Employer Name": data.companyName || '',
      "Employment Status": data.employment || '',
      "Job Title": data.position || '',
      "Time With Employer": data.timeAtJob || '',
      "Monthly Income": data.income || '',
      "Additional Income": "",
      "Previous Employer": "",
      "Estimated Credit Range": data.creditRating || "",
      "Monthly Debt Payments": "",
      "Proof Of Income": "",
      "Credit Notes": "",
      "Target Budget": "",
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
      "City": "",
      "Country": "",
      "Postal Code": "",
      "Province Code": "",
      "Province Name": "",
      "Trade Consideration": "",
      "Trade Reason": "",
      "Trade Buyout": "",
      "Trade Payments": "",
      "Trade Year": "",
      "Trade Make": "",
      "Trade Model": "",
      "Trade Trim": "",
      "Trade Mileage": "",
      "Trade VIN": "",
      "Trade Min Value": "",
      "Trade Fair Value": "",
      "Trade Max Value": "",
      "Trade Condition": "",
      "Trade Exterior Color": "",
      "Trade Interior Color": "",
      "Trade Fuel Type": "",
      "Trade Engine Size": "",
      "Trade Transmission Type": "",
      "Trade Drive Type": "",
      "Trade Body Style": "",
      "VOI Stock Number": "",
      "VOI Year": "",
      "VOI Make": "",
      "VOI Model": "",
      "VOI Trim": "",
      "VOI Price": "",
      "VOI VIN": "",
      "VOI Website Link": "",
      "VOI Mileage": "",
      "VOI Condition": "",
      "VOI Exterior Color": "",
      "VOI Interior Color": "",
      "VOI Fuel Type": "",
      "VOI Engine Size": "",
      "VOI Transmission Type": "",
      "VOI Drive Type": "",
      "VOI Body Style": data.vehicleType || "",
      "Requested Test Drive Date": "",
      "Requested Test Drive Time Preference": "",
      "Assigned To": "",
      "User Agent": navigator.userAgent || '',
      "UTM Source": ft.utmSource || '',
      "UTM Medium": ft.utmMedium || '',
      "UTM Campaign": ft.utmCampaign || '',
      "UTM Term": ft.utmTerm || '',
      "UTM Content": ft.utmContent || '',
      "Landing Page URL": ft.landingPageUrl || window.location.href,
      "Referrer URL": ft.referrerUrl || '',
      "Tracking URL": "",
      "GCLID": ft.gclid || ''
    };
  }

  function postToWebhook(payload){
    fetch(LEAD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('Easy Auto webhook failed to send:', err));
  }

  function firstNameOf(d){
    if(!d.name) return 'there';
    return d.name.trim().split(/\s+/)[0];
  }

  function companyNoun(d){
    return d.employment === 'Self Employed' ? 'business' : 'company';
  }

  function tenureBotLine(d){
    if(d.employment === 'Self Employed') return "And how long have you been running your business?";
    if(d.employment === 'Retired') return "And how long have you been retired?";
    if(d.employment === 'Other benefits income') return "And how long have you been receiving this income?";
    return "And how long have you been there?";
  }

  const steps = [
    {
      key:'vehicleType',
      bot: ["Hi! I'm here to help get you approved 👋", "Let's find your approval odds — quick chat, no long forms. What are you hoping to drive?"],
      type:'chips', options:[
        {label:'Sedan', icon:'sedan'},
        {label:'SUV', icon:'suv'},
        {label:'Truck', icon:'truck'},
        {label:'Minivan', icon:'minivan'},
        {label:'Not sure yet', icon:'question'}
      ]
    },
    {
      key:'creditRating',
      bot: ["No judgment here — what would you guess your credit is like right now?"],
      type:'chips', options:['Great','Good','Fair','Poor',"I'm not sure"]
    },
    {
      key:'name',
      bot: ["Got it — what's your full name?"],
      type:'text', placeholder:'Your full name', validate:v=>v.trim().length>1 ? null:'Just need your name to get started.'
    },
    {
      key:'phone',
      bot: d=>[`Nice to meet you, ${firstNameOf(d)}! What's the best number to text or call you at?`],
      type:'text', inputType:'tel', placeholder:'(555) 555-5555',
      validate:v=>/^[\d\s\-\(\)\+]{7,}$/.test(v.trim()) ? null : "That doesn't look like a valid phone number."
    },
    {
      key:'email',
      bot: ["Got it. And an email so we can send your approval details?"],
      type:'text', inputType:'email', placeholder:'you@email.com',
      validate:v=> /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? null : "That doesn't look like a valid email."
    },
    {
      key:'address',
      bot: ["What's your address? Start typing and pick it from the list, or just type it in yourself."],
      type:'address', placeholder:'Start typing your address…',
      validate:v=>v.trim().length>4 ? null : 'Just need your street address and city.'
    },
    {
      key:'birthdate',
      bot: ["What's your date of birth?"],
      type:'text', placeholder:'MM/DD/YYYY',
      validate: v => {
        const m = v.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if(!m) return "Use MM/DD/YYYY — e.g. 05/15/1990.";
        const mm = parseInt(m[1],10), dd = parseInt(m[2],10), yyyy = parseInt(m[3],10);
        const dob = new Date(yyyy, mm-1, dd);
        if(isNaN(dob.getTime()) || dob.getMonth() !== mm-1) return "That date doesn't look right.";
        return null;
      }
    },
    {
      key:'employment',
      bot: ["Quick one on income — how are you currently earning?"],
      type:'chips', options:['Full Time','Part Time','Self Employed','Retired','Other benefits income']
    },
    {
      key:'companyName',
      skipIf: d => NO_COMPANY.includes(d.employment),
      bot: d => [`What's the name of your ${companyNoun(d)}?`],
      type:'text', placeholder:'Company or business name',
      validate:v=>v.trim().length>0 ? null:'Just the name is fine, no need for details.'
    },
    {
      key:'position',
      skipIf: d => NO_COMPANY.includes(d.employment),
      bot: d => [d.employment === 'Self Employed' ? "And what's your role in the business?" : "And what's your position there?"],
      type:'text', placeholder:'Job title / role',
      validate:v=>v.trim().length>0 ? null:'Just a short title is fine.'
    },
    {
      key:'income',
      bot: ["Roughly what's your gross monthly income? (An estimate is fine.)"],
      type:'text', inputType:'text', placeholder:'e.g. 3200',
      validate:v=> /^\$?\d[\d,]*$/.test(v.trim()) ? null : "Just a number works — e.g. 3200."
    },
    {
      key:'timeAtJob',
      bot: d => [tenureBotLine(d)],
      type:'chips', options:['Less than 6 months','6 months – 1 year','1 – 3 years','3+ years']
    },
  ];

  function visibleSteps(fromIndex, data){
    const list = [];
    for(let i=fromIndex;i<steps.length;i++){
      const s = steps[i];
      if(s.skipIf && s.skipIf(data)) continue;
      list.push(s);
    }
    return list;
  }

  function totalVisibleCount(data){
    return visibleSteps(0, data).length;
  }

  function makeSessionId(){
    return 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2,8);
  }

  function mount({ chatBody, inputArea, progressBar, countdownEl, onComplete }){
    const state = { stepIndex:0, data:{}, answeredCount:0, sessionId: makeSessionId() };

    function scrollToBottom(){ chatBody.scrollTop = chatBody.scrollHeight; }

    function addBubble(text, sender){
      const b = document.createElement('div');
      b.className = 'bubble ' + sender;
      b.textContent = text;
      chatBody.appendChild(b);
      scrollToBottom();
    }

    function showTyping(){
      const t = document.createElement('div');
      t.className = 'typing';
      t.id = 'typing-indicator';
      t.innerHTML = '<span></span><span></span><span></span>';
      chatBody.appendChild(t);
      scrollToBottom();
    }
    function hideTyping(){
      const t = chatBody.querySelector('#typing-indicator');
      if(t) t.remove();
    }

    function updateProgress(){
      const total = totalVisibleCount({});
      const pct = Math.min(100, Math.round((state.answeredCount / total) * 100));
      if(progressBar) progressBar.style.width = pct + '%';
    }

    function updateCountdown(){
      if(!countdownEl) return;
      const remaining = visibleSteps(state.stepIndex, state.data).length;
      const secs = remaining * SECONDS_PER_STEP;
      if(remaining <= 0){
        countdownEl.textContent = 'Almost done';
      } else if(secs <= 15){
        countdownEl.textContent = 'Almost done — just a few more seconds';
      } else {
        countdownEl.textContent = `About ${secs} seconds from finish`;
      }
    }

    /* ------------------------------------------------------------------
       AUTOSAVE — fires after every single answer, not just at final
       submission, so a lead isn't lost even if someone abandons the
       form partway through (e.g. only gives name + phone, then closes
       the tab). Currently this logs to console and saves a local copy
       in the browser as a safety net. To actually receive these partial
       leads on your end (not just have them sit in the visitor's own
       browser), wire the fetch() call below into a real endpoint —
       same as the TODO on the final submitLead() function.
       ------------------------------------------------------------------ */
    function autosaveProgress(){
      const total = totalVisibleCount(state.data);
      const percentComplete = Math.min(100, Math.round((state.answeredCount / total) * 100));
      const payload = {
        sessionId: state.sessionId,
        status: 'partial',
        percentComplete,
        data: { ...state.data },
        source: window.location.pathname,
        updatedAt: new Date().toISOString()
      };
      console.log(`Easy Auto PARTIAL lead autosave (${percentComplete}% complete) — wire this to your CRM:`, payload);
      try{
        localStorage.setItem('easyauto_partial_' + state.sessionId, JSON.stringify(payload));
      }catch(e){ /* localStorage unavailable — safe to ignore, console.log above still ran */ }
      // OPTIONAL — send partial progress to the same webhook too, so
      // abandoned applications (someone who only got halfway through)
      // still reach you. Left OFF by default on purpose: your
      // LeadConnector workflow will fire once per webhook hit, so
      // turning this on means it fires on EVERY answered question, not
      // just at the end — which could mean multiple texts/emails/tags
      // firing per applicant if your workflow does something per-hit.
      // If you want this, either build a separate GHL workflow that
      // only acts on leadStatus:"partial" the first time it sees a
      // sessionId, or uncomment the line below to send every step:
      // postToWebhook(buildWebhookPayload(state.data, { status:'partial', percentComplete, sessionId: state.sessionId }));
    }

    function currentStep(){
      while(state.stepIndex < steps.length && steps[state.stepIndex].skipIf && steps[state.stepIndex].skipIf(state.data)){
        state.stepIndex++;
      }
      return steps[state.stepIndex];
    }

    function renderStep(){
      inputArea.innerHTML = '';
      updateCountdown();
      updateProgress();

      const step = currentStep();
      if(!step){ renderReview(); return; }

      const botLines = typeof step.bot === 'function' ? step.bot(state.data) : step.bot;

      showTyping();
      setTimeout(()=>{
        hideTyping();
        botLines.forEach((line, i)=>{
          setTimeout(()=> addBubble(line, 'bot'), i*550);
        });
        setTimeout(()=> renderInputFor(step), botLines.length*550 + 150);
      }, 550);
    }

    function advance(step, value){
      state.data[step.key] = value;
      state.answeredCount++;
      state.stepIndex++;
      autosaveProgress();
      renderStep();
    }

    function attachAddressAutocomplete(input){
      if(typeof google === 'undefined' || !google.maps || !google.maps.places) return;
      try{
        const ac = new google.maps.places.Autocomplete(input, {
          types: ['address'],
          componentRestrictions: { country: ['ca'] }
        });
        ac.addListener('place_changed', ()=>{
          const place = ac.getPlace();
          if(place && place.formatted_address){ input.value = place.formatted_address; }
        });
      }catch(e){ /* Places script present but failed to init — silently fall back to manual entry */ }
    }

    function renderInputFor(step){
      inputArea.innerHTML = '';
      if(step.type === 'chips'){
        const row = document.createElement('div');
        row.className = 'chip-row';
        step.options.forEach(opt=>{
          const isIconChip = typeof opt === 'object' && opt !== null;
          const label = isIconChip ? opt.label : opt;
          const chip = document.createElement('button');
          chip.className = isIconChip ? 'chip chip-icon' : 'chip';
          if(isIconChip){
            chip.innerHTML = (VEHICLE_ICONS[opt.icon] || '') + '<span>' + label + '</span>';
          } else {
            chip.textContent = label;
          }
          chip.addEventListener('click', ()=>{
            addBubble(label, 'user');
            advance(step, label);
          });
          row.appendChild(chip);
        });
        inputArea.appendChild(row);
      } else {
        const row = document.createElement('div');
        row.className = 'text-input-row';
        const input = document.createElement('input');
        input.type = step.inputType || 'text';
        input.placeholder = step.placeholder || '';
        if(step.type === 'address') input.autocomplete = 'off';
        const err = document.createElement('div');
        err.className = 'input-error';

        const sendBtn = document.createElement('button');
        sendBtn.className = 'send-btn';
        sendBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 12l18-8-6 18-3-7-9-3Z" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>';

        function submit(){
          const val = input.value;
          const errMsg = step.validate ? step.validate(val) : null;
          if(errMsg){ err.textContent = errMsg; err.style.display = 'block'; input.focus(); return; }
          addBubble(val.trim(), 'user');
          advance(step, val.trim());
        }
        sendBtn.addEventListener('click', submit);
        input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') submit(); });

        row.appendChild(input);
        row.appendChild(sendBtn);
        inputArea.appendChild(row);
        inputArea.appendChild(err);

        if(step.type === 'address'){
          const hint = document.createElement('div');
          hint.className = 'hint-note';
          hint.textContent = "Can't find it in the list? Just finish typing it and press enter.";
          inputArea.appendChild(hint);
          attachAddressAutocomplete(input);
        }

        setTimeout(()=>input.focus(), 100);
      }
    }

    function renderReview(){
      inputArea.innerHTML = '';
      if(countdownEl) countdownEl.textContent = 'Ready to run your file';
      showTyping();
      setTimeout(()=>{
        hideTyping();
        addBubble(`Perfect, ${firstNameOf(state.data)} — running your file now. One second while I check live approval odds…`, 'bot');
        setTimeout(()=>{
          const row = document.createElement('div');
          row.className = 'chip-row';
          const btn = document.createElement('button');
          btn.className = 'chip';
          btn.style.background = 'linear-gradient(135deg, var(--blue), var(--blue-deep))';
          btn.style.color = '#fff';
          btn.style.borderColor = 'transparent';
          btn.textContent = 'Run My Approval →';
          btn.addEventListener('click', submitLead);
          row.appendChild(btn);
          inputArea.appendChild(row);
        }, 400);
      }, 600);
    }

    function submitLead(){
      inputArea.innerHTML = '<div style="text-align:center; color:var(--slate-dim); font-family:var(--mono); font-size:12.5px; padding:6px 0;">Scanning the lender network…</div>';

      const leadPayload = {
        sessionId: state.sessionId,
        status: 'complete',
        percentComplete: 100,
        data: { ...state.data },
        source: window.location.pathname,
        submittedAt: new Date().toISOString()
      };
      console.log('Easy Auto COMPLETE lead captured:', leadPayload);
      try{ localStorage.removeItem('easyauto_partial_' + state.sessionId); }catch(e){}

      postToWebhook(buildWebhookPayload(state.data, { status:'complete', percentComplete:100, sessionId: state.sessionId }));
      setTimeout(renderSuccess, 1900);
    }

    function renderSuccess(){
      chatBody.innerHTML = '';
      inputArea.innerHTML = '';
      if(progressBar) progressBar.style.width = '100%';
      if(countdownEl) countdownEl.textContent = 'Done!';

      const fname = firstNameOf(state.data);
      const wrap = document.createElement('div');
      wrap.className = 'success-screen';
      wrap.innerHTML = `
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
        <button class="btn btn-primary" style="width:100%; justify-content:center;" id="success-done-btn">Done</button>
      `;
      chatBody.appendChild(wrap);
      document.getElementById('success-done-btn').addEventListener('click', ()=>{ if(onComplete) onComplete(state.data); });

      setTimeout(()=>{
        const arc = document.getElementById('succ-arc');
        const needle = document.getElementById('succ-needle');
        if(arc && needle) drawGauge(arc, needle, null, 98, 1800);
      }, 200);
    }

    return {
      start(){ updateCountdown(); updateProgress(); renderStep(); }
    };
  }

  return { mount };
})();
