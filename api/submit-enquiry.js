// Vercel route: emails D-SHE and the customer via Brevo. Env vars: BREVO_API_KEY, SENDER_EMAIL, NOTIFY_EMAIL
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).end();
  const d=req.body||{};if(!d.email||!d.name||!d.consent)return res.status(400).json({error:'Missing fields'});
  const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const rows=Object.entries(d).filter(([k,v])=>v&&typeof v==='string').map(([k,v])=>`<tr><td><b>${esc(k)}</b></td><td>${esc(v)}</td></tr>`).join('');
  const basket=(d.basket||[]).map(i=>`${esc(i.qty)} x ${esc(i.name)}`).join('<br>');
  const send=body=>fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':process.env.BREVO_API_KEY,'content-type':'application/json'},body:JSON.stringify({sender:{email:process.env.SENDER_EMAIL,name:'D-SHE'},...body})});
  try{
    await send({to:[{email:process.env.NOTIFY_EMAIL}],replyTo:{email:d.email},subject:`New ${d.service} enquiry ${d.ref}`,htmlContent:`<table>${rows}</table>${basket}`});
    await send({to:[{email:d.email}],subject:`We received your request (${d.ref})`,htmlContent:`<p>Hi ${esc(d.name)}, thank you for contacting D-SHE. Your reference is <b>${esc(d.ref)}</b>. We will respond within 24 hours.</p>`});
    res.json({ok:true,ref:d.ref});
  }catch(e){res.status(500).json({error:'Send failed'})}
}
