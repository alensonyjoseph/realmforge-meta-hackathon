import { protect, bodyOf, imageOf, postModel, handleError } from '../lib/meta.js';
export const config={maxDuration:60};
const clamp=n=>Math.max(0,Math.min(1000,Math.round(n)));
const safeBox=(box)=>Array.isArray(box)&&box.length===4?box.map(x=>clamp(Number(x)||0)):[0,0,1000,1000];
function parseBoxes(streamText){
 const out=[]; const re=/<\|box;x1=(\d+);y1=(\d+);x2=(\d+);y2=(\d+);w=(\d+);h=(\d+)(?:;c=([\d.]+))?\|>/g;
 let match;
 while((match=re.exec(streamText))!==null){
 const [x1,y1,x2,y2,w,h]=match.slice(1,7).map(Number);
 if(!w||!h||x2<=x1||y2<=y1)continue;
 out.push({box:[clamp(x1*1000/w),clamp(y1*1000/h),clamp(x2*1000/w),clamp(y2*1000/h)],confidence:match[7]?Number(match[7]):null});
 }return out;
}
async function segmentOne(image,item){
 const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),30000);
 try{
 const r=await fetch('https://api.meta.ai/v1/responses',{method:'POST',
 headers:{Authorization:'Bearer '+process.env.MODEL_API_KEY,'Content-Type':'application/json',Accept:'text/event-stream'},
 body:JSON.stringify({model:'sam-3.1',input:[{type:'message',role:'user',content:[{type:'input_text',text:item.label},{type:'input_image',image_url:image}]}],stream:true,metadata:{include_confidence:'true'}}),signal:ctrl.signal});
 if(!r.ok){const t=await r.text();throw new Error('SAM '+r.status+': '+t.slice(0,150));}
 const reader=r.body?.getReader();if(!reader)throw new Error('SAM returned no stream');
 const decoder=new TextDecoder();let pending='',raw='',readBytes=0;
 while(true){const {done,value}=await reader.read();if(done)break;readBytes+=value.length;if(readBytes>1300000)throw new Error('SAM response exceeded size budget');pending+=decoder.decode(value,{stream:true});
 const lines=pending.split('\n');pending=lines.pop()||'';for(const line of lines){if(!line.startsWith('data:'))continue;const text=line.slice(5).trim();if(text==='[DONE]')continue;try{const ev=JSON.parse(text);if(ev.type==='response.output_text.delta')raw+=String(ev.delta||'');else if(ev.type==='response.completed'){const extra=ev.response?.output_text;if(extra&&!raw)raw=String(extra)}}catch{}}
 }let boxes=parseBoxes(raw);if(!boxes.length)throw new Error('No segmented objects matching '+item.label);
 const target=safeBox(item.box);const cx=(target[0]+target[2])/2,cy=(target[1]+target[3])/2;
 boxes.sort((a,b)=>{const distance=x=>Math.hypot((x.box[0]+x.box[2])/2-cx,(x.box[1]+x.box[3])/2-cy);return distance(a)-distance(b)});
 return {id:item.id,label:item.label,box:boxes[0].box,confidence:boxes[0].confidence,found:boxes.length};
 }finally{clearTimeout(timeout)}
}
export default async function handler(req,res){
 if(!protect(req,res))return;
 try{const body=bodyOf(req);const image=imageOf(body);if(!Array.isArray(body.objects)||body.objects.length<1)return res.status(400).json({error:'Provide 1-3 visible objects'});
 const seen=new Set();const objects=body.objects.slice(0,3).map(o=>({id:String(o.id||'').slice(0,12),label:String(o.label||'').replace(/[^a-zA-Z0-9 -]/g,'').trim().slice(0,60),box:o.box})).filter(x=>{if(!x.id||!x.label||seen.has(x.id))return false;seen.add(x.id);return true});
 const tasks=await Promise.allSettled(objects.map(item=>segmentOne(image,item)));
 const segments=tasks.filter(x=>x.status==='fulfilled').map(x=>x.value);
 const failed=tasks.filter(x=>x.status==='rejected').map(x=>String(x.reason?.message||x.reason).slice(0,160));
 res.status(200).json({segments,failed,model:'sam-3.1',note:'Bounding boxes confirmed using SAM segmentation where available; original Muse Spark scene remains the fallback.'});
 }catch(e){handleError(res,e)}
}
