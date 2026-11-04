// Animated local browser effects. All visual particles are original generated geometry.
export function createEffects(canvas,stage){
 const ctx=canvas.getContext('2d',{alpha:true});let frame=0,on=true,phase='idle',points=[],burst=0,anim=0;
 const particles=Array.from({length:64},(_,i)=>({phase:Math.random()*Math.PI*2,speed:.15+Math.random()*.3,radius:12+Math.random()*80,size:.7+Math.random()*1.8,seed:Math.random()}));
 function layout(){const r=stage.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);return{w:r.width,h:r.height}}
 let wh=layout();
 const observer=new ResizeObserver(()=>wh=layout());observer.observe(stage);
 function draw(){if(!on)return;frame++;ctx.clearRect(0,0,wh.w,wh.h);if(phase!=='idle'&&points.length){
 for(const [i,p] of points.entries()){const x=p.x*wh.w/100,y=p.y*wh.h/100;const power=phase==='success'?1.5:1;const glow=ctx.createRadialGradient(x,y,2,x,y,55*power);glow.addColorStop(0,i===0?'rgba(241,202,123,.21)':'rgba(101,231,187,.14)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,58*power,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle=i===0?'rgba(242,202,134,.55)':'rgba(128,229,195,.48)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,y,27+Math.sin(frame*.03+i)*3,0,Math.PI*2);ctx.stroke();
 if(i<2){particles.forEach((v,j)=>{const a=v.phase+frame*v.speed*.02+j*.031;const rad=v.radius+(phase==='success'?Math.min(90,frame*.6):0);const xx=x+Math.cos(a)*rad,yy=y+Math.sin(a*.95)*rad*.62;ctx.globalAlpha=.35+Math.sin(a*3)*.25;ctx.fillStyle=j%3?'#eed1a0':'#9ff2cf';ctx.beginPath();ctx.arc(xx,yy,v.size,0,7);ctx.fill();});ctx.globalAlpha=1}
 }
 if(burst>0&&points.length>=2){const a=points[0],b=points[1],x=a.x*wh.w/100,y=a.y*wh.h/100,tx=b.x*wh.w/100,ty=b.y*wh.h/100;ctx.strokeStyle='rgba(255,218,144,'+Math.min(1,burst/35)+')';ctx.lineWidth=3+burst/15;ctx.shadowBlur=25;ctx.shadowColor='#e9c281';ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo((x+tx)/2,Math.min(y,ty)-62,tx,ty);ctx.stroke();ctx.shadowBlur=0;burst--}
 }
 anim=requestAnimationFrame(draw)}
 draw();
 return{setPoints(next){points=next;phase=next.length?'active':'idle'},success(){phase='success';burst=65;setTimeout(()=>{if(on)phase='active'},2300)},reset(){points=[];phase='idle';burst=0},destroy(){on=false;cancelAnimationFrame(anim);observer.disconnect()}}
}
let spellAudio=null;
export function unlockSpellAudio(){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;spellAudio=spellAudio||new Audio();if(spellAudio.state==='suspended')spellAudio.resume()}catch{}}
export function playSpell(success=true){try{unlockSpellAudio();const c=spellAudio;if(!c)return;const now=c.currentTime+.015;const notes=success?[392,523.25,659.25,1046.5]:[220,174.61,130.81];notes.forEach((frequency,i)=>{const start=now+i*(success?.12:.15);const o=c.createOscillator(),g=c.createGain(),filter=c.createBiquadFilter();o.type=i===notes.length-1?'sine':'triangle';o.frequency.setValueAtTime(frequency,start);o.frequency.exponentialRampToValueAtTime(frequency*1.008,start+.16);filter.type='lowpass';filter.frequency.value=success?2700:900;g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(success?.030:.022,start+.025);g.gain.exponentialRampToValueAtTime(.0001,start+(success?1.25:.64));o.connect(filter).connect(g).connect(c.destination);o.start(start);o.stop(start+(success?1.27:.66))});if(success){const bass=c.createOscillator(),gain=c.createGain();bass.type='sine';bass.frequency.setValueAtTime(135,now);bass.frequency.exponentialRampToValueAtTime(55,now+.7);gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.031,now+.06);gain.gain.exponentialRampToValueAtTime(.0001,now+.75);bass.connect(gain).connect(c.destination);bass.start(now);bass.stop(now+.78)}}catch{}}
