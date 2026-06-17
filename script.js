document.addEventListener('DOMContentLoaded', function(){
  const hamburger = document.getElementById('hamburger');
  const mobilePanel = document.getElementById('mobilePanel');
  const header = document.getElementById('siteHeader');

  hamburger.addEventListener('click', function(){
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){
      mobilePanel.hidden = false;
      mobilePanel.style.display = 'block';
    } else {
      mobilePanel.hidden = true;
      mobilePanel.style.display = 'none';
    }
  });

  // add shadow after scrolling a bit
  function onScroll(){
    if(window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Smooth in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile menu
        if(window.innerWidth < 980 && !mobilePanel.hidden){
          mobilePanel.hidden = true; mobilePanel.style.display='none'; hamburger.setAttribute('aria-expanded','false');
        }
        // If linking to join section, highlight the volunteer CTA after scroll
        if(href === '#join'){
          // give the browser time to perform the smooth scroll
          setTimeout(()=>{
            const volunteerBtn = document.querySelector('[data-contact="volunteer"]');
            if(volunteerBtn){
              volunteerBtn.classList.add('pulse');
              volunteerBtn.focus();
              setTimeout(()=> volunteerBtn.classList.remove('pulse'), 2200);
            }
          }, 600);
        }
      }
    })
  });
  
  // Contact modal behavior for volunteer/partner CTAs
  const contactButtons = document.querySelectorAll('[data-contact]');
  const modal = document.getElementById('contactModal');
  const modalPhone = document.getElementById('modalPhone');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCopy = document.getElementById('modalCopy');
  const PHONE = '+919350822375';

  function openModal(){
    if(!modal) return;
    modal.removeAttribute('hidden');
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'block';
    modalPhone.textContent = PHONE;
    // focus the close button for accessibility
    modalClose && modalClose.focus();
  }
  function closeModal(){
    if(!modal) return;
    modal.setAttribute('hidden','');
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
  }

  contactButtons.forEach(btn=>{
    btn.addEventListener('click', function(e){
      e.preventDefault();
      openModal();
    })
  });

  modalClose && modalClose.addEventListener('click', closeModal);
  modalBackdrop && modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

  modalCopy && modalCopy.addEventListener('click', function(){
    navigator.clipboard && navigator.clipboard.writeText(PHONE).then(()=>{
      modalCopy.textContent = 'Copied';
      setTimeout(()=> modalCopy.textContent = 'Copy number', 1500);
    }).catch(()=>{
      // fallback
      const ta = document.createElement('textarea'); ta.value = PHONE; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy'); modalCopy.textContent='Copied'}catch(e){alert(PHONE)} ta.remove(); setTimeout(()=> modalCopy.textContent = 'Copy number',1500);
    });
  });
});
