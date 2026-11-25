const $=s=>document.querySelector(s);const app=$("#app");
const L="A B C D".split(" ");
const store={get(k,d){try{return JSON.parse(localStorage.getItem("ict:"+k))??d}catch(e){return d}},set(k,v){localStorage.setItem("ict:"+k,JSON.stringify(v))}};
const esc=s=>String(s).replace(/&(?!lt;|gt;|amp;)/g,"&amp;").replace(/<(?!\/?(b|i|br)>)/g,"&lt;");
const allCh=()=>BOOKS.flatMap(b=>b.chs.map(c=>({...c,book:b})));
const TOPIC={A1:"A 资讯处理：数据表示、文书/简报处理",A2:"A 资讯处理：试算表与数据库",B:"B 电脑系统基础",C1:"C 互联网：网络与协议",C2:"C 互联网：网页与网络保安",D1:"D 算法与追踪",D2:"D 程序开发与测试",E:"E 社会影响"};

function qHTML(item,key,orig){
  // item: {q,st,o,a(letter),exp,src,code}
  const ans=store.get("ans:"+key,null);
  const ai=L.indexOf(item.a);
  let h=`<div class="q glass" id="q-${key}"><div class="src ${orig?"orig":""}">${orig?"Quest original":"真题 · "+esc(item.src)}${item.pct?" · 当年答对率 "+item.pct:""}</div>`;
  h+= item.code||/\n/.test(item.q)?`<pre>${esc(item.q)}</pre>`:`<div>${esc(item.q)}</div>`;
  if(item.fig) h+=`<a href="${item.fig}" target="_blank"><img class="fig" src="${item.fig}" loading="lazy"></a>`;
  if(item.st) h+=`<div class="st">${item.st.map((s,i)=>`(${i+1}) ${esc(s)}`).join("<br>")}</div>`;
  item.o.forEach((o,i)=>{let c="";if(ans!==null){if(i===ai)c="ok";else if(i===ans)c="bad"}
    h+=`<button class="opt ${item.code&&!item.st?"code":""} ${c}" data-k="${key}" data-i="${i}" data-a="${ai}">${L[i]}. ${esc(o)}</button>`});
  if(ans!==null) h+=`<div class="exp">${ans===ai?"✅ 正确":"❌ 答案是 "+item.a}。${esc(item.exp||"")}</div>`;
  return h+"</div>";
}
document.addEventListener("click",e=>{const b=e.target.closest(".opt");if(!b)return;
  const k=b.dataset.k;if(store.get("ans:"+k,null)!==null)return;store.set("ans:"+k,+b.dataset.i);
  const box=b.closest(".q");const it=window.__items[k];box.outerHTML=qHTML(it.item,k,it.orig);updateScore()});
