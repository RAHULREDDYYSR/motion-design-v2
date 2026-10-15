import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const project=path.join(root,'videos/fibonacci-nature');
const timing=JSON.parse(readFileSync(path.join(project,'timing.json'),'utf8'));
const out=(file,value)=>{const p=path.join(project,file);mkdirSync(path.dirname(p),{recursive:true});writeFileSync(p,value)};
const C={green:'#2e4a2a',deep:'#243a21',cream:'#efe7d4',pink:'#e89cb1',ink:'#1a1a17'};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
copyFileSync(path.join(root,'node_modules/gsap/dist/gsap.min.js'),path.join(project,'assets/gsap.min.js'));
for(const [pkg,file,target] of [
  ['source-serif-4','source-serif-4-latin-standard-normal.woff2','source-serif-4.woff2'],
  ['jetbrains-mono','jetbrains-mono-latin-wght-normal.woff2','jetbrains-mono.woff2']
])copyFileSync(path.join(root,`node_modules/@fontsource-variable/${pkg}/files/${file}`),path.join(project,'assets/fonts',target));
const fonts=`@font-face{font-family:'Source Serif 4';src:url('assets/fonts/source-serif-4.woff2') format('woff2');font-weight:200 900;font-style:normal;font-display:block}
@font-face{font-family:'JetBrains Mono';src:url('assets/fonts/jetbrains-mono.woff2') format('woff2');font-weight:100 800;font-style:normal;font-display:block}`;
out('assets/fonts.css',fonts);

function sunflower({color=C.green,petals=true,count=610}={}){
 let shapes='';
 if(petals)for(let j=0;j<34;j++)shapes+=`<path class="petal" d="M 437 119 Q 415 28 450 5 Q 485 28 463 119 Z" transform="rotate(${j*360/34} 450 450)" fill="${color}"/>`;
 for(let n=0;n<count;n++){
  let a=n*Math.PI*(3-Math.sqrt(5)),r=13.2*Math.sqrt(n+.5),x=450+r*Math.cos(a),y=450+r*Math.sin(a);
  shapes+=`<ellipse class="seed" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="7.0" ry="4.0" transform="rotate(${(a*180/Math.PI+90).toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})" fill="${color}"/>`;
 }
 return shapes;
}
function parastichy(step,start=60){
 let p=[];for(let n=start;n<610;n+=step){let a=n*Math.PI*(3-Math.sqrt(5)),r=13.2*Math.sqrt(n+.5);p.push(`${(450+r*Math.cos(a)).toFixed(2)},${(450+r*Math.sin(a)).toFixed(2)}`)}
 return `M${p.join(' L')}`;
}
function spiral(cx,cy,max,b,phase=0,turns=2.6){
 let p=[];for(let n=0;n<=220;n++){const a=n/220*Math.PI*2*turns,r=max*Math.exp(b*(a-Math.PI*2*turns));p.push(`${(cx+r*Math.cos(a+phase)).toFixed(2)},${(cy+r*Math.sin(a+phase)).toFixed(2)}`)}
 return 'M'+p.join(' L');
}
function svg(content,box='0 0 900 900',cls='art-svg'){return `<svg class="${cls}" viewBox="${box}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${content}</svg>`}
const flower=sunflower();
out('assets/vectors/sunflower.svg',svg(flower));
out('assets/vectors/logarithmic-spirals.svg',svg(`<path d="${spiral(450,450,380,.16)}" fill="none" stroke="${C.green}" stroke-width="2"/><path d="${spiral(450,450,380,.28)}" fill="none" stroke="${C.pink}" stroke-width="2"/>`));

