import {selectPhysicalQuest} from './lib/quest.js';
import {liveTracker} from './tracker.js';
import {createEffects,playSpell,unlockSpellAudio} from './effects.js';
const $=id=>document.getElementById(id);
const state={mode:'camera',stream:null,baseline:null,after:null,ratio:4/3,art:null,realm:null,quest:null,phase:'empty',busy:false,view:'placeholder',stopTracker:null,tracked:new Map(),verified:null,generated:false,callCount:0};
const fx=createEffects($('magicCanvas'),$('worldStage'));
let currentImageRequest=0;
const imageURL=(src)=>src||'';
$('access').value=sessionStorage.getItem('rf_demo_access')||sessionStorage.getItem('realmforge_access')||'';
$('access').addEventListener('input',()=>sessionStorage.setItem('rf_demo_access',$('access').value.trim()));
function activity(text,kind='info'){$('activity').textContent=text;$('activity').className='quest-feed '+(kind==='error'?'error':kind==='success'?'success':'');}
function phase(text){$('phaseLabel').textContent=text;$('stageToast').textContent='✦ '+text;$('cameraState').textContent=state.stream?'CAMERA ACTIVE · LOCAL VIDEO':'CAMERA OFFLINE';$('cameraDot').classList.toggle('on',!!state.stream);}
function mark(id,yes){$(id).classList.toggle('good',!!yes)}
function busy(value){state.busy=value;$('stagePrimary').disabled=value;document.body.classList.toggle('busy',value);for(const id of ['awaken','verify','startCamera','uploadBefore','uploadVideo','captureInitial','takeAfter','refine'])$(id).disabled=value||($(id).dataset.locked==='1');}
function updateButtons(){
 const p=state.phase;const empty=p==='empty',captured=p==='captured',awake=p==='awake',verified=p==='verified';
 for(const [id,show] of [['captureInitial',state.mode==='camera'&&!!state.stream&&(empty||captured)],['awaken',captured],['verify',awake],['takeAfter',awake&&state.mode==='photo'],['playAgain',verified]]){$(id).hidden=!show}
 $('captureInitial').disabled=!state.stream||state.busy;
 $('awaken').disabled=!state.baseline||state.busy;
 $('verify').disabled=!state.quest||state.busy;
 $('refine').disabled=!state.realm||state.busy;
 $('viewToggle').disabled=!state.art||state.busy;
 $('takeAfter').disabled=state.busy;
 const button=$('stagePrimary');
 button.textContent=verified?'↻ BEGIN NEW REALM':awake?(state.quest?'◈ VERIFY REAL OBJECT MOVE':'↺ CAPTURE CLEARER SCENE'):captured?'✦ AWAKEN REALITY':state.mode==='camera'?(state.stream?'◎ CAPTURE YOUR WORLD':'◉ OPEN CAMERA'):state.mode==='photo'?'▣ CHOOSE A PHOTO':'▶ CHOOSE A VIDEO';
 button.disabled=state.busy;
}
function chooseView(which){
 const stage=$('worldStage');
 stage.classList.remove('camera','photo','realm','split');
 let view=which;
 if(view==='camera'&&!state.stream)view=state.baseline?'photo':'placeholder';
 if((view==='realm'||view==='split')&&!state.art)view=state.stream?'camera':state.baseline?'photo':'placeholder';
 if(view==='placeholder'&&state.baseline)view='photo';
 state.view=view;
 if(view!=='placeholder')stage.classList.add(view);
 if(view==='split')setSplit(+$('compare').value||50);
 if(view==='realm'||view==='split')$('metaState').textContent='CINEMATIC KEYFRAME · MUSE IMAGE';
 else $('metaState').textContent=state.stream?'LIVE CAMERA · LOCAL EFFECTS':'MUSE SPARK + MUSE IMAGE';
 redrawMarkers();
}
function setSplit(x){$('generatedImage').style.clipPath='inset(0 0 0 '+x+'%)'}
$('compare').addEventListener('input',e=>setSplit(+e.target.value));
$('viewToggle').onclick=()=>{if(state.view==='camera'||state.view==='photo')chooseView('realm');else if(state.view==='realm'){if(state.stream)chooseView('camera');else chooseView('split')}else chooseView('realm')};
function setStageAspect(r){state.ratio=r;$('worldStage').style.aspectRatio=r>=.7&&r<=1.65?String(r):'4/3'}
function stageImage(src){$('originalImage').src=src;setStageAspect(state.ratio);}
function stopTracking(){state.stopTracker?.();state.stopTracker=null;state.tracked.clear()}
function stopCamera(){stopTracking();if(state.stream){for(const t of state.stream.getTracks())t.stop();state.stream=null;$('camera').srcObject=null;}$('startCamera').textContent='◉ START CAMERA';$('cameraDot').classList.remove('on');$('cameraState').textContent='CAMERA OFFLINE'}
async function startCamera(){
 if(state.stream){stopCamera();chooseView(state.baseline?'photo':'placeholder');updateButtons();return}
 if(!navigator.mediaDevices?.getUserMedia){activity('This browser cannot open the live camera. Choose Photo mode instead.','error');return}
 busy(true);activity('Opening the rear camera. Allow camera permission when asked.');
 try{
 const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:960}},audio:false});
 state.stream=stream;$('camera').srcObject=stream;
 await $('camera').play();
 if(!$('camera').videoWidth)await new Promise(resolve=>$('camera').addEventListener('loadedmetadata',resolve,{once:true}));
 setStageAspect($('camera').videoWidth/$('camera').videoHeight);
 $('startCamera').textContent='■ STOP CAMERA';phase(state.phase==='empty'?'CAMERA READY':'CAMERA ACTIVE');
 chooseView('camera');
 activity('Live camera active. Hold the phone steady. Capture the starting scene before moving anything.');
 if(state.realm)beginTracking();
 }catch(e){activity('Camera unavailable: '+(e.message||e)+'. You can still use Photo mode.','error')}
 finally{busy(false);updateButtons()}
}
$('startCamera').onclick=startCamera;
function canvasData(element,width=980,quality=.72){
 const sw=element.videoWidth||element.naturalWidth||element.width,sh=element.videoHeight||element.naturalHeight||element.height;
 if(!sw||!sh)throw new Error('No image frame available');
 const sc=Math.min(1,width/Math.max(sw,sh));
 const c=document.createElement('canvas');c.width=Math.max(1,Math.round(sw*sc));c.height=Math.max(1,Math.round(sh*sc));
 c.getContext('2d',{alpha:false}).drawImage(element,0,0,c.width,c.height);
 return{data:c.toDataURL('image/jpeg',quality),ratio:c.width/c.height};
}
function captureLive(){
 if(!state.stream||$('camera').readyState<2)throw new Error('Camera is not ready. Start the camera first.');
 return canvasData($('camera'),960,.7);
}
async function fileImage(file){
 if(!file||!/^image\/(jpeg|png|webp)/.test(file.type))throw new Error('Choose a JPEG, PNG or WebP image.');
 if(file.size>18e6)throw new Error('Image is too large. Please choose one under 18 MB.');
 const url=URL.createObjectURL(file),image=new Image();try{await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('Could not decode the image'));image.src=url});return canvasData(image,960,.72)}finally{URL.revokeObjectURL(url)}
}
async function extractVideo(file){
 if(!file||!file.type.startsWith('video/'))throw new Error('Choose a short video clip.');
 if(file.size>90e6)throw new Error('Keep the video under 90 MB.');
 const v=document.createElement('video');v.muted=true;v.playsInline=true;v.preload='auto';const url=URL.createObjectURL(file);v.src=url;
 try{
 await new Promise((resolve,reject)=>{v.onloadedmetadata=resolve;v.onerror=()=>reject(new Error('This video could not be decoded.'));setTimeout(()=>reject(new Error('Video metadata timed out.')),12000)});
 if(!Number.isFinite(v.duration)||v.duration<1.5||v.duration>35)throw new Error('Use a short video of 2–35 seconds.');
 const seek=async t=>{if(Math.abs(v.currentTime-t)>.04){v.currentTime=t;await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('Video seeking timed out')),9500);v.addEventListener('seeked',()=>{clearTimeout(timeout);resolve()},{once:true})})}return canvasData(v,960,.72)};
 const before=await seek(Math.min(.3,v.duration/10));const after=await seek(Math.max(1,v.duration-.25));return{before,after};
 }finally{URL.revokeObjectURL(url);v.removeAttribute('src');v.load()}
}
function useBaseline({data,ratio},source='photo'){
 stopTracking();$('missionBanner').hidden=true;state.baseline=data;state.ratio=ratio;state.after=null;state.realm=null;state.art=null;state.quest=null;state.verified=null;state.generated=false;state.phase='captured';
 $('generatedImage').removeAttribute('src');$('generatedImage').style.clipPath='';
 $('objectPair').hidden=true;$('questTitle').textContent='A world waiting to awaken';$('questDescription').textContent='Meta will discover the visible objects, invent an original realm, and create one physical-world challenge.';$('questCounter').textContent='REALITY CAPTURED';$('worldName').textContent='THE UNTOLD STORY';
 stageImage(data);if(source==='camera'&&state.stream)chooseView('camera');else chooseView('photo');
 $('proof').hidden=true;$('proofDetails').hidden=true;fx.reset();phase('REALITY CAPTURED');activity('Starting scene captured. Nothing has moved yet. Press Awaken to let Meta understand and transform it.');updateButtons();
}
$('captureInitial').onclick=()=>{try{useBaseline(captureLive(),'camera')}catch(e){activity(e.message,'error')}};
$('uploadBefore').onclick=()=>$('beforeFile').click();
$('beforeFile').onchange=async e=>{try{if(e.target.files?.[0])useBaseline(await fileImage(e.target.files[0]),'photo')}catch(err){activity(err.message,'error')}finally{e.target.value=''}};
$('uploadVideo').onclick=()=>$('videoFile').click();
$('videoFile').onchange=async e=>{if(!e.target.files?.[0])return;busy(true);activity('Extracting the beginning and end of your video locally…');try{const pair=await extractVideo(e.target.files[0]);useBaseline(pair.before,'video');state.after=pair.after.data;activity('Video frames extracted locally. The first frame creates the realm; the last will verify the movement.')}catch(err){activity(err.message,'error')}finally{e.target.value='';busy(false);updateButtons()}};
function setMode(mode){if(state.busy)return;state.mode=mode;for(const b of document.querySelectorAll('.mode')){const active=b.dataset.mode===mode;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active))}
 $('startCamera').hidden=mode!=='camera';$('uploadBefore').hidden=mode!=='photo';$('uploadVideo').hidden=mode!=='video';
 $('modeNote').textContent=mode==='camera'?'Live preview and animated magic. Capture a starting frame, move a real object, then press Verify.':mode==='photo'?'Choose a starting photo. After moving an object, choose a second photo to verify it.':'Upload a 2–35 second clip showing the scene before and after you move an object. Video frames are extracted locally.';
 if(mode!=='camera'&&state.stream){stopCamera();chooseView(state.baseline?'photo':'placeholder')}
 updateButtons();
}
for(const b of document.querySelectorAll('.mode'))b.addEventListener('click',()=>setMode(b.dataset.mode));
async function api(endpoint,body){
 if(!($('access').value||'').trim())throw new Error('Enter your private access code before using Meta.');
 if(state.callCount>=12)throw new Error('This session reached its 12-request safety budget. Reload deliberately to start a fresh session.');
 state.callCount++;
 const r=await fetch('/api/'+endpoint,{method:'POST',headers:{'Content-Type':'application/json','X-Realm-Access':$('access').value.trim()},body:JSON.stringify(body)});
 const response=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(response.error||'Meta request returned HTTP '+r.status);
 return response;
}
function mapIntoStage(x,y){const stage=$('worldStage'),W=stage.clientWidth,H=stage.clientHeight,r=state.ratio||4/3;const fitW=Math.min(W,H*r),fitH=fitW/r;return {x:(W-fitW)/2+x*fitW/100,y:(H-fitH)/2+y*fitH/100}}
function renderMarkers(){
 const container=$('trackingPoints');container.replaceChildren();
 if(!state.realm)return;
 const objects=state.realm.objects||[];
 const mission=state.quest,selected=new Set([mission?.subjectId,mission?.targetId].filter(Boolean));
 for(const obj of objects){
 if(!Array.isArray(obj.box)||obj.box.length!==4)continue;
 if(mission&&!selected.has(obj.id))continue;
 const marker=document.createElement('div');marker.className='marker'+(obj.id===mission?.targetId?' target':'');
 const tracked=state.tracked.get(obj.id),x=tracked?.score>.72?tracked.x:(obj.box[0]+obj.box[2])/20,y=tracked?.score>.72?tracked.y:(obj.box[1]+obj.box[3])/20;
 const screen=mapIntoStage(x,y);marker.style.left=screen.x+'px';marker.style.top=screen.y+'px';
 marker.innerHTML='<div class="glow-ring"></div><div class="marker-label"></div>';
 marker.querySelector('.marker-label').textContent=obj.magicalRole||obj.label;
 marker.setAttribute('aria-label',obj.label);
 container.append(marker);
 }
 updateEffects();
}
function updateEffects(){
 if(!state.quest||!state.realm){fx.setPoints([]);return}
 const ids=[state.quest.subjectId,state.quest.targetId],points=ids.map(id=>{const o=state.realm.objects.find(x=>x.id===id),p=state.tracked.get(id);if(!o)return null;return p&&p.score>.72?{x:p.x,y:p.y}:{x:(o.box[0]+o.box[2])/20,y:(o.box[1]+o.box[3])/20}}).filter(Boolean);
 const stage=$('worldStage'),sw=stage.clientWidth||1,sh=stage.clientHeight||1;fx.setPoints(points.map(p=>{const m=mapIntoStage(p.x,p.y);return{x:100*m.x/sw,y:100*m.y/sh}}));
}
function redrawMarkers(){renderMarkers();}
function beginTracking(){
 stopTracking();
 if(!state.stream||!state.realm||!$('camera').videoWidth)return;
 state.stopTracker=liveTracker($('camera'),state.realm.objects,(id,x,y,score)=>{
 state.tracked.set(id,{x,y,score});
 if(state.view==='camera')renderMarkers();
 });
}
function activateArt(image){
 if(!image)return;state.art=image;$('generatedImage').src=image;state.generated=true;$('viewToggle').disabled=false;
 if(state.mode!=='camera'){chooseView('realm')}else if(state.view!=='camera'){chooseView('realm')}
 mark('imageRow',true);
}
async function awaken(){
 if(state.busy)return;
 if(!state.baseline){if(state.mode==='camera'&&state.stream){try{useBaseline(captureLive(),'camera')}catch(e){activity(e.message,'error');return}}else return activity('Capture or upload a real scene first.','error')}
 busy(true);phase('AWAKENING · META THINKING');activity('Muse Spark is grounding visible objects. Muse Image is transfiguring this exact real-world photograph.');
 try{
 const body={image:state.baseline,ratio:state.ratio,theme:$('theme').value};
 const [a,t]=await Promise.allSettled([api('analyze',body),api('transform',body)]);
 if(a.status==='fulfilled'){
  const realm=a.value.scene;if(!Array.isArray(realm?.objects)||realm.objects.length<1)throw new Error('Meta could not reliably identify any visible real objects.');
  state.realm=realm;state.quest=selectPhysicalQuest(realm.objects);$('missionBanner').hidden=!state.quest;if(state.quest)$('missionShort').textContent=state.quest.instruction;
  $('worldName').textContent=realm.worldName||'THE ENCHANTED REALM';
  mark('sparkRow',true);$('metaState').textContent='MUSE SPARK · GROUNDED SCENE';
  if(state.quest){
   $('questCounter').textContent='PHYSICAL QUEST 01 / 01';$('questTitle').textContent=state.quest.title;
   $('questDescription').textContent=state.quest.fantasyInstruction+' '+state.quest.hint;
   $('objectPair').hidden=false;$('subjectName').textContent=state.quest.subjectLabel.toUpperCase();$('targetName').textContent=state.quest.targetLabel.toUpperCase();
   activity('Your magical mission is live: '+state.quest.instruction+' Then press Verify.');
  }else{
   $('questTitle').textContent='Find your magical pieces';
   $('questDescription').textContent='Muse understood the scene, but it did not identify two separated, suitable physical objects. Add a cup, book, and keys spaced apart, then capture again.';
   activity('World generated. A physical move requires two separate identifiable objects, at least one easy to pick up.','error');
  }
  state.phase='awake';renderMarkers();if(state.stream)beginTracking();
 }else{activity('Muse Spark could not establish a grounded game: '+a.reason.message,'error')}
 if(t.status==='fulfilled'){activateArt(t.value.image)}else activity('Muse Image unavailable: '+t.reason.message+'. The physical game can still be tested.','error');
 if(state.realm){phase(state.quest?'PHYSICAL QUEST READY':'WORLD READY · NEED OBJECTS');if(state.stream)chooseView('camera');else if(state.art)chooseView('realm')}
 else{state.phase='captured';phase('SCENE ANALYSIS FAILED')}
 }catch(e){activity('Awakening: '+e.message,'error');state.phase='captured';phase('TRY ANOTHER SCENE')}
 finally{busy(false);updateButtons()}
}
$('awaken').onclick=awaken;
function evidence(verdict,reason){
 $('proof').hidden=false;$('proof').classList.toggle('error',verdict!=='SUCCESS');
 $('proofIcon').textContent=verdict==='SUCCESS'?'✦':verdict==='NO_CHANGE'?'⌛':'◇';
 $('proofStatus').textContent=verdict==='SUCCESS'?'PHYSICAL SPELL VERIFIED':verdict==='UNCERTAIN'?'EVIDENCE UNCERTAIN':verdict==='NO_CHANGE'?'NO MOVEMENT DETECTED':'MOVE NOT YET COMPLETED';
 $('proofExplanation').textContent=reason;
 $('proofDetails').hidden=false;const r=state.verified||{};$('proofJson').textContent=JSON.stringify({model:r.model||'unavailable',observation:r.observation||'No validated observation',verdict,initialGap:r.metric?.initialGap??null,finalGap:r.metric?.finalGap??null,relativeMovement:r.metric?.relativeMovement??null,confidence:r.metric?.confidence??null,rule:'Meta observes; geometry decides. Unclear evidence cannot advance the quest.'},null,2);
}
async function runVerification(afterPhoto){
 if(state.phase!=='awake'||!state.quest||state.busy)return;
 if(!afterPhoto)return activity('Please capture the scene after moving the real object.','error');
 state.verified=null;busy(true);phase('VERIFYING REALITY');activity('Muse Spark is examining both actual photographs. Independent geometry rules will decide whether the physical move is proven.');
 try{
 const q=state.quest,objects=state.realm.objects;
 const anc=objects.find(o=>o.id===q.anchorId);
 const result=await api('verify',{before:state.baseline,after:afterPhoto,subjectLabel:q.subjectLabel,targetLabel:q.targetLabel,anchorLabel:anc?.label||''});
 state.verified=result;mark('verifyRow',result.verdict==='SUCCESS');evidence(result.verdict,result.reason);
 if(result.verdict!=='SUCCESS'){activity('Not accepted: '+result.reason+'. Adjust the real objects and verify again.','error');phase(result.verdict==='UNCERTAIN'?'VERIFY AGAIN · UNCERTAIN':'KEEP MOVING');return}
 state.phase='verified';$('missionBanner').hidden=true;fx.success();playSpell(true);$('sceneFlash').classList.remove('cast');void $('sceneFlash').offsetWidth;$('sceneFlash').classList.add('cast');
 activity('✦ VERIFIED. You physically changed the world. The independent geometry rules accepted the movement. The portal is opening…','success');$('questCounter').textContent='REAL-WORLD ACTION CONFIRMED';$('questTitle').textContent='The realm obeys you.';$('questDescription').textContent='You moved a real object. Meta visually observed the before-and-after arrangement, and independent rules authorised the spell.';
 phase('✦ PHYSICAL REALITY TRANSFORMED');
 $('originalImage').src=afterPhoto;
 // One additional explicit cinematic keyframe after a successful event; never on failed verification.
 try{
 const magic=await api('transform',{image:afterPhoto,ratio:state.ratio,theme:$('theme').value,stage:'after',physicalEvent:q.subjectRole+' joins '+q.targetRole});
 activateArt(magic.image);chooseView('realm');$('metaState').textContent='MUSE IMAGE · NEW WORLD STATE';
 }catch(e){activity('Physical action verified. The additional cinematic frame was unavailable: '+e.message,'success')}
 }catch(e){evidence('UNCERTAIN','Model verification could not complete. Nothing has advanced. '+e.message);activity('Verification error: '+e.message,'error');phase('VERIFICATION UNAVAILABLE')}
 finally{busy(false);updateButtons()}
}
$('verify').onclick=async()=>{unlockSpellAudio();
 if(state.mode==='camera'){try{state.after=captureLive().data;await runVerification(state.after)}catch(e){activity(e.message,'error')}}
 else if(state.mode==='video'){if(state.after)await runVerification(state.after);else activity('Upload a video with a visible before-and-after action.','error')}
 else $('afterFile').click();
};
$('takeAfter').onclick=()=>$('afterFile').click();
$('afterFile').onchange=async e=>{try{if(e.target.files?.[0]){state.after=(await fileImage(e.target.files[0])).data;await runVerification(state.after)}}catch(err){activity(err.message,'error')}finally{e.target.value=''}};
$('playAgain').onclick=()=>reset(false);
$('reset').onclick=()=>reset(true);
function reset(full){
 stopTracking();
 $('missionBanner').hidden=true;state.baseline=null;state.after=null;state.art=null;state.realm=null;state.quest=null;state.phase='empty';state.generated=false;state.verified=null;state.tracked.clear();fx.reset();
 $('originalImage').removeAttribute('src');$('generatedImage').removeAttribute('src');$('trackingPoints').replaceChildren();$('objectPair').hidden=true;$('proof').hidden=true;$('proofDetails').hidden=true;
 for(const id of ['sparkRow','imageRow','samRow','verifyRow'])mark(id,false);
 $('questCounter').textContent='THE FIRST AWAKENING';$('questTitle').textContent='Your world is the gameboard.';$('questDescription').textContent='Choose a scene with three distinct objects. We will create a magical objective you can complete in real life.';$('worldName').textContent='THE UNOPENED GATE';
 if(full&&state.stream)stopCamera();
 if(state.stream)chooseView('camera');else chooseView('placeholder');phase('AWAITING REALITY');activity('The portal is reset. Frame a few distinct real objects to begin.');
 updateButtons();
}
$('refine').onclick=async()=>{
 if(!state.realm||!state.baseline||state.busy)return;
 busy(true);activity('SAM 3.1 is refining up to three detected real-object locations. This optional call is not run automatically.');
 try{
 const wanted=state.realm.objects.slice(0,3).map(o=>({id:o.id,label:o.label,box:o.box}));
 const r=await api('segment',{image:state.baseline,objects:wanted});
 for(const box of r.segments||[]){const obj=state.realm.objects.find(o=>o.id===box.id);if(obj&&Array.isArray(box.box)&&box.box.length===4)obj.box=box.box;}
 const count=r.segments?.length||0;if(!count)throw new Error('No objects refined. '+(r.failed||[]).join(' '));
 mark('samRow',true);if(state.stream)beginTracking();renderMarkers();activity('SAM 3.1 refined '+count+' object locations. Gameplay still requires independent physical verification.');
 }catch(e){activity('SAM refinement did not succeed: '+e.message,'error')}finally{busy(false);updateButtons()}
};
async function modelStatus(){try{const r=await fetch('/api/status');const j=await r.json();$('modelStatus').classList.toggle('connected',!!j.ready);$('modelStatus').innerHTML='<span class="dot"></span>'+(j.ready?'META API READY':'META KEY REQUIRED');}catch{$('modelStatus').textContent='META STATUS UNAVAILABLE'}}
$('stagePrimary').onclick=()=>{if(state.busy)return;if(state.phase==='verified'){reset(false);return}if(state.phase==='awake'){if(state.quest)$('verify').click();else if(state.stream){try{useBaseline(captureLive(),'camera')}catch(e){activity(e.message,'error')}}else $('beforeFile').click();return}if(state.phase==='captured'){$('awaken').click();return}if(state.mode==='camera'){if(state.stream)$('captureInitial').click();else $('startCamera').click();return}if(state.mode==='photo')$('beforeFile').click();else $('videoFile').click();};
window.addEventListener('resize',()=>renderMarkers(),{passive:true});
window.addEventListener('pagehide',()=>{if(state.stream)stopCamera();fx.destroy()});
modelStatus();setMode('camera');reset(false);
