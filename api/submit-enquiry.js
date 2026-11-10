// Vercel route: emails D-SHE and the customer via Brevo. Env vars: BREVO_API_KEY, SENDER_EMAIL, NOTIFY_EMAIL
const SITE='https://www.safetydshe.co.za';
const BODY="'Exo 2','Segoe UI',Helvetica,Arial,sans-serif",HEAD="Rajdhani,'Arial Narrow',Arial,sans-serif";
const GRAD='background-color:#6a0dad;background-image:linear-gradient(100deg,#1b2bff,#6a0dad 55%,#e5101d);';
const SERVICES={consulting:'Safety consulting',safetyfile:'Safety file development',training:'Training',prchsa:'PrCHSA services',compliance:'Ongoing compliance support',product:'Product order'};
const LABELS={industry:'Industry',employees:'Employees',sites:'Sites',frequency:'Frequency',course:'Course',bookingType:'Booking type',delegates:'Delegates',date:'Preferred date',format:'Format',location:'Training location',project:'Project',projectLocation:'Project location',work:'Type of work',start:'Start date',stage:'Project stage',duration:'Duration',client:'Client / developer',delivery:'Delivery location'};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const row=(k,v)=>`<tr><td style="padding:10px 12px 10px 0;border-bottom:1px solid #e6e4f0;width:38%;vertical-align:top;font-size:13px;font-weight:600;color:#5b5b72">${k}</td><td style="padding:10px 0;border-bottom:1px solid #e6e4f0;vertical-align:top;font-size:15px;color:#161628">${v}</td></tr>`;
const h=t=>`<p style="margin:28px 0 6px;font:700 20px ${HEAD};color:#161628">${t}</p>`;
const btn=(href,t)=>`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:22px 0 4px"><tr><td style="border-radius:10px;${GRAD}"><a href="${href}" style="display:inline-block;padding:13px 26px;font:700 16px ${BODY};color:#ffffff;text-decoration:none;border-radius:10px">${t}</a></td></tr></table>`;
const chip=t=>`<span style="display:inline-block;padding:3px 12px;border-radius:99px;background:#efe6f8;color:#6a0dad;font:700 13px ${BODY}">${esc(t)}</span>`;
const basketBox=b=>b.length?`${h('Basket')}<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#f6f5fb;border-radius:12px;padding:14px 18px;font-size:15px;line-height:1.7;color:#161628">${b.map(i=>`<b>${esc(i.qty)} &times;</b> ${esc(i.name)}`).join('<br>')}</td></tr></table>`:'';

// Shared shell: gradient bar, wordmark, white card, dark footer (table layout + inline styles for email clients)
const shell=(pre,inner)=>`<!doctype html><html lang="en-ZA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&family=Rajdhani:wght@600;700&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:#f6f5fb;font-family:${BODY}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(pre)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5fb"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px">
<tr><td style="height:6px;line-height:6px;font-size:0;border-radius:14px 14px 0 0;${GRAD}">&nbsp;</td></tr>
<tr><td style="background:#ffffff;padding:26px 34px 6px;border-left:1px solid #e6e4f0;border-right:1px solid #e6e4f0">
<a href="${SITE}" style="text-decoration:none;font:700 36px ${HEAD};letter-spacing:5px"><span style="color:#1b2bff">D</span><span style="color:#3d1ad2">-</span><span style="color:#6a0dad">S</span><span style="color:#a30a68">H</span><span style="color:#e5101d">E</span></a></td></tr>
<tr><td style="background:#ffffff;padding:8px 34px 34px;border-left:1px solid #e6e4f0;border-right:1px solid #e6e4f0;color:#161628;font-size:16px;line-height:1.65">${inner}</td></tr>
<tr><td style="background:#14142b;border-radius:0 0 14px 14px;padding:26px 34px;color:#cfcfe6;font-size:13px;line-height:1.6">
<b style="color:#ffffff">D-SHE</b><br>Practical safety, health and environmental solutions for South African businesses.<br>
<a href="mailto:berto@safetydshe.co.za" style="color:#ffffff">berto@safetydshe.co.za</a> &nbsp;|&nbsp; <a href="${SITE}" style="color:#ffffff">www.safetydshe.co.za</a>
<br><br><span style="font-size:12px;color:#9a9ab8">Personal information you submit is used only to respond to your request, in line with POPIA.</span></td></tr>
</table></td></tr></table></body></html>`;