function frame(i,{theme='cream',kicker,title,body,css='',animate='',foot='SCHEMATIC ILLUSTRATION'}){
 const s=timing.scenes[i-1],id=s.id,bg=C[theme],fg=theme==='green'?C.cream:C.green;
 const scope=`#f${id}-root`;
 const rules=`${fonts}\n${scope}{position:absolute;inset:0;width:100%;height:100%;container-type:size;color:${fg};font-family:'Source Serif 4',serif;overflow:hidden}
${scope} *{box-sizing:border-box}
${scope} .ground{position:absolute;inset:0;background:${bg}}
${scope} .topbar{position:absolute;left:108px;right:108px;top:100px;display:flex;justify-content:space-between;border-bottom:2px solid ${fg};padding-bottom:25px}
${scope} .mono{font-family:'JetBrains Mono',monospace;font-size:23px;font-weight:500;letter-spacing:.1em;line-height:1.4;text-transform:uppercase}
${scope} h1,${scope} h2{position:absolute;left:108px;top:225px;width:864px;margin:0;font-size:112px;font-weight:500;letter-spacing:-.04em;line-height:1.0;font-optical-sizing:auto}
${scope} .foot{position:absolute;left:108px;right:108px;top:1466px;font-size:19px;border-top:2px solid ${fg};padding-top:20px}
${scope} .art-svg{display:block;width:100%;height:100%;overflow:visible}
${scope} .note{font-size:37px;line-height:1.25;font-weight:400}
${scope} .feature{position:absolute}
${scope} .folio{position:absolute;left:108px;right:108px;top:1788px;display:flex;justify-content:space-between;font-size:20px}
${css.replaceAll('@S',scope)}`;
 out(`compositions/frames/${id}.html`,`<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body><template>
<style>${rules}</style><div id="f${id}-root" data-composition-id="${id}" data-width="1080" data-height="1920" data-duration="${s.duration}">
<div id="f${id}-ground" class="ground clip" data-start="0" data-duration="${s.duration}" data-track-index="0"></div>
<div class="topbar mono"><span>FIELD NOTES / FIBONACCI</span><span>${String(i).padStart(2,'0')} / 06</span></div>
<h2 class="headline">${title}</h2>${body}
<div class="foot mono">${foot}</div><div class="folio mono"><span>${kicker}</span><span>NATURE × NUMBERS</span></div></div>
<script>(function(){const r=document.getElementById('f${id}-root');const q=s=>r.querySelector(s);const qa=s=>Array.from(r.querySelectorAll(s));const tl=gsap.timeline({paused:true});
tl.fromTo(q('.headline'),{y:42,opacity:0},{y:0,opacity:1,duration:.7,ease:'power3.out'},.05);
${animate}
tl.to({}, {duration:${s.duration}},0);window.__timelines=window.__timelines||{};window.__timelines['${id}']=tl;})();</script>
</template></body></html>`);
}

frame(1,{theme:'green',kicker:'A RECURRING RHYTHM',title:'Nature has<br>a rhythm.',
 body:`<div class="flower feature">${svg(sunflower({color:C.pink}))}</div><div class="numberline mono">1 &nbsp; 1 &nbsp; 2 &nbsp; 3 &nbsp; 5 &nbsp; 8 &nbsp; 13 &nbsp; 21</div>`,
 css:`@S .headline{font-size:132px;color:${C.pink}} @S .flower{left:155px;top:610px;width:770px;height:770px} @S .numberline{position:absolute;left:108px;top:520px;font-size:33px;letter-spacing:.08em}`,
 animate:`tl.fromTo(q('.flower'),{scale:.88,rotation:-9,opacity:0},{scale:1,rotation:0,opacity:1,duration:2.0,ease:'power2.out'},.15);tl.fromTo(q('.numberline'),{opacity:0,y:20},{opacity:1,y:0,duration:.7},1.2);`,
 foot:'FIBONACCI / A PATTERN WORTH EXPLORING'});

const tiles=[[0,0,13],[13,0,8],[16,8,5],[13,10,3],[13,8,2],[15,8,1],[15,9,1]];
const tileSvg=tiles.map(([x,y,n],j)=>`<g class="fib-tile"><rect x="${x*38}" y="${y*38}" width="${n*38}" height="${n*38}" fill="${j%2?C.green:C.cream}" stroke="${C.green}" stroke-width="2"/><text x="${(x+n/2)*38}" y="${(y+n/2)*38}" dominant-baseline="central" text-anchor="middle" font-family="Source Serif 4" font-size="${n>2?Math.min(n*15,130):n*19}" fill="${j%2?C.cream:C.green}">${n}</text></g>`).join('');
out('assets/vectors/fibonacci-squares.svg',svg(tileSvg,'-2 -2 802 498'));
frame(2,{kicker:'THE ADDITIVE SEQUENCE',title:'One simple<br>rule.',
 body:`<div class="sequence">${[1,1,2,3,5,8].map(n=>`<span class="num">${n}</span>`).join('')}</div><div class="squares feature">${svg(tileSvg,'-2 -2 802 498')}</div><div class="equation">8 + 13 = <span>21</span></div>`,
 css:`@S .sequence{position:absolute;left:108px;right:108px;top:550px;display:flex;justify-content:space-between;font-size:94px;font-weight:500} @S .squares{left:140px;top:795px;width:800px;height:500px} @S .equation{position:absolute;left:108px;top:1330px;font-size:68px;font-weight:500} @S .equation span{border-bottom:2px solid ${C.green}}`,
 animate:`tl.fromTo(qa('.num'),{opacity:0,y:25},{opacity:1,y:0,duration:.3,stagger:.42},.18);tl.fromTo(qa('.fib-tile').reverse(),{opacity:0},{opacity:1,duration:.35,stagger:.12},2.0);tl.fromTo(q('.equation'),{opacity:0,y:15},{opacity:1,y:0,duration:.5},3.5);`,foot:'EACH NEW NUMBER = THE TWO BEFORE IT'});

