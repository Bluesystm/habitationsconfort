/* Load after contact-handoff.js, early in the website's head, before analytics. */
(function(){
  'use strict';
  const values=ConfortHandoff.parse(location.hash);
  if(!values)return;
  // Remove contact details from the visible URL/history before filling the form.
  history.replaceState(history.state,'',location.pathname+location.search+'#contact');
  const apply=()=>{
    const form=document.querySelector('#soumissionForm');
    if(!form)return;
    ConfortHandoff.fill(form,values);
    document.querySelector('#contact')?.scrollIntoView({block:'start'});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
