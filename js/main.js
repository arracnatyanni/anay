/* ANAY — shared interaction layer */
(function(){
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer:fine)').matches && window.matchMedia('(hover:hover)').matches;
  if (isFinePointer) document.documentElement.classList.add('has-fine-pointer');

  document.addEventListener('DOMContentLoaded', () => {
    initLoadSequence();
    initNav();
    initMobileMenu();
    initCursor();
    initMagneticButtons();
    initReveal();
    initTimeline();
    initPhilosophyWords();
    initVideoSwitcher();
    initGalleryFilters();
    initBookingForm();
    initBackgroundParallax();
    initPageTransitions();
  });

  /* ---------------- hero load sequence ---------------- */
  function initLoadSequence(){
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.add('is-loaded'));
    });
  }

  /* ---------------- sticky nav ---------------- */
  function initNav(){
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 40) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });

    // active link highlight by section in view
    const links = nav.querySelectorAll('.nav-links a[href*="#"]');
    if (!links.length) return;
    const sections = Array.from(links).map(a => {
      const id = a.getAttribute('href').split('#')[1];
      return id ? document.getElementById(id) : null;
    }).filter(Boolean);
    if (!sections.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting){
          links.forEach(a => a.classList.remove('is-active'));
          const match = Array.from(links).find(a => a.getAttribute('href').includes('#' + e.target.id));
          if (match) match.classList.add('is-active');
        }
      });
    }, { rootMargin:'-45% 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  /* ---------------- mobile menu ---------------- */
  function initMobileMenu(){
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;
    const close = () => { toggle.classList.remove('is-open'); menu.classList.remove('is-open'); document.body.style.overflow=''; };
    toggle.addEventListener('click', () => {
      const willOpen = !menu.classList.contains('is-open');
      toggle.classList.toggle('is-open', willOpen);
      menu.classList.toggle('is-open', willOpen);
      document.body.style.overflow = willOpen ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  /* ---------------- custom cursor ---------------- */
  function initCursor(){
    if (!isFinePointer || reduceMotion) return;
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const label = document.createElement('div');
    label.className = 'cursor-label';
    document.body.appendChild(dot);
    document.body.appendChild(label);

    let mx=window.innerWidth/2, my=window.innerHeight/2, cx=mx, cy=my;
    window.addEventListener('mousemove', (e) => { mx=e.clientX; my=e.clientY; });

    function raf(){
      cx += (mx-cx)*0.22; cy += (my-cy)*0.22;
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      label.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    }
    raf();

    const setHover = (on) => dot.classList.toggle('is-hover', on);
    const showLabel = (text) => {
      if (text){ label.textContent = text; label.classList.add('is-visible'); dot.classList.add('is-active-label'); }
      else { label.classList.remove('is-visible'); dot.classList.remove('is-active-label'); }
    };

    document.querySelectorAll('a, button, .btn, .video-thumb, .filter-chip').forEach(el => {
      el.addEventListener('mouseenter', () => setHover(true));
      el.addEventListener('mouseleave', () => { setHover(false); showLabel(null); });
    });
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => { setHover(true); showLabel(el.dataset.cursor); });
      el.addEventListener('mouseleave', () => { setHover(false); showLabel(null); });
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  function initMagneticButtons(){
    if (!isFinePointer || reduceMotion) return;
    document.querySelectorAll('.btn').forEach(btn => {
      let rect = null;
      btn.addEventListener('mouseenter', () => { rect = btn.getBoundingClientRect(); });
      btn.addEventListener('mousemove', (e) => {
        if (!rect) rect = btn.getBoundingClientRect();
        const relX = e.clientX - (rect.left + rect.width/2);
        const relY = e.clientY - (rect.top + rect.height/2);
        const max = 8;
        const tx = Math.max(-max, Math.min(max, relX*0.28));
        const ty = Math.max(-max, Math.min(max, relY*0.5));
        btn.style.transform = `translate(${tx}px, ${ty}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------------- scroll reveal ---------------- */
  function initReveal(){
    const els = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!els.length) return;
    if (reduceMotion){ els.forEach(el => el.classList.add('is-visible')); return; }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold:0.16, rootMargin:'0px 0px -8% 0px' });
    els.forEach(el => obs.observe(el));
  }

  /* ---------------- timeline progressive fill ---------------- */
  function initTimeline(){
    const tl = document.querySelector('.timeline');
    if (!tl) return;
    const items = tl.querySelectorAll('.tl-item');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) tl.classList.add('is-visible');
      });
    }, { threshold:0.2 });
    obs.observe(tl);

    const itemObs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-active'); });
    }, { threshold:0.5 });
    items.forEach(i => itemObs.observe(i));
  }

  /* ---------------- philosophy word emphasis ---------------- */
  function initPhilosophyWords(){
    const words = document.querySelectorAll('.philo-word');
    if (!words.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e,idx) => {
        if (e.isIntersecting){
          setTimeout(() => e.target.classList.add('is-lit'), idx*120);
        }
      });
    }, { threshold:0.6 });
    words.forEach(w => obs.observe(w));
  }

  /* ---------------- video switcher ---------------- */
  function initVideoSwitcher(){
    document.querySelectorAll('[data-video-switcher]').forEach(root => {
      const stageMedia = root.querySelector('.video-stage-media');
      const stageTitle = root.querySelector('.video-meta-title');
      const stageCat = root.querySelector('.video-meta-cat');
      const thumbs = root.querySelectorAll('.video-thumb');
      if (!stageMedia || !thumbs.length) return;

      function activate(thumb){
        thumbs.forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
        stageMedia.classList.add('is-leaving');
        setTimeout(() => {
          stageMedia.style.backgroundImage = `url(${thumb.dataset.poster})`;
          if (stageTitle) stageTitle.textContent = thumb.dataset.title || '';
          if (stageCat) stageCat.textContent = thumb.dataset.cat || '';
          requestAnimationFrame(() => stageMedia.classList.remove('is-leaving'));
        }, reduceMotion ? 0 : 260);
      }

      thumbs.forEach(t => t.addEventListener('click', () => activate(t)));
      const playBtn = root.querySelector('.video-play');
      if (playBtn){
        playBtn.addEventListener('click', () => {
          const note = root.querySelector('.video-note');
          if (note){
            note.textContent = 'Vidéo à connecter — source à ajouter';
            note.style.opacity = '1';
          }
        });
      }
    });
  }

  /* ---------------- gallery filters ---------------- */
  function initGalleryFilters(){
    const bar = document.querySelector('.gallery-filters');
    const grid = document.querySelector('.gallery-grid');
    if (!bar || !grid) return;
    const chips = bar.querySelectorAll('.filter-chip');
    const cards = grid.querySelectorAll('.gallery-card');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        const cat = chip.dataset.filter;
        cards.forEach(card => {
          const show = cat === 'all' || card.dataset.cat === cat;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------------- booking form ---------------- */
  // EDIT THIS EMAIL if you want booking requests to go to another address.
  const BOOKING_EMAIL = 'contact@anay-music.com';

  function initBookingForm(){
    const form = document.querySelector('#booking-form');
    if (!form) return;
    const statusEl = form.querySelector('.form-status');
    const submitBtn = form.querySelector('.submit-btn');
    const submitLabel = submitBtn ? submitBtn.querySelector('.label') : null;
    let sending = false;
    let cooldownUntil = 0;

    function setStatus(state, msg){
      statusEl.className = 'form-status status-' + state;
      statusEl.innerHTML = `<span class="dot"></span><span>${msg}</span>`;
    }

    function validate(){
      let ok = true;
      form.querySelectorAll('[required]').forEach(input => {
        const field = input.closest('.field');
        field.classList.remove('has-error');
        const errEl = field.querySelector('.field-error');
        if (errEl) errEl.textContent = '';
        if (!input.value.trim()){
          field.classList.add('has-error');
          if (errEl) errEl.textContent = 'Champ requis.';
          ok = false;
        } else if (input.type === 'email'){
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(input.value.trim())){
            field.classList.add('has-error');
            if (errEl) errEl.textContent = 'Adresse email invalide.';
            ok = false;
          }
        }
      });
      return ok;
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (sending) return;
      if (Date.now() < cooldownUntil){
        setStatus('error', 'Merci de patienter un instant avant un nouvel envoi.');
        return;
      }
      if (!validate()){
        setStatus('error', 'Veuillez corriger les champs indiqués.');
        return;
      }

      sending = true;
      submitBtn.setAttribute('disabled','disabled');
      if (submitLabel) submitLabel.textContent = 'ENVOI EN COURS…';
      setStatus('sending', 'Préparation de votre demande…');

      const data = new FormData(form);
      const lines = [
        'Nom: ' + data.get('nom'),
        'Organisation: ' + (data.get('organisation') || '—'),
        'Email: ' + data.get('email'),
        'Téléphone: ' + (data.get('telephone') || '—'),
        "Type d'événement: " + (data.get('type_evenement') || '—'),
        'Date souhaitée: ' + (data.get('date') || '—'),
        'Ville: ' + (data.get('ville') || '—'),
        '',
        data.get('message') || ''
      ];
      const subject = encodeURIComponent('Demande de booking — ANAY');
      const body = encodeURIComponent(lines.join('\n'));

      setTimeout(() => {
        // No booking backend is connected yet — the honest, working path is a
        // pre-filled email handoff rather than a fabricated "sent" state.
        try {
          window.location.href = `mailto:${encodeURIComponent(BOOKING_EMAIL)}?subject=${subject}&body=${body}`;
          setStatus('success', "Votre client email s'ouvre avec la demande pré-remplie — il ne reste qu'à l'envoyer.");
          if (submitLabel) submitLabel.textContent = 'DEMANDE PRÊTE ✓';
          cooldownUntil = Date.now() + 8000;
          setTimeout(() => {
            submitBtn.removeAttribute('disabled');
            if (submitLabel) submitLabel.textContent = 'ENVOYER UNE DEMANDE';
            sending = false;
          }, 3000);
        } catch(err){
          setStatus('error', "Échec de l'ouverture — veuillez réessayer.");
          submitBtn.removeAttribute('disabled');
          if (submitLabel) submitLabel.textContent = 'RÉESSAYER';
          sending = false;
        }
      }, 900);
    });
  }

  /* ---------------- mouse-reactive atmosphere ---------------- */
  function initBackgroundParallax(){
    if (!isFinePointer || reduceMotion) return;
    const atmo = document.querySelector('.atmosphere');
    if (!atmo) return;
    let tx=0, ty=0, cx=0, cy=0;
    window.addEventListener('mousemove', (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    function raf(){
      cx += (tx-cx)*0.03; cy += (ty-cy)*0.03;
      atmo.style.setProperty('--mx', (cx*22) + 'px');
      atmo.style.setProperty('--my', (cy*22) + 'px');
      requestAnimationFrame(raf);
    }
    raf();
  }

  /* ---------------- page transitions ---------------- */
  function initPageTransitions(){
    const veil = document.querySelector('.veil');
    if (!veil) return;
    requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('is-hidden')));
    document.querySelectorAll('a[data-transition]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (!href || href.startsWith('#') || a.target === '_blank') return;
        e.preventDefault();
        veil.classList.remove('is-hidden');
        setTimeout(() => { window.location.href = href; }, 480);
      });
    });
  }
})();
