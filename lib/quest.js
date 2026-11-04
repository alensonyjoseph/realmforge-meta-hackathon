import {edgeGap,radius} from './geometry.js';
// deterministic mission selection; deliberately never asks the player to move an appliance.
const movable=/\b(cup|mug|glass|key|keys|pen|pencil|spoon|fork|book|notebook|coin|phone|toy|bottle|bowl|card|wallet|remote|dice|eraser|ball|brush|figurine)\b/i;
const stationary=/\b(book|notebook|plate|table|tray|box|bowl|container|laptop|keyboard|shelf|mat|board|cup|mug|glass)\b/i;
const area=b=>Array.isArray(b)?Math.max(1,(b[2]-b[0])*(b[3]-b[1])):Infinity;
const center=b=>Array.isArray(b)?[(b[0]+b[2])/2,(b[1]+b[3])/2]:[500,500];
const spread=(a,b)=>Math.hypot(center(a.box)[0]-center(b.box)[0],center(a.box)[1]-center(b.box)[1]);
export function selectPhysicalQuest(objects){
 if(!Array.isArray(objects)||objects.length<2)return null;
 const movableItems=objects.filter(x=>movable.test(x.label||'')&&Array.isArray(x.box));
 if(!movableItems.length)return null;
 const possibilities=[];
 for(const s of movableItems)for(const t of objects){if(s.id===t.id||!Array.isArray(t.box))continue;
 const difference=spread(s,t);
 if(difference<175||edgeGap(s.box,t.box)/Math.max(40,radius(t.box))<0.31)continue;
 let priority=0;
 if(stationary.test(t.label||''))priority+=3;
 if(area(t.box)>area(s.box))priority+=2;
 if(/key|keys|pen|coin|spoon/.test(s.label.toLowerCase()))priority+=1;
 priority+=Math.min(difference,650)/500;
 possibilities.push({s,t,priority});
 }
 if(!possibilities.length)return null;
 possibilities.sort((a,b)=>b.priority-a.priority);
 const {s,t}=possibilities[0];
 const anchor=objects.find(x=>x.id!==s.id&&x.id!==t.id)||null;
 const role=x=>x.magicalRole||x.label;
 return {id:'quest-move-01',kind:'PLACE_NEAR',subjectId:s.id,targetId:t.id,anchorId:anchor?.id||null,subjectLabel:s.label,targetLabel:t.label,subjectRole:role(s),targetRole:role(t),title:'The Binding Spell',instruction:'Move the real '+s.label+' beside the '+t.label+'.',fantasyInstruction:'Bring the '+role(s)+' close to the '+role(t)+' to awaken the seal.',hint:'Keep the camera still while moving the real '+s.label+'. You will verify by comparing two frames.'};
}
