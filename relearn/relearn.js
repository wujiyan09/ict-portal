// ICT 重学 (relearn): diagnostic, relearn path, SQL lab, web lab, DSE wording.
const RAW="https://raw.githubusercontent.com/wujiyan09/ict-portal/main/";
const SQLCDN="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/";
const $=s=>document.querySelector(s),app=$("#app");
const st={get(k,d){try{const v=JSON.parse(localStorage.getItem("rl:"+k));return v==null?d:v}catch(e){return d}},set(k,v){localStorage.setItem("rl:"+k,JSON.stringify(v))}};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const txt=s=>esc(s).replace(/\n/g,"<br>");
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
let D=null,SQL=null;
const L="ABCD";
// ---------- status ----------
function grade(r){if(!r)return null;const p=r.s/r.n;return p>=.8?"g":p>=.5?"a":"r"}
const GN={g:"可跳过",a:"复习知识卡",r:"重学",null:"未测"};
function chipC(g){return `<span class="chip ${g||"n"}">${GN[g]}</span>`}
function chLink(id,i){return i==null?`../#ch/${id}`:`../#cards/${id}/${i}`}
function allCh(){return D.chs}
function findCh(id){return D.chs.find(c=>c.id===id)||D.el[id]}
// ---------- views ----------
const V={};
V.home=()=>{const R=st.get("diag",{});const chs=allCh();const done=chs.filter(c=>R[c.id]).length;
 const cnt={g:0,a:0,r:0};chs.forEach(c=>{const g=grade(R[c.id]);if(g)cnt[g]++});
 return `<h1>重学 Relearn</h1><p class="sub">必修先摸底，再按弱项重学；Elective A / B 从零开始练。目标：Term 1 考试（2027-01-22）前完成。</p>
 <div class="list big">
 <a href="#diag"><span>摸底 Diagnostic</span><span>${done}/${chs.length} 章已测 · <b class="g">${cnt.g}</b> 绿 · <b class="a">${cnt.a}</b> 黄 · <b class="r">${cnt.r}</b> 红</span></a>
 <a href="#path"><span>重学路线 Relearn path</span><span>最弱的章节排最前 · 考纲小项清单</span></a>
 <a href="#sql"><span>Elective A · SQL Lab</span><span>${solvedN("sql")}/${SQLX.length} 题 · 浏览器内 SQLite</span></a>
 <a href="#web"><span>Elective B · Web Lab</span><span>${solvedN("web")}/${WEBX.length} 题 · HTML / CSS / JS 即时预览</span></a>
 <a href="#th/A"><span>Elective A theory MC</span><span>Database · normalisation · ER</span></a>
 <a href="#th/B"><span>Elective B theory MC</span><span>HTTP · client/server-side · cookies · security</span></a>
 </div><p class="k"><a href="../">← S5 ICT 主页</a> · 进度只存在这部设备的浏览器里。</p>`};
function solvedN(k){return Object.keys(st.get(k,{})).length}
V.diag=()=>{const R=st.get("diag",{});
 return `<p class="k"><a href="#home">← 重学</a></p><h1>摸底 Diagnostic</h1><p class="sub">每章 15 题，题目来自 DSE 真题和课本练习（标明出处），自动批改。≥80% 绿（可跳过）· 50–79% 黄（复习知识卡）· &lt;50% 红（重学）。</p>
 <div class="grid">${allCh().map(c=>{const r=R[c.id];const g=grade(r);return `<div class="cc ${g||"n"}"><div><b>${esc(c.book==="D1"?"D1":c.book+" Ch"+c.n)} · ${esc(c.t)}</b><div class="k">${esc(c.tz)}</div></div>
 <div class="row">${chipC(g)}${r?`<span class="k">${r.s}/${r.n}</span>`:""}<a class="btn sm" href="#q/${c.id}">${r?"再测":"开始"}</a>${c.items.length?`<a class="btn sm sec" href="#c/${c.id}">清单</a>`:""}</div></div>`}).join("")}</div>`};
