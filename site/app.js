// S5 ICT Learning Portal v2
const $=s=>document.querySelector(s);const app=$("#app");
const LT="ABCD";
const RAW="https://raw.githubusercontent.com/wujiyan09/ict-portal/main/";
const store={get(k,d){try{const v=JSON.parse(localStorage.getItem("ict:"+k));return v==null?d:v}catch(e){return d}},set(k,v){localStorage.setItem("ict:"+k,JSON.stringify(v))}};
const esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const hasTag=s=>/<(br|b|i|table|tr|td|pre|code|ul|li|p|span|sub|sup|u)\b/i.test(s||"");
const rich=(s,code)=>code?`<pre>${esc(s)}</pre>`:(hasTag(s)?wrapT(s):esc(s).replace(/\n/g,"<br>"));
const wrapT=s=>String(s).replace(/<table/g,'<div class="tw"><table').replace(/<\/table>/g,"</table></div>");
const shuffle=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
const EN=()=>store.get("lang","zh")==="en";
const T=(en,zh)=>EN()?en:zh;
const PG=(y,p)=>RAW+"pages/"+String(y).toLowerCase()+"-p1-"+String(p).padStart(2,"0")+".jpg";
const TOPIC={A1:["Information processing & data representation","A 资讯处理与数据表示"],A2:["Spreadsheet & database","A 试算表与数据库"],B:["Computer system fundamentals","B 电脑系统基础"],C1:["Networks & Internet","C 网络与互联网"],C2:["Web, security & privacy","C 网页、保安与私隐"],D1:["Algorithms & problem solving","D 算法与解难"],D2:["Programming & testing","D 编程与测试"],E:["Social implications","E 社会影响"]};
const tName=t=>TOPIC[t]?T(TOPIC[t][0],TOPIC[t][1]):t;

// ---------- data model ----------
let BK=[];const IT={};const LQ=[];const DQ=[]; // books, item registry, DSE long, DSE MC
function normBook(b){const nb={id:b.id,name:b.name,nz:b.nz||"",elective:!!b.elective||/^E[ABC]$/.test(b.id),note:b.note||"",chs:[]};
 (b.chs||[]).forEach(c=>{const ch={id:c.id,n:c.n,t:c.t,tz:c.tz||"",sec:c.sec||[],book:nb,cards:[],mc:[],sq:[],pr:[]};
  (c.cards||[]).forEach((k,i)=>{ch.cards.push(Array.isArray(k)?{t:k[0],tz:"",ty:k[1],en:"",zh:k[2],sec:k[3]||"",ex:[]}:{ex:[],...k})});
  (c.mc||[]).forEach((m,i)=>{const it=Array.isArray(m)?{q:m[0],o:m[1],a:m[2],e:m[3]}:{...m,a:typeof m.a==="string"?LT.indexOf(m.a):m.a};
   it.type="mc";it.key=ch.id+"-m"+i;it.orig=true;it.ch=ch.id;it.bk=nb.id;it.src=it.src||"";it.code=it.code||/\n/.test(it.q);IT[it.key]=it;ch.mc.push(it)});
  (c.sq||[]).forEach((s,i)=>{const it=Array.isArray(s)?{q:s[0],parts:[{l:"",q:"",m:0,ms:s[1]}]}:{...s};if(!it.parts)it.parts=[{l:"",q:"",m:it.m||0,ms:it.ms||it.a||""}];
   it.type="sq";it.key=ch.id+"-s"+i;it.src=it.src||"";it.orig=true;it.ch=ch.id;it.bk=nb.id;IT[it.key]=it;ch.sq.push(it)});
  (c.pr||[]).forEach((p,i)=>{const it={...p,type:"pr",key:ch.id+"-p"+i,orig:true,ch:ch.id,bk:nb.id};IT[it.key]=it;ch.pr.push(it)});
  nb.chs.push(ch)});return nb}
function addDSE(d){const y0=String(d.year);const Y=/^(sp|pp)$/i.test(y0)?y0.toUpperCase():y0;const yl=y0.toLowerCase();
 for(let i=DQ.length-1;i>=0;i--)if(DQ[i].y===Y)DQ.splice(i,1);
 (d.mc||[]).forEach(q=>{const it={type:"mc",key:"dse-"+Y+"-"+q.n,y:Y,n:q.n,q:q.q,st:q.st,o:q.o,a:LT.indexOf(q.a),pct:q.pct||((PCT[Y]||[])[q.n-1]||""),topic:q.topic,e:q.exp||"",code:q.code,fig:q.fig?PG(yl,q.pg):"",orig:false,src:yLabel(Y)+" 1A Q"+q.n};
  if(q.a==="*")it.cancel=true;IT[it.key]=it;DQ.push(it)});
 (d.lq||[]).forEach(l=>{const it={type:"lq",key:"lq-"+Y+"-"+l.n,y:Y,n:l.n,topic:l.topic,q:l.stem||"",parts:l.parts||[],pg:[].concat(l.pg||[]).map(p=>PG(yl,p)),orig:false,src:yLabel(Y)+" 1B Q"+l.n};IT[it.key]=it;LQ.push(it)});
 const YY=YEARS.find(x=>x.y===Y);if(YY)YY.inapp=true}
const yLabel=Y=>Y==="SP"?"Sample Paper":Y==="PP"?"Practice Paper":"DSE "+Y;
function legacyDSE(){DSEQ.forEach(q=>{const [y,n]=q.id.split("-");const Y=y;if(DQ.some(x=>x.y===Y))return;
 const it={type:"mc",key:"dse-"+Y+"-"+n,y:Y,n:+n,q:q.q,st:q.st,o:q.o,a:LT.indexOf(q.a),pct:(PCT[Y]||[])[n-1]||"",topic:q.topic,e:q.exp,code:q.code,orig:false,src:yLabel(Y)+" 1A Q"+n};IT[it.key]=it;DQ.push(it)})}
