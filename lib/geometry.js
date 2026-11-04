/**
 * Fail-closed physical scene comparison. All boxes in normalized image space [0,1000].
 * Verifier intentionally separates generated model observations from game authorization.
 */
const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));
export function validBox(b){return Array.isArray(b)&&b.length===4&&b.every(n=>Number.isFinite(n)&&n>=0&&n<=1000)&&b[2]>b[0]+6&&b[3]>b[1]+6}
export function center(b){return [(b[0]+b[2])/2,(b[1]+b[3])/2]}
export function width(b){return b[2]-b[0]}
export function height(b){return b[3]-b[1]}
export function radius(b){return Math.hypot(width(b),height(b))/2}
export function dist(a,b){const aa=center(a),bb=center(b);return Math.hypot(aa[0]-bb[0],aa[1]-bb[1])}
export function edgeGap(a,b){const dx=Math.max(0,a[0]-b[2],b[0]-a[2]),dy=Math.max(0,a[1]-b[3],b[1]-a[3]);return Math.hypot(dx,dy)}
export function evaluatePhysicalMove(input){
 const boxes=[input.beforeSubject,input.beforeTarget,input.afterSubject,input.afterTarget];
 if(!boxes.every(validBox))return {verdict:'UNCERTAIN',reason:'Could not identify both objects in both photographs.'};
 if(input.visibleBefore===false||input.visibleAfter===false||input.sameObjects===false)return {verdict:'UNCERTAIN',reason:'The same real objects are not confidently visible in both photographs.'};
 if(input.viewStable===false)return {verdict:'UNCERTAIN',reason:'Camera angle changed too much. Hold the camera still and try again.'};
 const confidence=Number(input.confidence);
 if(!Number.isFinite(confidence)||confidence<0.72)return {verdict:'UNCERTAIN',reason:'Object detection confidence is insufficient; try better lighting and a steady camera.'};
 const [s0,t0,s1,t1]=boxes;
 const targetScale=radius(t0),afterTargetScale=radius(t1);
 const scaleRatio=afterTargetScale/targetScale;
 if(scaleRatio<0.68||scaleRatio>1.42)return {verdict:'UNCERTAIN',reason:'Camera distance or target size changed too much.'};
 const targetTravel=dist(t0,t1);
 // Camera can translate slightly; account for the same translation in the subject's displacement.
 const pt0=center(t0),pt1=center(t1),ps0=center(s0),ps1=center(s1);
 const subjectRelativeTravel=Math.hypot((ps1[0]-pt1[0])-(ps0[0]-pt0[0]),(ps1[1]-pt1[1])-(ps0[1]-pt0[1]));
 if(targetTravel>210)return {verdict:'UNCERTAIN',reason:'Target moved too far on screen; please keep the camera position fixed.'};
 let anchorPresent=validBox(input.beforeAnchor)&&validBox(input.afterAnchor);
 if(anchorPresent){
   const a0=input.beforeAnchor,a1=input.afterAnchor;
   const shiftBefore=[center(a0)[0]-pt0[0],center(a0)[1]-pt0[1]];
   const shiftAfter=[center(a1)[0]-pt1[0],center(a1)[1]-pt1[1]];
   const anchorDrift=Math.hypot(shiftBefore[0]-shiftAfter[0],shiftBefore[1]-shiftAfter[1]);
   const anchorScale=radius(a1)/radius(a0);
   if(anchorDrift>130||anchorScale<0.65||anchorScale>1.5)return {verdict:'UNCERTAIN',reason:'Stationary reference shifted. Reframe the same desk and repeat.'};
 }
 const initialGap=edgeGap(s0,t0)/Math.max(40,targetScale);
 const finalGap=edgeGap(s1,t1)/Math.max(40,afterTargetScale);
 const moved=subjectRelativeTravel/Math.max(40,targetScale);
 const metric={initialGap:+initialGap.toFixed(3),finalGap:+finalGap.toFixed(3),relativeMovement:+moved.toFixed(3),confidence:+confidence.toFixed(3)};
 if(initialGap<0.23)return {verdict:'UNCERTAIN',reason:'The objects were already touching or too close before the move. Start farther apart.',metric};
 if(moved<0.34)return {verdict:'NO_CHANGE',reason:'The object has not moved enough relative to its target.',metric};
 if(finalGap<=0.27&&finalGap<=initialGap*.55)return {verdict:'SUCCESS',reason:'The objects moved together and are now close.',metric};
 return {verdict:'NOT_YET',reason:'Movement detected, but the objects are not close enough yet.',metric};
}
