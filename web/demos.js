// v3 card extras: code blocks, demos, cheatsheets
let DUID=0;const DM={};
const KW={python:"def return if elif else for while in not and or import from as class try except finally with lambda pass break continue True False None print range len input int str float list",
 js:"function return if else for while var let const new true false null undefined document console typeof break continue switch case default",
 php:"echo print if else elseif for foreach while do function return array true false null isset empty as",
 sql:"SELECT FROM WHERE AND OR NOT ORDER BY GROUP HAVING INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE DROP ALTER ADD PRIMARY KEY FOREIGN REFERENCES JOIN INNER LEFT ON AS DISTINCT COUNT SUM AVG MIN MAX LIKE IN BETWEEN IS NULL ASC DESC INT INTEGER VARCHAR CHAR DATE DECIMAL",
 pseudo:"IF THEN ELSE ENDIF END FOR TO NEXT WHILE DO ENDWHILE REPEAT UNTIL INPUT OUTPUT PRINT RETURN AND OR NOT",
 css:"",html:""};
function hl(src,lang){const kw=new Set((KW[lang]||"").split(" ").filter(Boolean).map(k=>lang==="sql"||lang==="pseudo"?k.toUpperCase():k));
 const re=lang==="html"?/(<!--[\s\S]*?-->)|(<\/?[\w-]+)|("[^"]*"|'[^']*')|(\/?>)|([^<"'>]+)/g
  :lang==="css"?/(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(#[0-9a-fA-F]{3,6}\b|\b\d+(?:\.\d+)?(?:px|em|rem|%)?)|([\w-]+(?=\s*:))|([\s\S])/g
  :/(#[^\n]*|\/\/[^\n]*|--[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\$?\b[A-Za-z_]\w*\b)|(\b\d+(?:\.\d+)?\b)|([\s\S])/g;
 let out="";src.replace(re,(m,a,b,c,d,e)=>{const s=esc(m);
  if(lang==="html"){out+=a?`<span class="hc">${s}</span>`:b?`<span class="hk">${s}</span>`:c?`<span class="hs">${s}</span>`:d?`<span class="hk">${s}</span>`:s;return""}
  if(lang==="css"){out+=a?`<span class="hc">${s}</span>`:b?`<span class="hs">${s}</span>`:c?`<span class="hn">${s}</span>`:d?`<span class="hk">${s}</span>`:s;return""}
  if(a&&!(lang==="python"&&m.startsWith("//"))&&!(lang!=="sql"&&m.startsWith("--"))&&!(lang!=="python"&&lang!=="php"&&m.startsWith("#")))out+=`<span class="hc">${s}</span>`;
  else if(b)out+=`<span class="hs">${s}</span>`;else if(c)out+=kw.has(lang==="sql"||lang==="pseudo"?m.toUpperCase():m)?`<span class="hk">${s}</span>`:m.startsWith("$")?`<span class="hv">${s}</span>`:s;else if(d)out+=`<span class="hn">${s}</span>`;else out+=s;return""});return out}
function codeBlock(cb){const id="cb"+(++DUID);DM[id]={cb};const lines=String(cb.src||"").split("\n");const hlines=hl(cb.src||"",cb.lang).split("\n");
 const notes={};(cb.notes||[]).forEach(n=>notes[n.l]=T(n.t,n.tz||n.t));
 return `<div class="cb" id="${id}"><div class="cbh"><span>${esc((cb.lang||"").toUpperCase())}</span>${cb.run?`<button class="mini" onclick="tryCode('${id}')">${T("Try it","试一试")} ▶</button>`:""}</div>
 <div class="cbv">${hlines.map((l,i)=>`<div class="ln ${notes[i+1]?"hasn":""}" onclick="lnNote('${id}',${i+1})"><span class="no">${i+1}</span><span class="lc">${l||" "}</span></div>`).join("")}</div>
 <div class="lnote" id="${id}-n">${Object.keys(notes).length?T("Tap a line to see what it does.","点任意一行看解释。"):""}</div>
 <details class="alln"><summary>${T("All line notes","全部逐行解释")}</summary>${Object.entries(notes).map(([l,t])=>`<div><b>${l}</b> ${rich(t)}</div>`).join("")}</details>
 ${cb.in?`<div class="io"><b>${T("Input","输入")}</b><pre>${esc(cb.in)}</pre></div>`:""}${cb.out!=null&&cb.out!==""?`<div class="io"><b>${T("Output","输出")}</b><pre>${esc(cb.out)}</pre></div>`:""}
 <div id="${id}-try"></div></div>`}
function lnNote(id,l){const cb=DM[id].cb;const n=(cb.notes||[]).find(x=>x.l===l);document.querySelectorAll(`#${id} .ln`).forEach((e,i)=>e.classList.toggle("on",i+1===l));
 document.getElementById(id+"-n").innerHTML=n?`<b>${T("Line","第")} ${l}${EN()?"":" 行"}</b> ${rich(T(n.t,n.tz||n.t))}`:""}
function tryCode(id){const cb=DM[id].cb;const box=document.getElementById(id+"-try");
 box.innerHTML=`<textarea class="code" id="${id}-ed" spellcheck="false" autocapitalize="off" autocorrect="off" onkeydown="tabKey(event)">${esc(cb.src)}</textarea>${cb.lang==="python"?`<label class="k">stdin</label><textarea id="${id}-in" style="min-height:50px">${esc(cb.in||"")}</textarea>`:""}<p><button class="btn" onclick="runSnippet('${id}','${cb.lang}')">${T("Run","运行")}</button></p><div class="out" id="${id}-out"></div>`}
async function runSnippet(id,lang){const code=document.getElementById(id+"-ed").value;const out=document.getElementById(id+"-out");out.innerHTML=T("Running…","运行中…");
 try{if(lang==="python"){const py=await getPY();py.globals.set("__c",code);py.globals.set("__i",(document.getElementById(id+"-in")||{}).value||"");
   const r=py.runPython(`
import sys,io,traceback
__o=io.StringIO();sys.stdout=__o;sys.stdin=io.StringIO(__i);__e=""
try:
    exec(__c,{"__name__":"__main__"})
except Exception:
    __e=traceback.format_exc(limit=1)
sys.stdout=sys.__stdout__
[__o.getvalue(),__e]`).toJs();out.innerHTML=`<pre>${esc(r[0])}</pre>`+(r[1]?`<pre class="fail">${esc(r[1])}</pre>`:"")}
  else if(lang==="js"){const logs=[];const con={log:(...a)=>logs.push(a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" "))};let err="";try{new Function("console",code)(con)}catch(e){err=e.message}out.innerHTML=`<pre>${esc(logs.join("\n"))}</pre>`+(err?`<pre class="fail">${esc(err)}</pre>`:"")}
  else if(lang==="sql"){const SQL=await getSQL();const db=new SQL.Database();out.innerHTML=rowsTbl(db.exec(code))}
  else if(lang==="html"||lang==="css"){out.innerHTML=`<iframe class="prev" sandbox="allow-scripts"></iframe>`;out.firstChild.srcdoc=lang==="css"?`<style>${code}</style><p>Sample text</p>`:code}
 }catch(e){out.innerHTML=`<pre class="fail">${esc(e.message||e)}</pre>`}}

// ---------- demos ----------
function demo(d){if(!d||!d.type)return"";const id="dm"+(++DUID);
 if(d.type==="live_html"){DM[id]={d};setTimeout(()=>liveUpd(id),0);return `<div class="demo" id="${id}"><div class="dh">${T("Live preview","实时预览")}</div>
  ${["html","css","js"].filter(k=>d[k]!=null).map(k=>`<label class="k">${k.toUpperCase()}</label><textarea class="code" style="min-height:90px" id="${id}-${k}" spellcheck="false" autocapitalize="off" oninput="liveUpd('${id}')" onkeydown="tabKey(event)">${esc(d[k])}</textarea>`).join("")}<iframe class="prev" id="${id}-f" sandbox="allow-scripts"></iframe></div>`}
 if(d.type==="run")return `<div class="demo">${codeBlock({lang:d.lang,src:d.src,in:d.stdin||"",run:true})}</div>`;
 let fr=[];try{fr=FR[d.type]?FR[d.type](d):[]}catch(e){fr=[`<pre class="fail">${esc(e.message)}</pre>`]}
 if(d.type==="sql"){DM[id]={d,fr:[`<p>${T("Loading…","载入中…")}</p>`],i:0};sqlFrames(d).then(f=>{DM[id].fr=f;DM[id].i=0;drawD(id)})}else DM[id]={d,fr,i:0};
 return `<div class="demo" id="${id}"><div class="dh">${esc(T(DT[d.type]?.[0]||d.type,DT[d.type]?.[1]||d.type))}${d.title?" · "+esc(d.title):""}</div><div class="stage" id="${id}-s">${DM[id].fr[0]||""}</div>
 <div class="ctl"><button class="mini" onclick="dGo('${id}',-1)">◀</button><button class="mini" id="${id}-p" onclick="dPlay('${id}')">▶ ${T("Play","播放")}</button><button class="mini" onclick="dGo('${id}',1)">▶|</button><button class="mini" onclick="dReset('${id}')">↺</button><span class="k" id="${id}-c">1/${DM[id].fr.length}</span></div></div>`}
const DT={base_convert:["Base conversion","进制转换"],twos_complement:["Two's complement","二补码"],binary_add:["Binary addition","二进制加法"],sort:["Sorting","排序"],search:["Searching","查找"],sql:["SQL query","SQL 查询"],trace:["Trace table","追踪表"],caesar:["Caesar cipher","凯撒密码"],steps:["Step by step","分步演示"]};
function drawD(id){const m=DM[id];const s=document.getElementById(id+"-s");if(!s)return;s.innerHTML=m.fr[m.i]||"";document.getElementById(id+"-c").textContent=`${m.i+1}/${m.fr.length}`}
function dGo(id,k){const m=DM[id];m.i=Math.max(0,Math.min(m.fr.length-1,m.i+k));drawD(id)}
function dReset(id){const m=DM[id];clearInterval(m.t);m.t=null;m.i=0;drawD(id);document.getElementById(id+"-p").innerHTML="▶ "+T("Play","播放")}
function dPlay(id){const m=DM[id];const b=document.getElementById(id+"-p");if(m.t){clearInterval(m.t);m.t=null;b.innerHTML="▶ "+T("Play","播放");return}
 if(m.i>=m.fr.length-1)m.i=0;b.innerHTML="❚❚ "+T("Pause","暂停");drawD(id);m.t=setInterval(()=>{if(!document.getElementById(id)){clearInterval(m.t);return}if(m.i>=m.fr.length-1){clearInterval(m.t);m.t=null;b.innerHTML="▶ "+T("Play","播放");return}m.i++;drawD(id)},1100)}
function liveUpd(id){const m=DM[id];const g=k=>{const e=document.getElementById(id+"-"+k);return e?e.value:(m.d[k]||"")};const f=document.getElementById(id+"-f");if(f)f.srcdoc=`<style>body{font-family:sans-serif}${g("css")}</style>${g("html")}<script>${g("js")}<\/script>`}
const cap=t=>`<div class="cap">${t}</div>`;
const bits=(s,hi)=>`<div class="bits">${[...s].map((c,i)=>`<span class="${hi&&hi.includes(i)?"on":""}">${c}</span>`).join("")}</div>`;
const arr=(a,cls)=>`<div class="arr">${a.map((v,i)=>`<span class="${cls[i]||""}">${v}</span>`).join("")}</div>`;
const FR={
base_convert(d){const from=+d.from,to=+d.to;const D="0123456789ABCDEF";const v=parseInt(String(d.value),from);const f=[];
 let dec=v;if(from!==10){const s=String(d.value).toUpperCase();let rows=[...s].map((c,i)=>`${c} × ${from}<sup>${s.length-1-i}</sup> = ${D.indexOf(c)*from**(s.length-1-i)}`);
  rows.forEach((r,i)=>f.push(cap(T(`Place values of ${s} (base ${from})`,`按位权展开 ${s}（${from} 进制）`))+`<div class="mono">${rows.slice(0,i+1).join("<br>")}</div>`));
  f.push(cap(T("Add them up","全部相加"))+`<div class="mono">${rows.join("<br>")}<br><b>= ${v}</b> (base 10)</div>`)}
 if(to!==10){let n=dec,rows=[];if(n===0)rows.push([0,0,0]);while(n>0){rows.push([n,Math.floor(n/to),n%to]);n=Math.floor(n/to)}
  const tb=k=>`<div class="tw"><table><tr><th>${T("Divide","除")}</th><th>${T("Quotient","商")}</th><th>${T("Remainder","余数")}</th></tr>${rows.slice(0,k).map(r=>`<tr><td>${r[0]} ÷ ${to}</td><td>${r[1]}</td><td><b>${D[r[2]]}</b></td></tr>`).join("")}</table></div>`;
  rows.forEach((r,i)=>f.push(cap(T(`Divide by ${to} repeatedly, keep the remainder`,`不断除以 ${to}，记下余数`))+tb(i+1)));
  f.push(cap(T("Read remainders from bottom to top","余数由下往上读"))+tb(rows.length)+`<p class="big">${d.value}<sub>${from}</sub> = <b>${dec.toString(to).toUpperCase()}</b><sub>${to}</sub></p>`)}
 else f.push(`<p class="big">${d.value}<sub>${from}</sub> = <b>${dec}</b><sub>10</sub></p>`);return f},
twos_complement(d){const b=+d.bits||8,v=+d.value;const min=-(2**(b-1)),max=2**(b-1)-1;if(v<min||v>max)return[cap(T(`${v} cannot fit in ${b} bits (range ${min} to ${max}): overflow`,`${v} 超出 ${b} 位范围（${min} 至 ${max}）：overflow`))];
 const p=Math.abs(v).toString(2).padStart(b,"0");if(v>=0)return[cap(T("Positive: just write it in binary","正数：直接写成二进制"))+bits(p),cap(T("MSB 0 means positive","最高位 0 = 正数"))+bits(p,[0])];
 const inv=[...p].map(c=>c==="0"?"1":"0").join("");const r=((2**b+v)).toString(2).padStart(b,"0");
 return[cap(T(`Step 1: write |${v}| = ${-v} in binary`,`第 1 步：把 |${v}| = ${-v} 写成二进制`))+bits(p),cap(T("Step 2: invert every bit (0↔1)","第 2 步：每一位取反（0↔1）"))+bits(p)+bits(inv,[...Array(b).keys()]),cap(T("Step 3: add 1","第 3 步：加 1"))+bits(inv)+`<div class="mono">+ ${"0".repeat(b-1)}1</div>`+bits(r),cap(T(`Result: ${v} = ${r}. MSB 1 means negative.`,`结果：${v} = ${r}，最高位 1 = 负数。`))+bits(r,[0])]},
binary_add(d){const b=+d.bits||d.a.length;const A=d.a.padStart(b,"0"),B=d.b.padStart(b,"0");let c=0,sum=Array(b).fill(" "),car=Array(b+1).fill(" ");const f=[];
 const row=(lab,cells,k)=>`<tr><td class="k">${lab}</td>${cells.map((x,i)=>`<td class="${i===k?"ok":""}">${x}</td>`).join("")}</tr>`;const show=(k,msg)=>cap(msg)+`<div class="tw"><table class="addt">${row(T("carry","进位"),car.slice(1).map(x=>x.trim()?`<small>${x}</small>`:""),-1)}${row("",[...A],-1)}${row("+",[...B],-1)}${row("=",sum,k)}</table></div>`;
 f.push(show(-1,T("Add column by column from the right","从右边开始逐列相加")));
 for(let i=b-1;i>=0;i--){const s=+A[i]+ +B[i]+c;sum[i]=String(s%2);const oc=c;c=s>=2?1:0;if(c&&i>0)car[i]="1";f.push(show(i,`${A[i]} + ${B[i]}${oc?" + 1":""} = ${s} → ${T("write","写")} ${s%2}${c?T(", carry 1","，进 1"):""}`))}
 const sv=x=>parseInt(x,2)-(x[0]==="1"?2**b:0);const R=sum.join("");const ov=A[0]===B[0]&&R[0]!==A[0];
 f.push(cap(T(`${c?"Final carry out is discarded. ":""}Signed: ${sv(A)} + ${sv(B)} → ${sv(R)}. ${ov?"OVERFLOW: two numbers with the same sign gave a result with a different sign.":"No overflow."}`,`${c?"最后的进位丢弃。":""}有符号：${sv(A)} + ${sv(B)} → ${sv(R)}。${ov?"OVERFLOW：两个同号数相加得到异号结果。":"没有 overflow。"}`))+bits(R));return f},
sort(d){const a=[...d.data],f=[];const snap=(cls,msg)=>f.push(cap(msg)+arr([...a],cls));const al=d.algo||"bubble";snap({},T("Start","开始"));
 if(al==="bubble"){for(let p=0;p<a.length-1;p++){let sw=false;for(let j=0;j<a.length-1-p;j++){snap({[j]:"cmp",[j+1]:"cmp"},T(`Pass ${p+1}: compare ${a[j]} and ${a[j+1]}`,`第 ${p+1} 轮：比较 ${a[j]} 和 ${a[j+1]}`));if(a[j]>a[j+1]){[a[j],a[j+1]]=[a[j+1],a[j]];sw=true;snap({[j]:"swp",[j+1]:"swp"},T("Swap","交换"))}}
   const done={};for(let k=a.length-1-p;k<a.length;k++)done[k]="done";snap(done,T(`End of pass ${p+1}: the largest unsorted item is now in place`,`第 ${p+1} 轮结束：最大的已到位`));if(!sw){snap({},T("No swaps in this pass, so the list is sorted","这一轮没有交换，已排好"));break}}}
 else if(al==="selection"){for(let i=0;i<a.length-1;i++){let m=i;for(let j=i+1;j<a.length;j++){snap({[m]:"swp",[j]:"cmp"},T(`Smallest so far ${a[m]}, check ${a[j]}`,`目前最小 ${a[m]}，检查 ${a[j]}`));if(a[j]<a[m])m=j}[a[i],a[m]]=[a[m],a[i]];snap({[i]:"done"},T(`Put ${a[i]} at position ${i+1}`,`把 ${a[i]} 放到第 ${i+1} 位`))}}
 else if(al==="insertion"){for(let i=1;i<a.length;i++){const k=a[i];let j=i-1;snap({[i]:"cmp"},T(`Take ${k} and insert it into the sorted part`,`取出 ${k}，插入左边已排好的部分`));while(j>=0&&a[j]>k){a[j+1]=a[j];j--;snap({[j+1]:"swp"},T(`Shift ${a[j+2]} right`,`把 ${a[j+2]} 右移`))}a[j+1]=k;snap({[j+1]:"done"},T(`Insert ${k}`,`插入 ${k}`))}}
 else if(al==="merge"){const ms=(l,r)=>{if(r-l<1)return;const m=Math.floor((l+r)/2);ms(l,m);ms(m+1,r);const L=a.slice(l,m+1),R=a.slice(m+1,r+1);let i=0,j=0,k=l;while(i<L.length&&j<R.length)a[k++]=L[i]<=R[j]?L[i++]:R[j++];while(i<L.length)a[k++]=L[i++];while(j<R.length)a[k++]=R[j++];const c={};for(let x=l;x<=r;x++)c[x]="swp";snap(c,T(`Merge [${L}] and [${R}]`,`合并 [${L}] 和 [${R}]`))};ms(0,a.length-1)}
 else if(al==="quick"){const qs=(l,r)=>{if(l>=r)return;const p=a[r];let i=l;for(let j=l;j<r;j++)if(a[j]<p){[a[i],a[j]]=[a[j],a[i]];i++}[a[i],a[r]]=[a[r],a[i]];snap({[i]:"done"},T(`Pivot ${p} goes to its final place`,`基准 ${p} 放到最终位置`));qs(l,i-1);qs(i+1,r)};qs(0,a.length-1)}
 snap(Object.fromEntries(a.map((_,i)=>[i,"done"])),T("Sorted","排序完成"));return f},
search(d){const a=d.data,t=d.target,f=[];if(d.algo==="binary"){let lo=0,hi=a.length-1;while(lo<=hi){const m=Math.floor((lo+hi)/2);const c={};for(let i=0;i<a.length;i++)if(i<lo||i>hi)c[i]="dim";c[m]="cmp";f.push(cap(`low=${lo}, high=${hi}, mid=⌊(${lo}+${hi})/2⌋=${m}: ${a[m]} ${a[m]===t?"=":a[m]<t?"<":">"} ${t}`)+arr(a,c));
  if(a[m]===t){f.push(cap(T(`Found ${t} at index ${m}`,`在索引 ${m} 找到 ${t}`))+arr(a,{[m]:"done"}));return f}if(a[m]<t)lo=m+1;else hi=m-1}f.push(cap(T(`low > high, ${t} not found`,`low > high，找不到 ${t}`))+arr(a,{}));return f}
 for(let i=0;i<a.length;i++){f.push(cap(T(`Check index ${i}: ${a[i]} ${a[i]===t?"=":"≠"} ${t}`,`检查索引 ${i}：${a[i]} ${a[i]===t?"=":"≠"} ${t}`))+arr(a,{[i]:a[i]===t?"done":"cmp"}));if(a[i]===t)return f}f.push(cap(T(`${t} not found`,`找不到 ${t}`))+arr(a,{}));return f},
trace(d){const L=String(d.src).split("\n");const f=[];(d.rows||[]).forEach((r,k)=>{f.push(`<div class="mono tr">${L.map((l,i)=>`<div class="${i+1===r.line?"on":""}">${i+1} ${esc(l)}</div>`).join("")}</div><div class="tw"><table><tr><th>${T("Line","行")}</th>${(d.vars||[]).map(v=>`<th>${esc(v)}</th>`).join("")}<th>${T("Output","输出")}</th></tr>${d.rows.slice(0,k+1).map((x,j)=>`<tr class="${j===k?"on":""}"><td>${x.line}</td>${(d.vars||[]).map(v=>`<td>${esc(x.vals?.[v]??"")}</td>`).join("")}<td>${esc(x.out||"")}</td></tr>`).join("")}</table></div>`)});return f},
caesar(d){const s=+d.shift||3,tx=String(d.text);const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ";const enc=c=>{const u=c.toUpperCase(),i=A.indexOf(u);return i<0?c:A[(i+s+26)%26]};const f=[];let out="";
 f.push(cap(T(`Key: shift each letter by ${s}`,`密钥：每个字母移 ${s} 位`))+`<div class="mono">${A}<br>${[...A].map(enc).join("")}</div>`);
 [...tx].forEach((c,i)=>{out+=enc(c);f.push(cap(`${c} → ${enc(c)}`)+`<div class="mono">${T("Plaintext","明文")}: ${esc(tx.slice(0,i))}<b class="ok">${esc(c)}</b>${esc(tx.slice(i+1))}<br>${T("Ciphertext","密文")}: ${esc(out)}</div>`)});
 f.push(cap(T(`Decrypt with the same key (shift back ${s}). Same key for both = symmetric encryption.`,`用同一个密钥往回移 ${s} 位就能解密。加密解密用同一密钥 = symmetric encryption。`))+`<div class="mono">${esc(tx)} → <b>${esc(out)}</b> → ${esc(tx)}</div>`);return f},
steps(d){return (d.frames||[]).map(fr=>cap(`<b>${esc(fr.t||"")}</b>`)+(fr.diagram?svgD(fr.diagram):"")+`<div>${rich(T(fr.en,fr.zh||fr.en)||"").replace(/\b(\S+)\b/g,w=>(fr.hl||[]).includes(w)?`<mark>${w}</mark>`:w)}</div>`)}};
function svgD(g){const N=g.nodes||[];const W=560,H=Math.max(130,N.length>4?220:130);const pos={};const n=N.length;
 N.forEach((x,i)=>{if(n<=4)pos[x.id]=[W*(i+0.5)/n,H/2];else{const a=Math.PI*2*i/n-Math.PI/2;pos[x.id]=[W/2+Math.cos(a)*(W/2-80),H/2+Math.sin(a)*(H/2-30)]}});
 const act=new Set(g.active||[]);
 return `<svg viewBox="0 0 ${W} ${H}" class="dg">${(g.edges||[]).map(e=>{const a=pos[e[0]],b=pos[e[1]];if(!a||!b)return"";const on=act.has(e[0])&&act.has(e[1]);return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="${on?"on":""}"/>${e[2]?`<text x="${(a[0]+b[0])/2}" y="${(a[1]+b[1])/2-6}" class="el">${esc(e[2])}</text>`:""}`}).join("")}
 ${N.map(x=>{const [cx,cy]=pos[x.id];const w=Math.max(60,String(x.label).length*8+20);return `<g class="${act.has(x.id)?"on":""}"><rect x="${cx-w/2}" y="${cy-18}" width="${w}" height="36" rx="10"/><text x="${cx}" y="${cy+5}">${esc(x.label)}</text></g>`}).join("")}</svg>`}
async function sqlFrames(d){const SQL=await getSQL();const db=new SQL.Database();db.exec(d.setup||"");const tn=db.exec("SELECT name FROM sqlite_master WHERE type='table'")[0]?.values.map(v=>v[0])||[];
 const f=[];tn.forEach(t=>f.push(cap(T(`Table ${t}`,`数据表 ${t}`))+rowsTbl(db.exec(`SELECT * FROM "${t}"`))));
 f.push(cap(T("The query","查询语句"))+`<pre>${hl(d.query,"sql")}</pre>`);
 try{f.push(cap(T("Result","结果"))+`<pre>${hl(d.query,"sql")}</pre>`+rowsTbl(db.exec(d.query))+(d.note?`<p>${rich(d.note)}</p>`:""))}catch(e){f.push(`<pre class="fail">${esc(e.message)}</pre>`)}return f}
function cheat(k){return `<div class="cheat">${wrapT(EN()?(k.en||k.zh):(k.zh||k.en))}</div>`}
