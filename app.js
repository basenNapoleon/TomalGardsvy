(()=>{
const $=id=>document.getElementById(id),cv=$('yard'),ctx=cv.getContext('2d');
let W=800,H=500,S=6,zoom=1,panX=0,panY=0,zOff=0;
const CEN={x:69,y:32},CLOCK=2;
let seed=7;const srnd=()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const rnd=Math.random,pick=a=>a[rnd()*a.length|0];
const col=(c,f)=>`rgb(${Math.min(255,c[0]*f|0)},${Math.min(255,c[1]*f|0)},${Math.min(255,c[2]*f|0)})`;
function P(x,y,z=0){const s=S*zoom;return[W/2+panX+((x+y)-(CEN.x+CEN.y))*s,H/2+panY+((y-x)-(CEN.y-CEN.x))*s*.5-(z+zOff)*s]}
function poly(pts,fill,stroke,lw){ctx.beginPath();for(let i=0;i<pts.length;i++)i?ctx.lineTo(pts[i][0],pts[i][1]):ctx.moveTo(pts[i][0],pts[i][1]);ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=.6;ctx.stroke()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke()}}
const wp=a=>a.map(p=>P(p[0],p[1],p[2]||0));

/* ---------- gården ---------- */
const OFF=[236,236,232],BRN=[112,84,72],RED=[170,80,54],DBR=[92,68,58],ROOF=[44,44,48],LG=[178,180,182],SOCK=[214,208,196],DK=[54,52,54],LT=[150,152,154],WD='#e6e7e8',GD='#3d4248',SK=-.12,HK=.2;
const B=[
 {k:'b3',n:'',x:32.6,y:6,w:4.3,d:12.1,h:2.8,wall:OFF,roof:[56,58,62],win:1,txt:''},
 {k:'prod',n:'Produktionen',x:36.9,y:6,w:7.6,d:12.1,h:4.6,wall:[190,94,60],roof:[58,56,58],sock:1,lab:1,txt:'Produktionen.'},
 {k:'prod',n:'Produktionen',x:44.5,y:6,w:9.5,d:12.1,h:4.6,wall:[190,94,60],roof:[58,56,58],sock:1,txt:'Produktionen.'},
 {k:'b4',n:'',x:32.1,y:18.2,w:12.3,d:8.4,h:3.6,wall:[120,84,70],roof:LG,txt:''},
 {k:'lagern',n:'Lager',x:54,y:6.2,w:8.5,d:11.3,h:4.8,wall:BRN,roof:LG,sock:1,lab:1,txt:'Lager.'},
 {k:'lagern',n:'Lager',x:62.5,y:6.2,w:8.7,d:11.3,h:5.8,wall:DBR,roof:[72,62,58],sock:1,txt:'Lager.'},
 {k:'slut',n:'Slutmontering',x:71.2,y:6.75,w:9,d:12.25,h:5.8,wall:DBR,roof:[72,62,58],sock:1,lab:1,txt:'Maskinerna slutmonteras här innan provning.'},
 {k:'svets',n:'Svets',x:54,y:17.5,w:8.5,d:9,h:4.6,wall:BRN,roof:LG,sock:1,lab:1,doors:[{s:57.5,n:6,c:GD}],txt:'Plåtleveranser lossas utanför och körs in genom Port 6.'},
 {k:'gods',n:'Godsmottagning',x:62.5,y:17.5,w:8.7,d:9,h:4.6,wall:BRN,roof:LG,sock:1,lab:1,doors:[{s:64.5,n:5,c:GD},{s:69,n:4,c:GD}],txt:'Alla paket- och fraktbilar kommer hit och lossas vid Port 5.'},
 {k:'prov',n:'Provning',x:71.2,y:19,w:9,d:7.5,h:5.6,wall:DBR,roof:[72,62,58],sock:1,lab:1,doors:[{s:76,n:3,c:GD}],txt:'Färdiga maskiner testas här och körs sedan med truck till packavdelningen.'},
 {k:'lagers',n:'Lager',x:44.4,y:18.2,w:9.6,d:8.6,h:3,wall:OFF,roof:LG,win:1,lab:1,txt:'Lager intill svetsen.'},
 {k:'kontor',n:'Kontor',x:23.5,y:27,w:8.5,d:5,h:3.2,g:3,wall:OFF,roof:ROOF,win:1,lab:1,txt:'Tjänstemännen sitter här.'},
 {k:'kok',n:'Kök',x:40.5,y:26.9,w:2.1,d:2.4,h:2.6,wall:OFF,roof:[60,62,66],txt:'Köket, inklämt mellan matsalen och hallen bakom.'},
 {k:'matsal',n:'Matsal',x:42.6,y:26.9,w:5.9,d:5.5,h:2.6,g:1.3,shed:1,gy:1,wall:OFF,roof:ROOF,win:1,lab:1,txt:'Matsalen. Uteplatsen framför används när vädret tillåter.'},
 {k:'kontor',n:'Kontor',x:33.9,y:27.9,w:5,d:2.6,h:2.6,g:.8,a:.7,wall:OFF,roof:[150,158,164],win:1,txt:'Kontor.'},
 {k:'kontor',n:'Kontor',x:32.2,y:30.6,w:2.6,d:2.6,h:2.6,g:1.4,wall:OFF,roof:ROOF,win:1,txt:'Kontor.'},
 {k:'entre',n:'Ingång',x:34.8,y:31.5,w:2.5,d:4,h:2.6,g:1.5,gy:1,wall:OFF,roof:ROOF,win:1,txt:'Ingången för besökare.'},
 {k:'entre',n:'Ingång',x:35.4,y:35.5,w:1.4,d:1.2,h:1.8,wall:[176,204,216],roof:OFF,txt:'Ingången för besökare.'},
 {k:'kontor',n:'Kontor',lx:4,x:37.5,y:33.3,w:12,d:5.5,h:4.2,g:3.4,a:SK,wall:OFF,roof:ROOF,win:2,lab:1,txt:'Tjänstemännen sitter här. Gästingång på västra sidan, gästparkering framför.'},
 {k:'pack',n:'Packavdelning',x:68,y:40,w:24,d:13,h:4.4,g:2.8,a:HK,wall:BRN,roof:DK,sock:1,lab:1,doors:[{w:43.5,n:1,k:1.5,z:3.3,c:WD},{w:49.5,n:2,k:1.5,z:3.3,c:WD}],txt:'Maskiner packas för frakt. Truckarna kör in via Port 1, kundlastbilar lastas från Port 2. Lager i östra delen.'},
 {k:'silo',n:'Silohall',x:64.75,y:57.5,w:24.5,d:9,h:7.6,g:.8,a:HK,wall:[82,88,96],roof:[58,63,70],lab:1,sign:1,doors:[{w:59.8,n:9,k:1.7,z:4.2,c:'#c5c9cd'},{w:64.2,n:10,k:1.7,z:4.2,c:'#c5c9cd'}],txt:'Silos upp till 30 m kommer in via Port 10 för elinstallation och isolering, sedan vidare till kund.'}
];
B.forEach(b=>{b.cx=b.x+b.w/2;b.cy=b.y+b.d/2;b.ca=Math.cos(b.a||0);b.sa=Math.sin(b.a||0)});
const R=(b,x,y)=>{const dx=x-b.cx,dy=y-b.cy;return[b.cx+dx*b.ca-dy*b.sa,b.cy+dx*b.sa+dy*b.ca]};
const BY=k=>B.find(b=>b.k===k);
function port(k,n){const b=BY(k),d=b.doors.find(d=>d.n===n);let f,i;if(d.s!=null){f=R(b,d.s,b.y+b.d+3.3);i=R(b,d.s,b.y+b.d-3)}else{f=R(b,b.x-3.4,d.w);i=R(b,b.x+2.8,d.w)}return{x:f[0],y:f[1],ix:i[0],iy:i[1]}}
const inB=(x,y,m=0)=>B.some(b=>{const dx=x-b.cx,dy=y-b.cy;return Math.abs(dx*b.ca+dy*b.sa)<b.w/2+m&&Math.abs(-dx*b.sa+dy*b.ca)<b.d/2+m});
const ROAD=[[-60,-36],[0,15],[10,23.5],[27.5,37.5],[39,45],[47,50],[65,70],[80,93],[140,185]];
function ribbon(pts,w){const L=[],R=[];for(let i=0;i<pts.length;i++){const a=pts[Math.max(0,i-1)],b=pts[Math.min(pts.length-1,i+1)],d=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/d*w,ny=(b[0]-a[0])/d*w;L.push([pts[i][0]+nx,pts[i][1]+ny]);R.unshift([pts[i][0]-nx,pts[i][1]-ny])}return L.concat(R)}
const fEdge=x=>x<24?10.5:x<81?5:12;
const TREES=[];for(let i=0;i<900;i++){const x=-70+srnd()*230,y=-70+srnd()*84;if(y<fEdge(x)-1)TREES.push([x,y,1.2+srnd()*1.1,srnd()])}
TREES.sort((a,b)=>(a[1]-a[0])-(b[1]-b[0]));
const SLOTS=[],RIN=[[0,15],[27.5,37.5],[39,45]];
const PAD=[84.5,14.5,98,35],PADZ=1.2;
function groundZ(x,y){if(x>PAD[0]-.1&&x<PAD[2]+.1&&y>PAD[1]-.1&&y<PAD[3]+.05)return PADZ;if(x>85.9&&x<92.1&&y>=PAD[3]&&y<39.5)return PADZ*(39.5-y)/4.5;return 0}
{const NE=RIN.concat([[45.5,48.3],[51,46.3],[58,42.5],[70,33.8],[77,34.2],[83,38.8],[89,40.3],[89,34],[90.5,31]]);
 for(let r=0;r<2;r++)for(let i=0;i<9;i++){const x=r?94:87,y=16.5+2*i;SLOTS.push({x,y,a:0,path:NE.concat([[90.5,y],[x,y]])})}
const dx=.546,dy=.838,SE=RIN.concat([[47,50],[65,70]]);
 for(let r=0;r<2;r++)for(let i=0;i<8;i++){const x=75+1.75*i,y=r?75.5:71.5;SLOTS.push({x,y,a:Math.PI/2,path:SE.concat([[68.9,76],[72.3,74],[x,73.5],[x,y]])})}
 for(let i=0;i<11;i++){if(i===2||i===3)continue;const t=2+2.1*i;SLOTS.push({x:65+dx*t+2.5,y:70+dy*t-1.64,a:Math.atan2(dy,dx)+Math.PI/2,path:SE.concat([[65+dx*t,70+dy*t],[65+dx*t+2.5,70+dy*t-1.64]])})}}
const GUEST=[[45,40.6],[47,40.6],[49,40.6]];
const TAGS=[['Gästparkering',48,43],['Parkering',90.5,31],['Parkering',81.5,73.5],['Används ej',20.5,20],['Ingång',36.2,38.4]];
const GOODS=[[72.5,36.6,'cyl',0,1.1,1.9],[74.6,37.1,'cyl',0,1.2,2.2],[76.6,37.8,'cyl',0,.9,1.7],[70.6,36.2,'cyl',0,.7,1.3],[81.6,23,'cont',1.57],[28.1,8.6,'cyl',0,1,6.5,[46,110,196]],[26.5,10.1,'cyl',0,.75,4,[226,228,230]],[18.2,16,'cont',0],[18.2,17.8,'cont',0],[18.2,19.6,'cont',0],[17.2,24.2,'cont',0],[21.5,26.5,'cont',1.57],[63.3,59,'stallning',.2],[63,57.3,'pall',.4],[64.5,55.2,'stallning',.2],[66.9,43.8,'stallning',1.77]];for(let i=0;i<6;i++)GOODS.push([96.4+srnd()*.9,17+i*2.4+srnd()*.5,srnd()<.5?'lada':'pall',srnd()*.4]);

/* ---------- ritprimitiver ---------- */
function obox(x,y,L,Wd,z0,z1,a,c){const co=Math.cos(a),si=Math.sin(a),h=[[L/2,Wd/2],[L/2,-Wd/2],[-L/2,-Wd/2],[-L/2,Wd/2]].map(p=>[x+p[0]*co-p[1]*si,y+p[0]*si+p[1]*co]),N=[[co,si],[si,-co],[-co,-si],[-si,co]];
 for(let i=0;i<4;i++){const n=N[i];if(n[1]-n[0]<=0)continue;const p=h[i],q=h[(i+1)%4];poly([P(p[0],p[1],z0),P(q[0],q[1],z0),P(q[0],q[1],z1),P(p[0],p[1],z1)],col(c,.78+.08*(n[0]+n[1])))}
 poly(h.map(p=>P(p[0],p[1],z1)),col(c,1));return h}
const off=(x,y,a,dx,dy=0)=>[x+dx*Math.cos(a)-dy*Math.sin(a),y+dx*Math.sin(a)+dy*Math.cos(a)];
function vcyl(x,y,z,r,h,c){const s=S*zoom,b=P(x,y,z),t=P(x,y,z+h),rx=r*1.3*s,ry=rx/2,g=ctx.createLinearGradient(b[0]-rx,0,b[0]+rx,0);g.addColorStop(0,col(c,.7));g.addColorStop(.45,col(c,1.05));g.addColorStop(1,col(c,.8));
 ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(b[0],b[1],rx,ry,0,0,Math.PI);ctx.lineTo(t[0]-rx,t[1]);ctx.lineTo(t[0]+rx,t[1]);ctx.closePath();ctx.fill();ctx.fillStyle=col(c,1.08);ctx.beginPath();ctx.ellipse(t[0],t[1],rx,ry,0,0,7);ctx.fill()}
function hcyl(a,b,z,r,c,band){const s=S*zoom,A=P(a[0],a[1],z),Bp=P(b[0],b[1],z),ang=Math.atan2(Bp[1]-A[1],Bp[0]-A[0]),wd=2*r*s;
 ctx.lineCap='butt';ctx.strokeStyle=col(c,.8);ctx.lineWidth=wd;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(Bp[0],Bp[1]);ctx.stroke();
 ctx.strokeStyle=col(c,1.06);ctx.lineWidth=wd*.42;ctx.beginPath();ctx.moveTo(A[0],A[1]-wd*.2);ctx.lineTo(Bp[0],Bp[1]-wd*.2);ctx.stroke();
 if(band){ctx.strokeStyle=col(band,1);ctx.lineWidth=wd;for(const t of[.18,.5,.82]){const mx=A[0]+(Bp[0]-A[0])*t,my=A[1]+(Bp[1]-A[1])*t,l=.5*s;ctx.beginPath();ctx.moveTo(mx-Math.cos(ang)*l,my-Math.sin(ang)*l);ctx.lineTo(mx+Math.cos(ang)*l,my+Math.sin(ang)*l);ctx.stroke()}}
 const near=(a[1]-a[0])>(b[1]-b[0])?A:Bp;ctx.fillStyle=col(c,.92);ctx.beginPath();ctx.ellipse(near[0],near[1],wd*.24,wd*.5,ang,0,7);ctx.fill()}
function cargo(t,x,y,a,z){
 if(t==='pall'){obox(x,y,1.1,1.1,z,z+.15,a,[150,118,78]);obox(x,y,1,1,z+.15,z+1,a,[198,163,112])}
 else if(t==='plat'){obox(x,y,1.2,2.7,z,z+.12,a,[150,118,78]);obox(x,y,1.1,2.6,z+.12,z+.42,a,[158,168,178])}
 else if(t==='cont'){obox(x,y,3.2,1.4,z,z+1.5,a,[30,92,172])}
 else if(t==='lada'){obox(x,y,1.5,1.3,z,z+1.3,a,[216,188,142])}
 else if(t==='skid'){obox(x,y,1.9,1.2,z,z+.2,a,[92,97,104]);let p=off(x,y,a,-.3);obox(p[0],p[1],1,.9,z+.2,z+1.25,a,[38,108,170]);p=off(x,y,a,.6);obox(p[0],p[1],.5,.7,z+.2,z+.9,a,[205,210,214])}
 else if(t==='tank'){obox(x,y,1.5,1.5,z,z+.15,a,[92,97,104]);vcyl(x,y,z+.15,.6,1.8,[226,231,236])}
 else{const h=obox(x,y,1.7,1.2,z,z+.12,a,[170,178,186]);ctx.strokeStyle='#aab3bd';ctx.lineWidth=Math.max(1,.12*S*zoom);ctx.beginPath();for(const p of h){const q=P(p[0],p[1],z+.12),r=P(p[0],p[1],z+1.9);ctx.moveTo(q[0],q[1]);ctx.lineTo(r[0],r[1])}ctx.stroke();poly(h.map(p=>P(p[0],p[1],z+1)),null,'#aab3bd',ctx.lineWidth);poly(h.map(p=>P(p[0],p[1],z+1.9)),null,'#c3cbd3',ctx.lineWidth)}
}
const CNAME={pall:'kolli',plat:'plåtbunt',lada:'packad maskin',skid:'skid',tank:'tank',stallning:'ställning'};

function drawB(b){const x=b.x,y=b.y,x1=x+b.w,y1=y+b.d,h=b.h,ym=y+b.d/2,xm=x+b.w/2,r=b.g||0,gy=b.gy;b.polys=[];const T=a=>a.map(p=>{const q=R(b,p[0],p[1]);return P(q[0],q[1],p[2]||0)});
 const west=b.shed?[[x,y,0],[x,y1,0],[x,y1,h],[x,y,h]]:r&&!gy?[[x,y,0],[x,y1,0],[x,y1,h],[x,ym,h+r],[x,y,h]]:[[x,y,0],[x,y1,0],[x,y1,h],[x,y,h]];
 const south=b.shed?[[x,y1,0],[x1,y1,0],[x1,y1,h+r],[x,y1,h]]:r&&gy?[[x,y1,0],[x1,y1,0],[x1,y1,h],[xm,y1,h+r],[x,y1,h]]:[[x,y1,0],[x1,y1,0],[x1,y1,h],[x,y1,h]];
 let p=T(west);poly(p,col(b.wall,.72));b.polys.push(p);p=T(south);poly(p,col(b.wall,.88));b.polys.push(p);
 if(b.sock){poly(T([[x,y,0],[x,y1,0],[x,y1,.9],[x,y,.9]]),col(SOCK,.76));poly(T([[x,y1,0],[x1,y1,0],[x1,y1,.9],[x,y1,.9]]),col(SOCK,.92))}
 for(let i=0;i<(b.win||0);i++){const z=1.1+i*2;poly(T([[x+.6,y1,z],[x1-.6,y1,z],[x1-.6,y1,z+.9],[x+.6,y1,z+.9]]),'#5d7f99');poly(T([[x,y+.6,z],[x,y1-.6,z],[x,y1-.6,z+.9],[x,y+.6,z+.9]]),'#4b6a82')}
 for(const d of b.doors||[]){const k=d.k||1.3,z=d.z||3;if(d.s!=null)poly(T([[d.s-k,y1,0],[d.s+k,y1,0],[d.s+k,y1,z],[d.s-k,y1,z]]),d.c);else poly(T([[x,d.w-k,0],[x,d.w+k,0],[x,d.w+k,z],[x,d.w-k,z]]),d.c)}
 if(b.sign)poly(T([[x,ym-1.8,h-1.7],[x,ym+1.8,h-1.7],[x,ym+1.8,h-.6],[x,ym-1.8,h-.6]]),'#f2f4f6');
 if(b.shed){p=T([[x,y,h],[x1,y,h+r],[x1,y1,h+r],[x,y1,h]]);poly(p,col(b.roof,.92));b.polys.push(p)}
 else if(r&&gy){poly(T([[x1,y,h],[x1,y1,h],[xm,y1,h+r],[xm,y,h+r]]),col(b.roof,.8));p=T([[x,y,h],[x,y1,h],[xm,y1,h+r],[xm,y,h+r]]);poly(p,col(b.roof,1));b.polys.push(p)}
 else if(r){poly(T([[x,y,h],[x1,y,h],[x1,ym,h+r],[x,ym,h+r]]),col(b.roof,.82));p=T([[x,y1,h],[x1,y1,h],[x1,ym,h+r],[x,ym,h+r]]);poly(p,col(b.roof,1));b.polys.push(p)}
 else{p=T([[x,y,h],[x1,y,h],[x1,y1,h],[x,y1,h]]);poly(p,col(b.roof,1));b.polys.push(p)}
 if(sel&&sel.b===b)poly(p,null,'#ff8a3c',3)}

/* ---------- fordon ---------- */
function drawV(v){const a=v.ang,x=v.x,y=v.y,parts=[];const add=(p,f)=>parts.push([p[1]-p[0],f]);
 const sh=P(x,y),s=S*zoom;ctx.fillStyle='rgba(20,25,30,.2)';ctx.beginPath();ctx.ellipse(sh[0],sh[1],(v.kind==='truck'?4.2:v.kind==='combine'?3:1.6)*s,(v.kind==='truck'?2:v.kind==='combine'?1.5:.8)*s,0,0,7);ctx.fill();
 if(v.kind==='fork'){add([x,y],()=>{obox(x,y,1.7,1.15,.25,1.15,a,[236,124,26]);const g=off(x,y,a,-.15);obox(g[0],g[1],1,1,1.9,2,a,[52,57,63])});
  const m=off(x,y,a,.95);add(m,()=>obox(m[0],m[1],.16,1,0,2.3,a,[58,63,69]));if(v.cargo){const c=off(x,y,a,1.9);add(c,()=>cargo(v.cargo,c[0],c[1],a,.3))}}
 else if(v.kind==='car'){add([x,y],()=>{obox(x,y,2.5,1.15,.2,.75,a,v.col);const c=off(x,y,a,-.15);obox(c[0],c[1],1.3,1,.75,1.2,a,[58,68,80])})}
 else if(v.kind==='van'){const b=off(x,y,a,-.35),c=off(x,y,a,1.35);add(b,()=>obox(b[0],b[1],2.5,1.45,.25,1.95,a,v.col));add(c,()=>obox(c[0],c[1],.9,1.4,.25,1.5,a,[v.col[0]*.85,v.col[1]*.85,v.col[2]*.85]))}
 else if(v.kind==='truck'){const c=off(x,y,a,3.1),b=off(x,y,a,-.7);add(c,()=>obox(c[0],c[1],1.5,1.6,.3,2.3,a,v.col));add(b,()=>{obox(b[0],b[1],6,1.6,.7,.95,a,[72,77,83]);for(let i=0;i<v.load;i++){const q=off(x,y,a,1.3-i*1.9);cargo(v.ctype,q[0],q[1],a,.95)}})}
 else if(v.kind==='combine'){const G=[62,128,58],h=off(x,y,a,2.7),c=off(x,y,a,1.1),t=off(x,y,a,-.9);
  add(h,()=>{obox(h[0],h[1],.9,4.4,.3,.95,a,[214,178,48])});
  add([x,y],()=>{obox(x,y,4,2.2,.4,2.1,a,G);obox(t[0],t[1],1.7,1.9,2.1,2.9,a,G);const u=off(x,y,a,-.6,1.6);obox(u[0],u[1],.35,1.9,2.6,2.8,a,[90,96,100])});
  add(c,()=>obox(c[0],c[1],1.2,1.4,2.1,3.2,a,[150,190,205]))}
 parts.sort((p,q)=>p[0]-q[0]).forEach(p=>p[1]());v.sx=sh[0];v.sy=sh[1]-s*.8}
function behind(v,D){let px=v.x,py=v.y,acc=0;for(let i=v.trail.length-1;i>=0;i--){const q=v.trail[i],d=Math.hypot(px-q[0],py-q[1]);if(acc+d>=D){const t=(D-acc)/(d||1);return[px+(q[0]-px)*t,py+(q[1]-py)*t]}acc+=d;px=q[0];py=q[1]}return[px,py]}
function seedTrail(v,a){v.trail=[];for(let i=60;i>=1;i--)v.trail.push([v.x-Math.cos(a)*i*.4,v.y-Math.sin(a)*i*.4])}
function rigParts(v,D){const f=behind(v,1.6),r=behind(v,17.6);let a=null,b=null;for(let i=0;i<=24;i++){const t=i/24,p=[f[0]+(r[0]-f[0])*t,f[1]+(r[1]-f[1])*t];if(!inB(p[0],p[1])){if(!a)a=p;b=p}}
 if(!inB(v.x,v.y)){D.push({k:v.y-v.x,f:()=>{obox(v.x,v.y,2.2,1.6,.3,2.4,v.ang,v.col);const p=P(v.x,v.y);v.sx=p[0];v.sy=p[1]-S*zoom}})}else v.sx=-999;
 if(a&&b&&Math.hypot(a[0]-b[0],a[1]-b[1])>.3){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,L=Math.hypot(a[0]-b[0],a[1]-b[1]),an=Math.atan2(a[1]-b[1],a[0]-b[0]);
  D.push({k:my-mx+.01,f:()=>{obox(mx,my,L,1.5,.7,.95,an,[72,77,83]);if(v.loaded){const fin=v.loaded==='klar';hcyl(a,b,2.1,1.15,fin?[236,239,242]:[168,176,184],fin?[38,108,170]:null)}}})}}

/* ---------- rörelse ---------- */
function mkPath(pts){for(let k=0;k<2;k++){const o=[pts[0]];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];if(i>0)o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25]);if(i<pts.length-2)o.push([a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}o.push(pts[pts.length-1]);pts=o}
 const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]));
 return{len:L[L.length-1],at(s){s=Math.max(0,Math.min(this.len,s));let i=1;while(i<L.length-1&&L[i]<s)i++;const a=pts[i-1],b=pts[i],t=(s-L[i-1])/((L[i]-L[i-1])||1);return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,Math.atan2(b[1]-a[1],b[0]-a[0])]}}}
