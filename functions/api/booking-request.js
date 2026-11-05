// Optional Cloudflare Pages Functions email channel. The public site uses WhatsApp unless email credentials are configured.
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=(v,max=250)=>typeof v==="string"?v.trim().slice(0,max):"";
const respond=(body,status=200)=>Response.json(body,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});
export async function onRequestPost({request,env}) {
 const host=new URL(request.url).hostname;
 if(!["skn.tranquilitasspa.com","localhost"].includes(host)&&!host.endsWith(".pages.dev"))return respond({ok:false,error:"Host mismatch."},403);
 if(!(request.headers.get("content-type")||"").includes("application/json"))return respond({ok:false,error:"JSON required."},415);
 if(Number(request.headers.get("content-length")||0)>12000)return respond({ok:false,error:"Request too long."},413);
 let input;try{input=await request.json()}catch{return respond({ok:false,error:"Invalid JSON."},400)}
 if(!input||typeof input!=="object"||Array.isArray(input))return respond({ok:false,error:"Invalid request."},400);
 if(input.website)return respond({ok:false,error:"Invalid submission."},400);
 let fields={};for(const [k,max] of Object.entries({service:60,duration:8,guests:3,area:120,property:200,date:12,time:7,name:150,email:254,phone:30,notes:1200,sourcePage:250}))fields[k]=clean(input[k],max);
 if(["service","duration","guests","area","property","date","time","name","email","phone"].some(k=>!fields[k]))return respond({ok:false,error:"Missing required fields."},400);
 if(!["swedish","deep","couples","mobile","villa","hotel","yacht","beach","group"].includes(fields.service)||!["60","90"].includes(fields.duration))return respond({ok:false,error:"Invalid service or duration."},400);
 const guests=Number(fields.guests);if(!Number.isInteger(guests)||guests<1||guests>10||(fields.service==="couples"&&guests!==2))return respond({ok:false,error:"Invalid guest count."},400);
 if(!/^\d{4}-\d{2}-\d{2}$/.test(fields.date)||!/^\d{2}:\d{2}$/.test(fields.time)||fields.time<"10:00"||fields.time>"19:00")return respond({ok:false,error:"Invalid date or local time."},400);
 const stamp=Date.parse(fields.date+"T"+fields.time+":00-04:00");
 if(!Number.isFinite(stamp)||stamp-Date.now()<6*3600000||stamp-Date.now()>366*86400000)return respond({ok:false,error:"Start times require at least 6 hours' notice, within the next year."},400);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)||!/^\+?[0-9\s()\-.]{7,25}$/.test(fields.phone))return respond({ok:false,error:"Invalid email or phone."},400);
 if(!env.RESEND_API_KEY||!env.BOOKING_FROM_EMAIL)return respond({ok:false,error:"Email booking channel is not configured. Send this request through WhatsApp."},503);
 const id="TQ-SKN-"+crypto.randomUUID().slice(0,8).toUpperCase();
 const rows=Object.entries(fields).map(([k,v])=>"<tr><th style='padding:8px;border-bottom:1px solid #ddd;text-align:left'>"+esc(k)+"</th><td style='padding:8px;border-bottom:1px solid #ddd'>"+esc(v)+"</td></tr>").join("");
 const mail={from:env.BOOKING_FROM_EMAIL,to:["info@massagebahamas.com","amar@massagebahamas.com"],reply_to:fields.email,subject:"[SKN] Massage request "+id,html:"<h2>Pending St. Kitts & Nevis massage enquiry</h2><p>Reference "+esc(id)+" — no booking is confirmed or paid.</p><table>"+rows+"</table>",text:"Reference: "+id+"\nDestination: St. Kitts & Nevis\n"+Object.entries(fields).map(([k,v])=>k+": "+v).join("\n")};
 const resp=await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Authorization":"Bearer "+env.RESEND_API_KEY,"Content-Type":"application/json"},body:JSON.stringify(mail)}).catch(()=>null);
 if(!resp?.ok)return respond({ok:false,error:"Email delivery failed. Please use WhatsApp."},502);
 return respond({ok:true,reference:id,notice:"Request delivered, not yet confirmed."});
}
export async function onRequestGet(){return new Response("Method not allowed",{status:405,headers:{Allow:"POST"}})}
