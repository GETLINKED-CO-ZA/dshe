// EDIT ME: business settings used by every page
window.DSHE={
  email:"info@safetydshe.co.za",   // confirm this address
  endpoint:"/api/submit-enquiry",  // Vercel route. If unreachable, forms fall back to opening an email.
  payments:false                   // set true once Paystack is live AND products below have prices
};
// Shop catalogue. price:null means "Price on request". Prices in ZAR.
window.DSHE_PRODUCTS=[
 {id:"tpl-pack",cat:"Digital",name:"Safety documentation template pack",desc:"Editable policies, registers and forms for your safety file.",price:null},
 {id:"tbt-pack",cat:"Digital",name:"Toolbox talk pack",desc:"Ready-to-present talks with attendance registers.",price:null},
 {id:"ra-tpl",cat:"Digital",name:"Risk assessment templates",desc:"Baseline risk assessment and method statement templates.",price:null},
 {id:"fa-kit",cat:"Equipment",name:"First aid kits",desc:"Workplace first aid kits for sites and offices.",price:null},
 {id:"fire-eq",cat:"Equipment",name:"Fire safety equipment",desc:"Extinguishers, hose reels and accessories.",price:null},
 {id:"ppe",cat:"Equipment",name:"PPE and protective clothing",desc:"Helmets, boots, gloves, eye and hearing protection, hi-vis wear.",price:null},
 {id:"signs",cat:"Equipment",name:"Safety signage",desc:"Statutory and site signage in standard sizes.",price:null}
];