function stepV(v,dt){let g=0;while(v.q.length&&g++<30){const a=v.q[0];
  if(a.t==='call'){v.q.shift();a.fn();continue}
  if(a.t==='wait'){a.m-=dt*CLOCK;if(a.m<=0){v.q.shift();dt=0;continue}break}
  if(!a.path){a.path=mkPath([[v.x,v.y]].concat(a.pts));a.s=0}
  if(v.hold)break;a.s+=v.sp*dt;const p=a.path.at(a.s),ln=(v.lane||0)*Math.max(0,Math.min(1,a.s/4,(a.path.len-a.s)/4));v.x=p[0]-Math.sin(p[2])*ln;v.y=p[1]+Math.cos(p[2])*ln;if(a.path.len>.05)v.ta=p[2];
  if(a.s>=a.path.len){v.q.shift();dt=0;continue}break}
 let d=v.ta-v.ang;d=Math.atan2(Math.sin(d),Math.cos(d));v.ang+=d*Math.min(1,dt*7+(dt?0:0));
 if(v.trail){const t=v.trail,l=t[t.length-1];if(Math.hypot(v.x-l[0],v.y-l[1])>.4){t.push([v.x,v.y]);if(t.length>90)t.shift()}}}
const go=(v,pts)=>v.q.push({t:'go',pts}),wait=(v,m)=>v.q.push({t:'wait',m}),call=(v,fn)=>v.q.push({t:'call',fn});

