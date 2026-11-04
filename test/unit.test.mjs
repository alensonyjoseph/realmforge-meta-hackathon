import test from 'node:test';import assert from 'node:assert/strict';
import {protect} from '../lib/meta.js';import analyze from '../api/analyze.js';import transform from '../api/transform.js';import action from '../api/act.js';import segment from '../api/segment.js';
process.env.MODEL_API_KEY='unit-test-dummy';process.env.DEMO_ACCESS_CODE='unit-test-code';
const photo='data:image/jpeg;base64,'+Buffer.from('testjpg').toString('base64');
const req=(b={},headers={})=>({method:'POST',headers:{'x-realm-access':'unit-test-code','content-length':'100',...headers},body:b});
function res(){return{code:200,value:null,setHeader(){},status(n){this.code=n;return this},json(x){this.value=x;return this}}}
function mock(body){const old=global.fetch;global.fetch=async(url,options)=>new Response(JSON.stringify(body),{status:200,headers:{'Content-Type':'application/json'}});return()=>global.fetch=old}
test('protect rejects incorrect access',()=>{let r=res();protect(req({}, {'x-realm-access':'invalid'}),r);assert.equal(r.code,401)});
test('Muse multimodal scene yields stable IDs and actionable steps',async()=>{
 const scene={worldName:'An Enchanted Table',tagline:'a hidden world',intro:'Awaken',finalMessage:'Done',objects:[{id:'original_a',label:'book',magicalRole:'tome',box:[100,100,300,300]},{id:'original_b',label:'cup',magicalRole:'chalice',box:[350,100,500,500]},{id:'original_c',label:'lamp',magicalRole:'beacon',box:[550,50,900,900]}],steps:[{targetId:'original_a',title:'Book',hint:'Find the book',success:'Read it'},{targetId:'original_b',title:'Cup',hint:'Find the cup',success:'Drink it'},{targetId:'original_c',title:'Lamp',hint:'Find the lamp',success:'Light it'}]};
 const restore=mock({choices:[{message:{content:JSON.stringify(scene)}}]});try{const r=res();await analyze(req({image:photo,theme:'ancient arcane library'}),r);assert.equal(r.code,200,JSON.stringify(r.value));assert.deepEqual(r.value.scene.steps.map(s=>s.targetId),['o1','o2','o3'])}finally{restore()}
});
test('Muse Image edit returns image URL',async()=>{const restore=mock({data:[{url:'https://example.com/generated.webp'}]});try{const r=res();await transform(req({image:photo,ratio:1.33}),r);assert.equal(r.code,200);assert.match(r.value.image,/generated.webp/)}finally{restore()}});
test('Meta intent router rejects hallucinated IDs',async()=>{const restore=mock({choices:[{message:{content:'{"targetId":"phantom","intent":"interact","narration":"A mystery."}'}}]});try{const r=res();await action(req({action:'Find the portal',objects:[{id:'o1',label:'book',magicalRole:'tome'}]}),r);assert.equal(r.code,200);assert.equal(r.value.targetId,'')}finally{restore()}});
test('SAM streaming response yields real normalized geometry',async()=>{const restore=global.fetch;const event=JSON.stringify({type:'response.output_text.delta',delta:'<0f>0<|box;x1=200;y1=100;x2=400;y2=300;w=800;h=600;c=0.92|><|mask;x=0;y=0;data=~|>'});global.fetch=async()=>new Response('data: '+event+'\n\ndata: [DONE]\n\n',{status:200,headers:{'Content-Type':'text/event-stream'}});try{const r=res();await segment(req({image:photo,objects:[{id:'o1',label:'book',box:[200,200,500,500]}]}),r);assert.equal(r.code,200);assert.deepEqual(r.value.segments[0].box,[250,167,500,500])}finally{global.fetch=restore}});

test('grounded scene never invents phantom objects or fallback bounding boxes',async()=>{
 const s={worldName:'Single Chalice',tagline:'Real',intro:'One cup',finalMessage:'Done',objects:[{id:'real1',label:'cup',magicalRole:'chalice',box:[100,150,400,800]},{id:'fake2',label:'ghost key',magicalRole:'key',box:[0,0,0,0]},{id:'fake3',label:'book',magicalRole:'grimoire',box:[]}],steps:[]};
 const restore=mock({choices:[{message:{content:JSON.stringify(s)}}]});
 try{const r=res();await analyze(req({image:photo}),r);assert.equal(r.code,200,JSON.stringify(r.value));assert.equal(r.value.scene.objects.length,1);assert.deepEqual(r.value.scene.objects[0].box,[100,150,400,800]);assert.equal(r.value.scene.objects[0].label,'cup')}finally{restore()}
});