const allCh=()=>BK.flatMap(b=>b.chs);
const chOf=id=>allCh().find(c=>c.id===id);
const chName=c=>`${c.book.id} Ch${c.n} ${T(c.t,c.tz||c.t)}`;

// ---------- history ----------
const H=()=>store.get("hist",{}); // key -> {r:[1,0,..], last}
function rec(key,ok){const h=H();const e=h[key]||{r:[]};e.r.push(ok?1:0);e.r=e.r.slice(-5);e.last=Date.now();h[key]=e;store.set("hist",h)}
function prio(keys){const h=H();return shuffle(keys).sort((a,b)=>{const s=k=>{const e=h[k];if(!e)return 0;return e.r[e.r.length-1]?2:1};return s(a)-s(b)})}
function stat(keys){const h=H();let d=0,c=0;keys.forEach(k=>{const e=h[k];if(e){d++;if(e.r[e.r.length-1])c++}});return{d,c,n:keys.length}}

// ---------- session engine (one question per page, marked at end) ----------
function startSession(title,keys,back){if(!keys.length){alert(T("No questions in this scope yet.","这个范围暂时没有题目。"));return}
 store.set("sess",{title,keys,ans:{},self:{},done:false,back:back||"#home",t:Date.now()});location.hash="#s/0"}
const S=()=>store.get("sess",null);
function saveAns(i,v){const s=S();s.ans[i]=v;store.set("sess",s)}
function itemQ(it){let h=`<div class="k">${esc(it.src||"")}${it.pct&&!it.orig?" · "+T("% correct","当年答对率")+" "+esc(it.pct):""}</div>`;
 h+=`<div style="margin-top:6px">${rich(it.q,it.code&&!hasTag(it.q))}</div>`;
 if(it.fig)h+=`<a href="${it.fig}" target="_blank"><img class="fig" src="${it.fig}" loading="lazy"></a>`;
 if(it.st&&it.st.length)h+=`<div style="margin:6px 0">${it.st.map((s,i)=>(/^\s*\(\d\)/.test(s)?"":`(${i+1}) `)+rich(s)).join("<br>")}</div>`;
 return h}
function vSess(i){const s=S();if(!s)return`<p>${T("No active session.","没有进行中的练习。")} <a href="#home">←</a></p>`;
 if(i==="r")return vResult();i=+i;const it=IT[s.keys[i]];if(!it)return"?";const a=s.ans[i];
 let h=`<p class="k"><a href="${s.back}">← ${T("Quit","退出")}</a> · ${esc(s.title)}</p><div class="dots">${s.keys.map((k,j)=>`<a href="#s/${j}" class="${j===i?"cur":""} ${s.ans[j]!=null&&s.ans[j]!==""?"d":""}">${j+1}</a>`).join("")}</div><div class="box">`;
 h+=itemQ(it);
 if(it.type==="mc")h+=it.o.map((o,j)=>`<button class="opt ${a===j?"sel":""}" onclick="saveAns(${i},${j});route()">${LT[j]}. ${rich(o,it.code&&/\n/.test(o))}</button>`).join("");
 else if(it.type==="sq"||it.type==="lq"){if(it.pg&&it.pg.length)h+=`<p>${it.pg.map((p,j)=>`<a href="${p}" target="_blank">${T("Original page","原卷页面")} ${j+1}</a>`).join(" · ")}</p>`;
  h+=it.parts.map((p,j)=>`<div style="margin-top:12px"><b>${esc(p.l||"")}</b> ${rich(p.q)} ${p.m?`<span class="k">(${p.m} ${T("marks","分")})</span>`:""}<textarea oninput="sAns(${i},${j},this.value)">${esc((a||{})[j]||"")}</textarea></div>`).join("")}
 else if(it.type==="pr")h+=prBody(it,"sp"+i,(a||{}).code,i);
 h+=`</div><div class="nav2"><span>${i>0?`<a class="btn sec" href="#s/${i-1}">← ${T("Prev","上一题")}</a>`:""}${i<s.keys.length-1?`<a class="btn sec" href="#s/${i+1}">${T("Next","下一题")} →</a>`:""}</span><button class="btn" onclick="submitSess()">${T("Submit all","交卷")}</button></div>`;
 return h}
function sAns(i,j,v){const s=S();s.ans[i]=s.ans[i]||{};s.ans[i][j]=v;store.set("sess",s)}
function submitSess(){const s=S();const un=s.keys.filter((k,i)=>s.ans[i]==null||s.ans[i]==="").length;
 if(un&&!confirm(T(`${un} unanswered. Submit anyway?`,`还有 ${un} 题没做，确定交卷？`)))return;
 s.done=true;s.keys.forEach((k,i)=>{const it=IT[k];if(it.type==="mc")rec(k,it.cancel||s.ans[i]===it.a);if(it.type==="pr")rec(k,!!(s.ans[i]||{}).pass)});
 store.set("sess",s);saveRun(s);location.hash="#s/r"}
function scoreSess(s){let got=0,tot=0;s.keys.forEach((k,i)=>{const it=IT[k];if(it.type==="mc"){tot++;if(it.cancel||s.ans[i]===it.a)got++}
 else if(it.type==="pr"){tot++;if((s.ans[i]||{}).pass)got++}
 else{it.parts.forEach((p,j)=>{const m=+p.m||1;tot+=m;got+=Math.min(m,+((s.self[i]||{})[j]||0))})}});return{got,tot}}