/* ---------- simulering ---------- */
let clock=445,speed=1,vehicles=[],forks=[],jobs=[],sched=[],cars=[],sel=null,rigBusy=false,idn=0;
let stat={inn:0,pack:0,out:0},hall8=2,packStock=3;
const P4=port('svets',6),P5=port('gods',5),P6=port('prov',3),P7=port('pack',1),P7B=port('pack',2),HUB=[64,36];
const SPOTS=[{x:62,y:31},{x:60.5,y:34.5},{x:63.5,y:34.8}],TS4={x:58,y:32.2},TS7={x:61.5,y:47.5};
const START=[-14,3.1],IN=RIN.concat([[45.5,48.3],[50.5,46.5]]),OUT=[[45.5,48.3],[39,45],[27.5,37.5],[0,15],START];
const COUR=[{n:'DHL',c:[244,196,48]},{n:'PostNord',c:[40,150,214]},{n:'UPS',c:[98,70,48]},{n:'FedEx',c:[236,236,240]},{n:'Schenker',c:[214,60,50]},{n:'DSV',c:[30,52,110]}];
const CARCOL=[[190,40,40],[230,232,235],[60,66,74],[150,156,162],[40,80,140],[210,214,218],[30,34,40],[120,40,40]];
const hhmm=m=>{m=((m%1440)+1440)%1440;return String(m/60|0).padStart(2,'0')+':'+String(m%60|0).padStart(2,'0')};
const ex=()=>'EX-'+(1000+rnd()*9000|0);
function log(t){const li=document.createElement('li');li.innerHTML=`<time>${hhmm(clock)}</time><span></span>`;li.lastChild.textContent=t;const l=$('log');l.prepend(li);while(l.children.length>40)l.lastChild.remove()}
const LANE={car:.9,van:.9,truck:.9,rig:.5},RAD={fork:1.3,car:1.4,van:1.9,truck:3.8,rig:1.6},PRI={fork:1,car:2,van:3,truck:4,rig:5};let mv=[];
const pri=v=>PRI[v.kind]*1e4+(+String(v.id).replace('T',''));
function yields(a,dt){if(a.pass>0){a.pass-=dt;return false}const ax=Math.cos(a.ta),ay=Math.sin(a.ta);for(const o of mv){if(o.v===a)continue;const dx=o.x-a.x,dy=o.y-a.y,d=Math.hypot(dx,dy);if(d<.01&&o.cab){if(pri(a)<pri(o.v))return true;continue}if(d>RAD[a.kind]+o.r+1.2||d<.01||(dx*ax+dy*ay)/d<.5)continue;
  const b=o.v;if(o.cab&&(-dx*Math.cos(b.ta)-dy*Math.sin(b.ta))/d>.5&&pri(a)>pri(b))continue;a.held=(a.held||0)+dt;if(a.held>8){a.held=0;a.pass=3;return false}return true}a.held=0;return false}