V.path=()=>{const R=st.get("diag",{}),ck=st.get("ck",{});const o={r:0,a:1,null:2,g:3};
 const chs=allCh().slice().sort((x,y)=>{const gx=grade(R[x.id]),gy=grade(R[y.id]);return o[gx]-o[gy]||((R[x.id]?R[x.id].s/R[x.id].n:1)-(R[y.id]?R[y.id].s/R[y.id].n:1))});
 return `<p class="k"><a href="#home">← 重学</a></p><h1>重学路线 Relearn path</h1><p class="sub">红 → 黄 → 未测 → 绿。点进去按小项打勾。</p>
 ${chs.map((c,i)=>{const g=grade(R[c.id]);const n=c.items.length,d=c.items.filter(it=>ck[c.id+":"+it.i]).length;
 return `<a class="pi ${g||"n"}" href="${c.items.length?"#c/"+c.id:"#q/"+c.id}"><span class="no">${i+1}</span><span><b>${esc(c.t)}</b><br><span class="k">${esc(c.tz)} · ${chipC(g)} ${n?`· 清单 ${d}/${n}`:""}</span></span></a>`}).join("")}`};
V.c=id=>{const c=findCh(id);if(!c)return"<p>No chapter.</p>";const ck=st.get("ck",{});const R=st.get("diag",{});const g=grade(R[id]);
 const secs={};c.items.forEach(it=>{const k=(it.s||"").split(".").slice(0,2).join(".")||"—";(secs[k]=secs[k]||[]).push(it)});
 const sn=s=>c.sec.find(x=>x.startsWith(s+" "))||s;
 return `<p class="k"><a href="#path">← 重学路线</a></p><h1>${esc(c.t)}</h1><p class="sub">${esc(c.tz)} · ${chipC(g)} ${R[id]?R[id].s+"/"+R[id].n:""}</p>
 <p><a class="btn" href="${chLink(id,0)}">知识卡 Cards →</a><a class="btn sec" href="${chLink(id)}">讲解与练习</a>${D.el[id]?"":`<a class="btn sec" href="#q/${id}">摸底 15 题</a>`}</p>
 ${g==="g"?`<p class="ok">这章摸底已绿，可只看下面的 DSE 用语。</p>`:""}
 ${Object.keys(secs).map(s=>`<h2>${esc(sn(s))}</h2>${secs[s].map(it=>`<div class="ci"><label><input type="checkbox" ${ck[id+":"+it.i]?"checked":""} onchange="tick('${id}',${it.i},this.checked)"> <span><b>${esc(it.t)}</b> <span class="k">${esc(it.tz)}</span></span></label> <a class="k" href="${chLink(id,it.i)}">卡 →</a>
 ${it.k.length?`<details><summary>DSE 答题关键词</summary><ul class="kw">${it.k.map(k=>`<li>${esc(k)}</li>`).join("")}</ul></details>`:""}</div>`).join("")}`).join("")}`};
function tick(id,i,v){const ck=st.get("ck",{});if(v)ck[id+":"+i]=1;else delete ck[id+":"+i];st.set("ck",ck)}
// ---------- quiz engine ----------
function drawDiag(c){const dse=shuffle(c.mc.filter(m=>m.src.startsWith("HKDSE"))),tb=shuffle(c.mc.filter(m=>!m.src.startsWith("HKDSE")&&!/chapter practice$/.test(m.src))),pr=shuffle(c.mc.filter(m=>/chapter practice$/.test(m.src)));
 const take=[...dse.slice(0,8)];take.push(...tb.slice(0,15-take.length));take.push(...pr.slice(0,15-take.length));if(take.length<15)take.push(...dse.slice(8,8+15-take.length));return shuffle(take)}
function startQuiz(kind,id,qs,back){st.set("quiz",{kind,id,qs,ans:{},done:false,back});location.hash="#run"}
V.q=id=>{const c=findCh(id);startQuiz("diag",id,drawDiag(c),"#diag");return""};
V.th=k=>{const pool=k==="A"?[...DBTH.map(x=>({...x,src:"Original (DSE-style)",ez:x.e})),...D.dseDb,...Object.values(D.el).filter(c=>c.book==="EA").flatMap(c=>c.mc)]:[...D.dseWeb,...Object.values(D.el).filter(c=>c.book==="EB").flatMap(c=>c.mc)];
 startQuiz("th",k,shuffle(pool).slice(0,15),"#home");return""};
function qHTML(m,i,s){const a=s.ans[i];return `<div class="box"><div class="k">${i+1}/${s.qs.length} · ${esc(m.src)}${m.pct?" · 当年答对率 "+esc(m.pct):""}</div>
 <p>${m.code?`<pre>${esc(m.q)}</pre>`:txt(m.q)}</p>${(m.st||[]).map(x=>`<p>${txt(x)}</p>`).join("")}
 ${m.o.map((o,j)=>{let cl="opt";if(a===j)cl+=" sel";if(s.done){if(j===m.a)cl+=" ok";else if(a===j)cl+=" bad"}return `<button class="${cl}" ${s.done?"disabled":""} onclick="ans(${i},${j})"><b>${L[j]}.</b> ${m.code?`<code>${esc(o)}</code>`:txt(o)}</button>`}).join("")}
 ${s.done?`<div class="ms">${a===m.a?'<b class="ok">✓</b>':'<b class="bad">✗</b>'} 答案 ${L[m.a]}。${esc(m.ez||m.e||"")}${m.ez&&m.e?`<div class="k">${esc(m.e)}</div>`:""}${m.kw?`<div class="k">DSE 用语：${esc(m.kw)}</div>`:""}</div>`:""}</div>`}
V.run=()=>{const s=st.get("quiz",null);if(!s)return`<p>没有进行中的测验。<a href="#home">←</a></p>`;
 const c=s.kind==="diag"?findCh(s.id):null;const title=c?c.t:(s.id==="A"?"Elective A theory":"Elective B theory");
 const sc=s.qs.filter((m,i)=>s.ans[i]===m.a).length;
 return `<p class="k"><a href="${s.back}">← 返回</a></p><h1>${esc(title)}</h1>
 ${s.done?resultHTML(s,sc,c):`<p class="sub">已答 ${Object.keys(s.ans).length}/${s.qs.length}</p>`}
 ${s.qs.map((m,i)=>qHTML(m,i,s)).join("")}
 ${s.done?"":`<p><button class="btn" onclick="submitQ()">交卷</button></p>`}`};
function resultHTML(s,sc,c){const g=grade({s:sc,n:s.qs.length});
 return `<div class="box res ${s.kind==="diag"?g:""}"><h2 style="margin:0">${sc}/${s.qs.length} ${s.kind==="diag"?chipC(g):""}</h2>
 ${c?`<p>${g==="g"?"掌握得不错，这章可以跳过，考前看一次 DSE 用语即可。":g==="a"?"大致记得，建议把知识卡过一遍，并做错题对应的小项。":"建议重学：从第一张知识卡开始，再回来重测。"}</p>
 <p>${c.items.length?`<a class="btn" href="${chLink(c.id,0)}">知识卡 →</a><a class="btn sec" href="${chLink(c.id)}">讲解与练习</a><a class="btn sec" href="#c/${c.id}">考纲清单</a>`:`<a class="btn sec" href="../#dse">DSE 真题</a>`}<a class="btn sec" href="#q/${c.id}">换一组再测</a></p>`:`<p><a class="btn sec" href="#th/${s.id}">再来 15 题</a></p>`}</div>`}
function ans(i,j){const s=st.get("quiz");if(s.done)return;s.ans[i]=j;st.set("quiz",s);const y=scrollY;route();scrollTo(0,y)}
function submitQ(){const s=st.get("quiz");const un=s.qs.length-Object.keys(s.ans).length;if(un&&!confirm(`还有 ${un} 题未答，确定交卷？`))return;
 s.done=true;st.set("quiz",s);const sc=s.qs.filter((m,i)=>s.ans[i]===m.a).length;
 if(s.kind==="diag"){const R=st.get("diag",{});R[s.id]={s:sc,n:s.qs.length,t:Date.now()};st.set("diag",R)}
 route();scrollTo(0,0)}
// ---------- SQL lab ----------
async function getSQL(){if(SQL)return SQL;await new Promise((ok,no)=>{const e=document.createElement("script");e.src=SQLCDN+"sql-wasm.js";e.onload=ok;e.onerror=no;document.head.appendChild(e)});SQL=await initSqlJs({locateFile:f=>SQLCDN+f});return SQL}
function freshDB(){const db=new SQL.Database();db.exec(SQL_SETUP);return db}
function runAll(db,q){const r=db.exec(q);return r.length?r[r.length-1]:{columns:[],values:[]}}
function tbl(r){if(!r||!r.columns.length)return`<p class="k">（没有结果集）</p>`;return `<div class="tw"><table><tr>${r.columns.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>${r.values.slice(0,50).map(v=>`<tr>${v.map(x=>`<td>${x===null?'<i class="k">NULL</i>':esc(x)}</td>`).join("")}</tr>`).join("")}</table></div><p class="k">${r.values.length} 行</p>`}
function norm(r,ord){const rows=r.values.map(v=>JSON.stringify(v.map(x=>typeof x==="number"?Math.round(x*1000)/1000:x)));return ord?rows:rows.sort()}
V.sql=i=>{if(i==null){const S=st.get("sql",{});let lv="";
 return `<p class="k"><a href="#home">← 重学</a></p><h1>Elective A · SQL Lab</h1><p class="sub">从零开始。每题在浏览器里跑真的 SQLite，结果集与标准答案比对。只有提示，没有自动给答案。</p>
 <details><summary>示例数据表（DSE 风格）</summary><pre>STUDENT(<u>SID</u>, SNAME, CLASS, SEX, HOUSE, DOB)
CLUB(<u>CID</u>, CNAME, ROOM, FEE)
MEMBER(<u>SID</u>, <u>CID</u>, JDATE)   SID → STUDENT, CID → CLUB
SCORE(<u>SID</u>, <u>SUBJ</u>, MARK)</pre></details>
 ${SQLX.map((x,k)=>{const h=x.lv!==lv?`<h2>${esc(x.lv)}</h2>`:"";lv=x.lv;return h+`<a class="pi ${S[k]?"g":"n"}" href="#sql/${k}"><span class="no">${k+1}</span><span><b>${esc(x.t)}</b><br><span class="k">${esc(x.q)}</span></span></a>`}).join("")}
 <h2>Sandbox</h2><p><a class="btn sec" href="#sql/free">自由练习</a> <a class="btn sec" href="#th/A">Normalisation / ER 理论题</a></p>`}
 const free=i==="free";const x=free?{t:"Sandbox",q:"随便写 SQL，试试示例数据表。"}:SQLX[+i];if(!x)return"";const code=st.get("sqlc",{})[i]||"";
 setTimeout(()=>getSQL().then(()=>{$("#sqlst").textContent="SQLite 已就绪";if(!free)showTables()}).catch(()=>$("#sqlst").textContent="SQLite 载入失败，请检查网络"),0);
 return `<p class="k"><a href="#sql">← SQL Lab</a></p><h1>${free?"Sandbox":(+i+1)+". "+esc(x.t)}</h1><div class="box"><p>${esc(x.q)}</p>${x.chk?`<p class="k">这题会改动数据；每次「运行」都在全新的示例数据上执行。</p>`:""}</div>
 <textarea id="ed" class="code" spellcheck="false" autocapitalize="off" autocorrect="off" placeholder="SELECT ..." oninput="saveC('sqlc','${i}',this.value)">${esc(code)}</textarea>
 <p><button class="btn" onclick="runSQL('${i}')">运行 ▶</button>${free?"":`<button class="btn sec" onclick="hint('${i}')">提示</button>`}<span id="sqlst" class="k">载入 SQLite…</span></p>
 <div id="hint"></div><div id="res" class="out"></div>${x.kw?`<details><summary>DSE 用语</summary><p class="ms">${esc(x.kw)}</p></details>`:""}
 <details><summary>数据表内容</summary><div id="tabs"></div></details>`};
function showTables(){const db=freshDB();$("#tabs").innerHTML=["STUDENT","CLUB","MEMBER","SCORE"].map(t=>`<h3>${t}</h3>`+tbl(runAll(db,"SELECT * FROM "+t))).join("");db.close()}
function saveC(k,i,v){const c=st.get(k,{});c[i]=v;st.set(k,c)}
let HN={};function hint(i){HN[i]=(HN[i]||0)+1;const h=SQLX[+i].h;$("#hint").innerHTML=h.slice(0,HN[i]).map((x,k)=>`<p class="ms">提示 ${k+1}：${esc(x)}</p>`).join("")+(HN[i]>=h.length?`<p class="k">提示已全部显示。</p>`:"")}
async function runSQL(i){await getSQL();const q=$("#ed").value.trim();const out=$("#res");if(!q){out.innerHTML="";return}
 const db=freshDB();let r;try{r=runAll(db,q)}catch(e){out.innerHTML=`<p class="fail">错误：${esc(e.message)}</p>`;db.close();return}
 if(i==="free"){out.innerHTML=tbl(r);db.close();return}
 const x=SQLX[+i];let pass,shown=r;
 try{if(x.chk){const u=runAll(db,x.chk);const m=freshDB();m.exec(x.ans);const e=runAll(m,x.chk);m.close();pass=JSON.stringify(norm(u,1))===JSON.stringify(norm(e,1));shown=u}
 else{const m=freshDB();const e=runAll(m,x.ans);m.close();pass=r.columns.length===e.columns.length&&JSON.stringify(norm(r,x.ord))===JSON.stringify(norm(e,x.ord));
  if(!pass&&r.columns.length===e.columns.length&&x.ord&&JSON.stringify(norm(r))===JSON.stringify(norm(e)))out.dataset.m="顺序不对，检查 ORDER BY。";else if(!pass&&r.columns.length!==e.columns.length)out.dataset.m=`栏位数量不对：应为 ${e.columns.length} 栏。`;else out.dataset.m=`行数：你的 ${r.values.length}，应为 ${e.values.length}。`}}
 catch(e){pass=false;out.dataset.m=e.message}
 db.close();if(pass){const S=st.get("sql",{});S[i]=1;st.set("sql",S)}
 out.innerHTML=(pass?`<p class="pass">✓ 正确！</p>${+i+1<SQLX.length?`<p><a class="btn" href="#sql/${+i+1}">下一题 →</a></p>`:""}`:`<p class="fail">✗ 结果不对。${esc(out.dataset.m||"")}</p>`)+(x.chk?`<p class="k">执行后的表：</p>`:"")+tbl(shown)}
// ---------- Web lab ----------
V.web=i=>{if(i==null){const S=st.get("web",{});let lv="";
 return `<p class="k"><a href="#home">← 重学</a></p><h1>Elective B · Web Lab</h1><p class="sub">左边写代码，右边即时预览；按「检查」自动批改。从 HTML 结构开始。</p>
 ${WEBX.map((x,k)=>{const h=x.lv!==lv?`<h2>${esc(x.lv)}</h2>`:"";lv=x.lv;return h+`<a class="pi ${S[k]?"g":"n"}" href="#web/${k}"><span class="no">${k+1}</span><span><b>${esc(x.t)}</b><br><span class="k">${x.q}</span></span></a>`}).join("")}
 <h2>Sandbox</h2><p><a class="btn sec" href="#web/free">自由编辑器</a> <a class="btn sec" href="#th/B">HTTP / cookies / security 理论题</a></p>`}
 const free=i==="free";const x=free?{t:"Sandbox",q:"随便写 HTML / CSS / JS。",starter:"<!DOCTYPE html>\n<html>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>"}:WEBX[+i];if(!x)return"";const saved=st.get("webc",{})[i];
 setTimeout(()=>preview(),0);
 return `<p class="k"><a href="#web">← Web Lab</a></p><h1>${free?"Sandbox":(+i+1)+". "+esc(x.t)}</h1><div class="box"><p>${x.q}</p>${x.tests?`<ul class="k">${x.tests.map(t=>`<li>${esc(t[0])}</li>`).join("")}</ul>`:""}</div>
 <div class="split"><textarea id="ed" class="code" spellcheck="false" autocapitalize="off" autocorrect="off" onkeydown="tabK(event)" oninput="saveC('webc','${i}',this.value);clearTimeout(window.pt);window.pt=setTimeout(preview,400)">${esc(saved!=null?saved:x.starter)}</textarea>
 <iframe id="pv" sandbox="allow-scripts allow-same-origin allow-modals" title="preview"></iframe></div>
 <p>${free?"":`<button class="btn" onclick="checkWeb('${i}')">检查 ✓</button><button class="btn sec" onclick="whint('${i}')">提示</button>`}<button class="btn sec" onclick="if(confirm('恢复起始代码？')){$('#ed').value=WEBX[+'${i}']?WEBX[+'${i}'].starter:'';saveC('webc','${i}',$('#ed').value);preview()}">重置</button></p>
 <div id="hint"></div><div id="res" class="out"></div>${x.kw?`<details><summary>DSE 用语</summary><p class="ms">${x.kw}</p></details>`:""}`};
function tabK(e){if(e.key==="Tab"){e.preventDefault();const t=e.target,s=t.selectionStart;t.value=t.value.slice(0,s)+"  "+t.value.slice(t.selectionEnd);t.selectionStart=t.selectionEnd=s+2}}
const guard="<base target='_blank'><script>document.addEventListener('submit',e=>e.preventDefault(),true)<\/script>";
function preview(){const f=$("#pv");if(!f)return Promise.resolve();return new Promise(ok=>{f.onload=()=>ok(f);f.srcdoc=guard+$("#ed").value})}
function whint(i){HN["w"+i]=(HN["w"+i]||0)+1;const h=WEBX[+i].h;$("#hint").innerHTML=h.slice(0,HN["w"+i]).map((x,k)=>`<p class="ms">提示 ${k+1}：${x}</p>`).join("")}
async function checkWeb(i){const x=WEBX[+i];const f=await preview();await new Promise(r=>setTimeout(r,80));const d=f.contentDocument,w=f.contentWindow;
 const res=x.tests.map(t=>{try{return !!t[1](d,w)}catch(e){return false}});const pass=res.every(Boolean);preview();
 if(pass){const S=st.get("web",{});S[i]=1;st.set("web",S)}
 $("#res").innerHTML=x.tests.map((t,k)=>`<div class="${res[k]?"pass":"fail"}">${res[k]?"✓":"✗"} ${esc(t[0])}</div>`).join("")+(pass?`<p class="pass">全部通过！</p>${+i+1<WEBX.length?`<p><a class="btn" href="#web/${+i+1}">下一题 →</a></p>`:""}`:"")}
// ---------- router ----------
function route(){const h=(location.hash||"#home").slice(1).split("/");const f=V[h[0]]||V.home;const html=f(h[1]);if(html!==""){app.innerHTML=html}}
addEventListener("hashchange",()=>{route();scrollTo(0,0)});
(async()=>{app.innerHTML="<p class='sub'>Loading…</p>";try{D=await (await fetch(RAW+"data/relearn.json?v="+Date.now())).json()}catch(e){app.innerHTML="<p>载入失败，请刷新。</p>";return}route()})();