const traces=[parastichy(34,50),parastichy(55,50)];
frame(3,{kicker:'PHYLLOTAXIS / PLANT ARRANGEMENT',title:'Count the<br>seed spirals.',
 body:`<div class="seedhead feature">${svg(flower+traces.map(d=>`<path class="trace" d="${d}" fill="none" stroke="${C.pink}" stroke-width="10" stroke-linecap="round" pathLength="1"/>`).join(''))}</div><div class="counts"><span>34</span><span class="times">/</span><span>55</span><span class="count-label mono">AN EXAMPLE PAIR</span></div>`,
 css:`@S .seedhead{left:125px;top:560px;width:830px;height:830px} @S .counts{position:absolute;top:1330px;left:108px;right:108px;display:flex;align-items:baseline;gap:28px;font-size:86px;font-weight:500} @S .times{font-size:52px} @S .count-label{margin-left:auto;font-size:20px}`,
 animate:`tl.fromTo(q('.seedhead'),{scale:.93,opacity:0},{scale:1,opacity:1,duration:1.1,ease:'power2.out'},.1);tl.fromTo(qa('.trace'),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.8,stagger:.8,ease:'power1.inOut'},1.5);tl.fromTo(q('.counts'),{opacity:0,y:20},{opacity:1,y:0,duration:.6},2.4);`,foot:'COMMON IN PLANTS / REAL COUNTS ALSO VARY'});

const golden=Math.PI*(3-Math.sqrt(5)),gx=450+250*Math.sin(golden),gy=450-250*Math.cos(golden);
let leaves='';for(let n=0;n<28;n++){let r=48+9.5*n,a=n*golden-1.57,x=450+r*Math.cos(a),y=450+r*Math.sin(a);leaves+=`<ellipse class="leaf" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${19+n*.55}" ry="${10+n*.25}" transform="rotate(${a*180/Math.PI} ${x} ${y})" fill="${C.green}"/>`}
const angleSvg=`<circle cx="450" cy="450" r="360" fill="none" stroke="${C.green}" stroke-width="2"/>${leaves}<path class="angle-arc" d="M450 200 A250 250 0 0 1 ${gx.toFixed(2)} ${gy.toFixed(2)}" fill="none" stroke="${C.green}" stroke-width="2" pathLength="1"/><path d="M450 140 L450 450 L${(450+310*Math.sin(golden)).toFixed(2)} ${(450-310*Math.cos(golden)).toFixed(2)}" fill="none" stroke="${C.green}" stroke-width="2"/><circle cx="450" cy="450" r="10" fill="${C.green}"/>`;
out('assets/vectors/golden-angle.svg',svg(angleSvg));
frame(4,{theme:'pink',kicker:'THE GOLDEN ANGLE',title:'Room to grow.',
 body:`<div class="angle-value">137.5<span>°</span></div><div class="angle feature">${svg(angleSvg)}</div><div class="formula mono">360° × (1 − 1/φ) ≈ 137.5°</div>`,
 css:`@S .headline{font-size:106px} @S .angle-value{position:absolute;left:108px;top:390px;font-size:180px;line-height:1;font-weight:500;letter-spacing:-.06em} @S .angle-value span{font-size:95px;vertical-align:top} @S .angle{left:145px;top:650px;width:790px;height:790px} @S .formula{position:absolute;left:108px;top:1400px;font-size:27px}`,
 animate:`tl.fromTo(q('.angle-value'),{opacity:0,y:30},{opacity:1,y:0,duration:.8},.4);tl.fromTo(qa('.leaf'),{opacity:0},{opacity:1,duration:.22,stagger:.12},.6);tl.fromTo(q('.angle-arc'),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:1.5,ease:'power2.inOut'},2.1);tl.fromTo(q('.formula'),{opacity:0},{opacity:1,duration:.6},3.6);`,foot:'SPACING MODEL / MANY PLANTS, NOT EVERY SPECIES'});