function traffic(dt){mv=[];const all=forks.concat(vehicles),on=v=>v.q[0]&&v.q[0].t==='go'&&!inB(v.x,v.y);for(const v of all)if(on(v)){mv.push({x:v.x,y:v.y,r:RAD[v.kind],v,cab:1});if(v.kind==='rig')for(const d of[4.5,9,13.5,17]){const p=behind(v,d);if(!inB(p[0],p[1]))mv.push({x:p[0],y:p[1],r:2,v})}}
 for(const v of all)v.hold=on(v)&&yields(v,dt)}
function mkV(kind,o){const v=Object.assign({kind,lane:LANE[kind],id:++idn,x:START[0],y:START[1],ang:.6,ta:.6,q:[],sp:7,order:ex()},o);vehicles.push(v);return v}
const kill=v=>{vehicles=vehicles.filter(u=>u!==v);if(sel&&sel.v===v){sel=null;info()}};
const later=(fn,m)=>{sched.push({t:clock+m,fn});sched.sort((a,b)=>a.t-b.t)};
function blocked(x0,y0,x1,y1){for(let i=1;i<20;i++){const t=i/20;if(inB(x0+(x1-x0)*t,y0+(y1-y0)*t,.9))return true}return false}
function route(f,tx,ty){const pts=[];if(blocked(f._px,f._py,tx,ty))pts.push(HUB);pts.push([tx,ty]);go(f,pts);f._px=tx;f._py=ty}
function assign(f,j){f.busy=true;f.q=[];f._px=f.x;f._py=f.y;f.status='Hämtar '+j.what;f.order=j.order||'–';
 route(f,j.from.x,j.from.y);if(j.from.ix!=null)go(f,[[j.from.ix,j.from.iy]]);wait(f,1.2);
 call(f,()=>{f.cargo=j.cargo;f.status=j.desc;j.onPick&&j.onPick()});if(j.from.ix!=null)go(f,[[j.from.x,j.from.y]]);
 route(f,j.to.x,j.to.y);if(j.to.ix!=null)go(f,[[j.to.ix,j.to.iy]]);wait(f,1.2);
 call(f,()=>{f.cargo=null;f.status='Ledig';f.order='–';j.onDrop&&j.onDrop()});if(j.to.ix!=null)go(f,[[j.to.x,j.to.y]]);
 call(f,()=>{f.busy=false;f._px=f.x;f._py=f.y;route(f,f.hx,f.hy)})}