window.__items={};
function reg(item,key,orig){window.__items[key]={item,orig};return qHTML(item,key,orig)}
function scoreOf(keys){let d=0,c=0;keys.forEach(k=>{const a=store.get("ans:"+k,null);if(a!==null){d++;if(a===L.indexOf(window.__items[k]?.item.a))c++}});return{d,c,n:keys.length}}
function updateScore(){const el=$("#score");if(!el)return;const s=scoreOf(JSON.parse(el.dataset.keys));el.textContent=`已作答 ${s.d}/${s.n} · 答对 ${s.c}`}
function resetKeys(keys){keys.forEach(k=>localStorage.removeItem("ict:ans:"+k));route()}
const mcItem=(m)=>({q:m[0],o:m[1],a:L[m[2]],exp:m[3],code:/\n/.test(m[0])});
const V={
home(){const chs=allCh();const mk=chs.flatMap(c=>c.mc.map((_,i)=>c.id+"-"+i));const s=scoreOf(mk);const d=scoreOf(DSEQ.map(q=>"dse-"+q.id));
 const seen=store.get("seen",{});const nc=chs.reduce((a,c)=>a+c.cards.length,0);const ns=Object.keys(seen).length;
 return `<h1>S5 ICT Learning Portal</h1><p class="sub">DSE ICT 必修部分 · 按课本 A1–E 编排 · 进度自动保存在这台设备</p>
 <div class="grid">
 <a class="tile glass" href="#learn"><div class="k">LEARN</div><div class="t">知识卡 + 章节练习</div><div>${chs.length} 章 · ${nc} 张卡 · ${mk.length} 题原创 MC</div><div class="bar"><i style="width:${ns/nc*100}%"></i></div><div class="k">已看 ${ns}/${nc} 张 · 练习答对 ${s.c}/${s.d}</div></a>
 <a class="tile glass" href="#dse"><div class="k">PAST PAPERS</div><div class="t">DSE 真题专区</div><div>按课题 / 按年份 · 2012–2026 · SP/PP</div><div class="bar"><i style="width:${d.d/d.n*100}%"></i></div><div class="k">站内真题 ${d.d}/${d.n} · 答对 ${d.c}</div></a>
 <a class="tile glass" href="#quiz"><div class="k">MIXED</div><div class="t">随机混合测验</div><div>真题 + 原创各一半，10 题</div></a>
 <a class="tile glass" href="#tools"><div class="k">TOOLS</div><div class="t">互动工具</div><div>进制转换 · 补码 · 子网 · SQL 练习场 · 算法追踪</div></a>
 </div>`},
learn(){return `<h1>知识卡</h1><p class="sub">按 ICT for iGeneration 课本章节。每章：知识卡 → 原创 MC 练习。</p>`+BOOKS.map(b=>`<h2>${b.id} · ${b.name}</h2>${b.note?`<p class="sub">${b.note}</p>`:""}<div class="grid">${b.chs.map(c=>{const s=scoreOf(c.mc.map((_,i)=>c.id+"-"+i));return `<a class="tile glass" href="#ch/${c.id}"><div class="k">${b.id} Ch${c.n} · ${c.cards.length} 卡 · ${c.mc.length} 题</div><div class="t">${c.t}</div><div class="bar"><i style="width:${s.d/s.n*100}%"></i></div><div class="k">${s.d?`答对 ${s.c}/${s.d}`:"未开始"}</div></a>`}).join("")}</div>`).join("")},
ch(id){const c=allCh().find(x=>x.id===id);if(!c)return"找不到章节";const seen=store.get("seen",{});c.cards.forEach((_,i)=>seen[c.id+i]=1);store.set("seen",seen);
 const keys=c.mc.map((_,i)=>c.id+"-"+i);const tp=c.book.id.startsWith("E")&&c.book.elective?null:c.book.id;const rel=DSEQ.filter(q=>q.topic===tp).length;
 return `<p><a href="#learn">← 知识卡</a></p><h1>${c.book.id} Ch${c.n} ${c.t}</h1><div>${c.sec.map(s=>`<span class="pill">${s}</span>`).join("")}</div>
 <h2>知识卡</h2>${c.cards.map(k=>`<div class="card glass"><div class="ty">${k[1]}</div><h3>${k[0]}</h3><div>${k[2]}</div></div>`).join("")}
 <h2>章节练习（原创）</h2><div class="row"><span id="score" data-keys='${JSON.stringify(keys)}'></span><button class="btn sec" onclick='resetKeys(${JSON.stringify(keys)})'>重做</button></div>
 ${keys.map((k,i)=>reg(mcItem(c.mc[i]),k,true)).join("")}
 ${c.sq.length?`<h2>结构题练习（原创）</h2>`+c.sq.map((q,i)=>`<div class="q glass"><div class="src orig">Quest original · 结构题 ${i+1}</div><div>${q[0]}</div><details><summary>看参考答案</summary><div class="exp">${q[1]}</div></details></div>`).join(""):""}
 ${rel?`<p><a class="btn" href="#dse/topic/${c.book.id}">练 ${rel} 题相关 DSE 真题 →</a></p>`:""}`},
dse(){return `<h1>DSE 真题专区</h1><p class="sub">全部是 HKDSE ICT Paper 1 原题（原文照录，标注年份/题号），答案为 HKEAA 官方答案，附当年考生答对率。解释为 Quest 所写。</p>
 <h2>按课题（站内作答）</h2><div class="grid">${Object.keys(TOPIC).map(t=>{const qs=DSEQ.filter(q=>q.topic===t);const s=scoreOf(qs.map(q=>"dse-"+q.id));return qs.length?`<a class="tile glass" href="#dse/topic/${t}"><div class="k">${qs.length} 题</div><div class="t">${TOPIC[t]}</div><div class="bar"><i style="width:${s.d/s.n*100}%"></i></div><div class="k">答对 ${s.c}/${s.d}</div></a>`:""}).join("")}</div>
 <h2>长题目 Section B（按课题）</h2><div class="grid">${Object.keys(TOPIC).map(t=>{const n=LQ.filter(l=>l.topic===t).length;return n?`<a class="tile glass" href="#lq/topic/${t}"><div class="k">${n} 题</div><div class="t">${TOPIC[t]}</div></a>`:""}).join("")}</div>
 <h2>按年份（整份 Paper 1A，40 题）</h2><p class="sub">打开试卷 PDF 做题，在答题纸上填答案，提交后自动对答案并显示当年答对率。2021 和 Sample Paper 可直接在站内作答。</p>
 <div class="grid">${YEARS.map(y=>{const r=store.get("sheet:"+y.y,null);return `<a class="tile glass" href="#year/${y.y}"><div class="k">${y.label||"HKDSE "+y.y}${y.note?" · "+y.note:""}</div><div class="t">${y.label||y.y} Paper 1A</div><div class="k">${r&&r.done?`上次得分 ${r.score}/${KEYS[y.y].length}`:(y.paper?"有 PDF":"PDF 待补，可用答题纸")}${y.inapp?" · 站内可做":""}</div></a>`}).join("")}</div>`},
topic(t){const qs=DSEQ.filter(q=>q.topic===t);const keys=qs.map(q=>"dse-"+q.id);
 return `<p><a href="#dse">← 真题专区</a></p><h1>${TOPIC[t]}</h1><div class="row"><span id="score" data-keys='${JSON.stringify(keys)}'></span><button class="btn sec" onclick='resetKeys(${JSON.stringify(keys)})'>重做</button></div>`+qs.map(q=>reg(q,"dse-"+q.id,false)).join("")},
year(y){const Y=YEARS.find(x=>x.y===y);const key=KEYS[y];const pct=PCT[y];const st=store.get("sheet:"+y,{a:{},done:false});
 const inapp=DSEQ.filter(q=>q.id.startsWith(y+"-"));
 let h=`<p><a href="#dse">← 真题专区</a></p><h1>${Y.label||"HKDSE "+y} ICT Paper 1A</h1><div class="row">`;
 h+=Y.paper?`<a class="btn" href="${Y.paper}" target="_blank">打开试卷 PDF</a>`:`<span class="pill">这一年的试卷 PDF 还没找到公开版本，用你自己的试卷做，下面答题纸照样可以对答案</span>`;
 if(Y.ms)h+=`<a class="btn sec" href="${Y.ms}" target="_blank">Marking Scheme（含 Section B）</a>`;
 h+=`</div>`;
 const lqs=LQ.filter(l=>l.y===y);if(lqs.length)h+=`<p><a class="btn" href="#lq/year/${y}">Section B 长题目（${lqs.length} 题，附评分标准）</a></p>`;
 if(inapp.length)h+=`<p><a class="btn" href="#yearq/${y}">站内逐题作答（${inapp.length} 题，附解释）</a></p>`;
 h+=`<h2>答题纸</h2><div class="sheet">${key.split("").map((k,i)=>{const a=st.a[i+1];return `<div><b>${i+1}</b>${L.map(l=>{let c=a===l?"sel":"";if(st.done){if(k==="*")c=a===l?"sel":"";else if(l===k)c="ok";else if(a===l)c="bad"}return `<button class="${c}" onclick="pick('${y}',${i+1},'${l}')">${l}</button>`}).join("")}${st.done&&k==="*"?`<span class="pc">题目取消，全部给分</span>`:""}${st.done&&pct[i]!=="-"?`<span class="pc">${pct[i]}</span>`:""}</div>`}).join("")}</div>
 <div class="row" style="margin-top:12px">${st.done?`<span class="big">${st.score}/${key.length}</span><button class="btn sec" onclick="sheetReset('${y}')">清空重做</button>`:`<button class="btn" onclick="sheetDone('${y}')">提交并对答案</button>`}</div>`;
 if(st.done){const wrong=key.split("").map((k,i)=>k!=="*"&&st.a[i+1]!==k?i+1:0).filter(Boolean);h+=`<p class="sub">错题：${wrong.join(", ")||"无"}。绿色 = 正确答案，红色 = 你选错的。右边百分比 = 当年考生答对率，低于 40% 的是拉分题。</p>`}
 return h},
yearq(y){const qs=DSEQ.filter(q=>q.id.startsWith(y+"-"));const keys=qs.map(q=>"dse-"+q.id);return `<p><a href="#year/${y}">← ${y} 答题纸</a></p><h1>${y==="SP"?"Sample Paper":"HKDSE "+y} 1A 站内作答</h1><div class="row"><span id="score" data-keys='${JSON.stringify(keys)}'></span><button class="btn sec" onclick='resetKeys(${JSON.stringify(keys)})'>重做</button></div>`+qs.map(q=>reg(q,"dse-"+q.id,false)).join("")},
quiz(){let pool=DSEQ.map(q=>({it:q,k:"dse-"+q.id,o:false}));let org=allCh().flatMap(c=>c.mc.map((m,i)=>({it:mcItem(m),k:c.id+"-"+i,o:true})));
 const sh=a=>a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
 const pick=[...sh(pool).slice(0,5),...sh(org).slice(0,5)];const qs=sh(pick);const keys=qs.map(x=>x.k);
 keys.forEach(k=>localStorage.removeItem("ict:ans:"+k));
 return `<h1>随机混合测验</h1><p class="sub">5 题 DSE 真题 + 5 题原创。<a href="#quiz" onclick="setTimeout(route)">换一组</a></p><span id="score" data-keys='${JSON.stringify(keys)}'></span>`+qs.map(x=>reg(x.it,x.k,x.o)).join("")},
progress(){const chs=allCh();let h=`<h1>进度</h1><p class="sub">只保存在这台设备的浏览器（Safari 不要用无痕模式，不要清网站数据）。</p><table><tr><th>章节</th><th>练习</th></tr>`;
 chs.forEach(c=>{const s=scoreOf(c.mc.map((_,i)=>c.id+"-"+i));h+=`<tr><td><a href="#ch/${c.id}">${c.book.id} Ch${c.n} ${c.t}</a></td><td>${s.d?`${s.c}/${s.d}`:"-"}</td></tr>`});
 h+=`</table><h2>真题答题纸</h2><table><tr><th>试卷</th><th>得分</th></tr>${YEARS.map(y=>{const r=store.get("sheet:"+y.y,null);return `<tr><td><a href="#year/${y.y}">${y.label||y.y}</a></td><td>${r&&r.done?r.score+"/"+KEYS[y.y].length:"-"}</td></tr>`}).join("")}</table>
 <h2>错题</h2>${(()=>{const w=Object.keys(window.__items).filter(k=>{const a=store.get("ans:"+k,null);return a!==null&&a!==L.indexOf(window.__items[k].item.a)});return w.length?w.map(k=>reg(window.__items[k].item,k,window.__items[k].orig)).join(""):"<p class='sub'>暂时没有错题。</p>"})()}
 <p><button class="btn sec" onclick="if(confirm('清除全部进度？')){Object.keys(localStorage).filter(k=>k.startsWith('ict:')).forEach(k=>localStorage.removeItem(k));route()}">清除全部进度</button></p>`;return h},
tools(){return TOOLS()},
lq(mode,v){const ls=LQ.filter(l=>mode==="year"?l.y===v:l.topic===v);
 return `<p><a href="#dse">← 真题专区</a></p><h1>Section B 长题目 · ${mode==="year"?v:TOPIC[v]}</h1><p class="sub">原文照录，答案来自 HKEAA 评分标准（标注 Suggested answer 的为 Quest 补充）。先自己写，再展开看答案。</p>`+ls.map(l=>`<div class="q glass"><div class="src">真题 · ${l.y} DSE ICT 1B Q${l.n}</div>${l.stem?`<div>${l.stem}</div>`:""}${[].concat(l.pg||[]).map(p=>`<a href="${PG(l.yl,p)}" target="_blank" class="pill">看原卷第 ${p} 页</a>`).join(" ")}${(l.parts||[]).map(p=>`<div class="lqp"><b>${p.l||""}</b> ${p.q} <span class="pill">${p.m||""} 分</span><details><summary>评分标准</summary><div class="exp">${p.ms}</div></details></div>`).join("")}</div>`).join("")}
};
function pick(y,n,l){const st=store.get("sheet:"+y,{a:{},done:false});if(st.done)return;st.a[n]=st.a[n]===l?undefined:l;store.set("sheet:"+y,st);route()}
function sheetDone(y){const st=store.get("sheet:"+y,{a:{},done:false});const k=KEYS[y];st.score=k.split("").filter((c,i)=>c==="*"||st.a[i+1]===c).length;st.done=true;store.set("sheet:"+y,st);route()}
function sheetReset(y){store.set("sheet:"+y,{a:{},done:false});route()}
function route(){const h=(location.hash||"#home").slice(1).split("/");let html;
 if(h[0]==="ch")html=V.ch(h[1]);else if(h[0]==="dse"&&h[1]==="topic")html=V.topic(h[2]);else if(h[0]==="year")html=V.year(h[1]);else if(h[0]==="lq")html=V.lq(h[1],h[2]);else if(h[0]==="yearq")html=V.yearq(h[1]);else html=(V[h[0]]||V.home)();
 app.innerHTML=html;updateScore();if(h[0]==="tools")initTools();if(!location.hash.includes("/"))window.scrollTo(0,0)}
