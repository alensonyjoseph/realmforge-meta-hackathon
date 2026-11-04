import {protect,bodyOf,imageOf,postModel,handleError} from '../lib/meta.js';
import {evaluatePhysicalMove} from '../lib/geometry.js';
export const config={maxDuration:60};
const box={type:'array',items:{type:'integer'}};
const keys=['beforeSubject','beforeTarget','afterSubject','afterTarget','beforeAnchor','afterAnchor'];
const properties={visibleBefore:{type:'boolean'},visibleAfter:{type:'boolean'},sameObjects:{type:'boolean'},viewStable:{type:'boolean'},confidence:{type:'number'},observation:{type:'string'}};
for(const name of keys)properties[name]=box;
const schema={type:'object',additionalProperties:false,properties,required:Object.keys(properties)};
const safeName=x=>String(x||'').replace(/[^\p{L}\p{N} .'-]/gu,'').trim().slice(0,70);
export default async function handler(req,res){
 if(!protect(req,res))return;
 try{
 const b=bodyOf(req);
 const before=imageOf({image:b.before});
 const after=imageOf({image:b.after});
 const subject=safeName(b.subjectLabel),target=safeName(b.targetLabel);
 const anchor=safeName(b.anchorLabel);
 if(!subject||!target||subject.toLowerCase()===target.toLowerCase())return res.status(400).json({error:'Select two different, distinguishable objects.'});
 const instructions='Two ORIGINAL photographs of the SAME real tabletop are supplied in order: FIRST=BEFORE action; SECOND=AFTER action. Strict physical detection, NOT creative writing. A user claims to have physically moved '+JSON.stringify(subject)+' near '+JSON.stringify(target)+'. '+(anchor?'A third stationary reference object is '+JSON.stringify(anchor)+'. ':'')+
 ' Locate the EXACT SAME real-world subject and target in BOTH photographs. Only boxes of genuinely visible objects; never invent boxes. Return integer normalized boxes [left,top,right,bottom] from 0 to 1000, NOT raw pixels. BEFORE: beforeSubject and beforeTarget. AFTER: afterSubject and afterTarget. For the third reference return beforeAnchor and afterAnchor; if absent or not identifiable return [0,0,0,0]. If an object cannot be identified set sameObjects false and missing box [0,0,0,0]. visibleBefore/visibleAfter false if either object not visible. Set viewStable false when phone moved significantly, camera angles change, or scenes differ. confidence between 0 and 1 must reflect certainty of ALL boxes. Be conservative; no falsely declared events. Never claim movement success; independent code decides. Give one short factual observation.';
 const result=await postModel('chat/completions',{model:'muse-spark-1.3',messages:[
 {role:'system',content:'You are a conservative machine vision observer for an independent physical-world game verifier. No fictional objects, no made-up coordinates, valid JSON only.'},
 {role:'user',content:[{type:'text',text:instructions},{type:'image_url',image_url:{url:before}},{type:'image_url',image_url:{url:after}}]}
 ],response_format:{type:'json_schema',json_schema:{name:'physical_change_observation',schema}},reasoning_effort:'low',max_completion_tokens:2200},53000);
 let raw=result.choices?.[0]?.message?.content||'';
 if(typeof raw!=='string')raw=JSON.stringify(raw);
 if(!raw.trim())throw new Error('Muse Spark returned no physical verification geometry; try again with clearer photos.');
 const obs=JSON.parse(raw);
 const analysis=evaluatePhysicalMove(obs);
 res.status(200).json({verdict:analysis.verdict,reason:analysis.reason,metric:analysis.metric||null,observation:String(obs.observation||'').slice(0,240),model:'muse-spark-1.3',checked:true});
 }catch(error){handleError(res,error)}
}