function setForks(n){while(forks.length<n){const i=forks.length;forks.push({kind:'fork',id:'T'+(i+1),name:'Truck T'+(i+1),x:67+1.8*i,y:29.6,hx:67+1.8*i,hy:29.6,ang:Math.PI,ta:Math.PI,q:[],sp:5,lane:.6,status:'Ledig',order:'–',cargo:null,busy:false})}
 forks.forEach((f,i)=>f.retire=i>=n)}
function spawnVan(){const sp=SPOTS.find(s=>!s.busy);if(!sp){later(spawnVan,15);return}sp.busy=true;const c=pick(COUR),n=1+(rnd()*3|0);
 const v=mkV('van',{name:'Paketbil '+c.n,col:c.c,sp:8,status:'På väg till godsmottagningen, Port 5',what:n+' kolli'});
 go(v,IN.concat([[55,41],[sp.x-3,sp.y+1.5],[sp.x,sp.y]]));
 call(v,()=>{v.status='Lossar vid Port 5';v.left=n;log(c.n+' lossar '+n+' kolli vid Port 5');
  for(let i=0;i<n;i++)jobs.push({from:{x:sp.x-3.4,y:sp.y+.9},to:P5,cargo:'pall',what:'kolli från '+c.n,desc:'Kör in kolli via Port 5',order:v.order,onDrop:()=>{stat.inn++;if(--v.left===0){v.status='Lämnar gården';sp.busy=false;go(v,[[sp.x+3,sp.y+2.5],[60,41.5],[52.5,46.5]].concat(OUT));call(v,()=>kill(v))}}})})}
function spawnPlat(){if(TS4.busy){later(spawnPlat,25);return}TS4.busy=true;const n=2+(rnd()*2|0);
 const v=mkV('truck',{name:'Lastbil plåtleverans',col:[52,96,150],sp:6,load:n,ctype:'plat',status:'På väg till svetsen, Port 6',what:n+' plåtbuntar'});
 go(v,IN.concat([[54.5,41],[56.5,36.5],[TS4.x,TS4.y]]));
 call(v,()=>{v.status='Lossar plåt vid Port 6';v.left=n;log('Plåtleverans lossar '+n+' buntar vid Port 6');
  for(let i=0;i<n;i++)jobs.push({from:{x:TS4.x-3.6,y:TS4.y+2.5},to:P4,cargo:'plat',what:'plåt från lastbil',desc:'Kör in plåt via Port 6',order:v.order,onPick:()=>v.load--,onDrop:()=>{if(--v.left===0){v.status='Lämnar gården';TS4.busy=false;go(v,[[61.5,33],[61,40],[52.5,46.5]].concat(OUT));call(v,()=>kill(v))}}})})}
function spawnOut(){if(TS7.busy){later(spawnOut,30);return}TS7.busy=true;const n=Math.max(1,Math.min(3,packStock));
 const v=mkV('truck',{name:'Lastbil till kund',col:[196,60,44],sp:6,load:0,ctype:'lada',status:'På väg till packavdelningen, Port 2',what:n+' maskiner'});
 go(v,IN.concat([[56,50.5],[60.5,51.6],[TS7.x,TS7.y]]));
 call(v,()=>{v.status='Lastas vid Port 2';v.left=n;log('Kundlastbil lastas med '+n+' maskiner vid Port 2');
  for(let i=0;i<n;i++)jobs.push({from:P7B,to:{x:63.5,y:48.6},cargo:'lada',what:'packad maskin vid Port 2',desc:'Lastar maskin på kundlastbil',order:v.order,onPick:()=>{packStock=Math.max(0,packStock-1)},onDrop:()=>{v.load++;stat.out++;if(--v.left===0){v.status='Kör till kund';TS7.busy=false;log('Kundlastbil lämnar med '+n+' maskiner');go(v,[[62,41],[58,37.5],[54,40],[52.5,46]].concat(OUT));call(v,()=>kill(v))}}})})}
