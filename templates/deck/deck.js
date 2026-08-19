/* ===================================================================
   DECK JS — navigasi ala PPT. Dipakai SEMUA compro.
   Butuh markup: .slide (banyak), #zprev #znext (zona), #mprev #mnext #mcount (mobile).
=================================================================== */
(function(){
  const slides=[...document.querySelectorAll('.slide')];
  if(!slides.length)return;
  const zprev=document.getElementById('zprev'), znext=document.getElementById('znext');
  const mprev=document.getElementById('mprev'), mnext=document.getElementById('mnext'), mcount=document.getElementById('mcount');
  let cur=0;
  function restart(s){const st=s.querySelector('.stage');if(!st)return;const c=st.cloneNode(true);st.parentNode.replaceChild(c,st);}
  function show(i){
    if(i<0||i>=slides.length)return;
    slides[cur].classList.remove('active');
    cur=i; const s=slides[cur]; s.classList.add('active'); restart(s); window.scrollTo(0,0);
    zprev&&zprev.classList.toggle('hide',cur===0);
    znext&&znext.classList.toggle('hide',cur===slides.length-1);
    if(mcount)mcount.textContent=(cur+1)+' / '+slides.length;
    if(mprev)mprev.disabled=cur===0;
    if(mnext)mnext.disabled=cur===slides.length-1;
    location.hash=cur+1;
  }
  window.deckShow=show;
  znext&&(znext.onclick=()=>show(cur+1));
  zprev&&(zprev.onclick=()=>show(cur-1));
  mnext&&(mnext.onclick=e=>{e.stopPropagation();show(cur+1);});
  mprev&&(mprev.onclick=e=>{e.stopPropagation();show(cur-1);});
  addEventListener('keydown',e=>{
    if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '||e.key==='Enter')show(cur+1);
    if(e.key==='ArrowLeft'||e.key==='PageUp'||e.key==='Backspace')show(cur-1);
  });
  let x0=null,y0=null;
  addEventListener('touchstart',e=>{x0=e.touches[0].clientX;y0=e.touches[0].clientY;},{passive:true});
  addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;
    if(Math.abs(dx)>55&&Math.abs(dx)>Math.abs(dy))show(cur+(dx<0?1:-1));x0=null;},{passive:true});
  const h=parseInt((location.hash||'').replace('#',''));
  show(h>=1&&h<=slides.length?h-1:0);
})();