let space='';for(let arm=0;arm<3;arm++){space+=`<path class="cosmic-arm" d="${spiral(450,450,325,.18,arm*2*Math.PI/3,2.2)}" fill="none" stroke="${C.pink}" stroke-width="2" pathLength="1"/>`;for(let j=0;j<170;j++){const a=j/170*Math.PI*4.4,r=325*Math.exp(.18*(a-Math.PI*4.4)),p=a+arm*2*Math.PI/3,off=Math.sin(j*7.13+arm)*8;space+=`<circle cx="${450+(r+off)*Math.cos(p)}" cy="${450+(r+off)*Math.sin(p)}" r="${j%6===0?3.5:1.7}" fill="${C.cream}"/>`}}
frame(5,{theme:'green',kicker:'EARTH → THE COSMOS',title:'Same shape.<br>Different causes.',
 body:`<div class="galaxy feature">${svg(space+`<circle cx="450" cy="450" r="13" fill="${C.pink}"/>`)}</div><div class="caution">Spiral ≠ Fibonacci</div><div class="categories mono">SHELLS · STORMS · GALAXIES</div>`,
 css:`@S .headline{font-size:104px} @S .galaxy{left:110px;top:560px;width:860px;height:760px} @S .caution{position:absolute;left:108px;top:1300px;font-size:71px;font-weight:500;color:${C.pink}} @S .categories{position:absolute;left:108px;top:1400px;font-size:26px}`,
 animate:`tl.fromTo(q('.galaxy'),{scale:.9,opacity:0,rotation:-12},{scale:1,opacity:1,rotation:0,duration:2.8,ease:'power2.out'},.1);tl.fromTo(qa('.cosmic-arm'),{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:2.2,stagger:.2},.4);tl.fromTo(q('.caution'),{opacity:0,y:22},{opacity:1,y:0,duration:.7},2.5);tl.fromTo(q('.categories'),{opacity:0},{opacity:1,duration:.6},3.2);`,foot:'LOGARITHMIC SPIRALS / ILLUSTRATION, NOT DATA'});

frame(6,{kicker:'CURIOSITY IS THE POINT',title:'A pattern.<br>Not a law<br>of everything.',
 body:`<div class="small-flower feature">${svg(sunflower({petals:false,count:377}))}</div><div class="takeaway"><span>Look closely.</span><span>Count.</span><span>Ask why.</span></div><div class="sources mono">READ MORE<br>SWINTON & OCHU / 2016<br>KUHLEMEIER / 2017 · NASA / APOD</div>`,
 css:`@S .headline{font-size:107px} @S .small-flower{left:555px;top:800px;width:460px;height:460px} @S .takeaway{position:absolute;left:108px;top:785px;font-size:78px;line-height:1.35;font-weight:500} @S .takeaway span{display:block} @S .sources{position:absolute;left:108px;top:1284px;font-size:22px;line-height:1.65}`,
 animate:`tl.fromTo(q('.small-flower'),{scale:.9,opacity:0},{scale:1,opacity:1,duration:1.3},.5);tl.fromTo(qa('.takeaway span'),{opacity:0,y:18},{opacity:1,y:0,duration:.5,stagger:.55},${Math.max(3,timing.scenes[5].duration-4.2)});tl.fromTo(q('.sources'),{opacity:0},{opacity:1,duration:.5},1.8);`,foot:'SOME LIVING SYSTEMS / NEVER A UNIVERSAL CLAIM'});

const descriptions=[
 'Open on a growing sunflower seedhead and a Fibonacci number line.',
 'Reveal the additive sequence, then construct seven Fibonacci squares.',
 'Trace two illustrative parastichy paths across a schematic seedhead.',
 'Reveal a golden-angle construction and successive growth points.',
 'Draw a schematic galaxy; distinguish spiral geometry from a Fibonacci claim.',
 'Return to botanical geometry with a clear limit on the claim and an invitation to observe.'
];
out('STORYBOARD.md',`---\nformat: 1080x1920\nduration: ${timing.duration}s\nmessage: Fibonacci recurs in some plant patterns; a spiral alone is not proof.\narc: Curiosity → Rule → Plants → Spacing → Cosmos → Evidence\naudience: Curious general viewers\nmode: autonomous\n---\n\n`+timing.scenes.map((s,i)=>`## Frame ${i+1} — ${s.title}\n\n- status: animated\n- src: compositions/frames/${s.id}.html\n- duration: ${s.duration}s\n- poster: ${Math.min(3,s.duration/2)}s\n- transition_in: cut\n- scene: ${descriptions[i]}\n- voiceover: "${s.text}"\n\n${descriptions[i]} All artwork remains editable.\n`).join('\n'));
out('SCRIPT.md','# Narration\n\nEnglish · Kokoro af_heart · restrained, curious delivery.\n\n'+timing.scenes.map((s,i)=>`## Frame ${i+1}\n\n${s.text}\n`).join('\n'));
console.log(`Built six editable scenes; ${timing.duration}s at 1080×1920.`);