function notifyHtml(d,basket){
  const svc=SERVICES[d.service]||d.service||'General';
  const contact=[['Name',esc(d.name)],['Company',esc(d.company)],['Email',`<a href="mailto:${esc(d.email)}" style="color:#6a0dad">${esc(d.email)}</a>`],['Phone',d.phone?`<a href="tel:${esc(d.phone)}" style="color:#6a0dad">${esc(d.phone)}</a>`:'']].filter(r=>r[1]);
  const details=Object.entries(LABELS).filter(([k])=>d[k]&&typeof d[k]==='string').map(([k,l])=>[l,esc(d[k])]);
  const flags=[['POPIA consent',d.consent?'Yes':'No'],['Marketing opt-in',d.marketing?'Yes':'No']];
  const msg=d.details?`${h('Message')}<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#f6f5fb;border-left:4px solid #6a0dad;border-radius:8px;padding:14px 18px;font-size:15px;white-space:pre-wrap">${esc(d.details)}</td></tr></table>`:'';
  return shell(`New ${svc} enquiry from ${d.name}`,
   `<p style="margin:14px 0 8px">${chip(svc)}</p>
    <h1 style="margin:0 0 4px;font:700 34px/1.1 ${HEAD};color:#161628">New enquiry</h1>
    <p style="margin:0;color:#5b5b72">Reference <b style="color:#6a0dad">${esc(d.ref)}</b></p>
    ${h('Contact')}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${contact.map(r=>row(...r)).join('')}</table>
    ${details.length?h('Request details')+`<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${details.map(r=>row(...r)).join('')}</table>`:''}
    ${basketBox(basket)}${msg}
    ${h('Consent')}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${flags.map(r=>row(...r)).join('')}</table>
    ${btn(`mailto:${esc(d.email)}?subject=${encodeURIComponent('Re: '+d.ref)}`,'Reply to '+esc(d.name))}`);
}

function customerHtml(d,basket){
  const svc=SERVICES[d.service]||d.service||'';
  const step=(n,t,p)=>`<tr><td style="width:44px;vertical-align:top;padding:8px 0;font:700 26px ${HEAD};color:#6a0dad">${n}</td><td style="padding:8px 0;vertical-align:top"><b>${t}</b><br><span style="color:#5b5b72;font-size:15px">${p}</span></td></tr>`;
  return shell(`We received your request (${d.ref}). We reply within 24 hours.`,
   `<h1 style="margin:14px 0 10px;font:700 36px/1.1 ${HEAD};color:#161628">Thank you, ${esc(d.name)}.<br><span style="color:#6a0dad">We have your request.</span></h1>
    <p style="margin:0 0 18px">Thanks for contacting D-SHE. One of our team will respond within 24 hours.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="background:#f6f5fb;border-left:4px solid #6a0dad;border-radius:8px;padding:16px 20px">
      <span style="font-size:13px;font-weight:600;color:#5b5b72">YOUR REFERENCE</span><br><span style="font:700 26px ${HEAD};color:#161628;letter-spacing:1px">${esc(d.ref)}</span>${svc?`<br><span style="font-size:14px;color:#5b5b72">${esc(svc)}</span>`:''}</td></tr></table>
    ${basketBox(basket)}
    ${h('What happens next')}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      ${step(1,'We review','We look at the details you sent.')}${step(2,'We respond','You receive a quotation or booking confirmation, quoting your reference.')}${step(3,'Go ahead','Accept, pay where a price is fixed, and we get started.')}</table>
    <p style="margin:22px 0 0;font-size:15px;color:#5b5b72">Need to send documents? Simply reply to this email and quote your reference number.</p>
    ${btn(SITE,'Visit our website')}`);
}

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).end();
  const d=req.body||{};if(!d.email||!d.name||!d.consent)return res.status(400).json({error:'Missing fields'});
  const basket=Array.isArray(d.basket)?d.basket:[];
  const send=body=>fetch('https://api.brevo.com/v3/smtp/email',{method:'POST',headers:{'api-key':process.env.BREVO_API_KEY,'content-type':'application/json'},body:JSON.stringify({sender:{email:process.env.SENDER_EMAIL,name:'D-SHE'},...body})});
  try{
    await send({to:[{email:process.env.NOTIFY_EMAIL}],replyTo:{email:d.email},subject:`New ${SERVICES[d.service]||d.service||''} enquiry ${d.ref}`.replace(/\s+/g,' '),htmlContent:notifyHtml(d,basket)});
    await send({to:[{email:d.email}],subject:`We received your request (${d.ref})`,htmlContent:customerHtml(d,basket)});
    res.json({ok:true,ref:d.ref});
  }catch(e){res.status(500).json({error:'Send failed'})}
}