function saveRun(s){const r=store.get("runs",[]);const sc=scoreSess(s);const ix=r.findIndex(x=>x.t===s.t);const e={t:s.t,title:s.title,got:sc.got,tot:sc.tot};if(ix>=0)r[ix]=e;else r.unshift(e);store.set("runs",r.slice(0,200))}
function selfMark(i,j,v){const s=S();s.self[i]=s.self[i]||{};s.self[i][j]=v;store.set("sess",s);saveRun(s);const sc=scoreSess(s);$("#tot").textContent=`${sc.got}/${sc.tot}`;
 const it=IT[s.keys[i]];rec(it.key,it.parts.every((p,jj)=>(+(s.self[i]||{})[jj]||0)>=(+p.m||1)))}
function vResult(){const s=S();const sc=scoreSess(s);
 let h=`<p class="k"><a href="${s.back}">← ${T("Back","返回")}</a></p><h1>${esc(s.title)}</h1><p style="font-size:28px;margin:4px 0"><b id="tot">${sc.got}/${sc.tot}</b></p><p class="sub">${T("Structured answers: tick the marks you earned against the marking points.","结构题：对照评分要点，自己给分。")}</p>
 <p><button class="btn" onclick='startSession(${JSON.stringify(s.title)},${JSON.stringify(shuffle(s.keys))},${JSON.stringify(s.back)})'>${T("Retry (reshuffled)","再做一次（重新洗牌）")}</button>`;
 const wrong=s.keys.filter((k,i)=>IT[k].type==="mc"&&!IT[k].cancel&&s.ans[i]!==IT[k].a);
 if(wrong.length)h+=`<button class="btn sec" onclick='startSession(${JSON.stringify(T("Redo wrong ones","重做错题"))},${JSON.stringify(wrong)},${JSON.stringify(s.back)})'>${T("Redo wrong","只做错题")} (${wrong.length})</button>`;
 h+="</p>";
 s.keys.forEach((k,i)=>{const it=IT[k];const a=s.ans[i];h+=`<div class="box"><div class="k">${i+1}</div>${itemQ(it)}`;
  if(it.type==="mc"){const ok=it.cancel||a===it.a;h+=it.o.map((o,j)=>`<div class="opt ${j===it.a?"ok":a===j?"bad":""}">${LT[j]}. ${rich(o,it.code&&/\n/.test(o))}</div>`).join("");
   h+=`<p class="${ok?"ok":"bad"}">${ok?"✓":"✗"} ${T("Answer","答案")} ${it.cancel?T("(cancelled, mark given)","（题目取消，全部给分）"):LT[it.a]}${a==null?" · "+T("not answered","未作答"):""}</p>`;
   const ex=T(it.e,it.ez||it.e);if(ex)h+=`<p>${rich(ex)}</p>`}
  else if(it.type==="pr"){const r=a||{};h+=`<p class="${r.pass?"ok":"bad"}">${r.pass?"✓ "+T("All tests passed","全部测试通过"):"✗ "+T("Not passed","未通过")}</p><details><summary>${T("Reference solution","参考答案")}</summary><pre>${esc(it.solution||(it.check||{}).model||"")}</pre></details>`}
  else it.parts.forEach((p,j)=>{const m=+p.m||1;const v=+((s.self[i]||{})[j]||0);h+=`<div style="margin-top:12px"><b>${esc(p.l||"")}</b> ${rich(p.q)}<div class="k">${T("Your answer","你的答案")}</div><div>${esc((a||{})[j]||"—").replace(/\n/g,"<br>")}</div><div class="ms">${rich(p.ms||"")}</div>${T("Marks","得分")}: <select onchange="selfMark(${i},${j},this.value)">${Array.from({length:m+1},(_,x)=>`<option ${x===v?"selected":""}>${x}</option>`).join("")}</select> / ${m}</div>`});
  h+="</div>"});return h}

