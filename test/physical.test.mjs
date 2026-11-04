import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluatePhysicalMove,edgeGap} from '../lib/geometry.js';
import {selectPhysicalQuest} from '../lib/quest.js';
import verify from '../api/verify.js';
const start={beforeSubject:[100,200,220,400],beforeTarget:[650,200,850,490],afterSubject:[520,230,630,410],afterTarget:[650,200,850,490],beforeAnchor:[280,690,410,850],afterAnchor:[280,690,410,850],visibleBefore:true,visibleAfter:true,sameObjects:true,viewStable:true,confidence:.93};
test('physical move verified only after real relative displacement and proximity',()=>{const v=evaluatePhysicalMove(start);assert.equal(v.verdict,'SUCCESS',JSON.stringify(v));assert.ok(v.metric.finalGap<v.metric.initialGap)});
test('unchanged scene does not pass',()=>{const v=evaluatePhysicalMove({...start,afterSubject:start.beforeSubject});assert.equal(v.verdict,'NO_CHANGE')});
test('movement without proximity does not pass',()=>{const v=evaluatePhysicalMove({...start,afterSubject:[320,200,440,400]});assert.equal(v.verdict,'NOT_YET')});
test('camera shift or wrong anchor makes evidence uncertain',()=>{assert.equal(evaluatePhysicalMove({...start,viewStable:false}).verdict,'UNCERTAIN');assert.equal(evaluatePhysicalMove({...start,afterAnchor:[620,700,750,880]}).verdict,'UNCERTAIN')});
test('low confidence and invisible objects fail closed',()=>{assert.equal(evaluatePhysicalMove({...start,confidence:.51}).verdict,'UNCERTAIN');assert.equal(evaluatePhysicalMove({...start,sameObjects:false}).verdict,'UNCERTAIN');assert.equal(evaluatePhysicalMove({...start,afterSubject:[0,0,0,0]}).verdict,'UNCERTAIN')});
test('objects initially touching cannot be accepted as a move',()=>{const v=evaluatePhysicalMove({...start,beforeSubject:[545,200,650,400]});assert.equal(v.verdict,'UNCERTAIN')});
test('movable physical mission references existing distinct objects',()=>{
 const scene=[{id:'o1',label:'Ceramic cup',magicalRole:'chalice',box:[120,250,270,610]},{id:'o2',label:'large book',magicalRole:'grimoire',box:[540,190,840,690]},{id:'o3',label:'keys',magicalRole:'sigil keys',box:[90,740,240,920]}];
 const mission=selectPhysicalQuest(scene);assert.ok(mission);assert.notEqual(mission.subjectId,mission.targetId);assert.ok(scene.some(x=>x.id===mission.subjectId));assert.ok(scene.some(x=>x.id===mission.targetId));assert.equal(mission.kind,'PLACE_NEAR');
 assert.equal(selectPhysicalQuest([{id:'o1',label:'microwave',box:[0,0,500,500]}]),null);
});
test('server verification performs independent evaluation of model JSON',async()=>{
 const previous=global.fetch;const key=process.env.MODEL_API_KEY,pass=process.env.DEMO_ACCESS_CODE;
 process.env.MODEL_API_KEY='dummy';process.env.DEMO_ACCESS_CODE='unit-only';
 const image='data:image/jpeg;base64,'+Buffer.from('dummy').toString('base64');
 global.fetch=async()=>new Response(JSON.stringify({choices:[{message:{content:JSON.stringify({...start,observation:'Cup is now closer to book.'})}}]}),{status:200,headers:{'content-type':'application/json'}});
 const req={method:'POST',headers:{'x-realm-access':'unit-only','content-length':'1000'},body:{before:image,after:image,subjectLabel:'cup',targetLabel:'book',anchorLabel:'keys'}};
 const res={statusCode:200,body:null,setHeader(){},status(n){this.statusCode=n;return this},json(b){this.body=b;return this}};
 try{await verify(req,res);assert.equal(res.statusCode,200,JSON.stringify(res.body));assert.equal(res.body.verdict,'SUCCESS');assert.equal(res.body.model,'muse-spark-1.3');assert.equal(res.body.metric.confidence,.93)}
 finally{global.fetch=previous;if(key===undefined)delete process.env.MODEL_API_KEY;else process.env.MODEL_API_KEY=key;if(pass===undefined)delete process.env.DEMO_ACCESS_CODE;else process.env.DEMO_ACCESS_CODE=pass}
});