function machineMove(){const c=pick(['stallning','tank','skid']);jobs.push({from:P6,to:P7,cargo:c,what:CNAME[c]+' i provningen',desc:'Kör '+CNAME[c]+' från Port 3 till packavdelningen, Port 1',order:ex(),onPick:()=>log(CNAME[c][0].toUpperCase()+CNAME[c].slice(1)+' provad, körs Port 3 → Port 1'),onDrop:()=>{stat.pack++;packStock++}})}
function silo(inb){if(rigBusy){later(()=>silo(inb),40);return}if(!inb&&hall8<1)return;rigBusy=true;const sb=BY('silo'),F=R(sb,sb.x-5,64.2),E=R(sb,sb.x+21.75,64.2),X=R(sb,sb.x+1.75,64.2);
 const v=mkV('rig',{name:inb?'Silotransport in':'Silotransport ut',col:[30,110,90],sp:4.5,loaded:inb?'ra':null,status:'På väg till silohallen, Port 10',what:inb?'Silo 30 m, obehandlad':'Tom, hämtar färdig silo'});
 seedTrail(v,Math.atan2(.85,1));log(inb?'Silotransport anländer med 30 m silo':'Tom silotransport anländer för hämtning');
 go(v,RIN.concat([[47,50],[53,56.7],[57,59.6],F,E]));
 call(v,()=>{v.status=inb?'Lossar i silohallen':'Lastar färdig silo';if(inb){hall8++;v.loaded=null}});wait(v,35);
 call(v,()=>{if(!inb){hall8--;v.loaded='klar';v.what='Silo 30 m, el och isolering klar';log('Färdig silo lämnar silohallen mot kund')}else log('Silo avlastad i silohallen');v.status='Lämnar gården';v.x=X[0];v.y=X[1];v.ang=v.ta=Math.PI+HK;seedTrail(v,Math.PI+HK)});
 go(v,[F,[57,59.6],[53,56.7],[47,50],[39,45],[27.5,37.5],[0,15],[-45,-23.3]]);call(v,()=>{rigBusy=false;kill(v)})}
let farm=[],stubble=[];
function harvest(){if(farm.length)return;const c0=17+rnd()*5,n=4+(rnd()*3|0),X0=-4,X1=74,W2=3.2;
 const v={kind:'combine',id:'S1',name:'Skördetröska',status:'Tröskar på grannens åker',what:'Spannmål',order:'–',x:-30,y:-30+c0,ang:Math.PI/4,ta:Math.PI/4,q:[],sp:2.6,lane:0,cur:null};farm.push(v);log('Skördetröskan kör ut på åkern');
 go(v,[[X0,X0+c0]]);for(let k=0;k<n;k++){const c=c0+k*W2,fw=k%2===0,xa=fw?X0:X1,xb=fw?X1:X0;
  call(v,()=>{v.cur={c,xa}});go(v,[[xb,xb+c]]);call(v,()=>{stubble.push([c,Math.min(xa,xb),Math.max(xa,xb)]);v.cur=null});
  if(k<n-1){const e=fw?3:-3,cn=c+W2;go(v,[[xb+e,xb+e+c+W2/2],[xb,xb+cn]])}}
 const last=c0+(n-1)*W2;go(v,[[-40,-40+last]]);call(v,()=>{farm=farm.filter(u=>u!==v);v.status='Klar';if(sel&&sel.v===v){sel=null;info()}})}
const NV=()=>+$('nVan').value,NO=()=>+$('nOut').value,NS=()=>+$('nSilo').value;
function buildSchedule(from){sched=[];const add=(t,fn)=>{if(t>from)sched.push({t,fn})};
 for(let i=0;i<NV();i++)add(600+rnd()*300,spawnVan);for(let i=0;i<1+(rnd()<.5);i++)add(600+rnd()*270,spawnPlat);
 for(let i=0;i<NO();i++)add(600+rnd()*300,spawnOut);for(let i=0;i<NS();i++){add(600+rnd()*180,()=>silo(1));add(790+rnd()*110,()=>silo(0))}
 for(let t=430+rnd()*30;t<940;t+=40+rnd()*35)add(t,machineMove);if(rnd()<.85)add(480+rnd()*420,harvest);if(rnd()<.4)add(600+rnd()*360,harvest);sched.sort((a,b)=>a.t-b.t)}
function resetTo(t){clock=t;vehicles=[];farm=[];stubble=[];if(t>540&&t<1000&&rnd()<.5)later(harvest,1);jobs=[];rigBusy=false;sel=null;SPOTS.forEach(s=>s.busy=false);TS4.busy=TS7.busy=false;stat={inn:0,pack:0,out:0};
 forks=[];setForks(+$('nFork').value);cars.forEach(c=>{c.st=t>=c.arr&&t<c.dep?'parked':'away';c.done=t>=c.dep});buildSchedule(t);$('log').innerHTML='';info()}
cars=SLOTS.map(sl=>({sl,col:pick(CARCOL),arr:rnd()<.85?330+(rnd()+rnd()+rnd())/3*120:450+rnd()*90,dep:rnd()<.55?900+(rnd()+rnd())/2*120:780+rnd()*330,st:'away'}));
function stepCars(){for(const c of cars){
  if(c.st==='away'&&!c.done&&clock>=c.arr&&clock<c.dep){c.st='moving';const v=mkV('car',{name:'Personbil',col:c.col,sp:9,status:'Personal på väg in',what:'–',order:'–'});go(v,c.sl.path);call(v,()=>{c.st='parked';kill(v)})}
  else if(c.st==='parked'&&clock>=c.dep){c.st='moving';c.done=true;const v=mkV('car',{name:'Personbil',col:c.col,sp:9,status:'Personal på väg hem',what:'–',order:'–',x:c.sl.x,y:c.sl.y,ang:c.sl.a,ta:c.sl.a});go(v,c.sl.path.slice(0,-1).reverse().concat([START]));call(v,()=>{c.st='away';kill(v)})}}}
function step(dt){const night=(clock>1110||clock<290)&&!vehicles.length&&!farm.length&&!jobs.length;clock+=dt*CLOCK*(night?15:1);
 if(clock>=1440){clock-=1440;stubble=[];stat={inn:0,pack:0,out:0};cars.forEach(c=>c.done=false);buildSchedule(0)}
 while(sched.length&&sched[0].t<=clock)sched.shift().fn();stepCars();
 traffic(dt);for(const f of forks){if(!f.busy&&jobs.length&&!f.retire)assign(f,jobs.shift());stepV(f,dt)}
 forks=forks.filter(f=>!(f.retire&&!f.busy));for(const v of vehicles.slice())stepV(v,dt);for(const v of farm.slice())stepV(v,dt)}