// ---------- practicals ----------
let SQLJS=null,PY=null;
function loadScript(src){return new Promise((ok,no)=>{const s=document.createElement("script");s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
async function getSQL(){if(SQLJS)return SQLJS;if(!window.initSqlJs)await loadScript("https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js");SQLJS=await initSqlJs({locateFile:f=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/"+f});return SQLJS}
async function getPY(){if(PY)return PY;if(!window.loadPyodide)await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");PY=await loadPyodide();return PY}
function prBody(it,id,code,si){const c=it.check||{};const lg=it.lang||"";
 return `<h3>${esc(T(it.t,it.tz||it.t))} <span class="k">${lg.toUpperCase()}</span></h3><div>${rich(T(it.task,it.taskz||it.task))}</div>
 ${it.setup&&lg==="sql"?`<details><summary>${T("Tables","数据表")}</summary><pre>${esc(it.setup)}</pre></details>`:""}
 ${c.type==="self"?`<textarea class="code" id="ed-${id}" spellcheck="false" autocapitalize="off" onkeydown="tabKey(event)">${esc(code??it.starter??"")}</textarea><details><summary>${T("Model answer","参考答案")}</summary><pre>${esc(c.model||it.solution||"")}</pre></details>`
 :`<textarea class="code" id="ed-${id}" spellcheck="false" autocapitalize="off" autocorrect="off" onkeydown="tabKey(event)">${esc(code??it.starter??"")}</textarea>
 <p><button class="btn" onclick="runPr('${it.key}','${id}',${si??"null"})">${T("Run & check","运行并检查")}</button>${si==null?`<button class="btn sec" onclick="document.getElementById('ed-${id}').value=IT['${it.key}'].solution||'';">${T("Show solution","看参考答案")}</button>`:""}</p>`}
 <div class="out" id="out-${id}"></div>`}
function tabKey(e){if(e.key==="Tab"){e.preventDefault();const t=e.target,s=t.selectionStart;t.value=t.value.slice(0,s)+"    "+t.value.slice(t.selectionEnd);t.selectionStart=t.selectionEnd=s+4}}
const tbl=r=>!r||!r.length?"<p class='k'>(no rows)</p>":r.map(x=>`<div class="tw"><table><tr>${x.columns.map(c=>`<th>${esc(c)}</th>`).join("")}</tr>${x.values.slice(0,50).map(v=>`<tr>${v.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table></div>`).join("");
const norm=v=>v==null?"NULL":typeof v==="number"?String(Math.round(v*1e6)/1e6):String(v);
async function runPr(key,id,si){const it=IT[key];const code=$("#ed-"+id).value;const out=$("#out-"+id);const c=it.check||{};let pass=false,html="";
 out.innerHTML=T("Running…","运行中…");
 try{
 if(it.lang==="sql"){const SQL=await getSQL();const run=(q)=>{const db=new SQL.Database();if(it.setup)db.exec(it.setup);const r=db.exec(q);return{r,db}};
  const u=run(code);html+=tbl(u.r);
  if(c.type==="sql_result"){const e=run(c.expected_sql).r;const rows=r=>r.length?r[r.length-1].values.map(v=>v.map(norm).join("|")):[];
   let A=rows(u.r),B=rows(e);if(!/order\s+by/i.test(c.expected_sql)){A=A.slice().sort();B=B.slice().sort()}
   pass=A.length===B.length&&A.every((x,i)=>x===B[i]);if(!pass)html+=`<details><summary>${T("Expected result","应有结果")}</summary>${tbl(e)}</details>`}
  else if(c.type==="sql_state"){const e=run((it.setup?"":"")+c.expected_sql);pass=true}
 }else if(it.lang==="python"){const py=await getPY();
  py.globals.set("__user",code);py.globals.set("__setup",it.setup||"");py.globals.set("__stdin",c.stdin||"");
  const res=py.runPython(`
import sys,io,traceback
__o=io.StringIO();__g={}
sys.stdout=__o;sys.stdin=io.StringIO(__stdin)
__err=""
try:
    exec(__setup,__g);exec(__user,__g)
except Exception:
    __err=traceback.format_exc(limit=1)
sys.stdout=sys.__stdout__
[__o.getvalue(),__err]`).toJs();
  let so=res[0],err=res[1];html+=so?`<pre>${esc(so)}</pre>`:"";if(err)html+=`<pre class="fail">${esc(err)}</pre>`;
  if(c.type==="py_stdout"){pass=!err&&so.trim().replace(/\s+\n/g,"\n")===String(c.expect).trim().replace(/\s+\n/g,"\n");if(!pass)html+=`<p class="fail">✗ ${T("Expected output","应输出")}:</p><pre>${esc(c.expect)}</pre>`}
  else if(c.type==="py_tests"){pass=!err;for(const t of c.tests||[]){py.globals.set("__call",t.call);let got;
    try{got=py.runPython(`
try:
    __r=eval(__call,__g);__s=[str(__r),repr(__r)]
except Exception as e:
    __s=["Error: "+repr(e),""]
__s`).toJs()}catch(e){got=[String(e),""]}
    const ok=got[0]===String(t.expect)||got[1]===String(t.expect);if(!ok)pass=false;html+=`<div class="${ok?"pass":"fail"}">${ok?"✓":"✗"} <code>${esc(t.call)}</code> → ${esc(got[0])}${ok?"":` (${T("expected","应为")} ${esc(t.expect)})`}</div>`}}}
 else if(it.lang==="js"){if(c.type==="js_tests"){pass=true;for(const t of c.tests||[]){let got;try{got=new Function(code+"\n;return ("+t.call+");")()}catch(e){got="Error: "+e.message}
    const g=typeof got==="string"?got:JSON.stringify(got);const ok=String(got)===String(t.expect)||g===String(t.expect);if(!ok)pass=false;html+=`<div class="${ok?"pass":"fail"}">${ok?"✓":"✗"} <code>${esc(t.call)}</code> → ${esc(String(got))}${ok?"":` (${T("expected","应为")} ${esc(t.expect)})`}</div>`}}
   else if(c.type==="html_dom")({pass,html}=await domCheck(code,c));}
 else if(it.lang==="html"||c.type==="html_dom"){({pass,html}=await domCheck(code,c))}
 }catch(e){html+=`<pre class="fail">${esc(e.message||e)}</pre>`}
 html=`<p class="${pass?"pass":"fail"}"><b>${pass?"✓ "+T("Passed","通过"):"✗ "+T("Not yet","未通过")}</b></p>`+html;out.innerHTML=html;
 if(si!=null){saveAns(si,{code,pass})}else{rec(key,pass)}}
function domCheck(code,c){return new Promise(res=>{const f=document.createElement("iframe");f.style.display="none";f.setAttribute("sandbox","allow-same-origin");document.body.appendChild(f);
 f.onload=()=>{const d=f.contentDocument;let pass=true,html="";(c.checks||[]).forEach(k=>{const els=[...d.querySelectorAll(k.sel)];let ok=true,msg=k.sel;
  if(k.count!=null){ok=els.length===k.count;msg+=` × ${els.length} (${T("need","需要")} ${k.count})`}else if(!els.length){ok=false;msg+=" "+T("not found","找不到")}
  if(ok&&k.text!=null){ok=els.some(e=>e.textContent.trim().includes(k.text));msg+=` "${k.text}"`}
  if(ok&&k.attr){ok=els.some(e=>k.value==null?e.hasAttribute(k.attr):e.getAttribute(k.attr)==k.value);msg+=` [${k.attr}${k.value!=null?"="+k.value:""}]`}
  if(ok&&k.style){const w=f.contentWindow;ok=els.some(e=>w.getComputedStyle(e)[k.style]===k.value);msg+=` {${k.style}: ${k.value}}`}
  if(!ok)pass=false;html+=`<div class="${ok?"pass":"fail"}">${ok?"✓":"✗"} <code>${esc(msg)}</code></div>`});
  f.remove();res({pass,html})};f.srcdoc=code})}

// ---------- views ----------
const V={};
V.home=()=>{const chs=allCh();const nc=chs.reduce((a,c)=>a+c.cards.length,0),nm=chs.reduce((a,c)=>a+c.mc.length,0),np=chs.reduce((a,c)=>a+c.pr.length,0);
 return `<h1>S5 ICT</h1><p class="sub">HKDSE ICT · ICT for iGeneration</p>
 <div class="seg"><button class="${EN()?"on":""}" onclick="setLang('en')">全英文</button><button class="${EN()?"":"on"}" onclick="setLang('zh')">英文知识点 + 中文讲解</button></div>
 <div class="list" style="margin-top:16px">
 <a href="#learn"><span>${T("Textbook: cards & practice","课本：知识卡与练习")}</span><span>${chs.length} ${T("ch","章")} · ${nc} ${T("cards","卡")} · ${nm} MC · ${np} ${T("practicals","实操")}</span></a>
 <a href="#dse"><span>${T("DSE past papers","DSE 真题")}</span><span>${DQ.length} MC · ${LQ.length} ${T("long Qs","长题")}</span></a>
 <a href="#quiz"><span>${T("Quiz zone","测验区")}</span><span>${T("build your own","自选范围")}</span></a>
 <a href="#tools"><span>${T("Tools","工具")}</span><span>SQL · ${T("base","进制")} · subnet</span></a>
 <a href="#progress"><span>${T("Progress","进度")}</span><span></span></a></div>`};
function setLang(l){store.set("lang",l);route()}
V.learn=()=>{const sec=(f,title)=>`<h2>${title}</h2>`+BK.filter(f).map(b=>`<div class="k" style="margin-top:14px">${esc(b.id)} · ${esc(T(b.name,b.nz||b.name))}${b.note?" · "+esc(b.note):""}</div><div class="list">${b.chs.map(c=>{const s=stat(c.mc.map(m=>m.key));return `<a href="#ch/${c.id}"><span>Ch${c.n} ${esc(T(c.t,c.tz||c.t))}</span><span>${s.d?`${s.c}/${s.d}`:""}</span></a>`}).join("")}</div>`).join("");
 return `<h1>${T("Textbook","课本")}</h1>`+sec(b=>!b.elective,T("Compulsory","必修部分"))+sec(b=>b.elective,T("Electives","选修部分"))};
function chTabs(c,on){return `<p class="k"><a href="#learn">← ${T("Textbook","课本")}</a></p><h1>${esc(chName(c))}</h1><div class="tabs">
 <a class="${on==="c"?"on":""}" href="#cards/${c.id}/0">${T("Cards","知识卡")} ${c.cards.length}</a><a class="${on==="p"?"on":""}" href="#ch/${c.id}">${T("Practice","练习")} ${c.mc.length}</a><a class="${on==="s"?"on":""}" href="#sq/${c.id}">${T("Structured","结构题")} ${c.sq.length}</a>${c.pr.length?`<a class="${on==="r"?"on":""}" href="#pr/${c.id}">${T("Hands-on","实操")} ${c.pr.length}</a>`:""}</div>`}
V.ch=id=>{const c=chOf(id);if(!c)return"?";const keys=c.mc.map(m=>m.key);const s=stat(keys);
 const bySec=c.sec.map(x=>{const n=x.split(" ")[0];const k=c.mc.filter(m=>(m.sec||"")===n).map(m=>m.key);return [x,k]}).filter(x=>x[1].length);
 return chTabs(c,"p")+`<p class="sub">${T("One question per page, marked at the end. Unseen and wrong questions come first.","一页一题，做完统一批改。没做过和做错的题优先出现。")} ${s.d?`${T("Done","已做")} ${s.d}/${s.n} · ${T("correct","答对")} ${s.c}`:""}</p>
 ${[10,20,40].filter(n=>n<keys.length).concat([keys.length]).map(n=>`<button class="btn ${n===10?"":"sec"}" onclick='startSession(${JSON.stringify(chName(c))},prio(${JSON.stringify(keys)}).slice(0,${n}),"#ch/${c.id}")'>${n===keys.length?T("All","全部")+" "+n:n+" "+T("Qs","题")}</button>`).join("")}
 ${bySec.length>1?`<h2>${T("By section","按小节")}</h2><div class="list">${bySec.map(([t,k])=>{const st=stat(k);return `<a href="javascript:void 0" onclick='startSession(${JSON.stringify(t)},prio(${JSON.stringify(k)}).slice(0,10),"#ch/${c.id}")'><span>${esc(t)}</span><span>${k.length} · ${st.d?st.c+"/"+st.d:""}</span></a>`}).join("")}</div>`:""}
 ${relDSE(c)}`};
function relDSE(c){const t=c.book.elective?null:{A1:"A1",A2:"A2",B:"B",C1:"C1",C2:"C2",D1:"D1",D2:"D2",E:"E"}[c.book.id];if(!t)return"";const k=DQ.filter(q=>q.topic===t).map(q=>q.key);
 return k.length?`<h2>${T("Related DSE questions","相关 DSE 真题")}</h2><button class="btn sec" onclick='startSession(${JSON.stringify(tName(t))},prio(${JSON.stringify(k)}).slice(0,10),"#ch/${c.id}")'>${k.length} ${T("real questions · start 10","题真题 · 做 10 题")}</button>`:""}
V.cards=(id,i)=>{const c=chOf(id);if(!c)return"?";i=+i||0;const k=c.cards[i];if(!k)return chTabs(c,"c")+"<p class='sub'>—</p>";
 const seen=store.get("seen",{});seen[c.id+"-"+i]=1;store.set("seen",seen);
 const body=EN()?(k.en||k.zh):(k.zh||k.en);
 return chTabs(c,"c")+`<div class="k">${esc(k.sec||"")} · ${esc(k.ty||"")} · ${i+1}/${c.cards.length}</div><div class="box"><h3>${esc(EN()?k.t:(k.tz?k.tz+" / "+k.t:k.t))}</h3><div>${wrapT(body)}</div>
 ${(k.ex||[]).map((e,j)=>`<div style="margin-top:14px"><b>${T("Example","例题")} ${j+1}</b><div>${rich(e.q)}</div><details><summary>${T("Worked solution","看解答")}</summary><div>${wrapT(EN()?e.a:(e.az?e.a+"<div class='ms'>"+e.az+"</div>":e.a))}</div></details></div>`).join("")}</div>
 <div class="nav2"><span>${i>0?`<a class="btn sec" href="#cards/${id}/${i-1}">←</a>`:""}<select onchange="location.hash='#cards/${id}/'+this.value">${c.cards.map((x,j)=>`<option value="${j}" ${j===i?"selected":""}>${j+1}. ${esc(x.t).slice(0,40)}</option>`).join("")}</select></span>${i<c.cards.length-1?`<a class="btn" href="#cards/${id}/${i+1}">${T("Next","下一张")} →</a>`:`<a class="btn" href="#ch/${id}">${T("Practice","去练习")} →</a>`}</div>`};
V.sq=id=>{const c=chOf(id);const keys=c.sq.map(s=>s.key);return chTabs(c,"s")+`<p class="sub">${T("Write your answers, then compare with the marking points and mark yourself.","先写答案，交卷后对照评分要点自己给分。")}</p>${keys.length?`<button class="btn" onclick='startSession(${JSON.stringify(chName(c)+" · "+T("Structured","结构题"))},prio(${JSON.stringify(keys)}).slice(0,4),"#sq/${c.id}")'>${T("Start 4","做 4 题")}</button><button class="btn sec" onclick='startSession(${JSON.stringify(chName(c))},${JSON.stringify(keys)},"#sq/${c.id}")'>${T("All","全部")} ${keys.length}</button>`:"<p class='sub'>—</p>"}`};
V.pr=id=>{const c=chOf(id);const h=H();return chTabs(c,"r")+`<div class="list">${c.pr.map((p,i)=>{const e=h[p.key];return `<a href="#p/${c.id}/${i}"><span>${esc(T(p.t,p.tz||p.t))}</span><span>${(p.lang||"").toUpperCase()} ${e?(e.r[e.r.length-1]?"✓":"✗"):""}</span></a>`}).join("")}</div>`};
V.p=(id,i)=>{const c=chOf(id);const p=c.pr[+i];if(!p)return"?";return chTabs(c,"r")+`<div class="box">${prBody(p,"x",null,null)}</div><div class="nav2"><span>${+i>0?`<a class="btn sec" href="#p/${id}/${+i-1}">←</a>`:""}</span>${+i<c.pr.length-1?`<a class="btn sec" href="#p/${id}/${+i+1}">→</a>`:""}</div>`};

V.dse=()=>{const tp=Object.keys(TOPIC);
 return `<h1>${T("DSE past papers","DSE 真题")}</h1><p class="sub">${T("Verbatim HKDSE ICT Paper 1 questions. Official keys and % correct;","HKDSE ICT 卷一原题照录。官方答案与当年答对率，")}</p>
 <h2>${T("MC by topic","选择题 · 按课题")}</h2><div class="list">${tp.map(t=>{const k=DQ.filter(q=>q.topic===t).map(q=>q.key);const s=stat(k);return k.length?`<a href="javascript:void 0" onclick='startSession(${JSON.stringify(tName(t))},prio(${JSON.stringify(k)}).slice(0,20),"#dse")'><span>${esc(tName(t))}</span><span>${k.length} · ${s.d?s.c+"/"+s.d:""}</span></a>`:""}).join("")}</div>
 <h2>${T("Section B long questions by topic","Section B 长题 · 按课题")}</h2><div class="list">${tp.map(t=>{const k=LQ.filter(q=>q.topic===t).map(q=>q.key);return k.length?`<a href="javascript:void 0" onclick='startSession(${JSON.stringify("1B · "+tName(t))},prio(${JSON.stringify(k)}).slice(0,3),"#dse")'><span>${esc(tName(t))}</span><span>${k.length}</span></a>`:""}).join("")}</div>
 <h2>${T("By year","按年份")}</h2><div class="list">${YEARS.map(y=>{const r=store.get("sheet:"+y.y,null);const n=DQ.filter(q=>q.y===y.y).length;return `<a href="#year/${y.y}"><span>${esc(y.label||"HKDSE "+y.y)}</span><span>${n?T("in-site","站内")+" · ":""}${r&&r.done?r.score+"/"+KEYS[y.y].length:""}</span></a>`}).join("")}</div>`};
V.year=y=>{const Y=YEARS.find(x=>x.y===y);const key=KEYS[y];const pct=PCT[y]||[];const st=store.get("sheet:"+y,{a:{},done:false});
 const mq=DQ.filter(q=>q.y===y).sort((a,b)=>a.n-b.n).map(q=>q.key);const lq=LQ.filter(q=>q.y===y).sort((a,b)=>a.n-b.n).map(q=>q.key);
 let h=`<p class="k"><a href="#dse">← ${T("Past papers","真题")}</a></p><h1>${esc(Y.label||"HKDSE "+y)} ICT Paper 1</h1><p>`;
 if(mq.length)h+=`<button class="btn" onclick='startSession(${JSON.stringify(yLabel(y)+" 1A")},${JSON.stringify(mq)},"#year/${y}")'>1A ${T("in-site","站内整卷")} (${mq.length})</button>`;
 if(lq.length)h+=`<button class="btn" onclick='startSession(${JSON.stringify(yLabel(y)+" 1B")},${JSON.stringify(lq)},"#year/${y}")'>1B ${T("long questions","长题")} (${lq.length})</button>`;
 h+="</p><p>"+(Y.paper?`<a href="${Y.paper}" target="_blank">${T("Paper PDF","试卷 PDF")}</a>`:`<span class="k">${T("No public PDF found for this year. Use your own copy with the answer sheet.","这一年没有找到公开试卷，可用自己的试卷配合答题纸。")}</span>`)+(Y.ms?` · <a href="${Y.ms}" target="_blank">Marking scheme</a>`:"")+"</p>";
 h+=`<h2>${T("Answer sheet","答题纸")}${Y.note?` <span class="k">${esc(Y.note)}</span>`:""}</h2><div class="sheet">${key.split("").map((k,i)=>{const a=st.a[i+1];return `<div><b>${i+1}</b>${[..."ABCD"].map(l=>{let c=a===l?"sel":"";if(st.done&&k!=="*"){if(l===k)c="ok";else if(a===l)c="bad"}return `<button class="${c}" onclick="pick('${y}',${i+1},'${l}')">${l}</button>`}).join("")}${st.done?`<span class="pc">${k==="*"?T("cancelled","取消"):(pct[i]&&pct[i]!=="-"?pct[i]:"")}</span>`:""}</div>`}).join("")}</div>
 <p>${st.done?`<b style="font-size:22px">${st.score}/${key.length}</b> <button class="btn sec" onclick="sheetReset('${y}')">${T("Clear","清空")}</button>`:`<button class="btn" onclick="sheetDone('${y}')">${T("Submit","提交")}</button>`}</p>`;return h};
function pick(y,n,l){const st=store.get("sheet:"+y,{a:{},done:false});if(st.done)return;st.a[n]=st.a[n]===l?undefined:l;store.set("sheet:"+y,st);route()}
function sheetDone(y){const st=store.get("sheet:"+y,{a:{},done:false});st.score=KEYS[y].split("").filter((c,i)=>c==="*"||st.a[i+1]===c).length;st.done=true;store.set("sheet:"+y,st);route()}
function sheetReset(y){store.set("sheet:"+y,{a:{},done:false});route()}

V.quiz=()=>{const q=store.get("qz",{n:20,scope:[],type:["mc"],mix:50});const ck=(name,v,lab,on)=>`<label class="ck"><input type="checkbox" name="${name}" value="${v}" ${on?"checked":""}> ${esc(lab)}</label>`;
 return `<h1>${T("Quiz zone","测验区")}</h1><p class="sub">${T("Pick scope, type and mix. One question per page, marked at the end.","选范围、题型和比例。一页一题，交卷后统一批改。")}</p><form id="qf" onsubmit="event.preventDefault();buildQuiz()">
 <h2>${T("Number of questions","题数")}</h2><input type="number" name="n" min="1" max="200" value="${q.n}">
 <h2>${T("Scope","范围")}</h2><p>${ck("scope","comp",T("All compulsory","全部必修"),q.scope.includes("comp"))}${ck("scope","elec",T("All electives","全部选修"),q.scope.includes("elec"))}</p>
 <div class="k">${T("DSE topics","DSE 课题")}</div><p>${Object.keys(TOPIC).map(t=>ck("scope","t:"+t,tName(t),q.scope.includes("t:"+t))).join("")}</p>
 <details><summary>${T("Choose chapters","选择章节")}</summary>${BK.map(b=>`<div class="k" style="margin-top:8px">${esc(b.id)} ${esc(T(b.name,b.nz||b.name))}</div>`+b.chs.map(c=>ck("scope","c:"+c.id,"Ch"+c.n+" "+T(c.t,c.tz||c.t),q.scope.includes("c:"+c.id))).join("<br>")).join("")}</details>
 <h2>${T("Question type","题型")}</h2><p>${ck("type","mc","MC",q.type.includes("mc"))}${ck("type","sq",T("Structured","结构题"),q.type.includes("sq"))}${ck("type","lq",T("DSE long (1B)","DSE 长题 (1B)"),q.type.includes("lq"))}${ck("type","pr",T("Hands-on","实操"),q.type.includes("pr"))}</p>
 <h2>${T("Real DSE share","真题比例")}: <span id="mv">${q.mix}</span>%</h2><input type="range" name="mix" min="0" max="100" step="10" value="${q.mix}" oninput="$('#mv').textContent=this.value" style="width:100%">
 <p><button class="btn">${T("Generate","生成测验")}</button></p></form>
 <h2>${T("Recent results","最近成绩")}</h2><div class="list">${store.get("runs",[]).slice(0,10).map(r=>`<div class="item"><span>${esc(r.title)}</span><span class="r">${r.got}/${r.tot} · ${new Date(r.t).toLocaleDateString()}</span></div>`).join("")||"<p class='k'>—</p>"}</div>`};
const BT={A1:"A1",A2:"A2",B:"B",C1:"C1",C2:"C2",D1:"D1",D2:"D2",E:"E",EA:"A2",EB:"C2",EC:"D2"};
function buildQuiz(){const f=new FormData($("#qf"));const n=Math.max(1,+f.get("n")||20);const scope=f.getAll("scope");const type=f.getAll("type");const mix=+f.get("mix");
 store.set("qz",{n,scope,type,mix});if(!type.length)return alert(T("Pick a type","请选题型"));
 const chs=allCh().filter(c=>!scope.length||scope.includes("c:"+c.id)||(scope.includes("comp")&&!c.book.elective)||(scope.includes("elec")&&c.book.elective)||scope.includes("t:"+(BT[c.book.id]||c.book.id)));
 const tps=new Set(chs.map(c=>BT[c.book.id]||c.book.id));scope.filter(s=>s.startsWith("t:")).forEach(s=>tps.add(s.slice(2)));
 const orig=chs.flatMap(c=>[...(type.includes("mc")?c.mc:[]),...(type.includes("sq")?c.sq:[]),...(type.includes("pr")?c.pr:[])]).map(x=>x.key);
 const real=[...(type.includes("mc")?DQ.filter(q=>!scope.length||tps.has(q.topic)):[]),...((type.includes("lq")||type.includes("sq"))?LQ.filter(q=>!scope.length||tps.has(q.topic)):[])].map(x=>x.key);
 let nr=Math.round(n*mix/100);if(!orig.length)nr=n;if(!real.length)nr=0;
 const pick=[...prio(real).slice(0,nr),...prio(orig).slice(0,n-Math.min(nr,real.length))];
 startSession(T("Quiz","测验")+` · ${pick.length} ${T("Qs","题")}`,shuffle(pick),"#quiz")}

V.progress=()=>{const h=H();const chs=allCh();const wrong=Object.keys(h).filter(k=>IT[k]&&IT[k].type==="mc"&&!h[k].r[h[k].r.length-1]);
 return `<h1>${T("Progress","进度")}</h1><p class="sub">${T("Saved in this browser only.","只保存在这台设备的浏览器。")}</p>
 ${wrong.length?`<p><button class="btn" onclick='startSession(${JSON.stringify(T("Wrong questions","错题重做"))},${JSON.stringify(shuffle(wrong).slice(0,30))},"#progress")'>${T("Redo wrong questions","重做错题")} (${wrong.length})</button></p>`:""}
 <h2>${T("Chapters","章节")}</h2><div class="list">${chs.map(c=>{const s=stat(c.mc.map(m=>m.key));return `<a href="#ch/${c.id}"><span>${esc(chName(c))}</span><span>${s.d?`${s.c}/${s.d} · ${s.n}`:"—"}</span></a>`}).join("")}</div>
 <h2>${T("DSE answer sheets","真题答题纸")}</h2><div class="list">${YEARS.map(y=>{const r=store.get("sheet:"+y.y,null);return r&&r.done?`<a href="#year/${y.y}"><span>${esc(y.label||y.y)}</span><span>${r.score}/${KEYS[y.y].length}</span></a>`:""}).join("")}</div>
 <h2>${T("Sessions","练习记录")}</h2><div class="list">${store.get("runs",[]).slice(0,30).map(r=>`<div class="item"><span>${esc(r.title)}</span><span class="r">${r.got}/${r.tot} · ${new Date(r.t).toLocaleString()}</span></div>`).join("")}</div>
 <p><button class="btn sec" onclick="if(confirm('Reset?')){Object.keys(localStorage).filter(k=>k.startsWith('ict:')&&k!=='ict:lang').forEach(k=>localStorage.removeItem(k));route()}">${T("Reset all progress","清除全部进度")}</button></p>`};
V.tools=()=>TOOLS();

function route(){const h=(location.hash||"#home").slice(1).split("/");const f=V[h[0]]||V.home;
 if(h[0]==="s"){app.innerHTML=vSess(h[1])}else app.innerHTML=f(h[1],h[2]);
 if(h[0]==="tools"&&window.initTools)initTools();window.scrollTo(0,0)}
function clean(t){const o=JSON.parse(t);const f=v=>typeof v==="string"?scrub(v):Array.isArray(v)?v.map(f):v&&typeof v==="object"?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,f(x)])):v;return f(o)}
function scrub(s){return s.replace(/\s*[(（][^()（）]*Quest[^()（）]*[)）]/g,"").replace(/Quest[’']s\s+/g,"").replace(/\bQuest\s*(original|原创|补充|自拟|编写|所写)[^。.;；<]*[。.;；]?/gi,"").replace(/Suggested answer \(Quest\)/g,"Suggested answer")}
async function boot(){app.innerHTML="<p class='sub'>Loading…</p>";
 BK=clean(JSON.stringify(BOOKS)).map(normBook);DSEQ.forEach(q=>{q.exp=scrub(q.exp||"")});
 try{const m=await (await fetch(RAW+"data/manifest.json?"+Date.now())).json();
  const bk=await Promise.all((m.books||[]).map(b=>fetch(RAW+"data/book-"+b+".json?v="+m.v).then(r=>r.text()).then(clean).catch(()=>null)));
  bk.filter(Boolean).forEach(b=>{const nb=normBook(b);const k=BK.findIndex(x=>x.id===nb.id);if(k>=0)BK[k]=nb;else BK.push(nb)});
  const ys=await Promise.all((m.years||[]).map(y=>fetch(RAW+"data/dse-"+y+".json?v="+m.v).then(r=>r.text()).then(clean).catch(()=>null)));
  ys.filter(Boolean).forEach(addDSE);
 }catch(e){console.log(e)}
 legacyDSE();const ord=["A1","A2","B","C1","C2","D1","D2","E","EA","EB","EC"];BK.sort((a,b)=>ord.indexOf(a.id)-ord.indexOf(b.id));
 route()}
window.addEventListener("hashchange",route);boot();
