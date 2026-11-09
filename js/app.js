(function(){
const C=window.DSHE,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const io=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12});
const watch=r=>$$('.reveal',r).forEach((el,i)=>{el.style.transitionDelay=(i%4)*90+'ms';io.observe(el)});
$('#menu')?.addEventListener('click',()=>$('nav').classList.toggle('open'));
$$('.acc>button').forEach(b=>b.addEventListener('click',()=>{const o=b.parentElement.classList.toggle('open');b.setAttribute('aria-expanded',o)}));
$$('.chip').forEach(c=>c.addEventListener('click',()=>{$$('.chip').forEach(x=>x.classList.toggle('on',x===c));$$('[data-cat]').forEach(k=>k.style.display=(c.dataset.f==='All'||k.dataset.cat===c.dataset.f)?'':'none')}));
const get=()=>{try{return JSON.parse(localStorage.getItem('dshe_cart')||'[]')}catch(e){return[]}};
const set=v=>{try{localStorage.setItem('dshe_cart',JSON.stringify(v))}catch(e){}count()};
function count(){const n=get().reduce((a,b)=>a+b.qty,0);$$('.cartlink b').forEach(b=>b.textContent=n)}
function toast(t){let d=$('#toast');if(!d){d=document.createElement('div');d.id='toast';d.setAttribute('role','status');d.style.cssText='position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#161628;color:#fff;padding:12px 20px;border-radius:10px;z-index:50;transition:opacity .4s';document.body.appendChild(d)}d.textContent=t;d.style.opacity=1;clearTimeout(d.t);d.t=setTimeout(()=>d.style.opacity=0,2200)}
window.addItem=id=>{const p=window.DSHE_PRODUCTS.find(x=>x.id===id),c=get(),f=c.find(x=>x.id===id);f?f.qty++:c.push({id,name:p.name,price:p.price,qty:1});set(c);toast(p.name+' added to your basket')};
const shop=$('#products');
if(shop){shop.innerHTML=window.DSHE_PRODUCTS.map(p=>`<div class="card reveal" data-cat="${p.cat}"><span class="tag">${p.cat}</span><h3>${p.name}</h3><p>${p.desc}</p><p class="meta">${p.price?'R '+p.price.toLocaleString('en-ZA'):'Price on request'}</p><button class="btn" onclick="addItem('${p.id}')">Add to basket</button></div>`).join('')}
watch(document);count();
const f=$('#quote');
if(f){const q=new URLSearchParams(location.search),sv=$('#service'),cart=get(),bk=$('.basket');
 const show=()=>$$('.grp',f).forEach(g=>g.classList.toggle('show',g.dataset.for.split(' ').includes(sv.value)));
 if(q.get('service'))sv.value=q.get('service');if(q.get('course'))$('#course').value=q.get('course');
 if(cart.length){bk.style.display='block';bk.innerHTML='<b>Your basket:</b> '+cart.map(i=>i.qty+' × '+i.name).join(', ');if(!q.get('service'))sv.value='product'}
 sv.addEventListener('change',show);show();
 f.addEventListener('submit',async e=>{e.preventDefault();
  const d=Object.fromEntries(new FormData(f));d.basket=cart;d.ref='DSHE-'+Date.now().toString(36).toUpperCase();
  const b=$('button[type=submit]',f);b.disabled=true;b.textContent='Sending…';
  try{const r=await fetch(C.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});if(!r.ok)throw 0}
  catch(x){const body=Object.entries(d).filter(([k,v])=>v&&typeof v==='string').map(([k,v])=>k+': '+v).join('\n')+(cart.length?'\nBasket: '+cart.map(i=>i.qty+' x '+i.name).join(', '):'');
   location.href='mailto:'+C.email+'?subject='+encodeURIComponent('D-SHE enquiry '+d.ref)+'&body='+encodeURIComponent(body)}
  set([]);f.style.display='none';const ok=$('.ok');ok.style.display='block';ok.innerHTML='<b>Thank you. Your reference is '+d.ref+'.</b><br>We reply within 24 hours. Quote this reference in any follow-up.';ok.scrollIntoView({behavior:'smooth',block:'center'})})}
})();
