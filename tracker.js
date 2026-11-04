// Visual-only, on-device correlation tracker. Not authoritative movement verification.
// Operates on local camera frames; never sends video frames or raw pixel data to Meta.
function grayFrame(video,canvas,ctx,w,h){canvas.width=w;canvas.height=h;ctx.drawImage(video,0,0,w,h);const d=ctx.getImageData(0,0,w,h).data;const gray=new Float32Array(w*h);for(let i=0,j=0;i<d.length;i+=4,j++)gray[j]=.299*d[i]+.587*d[i+1]+.114*d[i+2];return gray}
function patch(g,w,h,x,y,s=8){let arr=[];for(let dy=-s;dy<=s;dy+=2){for(let dx=-s;dx<=s;dx+=2){const xx=Math.max(0,Math.min(w-1,x+dx)),yy=Math.max(0,Math.min(h-1,y+dy));arr.push(g[yy*w+xx])}}let avg=arr.reduce((a,b)=>a+b,0)/arr.length;let v=Math.sqrt(arr.reduce((s,a)=>s+(a-avg)**2,0))+1;return arr.map(a=>(a-avg)/v)}
function compare(a,b){let value=0;for(let i=0;i<a.length;i++)value+=a[i]*b[i];return value}
export function liveTracker(video,objects,onUpdate){
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true}),w=160,h=160;
 let running=true,prior=[],timer;
 function init(){if(!running||!video.videoWidth){timer=setTimeout(init,180);return}const g=grayFrame(video,canvas,ctx,w,h);prior=objects.slice(0,5).filter(o=>Array.isArray(o.box)&&o.box.length===4).map(o=>{const x=Math.round((o.box[0]+o.box[2])*w/2000),y=Math.round((o.box[1]+o.box[3])*h/2000);return{id:o.id,x,y,ref:patch(g,w,h,x,y,12),score:1}});timer=setTimeout(tick,220)}
 function tick(){if(!running||video.readyState<2){timer=setTimeout(tick,220);return}try{const gray=grayFrame(video,canvas,ctx,w,h);for(const p of prior){let best=-Infinity,bx=p.x,by=p.y;for(let dy=-19;dy<=19;dy+=3){for(let dx=-19;dx<=19;dx+=3){const x=p.x+dx,y=p.y+dy;if(x<8||y<8||x>=w-8||y>=h-8)continue;const score=compare(p.ref,patch(gray,w,h,x,y,12));if(score>best){best=score;bx=x;by=y}}}if(best>.69){p.x=bx;p.y=by;p.score=best;p.ref=patch(gray,w,h,bx,by,12)}else p.score=best;onUpdate(p.id,p.x/w*100,p.y/h*100,p.score)}}
 catch{}timer=setTimeout(tick,220)}
 init();return()=>{running=false;clearTimeout(timer)};
}
