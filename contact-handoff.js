/* Shared by the quiz and website. No storage, requests, or automatic submission. */
(function(root){
  'use strict';
  function phone(value){
    if(typeof value!=='string'||value.length>32||!/^[+\d\s().-]+$/.test(value))return '';
    let n=value.replace(/\D/g,'');if(n.length===11&&n[0]==='1')n=n.slice(1);
    if(!/^(263|273|354|367|418|438|450|468|514|579|581|819|873)[2-9]\d{6}$/.test(n))return '';
    return n.slice(0,3)+' '+n.slice(3,6)+'-'+n.slice(6);
  }
  function sector(value){
    if(typeof value!=='string')return '';
    const s=value.normalize('NFC').trim();
    // Pas de caractères de contrôle ni invisibles (inversion du sens du texte, espaces de largeur nulle).
    return s.length>=2&&s.length<=80&&!/[<>\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069\ufeff\ufffd]/.test(s)?s:'';
  }
  function buildLink(data,destination='contact-preview.html'){
    const telephone=phone(data.phone),secteur=sector(data.sector);
    if(!telephone||!secteur)throw new Error('Coordonnées incomplètes.');
    // Destination is a deployment setting, never taken from visitor input.
    if(!['contact-preview.html','https://www.habitationsconfort.com/'].includes(destination))throw new Error('Destination inconnue.');
    const params=new URLSearchParams({hc_quiz:'1',hc_phone:telephone,hc_sector:secteur,hc_service:'Isolation'});
    return destination+'#contact?'+params.toString();
  }
  function parse(hash){
    if(typeof hash!=='string'||!hash.startsWith('#contact?'))return null;
    const params=new URLSearchParams(hash.slice(9));
    if(params.get('hc_quiz')!=='1')return null;
    if(hash.length>1000)return {};
    return {telephone:phone(params.get('hc_phone')),secteur:sector(params.get('hc_sector')),service:params.get('hc_service')==='Isolation'?'Isolation':''};
  }
  function fill(form,values){
    if(!form||!values)return 0;let count=0;
    for(const id of ['telephone','secteur','service']){
      const field=form.querySelector('#'+id);
      if(field&&values[id]&&!field.value.trim()){
        field.value=values[id];count++;
        if(typeof Event==='function')field.dispatchEvent(new Event('input',{bubbles:true}));
      }
    }
    return count;
  }
  const api={phone,sector,buildLink,parse,fill};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ConfortHandoff=api;
})(globalThis);
