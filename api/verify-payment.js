export default async function handler(req,res){
  const r=await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(req.query.reference)}`,{headers:{Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`}});
  const j=await r.json();res.json({paid:j?.data?.status==='success'});
}