const RAW="https://raw.githubusercontent.com/wujiyan09/ict-portal/main/";window.LQ=[];
const PG=(y,p)=>RAW+"pages/"+y+"-p1-"+String(p).padStart(2,"0")+".jpg";
async function boot(){app.innerHTML="<p class='sub'>载入中…</p>";
 try{const m=await (await fetch(RAW+"data/manifest.json?"+Date.now())).json();
  const bk=await Promise.all(m.books.map(b=>fetch(RAW+"data/book-"+b+".json?v="+m.v).then(r=>r.json()).catch(()=>null)));
  bk.filter(Boolean).forEach(b=>{b.chs.forEach(c=>{c.cards=c.cards||[];c.mc=c.mc||[];c.sq=c.sq||[]});const k=BOOKS.findIndex(x=>x.id===b.id);if(k>=0)BOOKS[k]=b;else BOOKS.push(b)});
  const ys=await Promise.all(m.years.map(y=>fetch(RAW+"data/dse-"+y+".json?v="+m.v).then(r=>r.json()).catch(()=>null)));
  ys.filter(Boolean).forEach(d=>{let y=String(d.year).toLowerCase();const Y=y==="sp"?"SP":y==="pp"?"PP":y;
   for(let i=DSEQ.length-1;i>=0;i--)if(DSEQ[i].id.startsWith(Y+"-"))DSEQ.splice(i,1);
   (d.mc||[]).forEach(q=>DSEQ.push({id:Y+"-"+q.n,src:(Y==="SP"?"Sample Paper":Y==="PP"?"Practice Paper":Y+" DSE")+" ICT 1A Q"+q.n,topic:q.topic,q:q.q,st:q.st,o:q.o,a:q.a,exp:q.exp,code:q.code,fig:q.fig?PG(y,q.pg):""}));
   (d.lq||[]).forEach(l=>LQ.push({...l,y:Y,yl:y}));
   const YY=YEARS.find(x=>x.y===Y);if(YY)YY.inapp=true});
 }catch(e){console.log(e)}
 BOOKS.forEach(b=>b.chs.forEach(c=>{c.sq=c.sq||[]}));
 // register everything so progress works anywhere
allCh().forEach(c=>c.mc.forEach((m,i)=>window.__items[c.id+"-"+i]={item:mcItem(m),orig:true}));
DSEQ.forEach(q=>{const y=q.id.split("-")[0];const n=+q.id.split("-")[1];q.pct=(PCT[y]||[])[n-1]&&PCT[y][n-1]!=="-"?PCT[y][n-1]:"";window.__items["dse-"+q.id]={item:q,orig:false}});


 route()}
window.addEventListener("hashchange",route);boot();
