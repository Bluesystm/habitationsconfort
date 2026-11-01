/* Load after contact-handoff.js, early in the website's head, before analytics. */
(function(){
  'use strict';
  const values=ConfortHandoff.parse(location.hash);
  if(!values)return;
  // Remove contact details from the visible URL/history before filling the form.
  history.replaceState(history.state,'',location.pathname+location.search+'#contact');
  // Aller au formulaire d'un coup (pas en glissant), sous l'en-tête fixe, puis une 2e fois
  // quand la page a fini de charger (les images déplacent le formulaire), sauf si la
  // personne a déjà commencé à faire défiler la page elle-même.
  let bouge=false;
  const ecouter=(t,f,o)=>{try{globalThis.addEventListener?.(t,f,o);}catch{}};
  ['wheel','touchstart','keydown'].forEach(t=>ecouter(t,()=>{bouge=true;},{once:true,passive:true}));
  // Jamais bloquant : un vieux navigateur qui ne connaît pas « instant » défile simplement.
  const allerAuFormulaire=()=>{
    const c=document.querySelector('#contact');if(!c)return;
    try{c.style.scrollMarginTop='120px';c.scrollIntoView({block:'start',behavior:'instant'});}
    catch{try{c.scrollIntoView(true);}catch{}}
  };
  const apply=()=>{
    const form=document.querySelector('#soumissionForm');
    if(!form)return;
    ConfortHandoff.fill(form,values);
    allerAuFormulaire();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  ecouter('load',()=>{if(!bouge)allerAuFormulaire();},{once:true});
})();