/* ---------- rendering ---------- */
function ground(){ctx.fillStyle='#927c62';ctx.fillRect(0,0,W,H);
 ctx.save();poly(wp(ROAD.concat([[140,400],[-300,400],[-300,-36]])));ctx.clip();ctx.strokeStyle='rgba(60,45,30,.16)';ctx.lineWidth=1;ctx.beginPath();for(let c=-40;c<140;c+=1.5){const a=P(-200,c-200),b=P(300,c+300);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}ctx.stroke();
 ctx.fillStyle='rgba(204,178,122,.55)';const band=(c,a,b)=>poly(wp([[a,a+c-1.6],[b,b+c-1.6],[b,b+c+1.6],[a,a+c+1.6]]),'rgba(204,178,122,.55)');
 for(const t of stubble)band(t[0],t[1],t[2]);for(const v of farm)if(v.cur)band(v.cur.c,Math.min(v.cur.xa,v.x),Math.max(v.cur.xa,v.x));ctx.restore();
 const fp=[];for(let x=-200;x<=260;x+=3)fp.push([x,fEdge(x)]);poly(wp(fp.concat([[260,-300],[-200,-300]])),'#3f5236');
 poly(wp([[99,12],[260,12],[260,300],[130,162],[88,106],[90,80],[92,70],[95,45],[99,40]]),'#6f9450');
 poly(wp([[17,12.5],[23.5,10.5],[24,5.5],[81,5.5],[82,12.5],[99,13.5],[99,40],[95,45],[92,70],[90,80],[88,106],[82,98],[65,72],[47,52],[39,47],[27.5,39.5],[12,26.5]]),'#77787b');
 for(const q of[[73.8,69.8,88.6,77.2],[43.6,39.4,50.6,41.8]])poly(wp([[q[0],q[1]],[q[2],q[1]],[q[2],q[3]],[q[0],q[3]]]),'#6d6e71');poly(wp([[16,10],[25,10],[25,31.5],[21,31.4],[15,26.3]]),'#6d6e71');poly(wp([[37.3,27],[40.5,27],[40.5,29.3],[42.6,29.3],[42.6,32.7],[37.6,33.3]]),'#a77d55');
 poly(wp(ribbon(ROAD,1.7)),'#68696b');

 const s=S*zoom;for(const t of TREES){const p=P(t[0],t[1],t[2]);if(p[0]<-30||p[0]>W+30||p[1]<-30||p[1]>H+30)continue;ctx.fillStyle=t[3]<.5?'#2f4429':'#39502f';ctx.beginPath();ctx.arc(p[0],p[1],t[2]*s*1.1,0,7);ctx.fill();ctx.fillStyle=t[3]<.5?'#46633a':'#517041';ctx.beginPath();ctx.arc(p[0]-t[2]*s*.25,p[1]-t[2]*s*.35,t[2]*s*.6,0,7);ctx.fill()}
 {const [a,b,c,d]=PAD,CON=[150,148,142];poly(wp([[a,b,0],[a,d,0],[a,d,PADZ],[a,b,PADZ]]),col(CON,.72));poly(wp([[a,d,0],[c,d,0],[c,d,PADZ],[a,d,PADZ]]),col(CON,.88));
  poly(wp([[a,b,PADZ],[c,b,PADZ],[c,d,PADZ],[a,d,PADZ]]),'#707174');poly(wp([[86,d,PADZ],[92,d,PADZ],[92,39.5,0],[86,39.5,0]]),'#7c7d80');poly(wp([[86,d,0],[86,d,PADZ],[86,39.5,0]]),col(CON,.72))}
 ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=1;ctx.beginPath();for(const s of SLOTS){zOff=groundZ(s.x,s.y);const c=Math.cos(s.a),n=Math.sin(s.a);for(const k of[-1,1]){const a=P(s.x-n*.9*k-c*1.35,s.y+c*.9*k-n*1.35),b=P(s.x-n*.9*k+c*1.35,s.y+c*.9*k+n*1.35);ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1])}}zOff=0;ctx.stroke();}
function render(){ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);ground();const D=[],s=S*zoom;
 if(sel&&sel.v&&sel.v.sx>-900){zOff=groundZ(sel.v.x,sel.v.y);const p=P(sel.v.x,sel.v.y);zOff=0;ctx.strokeStyle='#ff8a3c';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(p[0],p[1],3*s,1.5*s,0,0,7);ctx.stroke()}
 B.forEach(b=>D.push({k:b.cy-b.cx,f:()=>drawB(b)}));
 GOODS.forEach(g=>D.push({k:g[1]-g[0],f:()=>{zOff=groundZ(g[0],g[1]);g[2]==='cyl'?vcyl(g[0],g[1],0,g[4],g[5],g[6]||[205,210,214]):cargo(g[2],g[0],g[1],g[3],0);zOff=0}}));
 GUEST.forEach(g=>D.push({k:g[1]-g[0]+9,f:()=>{obox(g[0],g[1],2.5,1.15,.2,.75,1.57,[232,234,236]);obox(g[0],g[1],1.3,1,.75,1.2,1.57,[58,68,80])}}));
 cars.forEach(c=>{if(c.st==='parked')D.push({k:c.sl.y-c.sl.x,f:()=>{zOff=groundZ(c.sl.x,c.sl.y);obox(c.sl.x,c.sl.y,2.5,1.15,.2,.75,c.sl.a,c.col);obox(c.sl.x,c.sl.y,1.3,1,.75,1.2,c.sl.a,[58,68,80]);zOff=0}})});
 forks.concat(vehicles,farm).forEach(v=>{if(v.kind==='rig'){rigParts(v,D);return}if(inB(v.x,v.y)){v.sx=-999;return}D.push({k:v.y-v.x,f:()=>{zOff=groundZ(v.x,v.y);drawV(v);zOff=0}})});
 D.sort((a,b)=>a.k-b.k).forEach(d=>d.f());
 if($('labels').checked){ctx.font=`600 ${Math.max(11,Math.min(15,s*1.9))}px 'Barlow Condensed','Arial Narrow',sans-serif`;ctx.textBaseline='middle';
  ctx.textAlign='center';for(const t of TAGS){const p=P(t[1],t[2]),w=ctx.measureText(t[0]).width+10;ctx.fillStyle='rgba(255,255,255,.16)';ctx.beginPath();ctx.roundRect(p[0]-w/2,p[1]-8,w,16,2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.9)';ctx.fillText(t[0],p[0],p[1]+1)}
  for(const b of B){const Q=(x,y,z)=>{const q=R(b,x,y);return P(q[0],q[1],z)};
   for(const d of b.doors||[]){const p=d.s!=null?Q(d.s,b.y+b.d,(d.z||3)-.5):Q(b.x,d.w,(d.z||3)-.5),t='Port '+d.n,w=ctx.measureText(t).width+8;ctx.fillStyle='#1f5fae';ctx.beginPath();ctx.roundRect(p[0]-w/2,p[1]-8,w,16,2);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(t,p[0],p[1]+1)}
   if(b.sign){const p=Q(b.x,b.cy,b.h-1.15),q=Q(b.x,b.cy+1,b.h-1.15),ux=q[0]-p[0],uy=q[1]-p[1],L=Math.hypot(ux,uy);ctx.save();ctx.translate(p[0],p[1]);ctx.transform(ux/L,uy/L,0,1,0,0);ctx.font=`700 ${(S*zoom*.85).toFixed(1)}px 'Barlow Condensed','Arial Narrow',sans-serif`;ctx.fillStyle='#1f3f7a';ctx.fillText('TOMAL',0,1);ctx.restore()}
   if(!b.lab)continue;const p=P(b.cx+(b.lx||0),b.cy,b.h+(b.g||0)+.8),w=ctx.measureText(b.n).width+14;ctx.fillStyle='rgba(16,23,29,.84)';ctx.beginPath();ctx.roundRect(p[0]-w/2,p[1]-10,w,20,3);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(b.n,p[0],p[1]+1)}}
 const h=clock/60,n=h<5||h>21?.52:h<7?.52*(7-h)/2:h>17?.52*(h-17)/4:0;if(n>0){ctx.fillStyle=`rgba(12,22,52,${n})`;ctx.fillRect(0,0,W,H)}}
