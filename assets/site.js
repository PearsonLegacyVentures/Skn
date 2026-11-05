(()=>{"use strict";
const TZ="America/St_Kitts",WA="12428168286",LIMIT_HOURS=6;
const get=(id)=>document.getElementById(id),dialog=get("bookingDialog"),form=get("bookingForm"),result=get("bookingResult");
const nav=get("mainNav"),toggle=get("menuToggle");
if(toggle&&nav){toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.textContent=open?"×":"☰"});document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");toggle.setAttribute("aria-expanded","false");toggle.textContent="☰"}))}
function localParts(at){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}).formatToParts(at);const o={};for(const p of parts)if(p.type!=="literal")o[p.type]=p.value;return {date:o.year+"-"+o.month+"-"+o.day,time:o.hour+":"+o.minute}}
function localEpoch(date,time){return Date.parse(date+"T"+time+":00-04:00")}
function minimum(){return localParts(new Date(Date.now()+LIMIT_HOURS*3600000))}
const dateField=form?.querySelector('[name="date"]'),timeField=form?.querySelector('[name="time"]');
function setDateMin(){if(dateField)dateField.min=minimum().date}
if(dateField)setDateMin();
document.querySelectorAll("[data-book]").forEach(el=>el.addEventListener("click",e=>{e.preventDefault();if(!dialog)return;const service=el.getAttribute("data-service");if(service){let select=form?.querySelector('[name="service"]');if(select&&Array.from(select.options).some(x=>x.value===service))select.value=service;}result?.classList.remove("show");updateSummary();dialog.showModal();document.body.classList.add("modal-open")}));
document.querySelectorAll("[data-close-booking]").forEach(el=>el.addEventListener("click",()=>dialog?.close()));
dialog?.addEventListener("close",()=>document.body.classList.remove("modal-open"));
dialog?.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
function updateSummary(){if(!form)return;const f=new FormData(form),service=f.get("service"),duration=f.get("duration"),guests=f.get("guests"),area=f.get("area");const names={swedish:"Swedish massage",deep:"Deep tissue massage",couples:"Couples massage",villa:"Villa massage",hotel:"Hotel / resort massage",yacht:"Yacht massage",mobile:"Mobile massage",beach:"Beach-adjacent request",group:"Group wellness"};const out=get("estimateSummary");if(out)out.textContent=(names[service]||"Your selected treatment")+" · "+(duration||"60")+" min · "+(guests||"1")+" guest(s)"+(area?" · "+area:"");}
form?.addEventListener("change",updateSummary);
function error(t){if(result){result.textContent=t;result.classList.add("show");result.scrollIntoView({block:"nearest",behavior:"smooth"})}}
function formatted(d){return d.replace("T"," ")}
form?.addEventListener("submit",e=>{e.preventDefault();setDateMin();if(!form.reportValidity())return;
const values=Object.fromEntries(new FormData(form).entries());
if(values.website)return error("Please refresh and try again.");
if(!values.consent)return error("Please agree to be contacted about your request.");
if(values.service==="couples"&&Number(values.guests)!==2)return error("Choose two guests for the couples massage.");
if(!["60","90"].includes(values.duration))return error("Select a valid treatment duration.");
const bookingTime=localEpoch(values.date,values.time);
if(!Number.isFinite(bookingTime)||bookingTime-Date.now()<LIMIT_HOURS*3600000){const m=minimum();return error("Please select a start time at least 6 hours from now. Earliest possible: "+m.date+" at "+m.time+" (St. Kitts & Nevis time, UTC−4).");}
if(bookingTime-Date.now()>366*86400000)return error("Please select a date within the next 12 months.");
if(values.time<"10:00"||values.time>"19:00")return error("Appointments can only be requested for starts between 10:00 AM and 7:00 PM local time.");
const entries=[["Destination","St. Kitts & Nevis"],["Service",values.service],["Duration",values.duration+" minutes"],["Number of guests",values.guests],["Area",values.area],["Property / meeting point",values.property],["Preferred date",values.date],["Preferred time (AST, UTC-4)",values.time],["Name",values.name],["Email",values.email],["Phone",values.phone],["Notes",values.notes||"None"],["Website page",location.href]];
const text="Hello Tranquilitas, I would like to request a mobile massage.\n\n"+entries.map(([k,v])=>k+": "+v).join("\n")+"\n\nPlease confirm therapist availability, access and my full final price before payment. I understand this is a request, not a confirmed appointment.";
const link="https://wa.me/"+WA+"?text="+encodeURIComponent(text);
const opened=window.open(link,"_blank","noopener,noreferrer");
if(!opened){const a=document.createElement("a");a.href=link;a.target="_blank";a.rel="noopener noreferrer";a.textContent="Open WhatsApp with my request";const box=get("bookingResult");box.innerHTML="";box.append("Your request has not been sent yet. ");box.appendChild(a);box.classList.add("show");}else error("WhatsApp opened with your request. Please press Send there. No appointment or price has been confirmed.");});
document.querySelectorAll("a[href^='#']").forEach(a=>a.addEventListener("click",()=>{if(nav){nav.classList.remove("open");toggle?.setAttribute("aria-expanded","false")}}));
if("IntersectionObserver" in window&&matchMedia("(prefers-reduced-motion: no-preference)").matches){const els=document.querySelectorAll(".section .intro,.tile,.location,.step,.split-copy,.split-image");const io=new IntersectionObserver((entries,ob)=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.animate([{opacity:.87,transform:"translateY(11px)"},{opacity:1,transform:"none"}],{duration:570,easing:"ease-out"});ob.unobserve(e.target)}),{threshold:.1});els.forEach(e=>io.observe(e));}
})();