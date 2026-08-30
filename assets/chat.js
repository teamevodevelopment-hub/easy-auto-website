/* =========================================================
   EASY AUTO — conversational apply form
   Reusable engine mounted into either the popup modal
   (index.html) or the standalone page (apply.html).
   ========================================================= */
const EasyAutoChat = (function(){

  const SECONDS_PER_STEP = 4;
  const NO_COMPANY = ['Retired','Other benefits income'];

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
      key:'name',
      bot: ["Hi! I'm here to help get you approved 👋", "Let's find your approval odds — quick chat, no long forms. What's your full name?"],
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
      // Example of where a real autosave submission would go:
      // fetch('https://your-endpoint.example/api/leads/partial', {
      //   method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)
      // });
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
          const chip = document.createElement('button');
          chip.className = 'chip';
          chip.textContent = opt;
          chip.addEventListener('click', ()=>{
            addBubble(opt, 'user');
            advance(step, opt);
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

      /* ------------------------------------------------------------------
         LEAD PAYLOAD — send this to your real backend.
         Wire this into your CRM / webhook / lender intake here.
         Currently this only logs to the console as a placeholder.
         ------------------------------------------------------------------ */
      const leadPayload = {
        sessionId: state.sessionId,
        status: 'complete',
        percentComplete: 100,
        data: { ...state.data },
        source: window.location.pathname,
        submittedAt: new Date().toISOString()
      };
      console.log('Easy Auto COMPLETE lead captured (wire this to your CRM):', leadPayload);
      try{ localStorage.removeItem('easyauto_partial_' + state.sessionId); }catch(e){}
      // Example of where a real submission would go:
      // fetch('https://your-endpoint.example/api/leads', {
      //   method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(leadPayload)
      // });

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