function info(){const el=$('info');if(!sel){el.hidden=true;return}el.hidden=false;
 const rows=[];let title,txt='';
 if(sel.v){const v=sel.v;title=v.name;rows.push(['Status',v.status],['Last',v.kind==='fork'?(v.cargo?CNAME[v.cargo]:'–'):v.what],['Order',v.order])}
 else{const b=sel.b;title=b.n;txt=b.txt;if(b.doors)rows.push(['Portar',b.doors.map(d=>'Port '+d.n).join(', ')]);
  if(b.k==='gods')rows.push(['I dag',stat.inn+' kolli mottagna']);if(b.k==='prov')rows.push(['I dag',stat.pack+' maskiner provade och flyttade']);
  if(b.k==='pack')rows.push(['Väntar på frakt',packStock+' maskiner']);if(b.k==='silo')rows.push(['I hallen',hall8+' silos']);}
 el.innerHTML='<h3></h3><p></p><dl></dl>';el.children[0].textContent=title;el.children[1].textContent=txt;el.children[1].hidden=!txt;const dl=el.children[2];rows.forEach(r=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=r[0];dd.textContent=r[1];dl.append(dt,dd)})}
let uiT=0,tourT=0,tourI=-1,tourHold=0;const TOUR=B.filter(b=>b.lab&&b.txt);
function tourStep(t){if(!$('tour').checked||t<tourHold||t-tourT<10000)return;tourT=t;tourI=(tourI+1)%TOUR.length;sel={b:TOUR[tourI]};info()}
function ui(t){tourStep(t||0);const c=hhmm(clock);if($('clock').textContent!==c){$('clock').textContent=c;if(document.activeElement!==$('tod')){$('tod').value=clock|0;$('todO').textContent=c}}
 const h=clock/60;$('phase').textContent=h<5?'Natt, gården är tom':h<9?'Morgon, personalen anländer':h<10?'Förmiddag':h<15?'Leveranser och full drift':h<15.5?'Eftermiddag':h<17?'Personalen åker hem':h<18.5?'Kväll':'Natt, gården är tom';
 $('kInn').textContent=stat.inn;$('kPack').textContent=stat.pack;$('kOut').textContent=stat.out;$('kSilo').textContent=hall8;$('kCars').textContent=cars.filter(c=>c.st==='parked').length;$('kJobs').textContent=jobs.length;if(sel)info()}
let last=performance.now();function frame(t){const dt=Math.min(.1,(t-last)/1000);last=t;if(speed){let r=dt*speed;while(r>0){const d=Math.min(.05,r);step(d);r-=d}}render();if(t-uiT>250){uiT=t;ui(t)}requestAnimationFrame(frame)}
function resize(){const r=$('stage').getBoundingClientRect();W=Math.max(200,r.width);H=Math.max(200,r.height);cv.width=W*devicePixelRatio;cv.height=H*devicePixelRatio;S=Math.min(W/128,H/62)}
new ResizeObserver(resize).observe($('stage'));

/* ---------- interaktion ---------- */
let drag=null;
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,px:panX,py:panY,m:0};cv.setPointerCapture(e.pointerId);cv.style.cursor='grabbing'});
cv.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.m=Math.max(drag.m,Math.hypot(dx,dy));panX=drag.px+dx;panY=drag.py+dy});
cv.addEventListener('pointerup',e=>{cv.style.cursor='grab';const d=drag;drag=null;if(!d||d.m>5)return;const r=cv.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;
 let best=null,bd=26;for(const v of forks.concat(vehicles,farm)){if(v.sx==null||v.sx<-900)continue;const q=Math.hypot(v.sx-mx,v.sy-my);if(q<bd){bd=q;best=v}}
 if(best)sel={v:best};else{sel=null;const hit=B.slice().sort((a,b)=>(b.cy-b.cx)-(a.cy-a.cx)).find(b=>b.n&&b.polys&&b.polys.some(p=>{let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>my)!==(p[j][1]>my)&&mx<(p[j][0]-p[i][0])*(my-p[i][1])/(p[j][1]-p[i][1])+p[i][0])c=!c}return c}));if(hit)sel={b:hit}}tourHold=performance.now()+30000;info()});
function zoomBy(f,cx=W/2,cy=H/2){const z=Math.max(.6,Math.min(5,zoom*f)),k=z/zoom;panX=(panX+W/2-cx)*k-(W/2-cx);panY=(panY+H/2-cy)*k-(H/2-cy);zoom=z}
cv.addEventListener('wheel',e=>{e.preventDefault();const r=cv.getBoundingClientRect();zoomBy(e.deltaY<0?1.12:.89,e.clientX-r.left,e.clientY-r.top)},{passive:false});
$('zin').onclick=()=>zoomBy(1.3);$('zout').onclick=()=>zoomBy(.77);$('zfit').onclick=()=>{zoom=1;panX=panY=0};
const SK_='gardsvy';function save(){try{localStorage.setItem(SK_,JSON.stringify({speed,labels:$('labels').checked,tour:$('tour').checked,nVan:NV(),nOut:NO(),nSilo:NS(),nFork:+$('nFork').value}))}catch(e){}}
function setSpeed(v){speed=v;[...$('speed').children].forEach(c=>c.setAttribute('aria-pressed',+c.dataset.s===v))}
$('speed').onclick=e=>{const b=e.target.closest('button');if(!b)return;setSpeed(+b.dataset.s);save()};
$('tod').oninput=e=>{$('todO').textContent=hhmm(+e.target.value);resetTo(+e.target.value)};
$('nFork').oninput=e=>{$('nForkO').textContent=e.target.value;setForks(+e.target.value);save()};
for(const id of['nVan','nOut','nSilo'])$(id).oninput=e=>{$(id+'O').textContent=e.target.value;buildSchedule(clock);save()};
$('labels').onchange=save;$('tour').onchange=()=>{tourT=0;tourHold=0;if(!$('tour').checked){sel=null;info()}save()};
$('bVan').onclick=spawnVan;$('bPlat').onclick=spawnPlat;$('bOut').onclick=spawnOut;$('bSiloIn').onclick=()=>silo(1);$('bSiloOut').onclick=()=>{if(hall8<1)log('Ingen färdig silo i silohallen att hämta');silo(0)};$('bMove').onclick=machineMove;$('bHarv').onclick=harvest;
function panel(open){$('panel').hidden=!open;$('bSet').setAttribute('aria-expanded',open)}
$('bSet').onclick=()=>panel($('panel').hidden);$('bClose').onclick=()=>panel(false);
document.addEventListener('keydown',e=>{if(e.key==='Escape')panel(false)});
$('bFull').onclick=()=>{const d=document;try{if(d.fullscreenElement)d.exitFullscreen();else{const p=d.documentElement.requestFullscreen();p&&p.catch(()=>{})}}catch(e){}};
document.addEventListener('fullscreenchange',()=>{$('bFull').textContent=document.fullscreenElement?'Avsluta helskärm':'Helskärm'});
let idleT=0;const wake=()=>{$('app').classList.remove('idle');clearTimeout(idleT);idleT=setTimeout(()=>$('app').classList.add('idle'),4000)};['pointermove','pointerdown','keydown'].forEach(ev=>document.addEventListener(ev,wake));wake();
try{const c=JSON.parse(localStorage.getItem(SK_)||'null');if(c){setSpeed(c.speed??1);$('labels').checked=c.labels!==false;$('tour').checked=!!c.tour;for(const k of['nVan','nOut','nSilo','nFork'])if(c[k]!=null){$(k).value=c[k];$(k+'O').textContent=$(k).value}}}catch(e){}
{const n=new Date();resize();resetTo(n.getHours()*60+n.getMinutes());$('tod').value=clock;for(let i=0;i<240;i++)step(.05);ui(0);requestAnimationFrame(frame)}
})();
