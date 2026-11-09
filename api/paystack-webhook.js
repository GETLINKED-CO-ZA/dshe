import crypto from 'crypto';
export const config={api:{bodyParser:false}};
export default async function handler(req,res){
  const chunks=[];for await(const c of req)chunks.push(c);const raw=Buffer.concat(chunks);
  const sig=crypto.createHmac('sha512',process.env.PAYSTACK_SECRET_KEY).update(raw).digest('hex');
  if(sig!==req.headers['x-paystack-signature'])return res.status(401).end();
  const ev=JSON.parse(raw);if(ev.event==='charge.success'){/* mark order paid, send receipt or download link */}
  res.status(200).end();
}
