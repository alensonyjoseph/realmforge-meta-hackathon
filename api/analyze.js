import {protect,bodyOf,imageOf,themeOf,postModel,handleError} from '../lib/meta.js';
export const config={maxDuration:60};
const thing={type:'object',additionalProperties:false,properties:{id:{type:'string'},label:{type:'string'},magicalRole:{type:'string'},box:{type:'array',items:{type:'integer'}}},required:['id','label','magicalRole','box']};
const step={type:'object',additionalProperties:false,properties:{targetId:{type:'string'},title:{type:'string'},hint:{type:'string'},success:{type:'string'}},required:['targetId','title','hint','success']};
const schema={type:'object',additionalProperties:false,properties:{worldName:{type:'string'},tagline:{type:'string'},intro:{type:'string'},finalMessage:{type:'string'},objects:{type:'array',items:thing},steps:{type:'array',items:step}},required:['worldName','tagline','intro','finalMessage','objects','steps']};
const short=(s,n)=>String(s||'').trim().slice(0,n);
function normalizeObjects(items){
 const seen=new Set(),idMap=new Map(),out=[];
 for(const o of (Array.isArray(items)?items:[])){
  if(out.length===5)break;
  const label=short(o.label,60);
  if(label.length<2||seen.has(label.toLowerCase()))continue;
  if(!Array.isArray(o.box)||o.box.length!==4)continue;
  const raw=o.box.map(Number);
  if(!raw.every(Number.isFinite)||raw[2]-raw[0]<15||raw[3]-raw[1]<15)continue;
  const box=raw.map(n=>Math.max(0,Math.min(1000,Math.round(n))));
  if(box[2]-box[0]<15||box[3]-box[1]<15)continue;
  const id='o'+(out.length+1);seen.add(label.toLowerCase());idMap.set(String(o.id),id);
  out.push({id,label,magicalRole:short(o.magicalRole,90)||'enchanted artifact',box});
 }
 return {objects:out,idMap};
}
export default async function handler(req,res){
 if(!protect(req,res))return;
 try{
 const b=bodyOf(req),image=imageOf(b),theme=themeOf(b);
 const prompt='REALMFORGE: inspect this EXACT REAL photograph. We are constructing a photo-grounded physical tabletop game. Choose from ONE to FIVE actually visible, clearly distinguishable real physical objects. Never invent a key, book, chalice, person, container or other object absent from the image just to reach a quota. It is better to identify 1 object accurately than hallucinate 3! Describe every visible object by its ordinary real-world name (cup, book, keys, bowl, bottle etc), NOT by its fantasy identity. For each give a meaningful 0-1000 normalized bounding box [left, top, right, bottom] tightly surrounding that specific real item. Also give it an imaginative magicalRole in a '+theme+' and an atmospheric fantasy worldName/tagline/intro. Create up to 3 original sequential narrative steps grounded only in these actual objects. NEVER guess object locations. No violence, movie franchises, copyrighted characters or war. Do not confuse background patterns with distinct movable objects.';
 const data=await postModel('chat/completions',{model:'muse-spark-1.3',messages:[{role:'system',content:'You are a careful vision observer. Your first responsibility is real-world factual accuracy. Never invent objects or coordinates. Then use the verified objects to invent an original fantasy story. Output only the JSON schema.'},{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:image}}]}],response_format:{type:'json_schema',json_schema:{name:'realm_scene',schema}},reasoning_effort:'low',max_completion_tokens:2300});
 let raw=data.choices?.[0]?.message?.content||'';
 if(typeof raw!=='string')raw=JSON.stringify(raw);
 if(!raw.trim())throw new Error('Muse Spark returned no grounded scene. Try another photograph.');
 const scene=JSON.parse(raw);
 const {objects,idMap}=normalizeObjects(scene.objects);
 if(!objects.length)throw new Error('No reliably located physical objects. Photograph a few everyday items with clear edges and sufficient light.');
 let steps=(Array.isArray(scene.steps)?scene.steps:[]).slice(0,3).map((s,i)=>({targetId:idMap.get(String(s.targetId))||objects[i%objects.length].id,title:short(s.title,100)||'Awaken the artifact',hint:short(s.hint,170)||'Find the visible object',success:short(s.success,180)||'A secret awakens.'}));
 while(steps.length<3){const obj=objects[steps.length%objects.length];steps.push({targetId:obj.id,title:'Discover the next rune',hint:'Find the real '+obj.label,success:'A forgotten spell responds.'})}
 res.status(200).json({scene:{worldName:short(scene.worldName,90)||'THE UNSEEN REALM',tagline:short(scene.tagline,130)||'Your reality, enchanted',intro:short(scene.intro,260)||'A hidden story awaits in the objects around you.',finalMessage:short(scene.finalMessage,160)||'Your world has awakened.',objects,steps},model:'muse-spark-1.3',usage:data.usage||null,groundedCount:objects.length});
 }catch(error){handleError(res,error)}
}
