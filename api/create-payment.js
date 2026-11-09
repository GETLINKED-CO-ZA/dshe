// Starts a Paystack checkout. Prices come from this server table, never from the browser. Env: PAYSTACK_SECRET_KEY
const PRICES={/* "tpl-pack": 49900  (amount in cents) */};
export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).end();
  const {email,items=[],ref}=req.body||{};
  const amount=items.reduce((a,i)=>a+(PRICES[i.id]||0)*Math.max(1,+i.qty||1),0);
  if(!email||!amount)return res.status(400).json({error:'Invalid order'});
  const r=await fetch('https://api.paystack.co/transaction/initialize',{method:'POST',headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,'content-type':'application/json'},body:JSON.stringify({email,amount,currency:'ZAR',reference:ref})});
  res.json(await r.json());
}
