/* =========================================================
   EASY AUTO — conversational apply form
   Reusable engine mounted into either the popup modal
   (index.html) or the standalone page (apply.html).
   ========================================================= */
const EasyAutoChat = (function(){

  const steps = [
    {
      key:'firstName',
      bot: ["Hi! I'm here to help get you approved 👋", "Let's find your approval odds — quick chat, no long forms. First, what's your first name?"],
      type:'text', placeholder:'Your first name', validate:v=>v.trim().length>0 ? null:'Just need a first name to get started.'
    },
    {
      key:'phone',
      bot: d=>[`Nice to meet you, ${d.firstName}! What's the best number to text or call you at?`],
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
      key:'vehicle',
      bot: ["What are you hoping to drive?"],
      type:'chips', options:['Sedan / Car','SUV','Truck','Not sure yet — show me options']
    },
    {
      key:'employment',
      bot: ["Quick one on income — how are you currently earning?"],
      type:'chips', options:['Employed full-time','Employed part-time','Self-employed','On benefits / pension','Other']
    },
    {
      key:'income',
      bot: ["Roughly what's your gross monthly income? (An estimate is fine.)"],
      type:'text', inputType:'text', placeholder:'e.g. 3200',
      validate:v=> /^\$?\d[\d,]*$/.test(v.trim()) ? null : "Just a number works — e.g. 3200."
    },
    {
      key:'credit',
      bot: ["No judgment here — how would you describe your credit situation right now?"],
      type:'chips', options:['Pretty good, just want a better rate','Fair / a few dings','Rebuilding after a rough patch','No credit history yet','Not sure']
    },
    {
      key:'downpayment',
      bot: ["Last one — got anything set aside for a down payment or trade-in?"],
      type:'chips', options:['$0 down','$500–$1,500','$1,500–$4,000','$4,000+']
    },
  ];

  function mount({ chatBody, inputArea, progressBar, onComplete }){
    const state = { stepIndex:0, data:{} };

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
      const pct = Math.min(100, Math.round((state.stepIndex / steps.length) * 100));
      if(progressBar) progressBar.style.width = pct + '%';
    }

    function renderStep(){
      inputArea.innerHTML = '';
      updateProgress();
      if(state.stepIndex >= steps.length){ renderReview(); return; }

      const step = steps[state.stepIndex];
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
            state.data[step.key] = opt;
            state.stepIndex++;
            renderStep();
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
          state.data[step.key] = val.trim();
          state.stepIndex++;
          renderStep();
        }
        sendBtn.addEventListener('click', submit);
        input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') submit(); });

        row.appendChild(input);
        row.appendChild(sendBtn);
        inputArea.appendChild(row);
        inputArea.appendChild(err);
        setTimeout(()=>input.focus(), 100);
      }
    }

    function renderReview(){
      inputArea.innerHTML = '';
      showTyping();
      setTimeout(()=>{
        hideTyping();
        addBubble(`Perfect, ${state.data.firstName} — running your file now. One second while I check live approval odds…`, 'bot');
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
        ...state.data,
        source: window.location.pathname,
        submittedAt: new Date().toISOString()
      };
      console.log('Easy Auto lead captured (wire this to your CRM):', leadPayload);
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
        <h3>You're pre-matched, ${state.data.firstName}. 🎉</h3>
        <p>We found lenders likely to approve your profile. A real Easy Auto finance manager will call or text ${state.data.phone || 'you'} shortly to walk through your options.</p>
        <div class="success-stat-row">
          <div class="success-stat"><div class="v">86%</div><div class="l">Approval odds</div></div>
          <div class="success-stat"><div class="v">3</div><div class="l">Lenders matched</div></div>
          <div class="success-stat"><div class="v">~15 min</div><div class="l">Callback window</div></div>
        </div>
        <button class="btn btn-primary" style="width:100%; justify-content:center;" id="success-done-btn">Done</button>
      `;
      chatBody.appendChild(wrap);
      document.getElementById('success-done-btn').addEventListener('click', ()=>{ if(onComplete) onComplete(state.data); });

      setTimeout(()=>{
        const arc = document.getElementById('succ-arc');
        const needle = document.getElementById('succ-needle');
        if(arc && needle) drawGauge(arc, needle, null, 86, 1800);
      }, 200);
    }

    return {
      start(){ updateProgress(); renderStep(); }
    };
  }

  return { mount };
})();
