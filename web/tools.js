const TL={base:["进制转换","Number bases","十进制 / 二进制 / 八进制 / 十六进制互换"],twos:["补码与溢出","Two's complement","8-bit two's complement、加法和 overflow 检查"],subnet:["子网计算","Subnet calculator","由 IP 和前缀求 mask、network、broadcast、主机范围"],sql:["SQL 练习场","SQL playground","在示例数据库上运行任何 SQL"],trace:["算法追踪","Trace tables","取余法、bubble sort、binary / linear search 逐步追踪"]};
function TOOLS(){return `<h1>${T("Tools","工具")}</h1><p class="sub">${T("Check your working while you practise.","做题时用来自己验算。")}</p><div class="list">${Object.entries(TL).map(([k,v])=>`<a href="#tool/${k}"><span>${T(v[1],v[0])}</span><span>${v[2]}</span></a>`).join("")}</div>`}
const F=(lab,inp)=>`<label style="display:block;margin:12px 0 4px" class="k">${lab}</label>${inp}`;
const TV={
base:()=>F("输入的进制",`<select id="b-in" onchange="baseConv()" style="width:100%"><option value="10">十进制 Decimal</option><option value="2">二进制 Binary</option><option value="8">八进制 Octal</option><option value="16">十六进制 Hexadecimal</option></select>`)+F("数值",`<input id="b-v" value="182" oninput="baseConv()" style="width:100%">`)+`<h2>结果</h2><div class="box"><pre id="b-out"></pre></div>`,
twos:()=>`<h2>十进制 ↔ 8-bit 补码</h2>`+F("十进制（−128 至 127）",`<input id="tc-d" value="-70" oninput="tcD()" style="width:100%">`)+F("或 8 位二进制",`<input id="tc-b" oninput="tcB()" style="width:100%" placeholder="例如 10111010">`)+`<div class="box"><pre id="tc-out"></pre></div><h2>加法与 overflow</h2>`+F("第一个数（8 位）",`<input id="ad-a" value="10111010" oninput="tcAdd()" style="width:100%">`)+F("第二个数（8 位）",`<input id="ad-b" value="11000100" oninput="tcAdd()" style="width:100%">`)+`<div class="box"><pre id="ad-out"></pre></div>`,
subnet:()=>F("IP 地址",`<input id="sn-ip" value="192.168.5.77" oninput="subnet()" style="width:100%">`)+F("前缀长度 /n",`<input id="sn-p" value="26" type="number" min="0" max="32" oninput="subnet()" style="width:100%">`)+`<h2>结果</h2><div class="box"><pre id="sn-out"></pre></div>`,
sql:()=>`<div class="box k">示例数据库：STUDENT(SID, NAME, CLASS, CID)、CLUB(CID, CNAME, TEACHER)、RESULT(SID, SUBJECT, SCORE)。可以改数据或建新表，刷新页面重置。</div>`+F("SQL",`<textarea id="sql" class="code" rows="7" spellcheck="false" autocapitalize="off">SELECT S.CLASS, COUNT(*) AS N, AVG(R.SCORE) AS AVG_SCORE
FROM STUDENT S, RESULT R
WHERE S.SID = R.SID AND R.SUBJECT = 'ICT'
GROUP BY S.CLASS
HAVING COUNT(*) >= 2
ORDER BY AVG_SCORE DESC;</textarea>`)+`<p><button class="btn" onclick="runSQL()">运行</button><button class="btn sec" onclick="sqlEx(0)">JOIN 例</button><button class="btn sec" onclick="sqlEx(1)">LIKE 例</button><button class="btn sec" onclick="sqlEx(2)">子查询例</button><button class="btn sec" onclick="sqlEx(3)">看表</button></p><h2>结果</h2><div class="box" id="sql-out"></div>`,
trace:()=>F("算法",`<select id="al" style="width:100%"><option value="bin">十进制 → 二进制（取余法）</option><option value="bub">Bubble sort</option><option value="bs">Binary search</option><option value="lin">Linear search</option></select>`)+F("数据（十进制数，或用逗号分隔的列表）",`<input id="al-in" value="5,1,4,2,8" style="width:100%">`)+F("查找目标（search 用）",`<input id="al-t" value="4" style="width:100%">`)+`<p><button class="btn" onclick="trace()">追踪</button></p><h2>逐步过程</h2><div class="box" id="al-out"></div>`}
function TOOL(k){const v=TL[k];if(!v)return TOOLS();return `<p class="k"><a href="#tools">← ${T("Tools","工具")}</a></p><h1>${T(v[1],v[0])}</h1><p class="sub">${v[2]}</p><div style="max-width:560px">${TV[k]()}</div>`}
function tj(id){setTimeout(()=>document.getElementById(id).scrollIntoView({behavior:"smooth"}),50)}
function g(i){return document.getElementById(i)}
function baseConv(){const b=+g("b-in").value,v=g("b-v").value.trim().replace(/\s/g,"");const n=parseInt(v,b);
 if(isNaN(n)||!/^[0-9a-fA-F]+$/.test(v)){g("b-out").textContent="输入无效";return}
 const bin=n.toString(2);g("b-out").textContent=`十进制 ${n}\n二进制 ${bin.padStart(Math.ceil(bin.length/4)*4,"0").replace(/(.{4})/g,"$1 ").trim()}\n八进制 ${n.toString(8)}\n十六进制 ${n.toString(16).toUpperCase()}\n需要 bits：${bin.length}`}
const to8=n=>((n+256)%256).toString(2).padStart(8,"0");
const fmt=s=>s.slice(0,4)+" "+s.slice(4);
const val8=s=>{const n=parseInt(s,2);return n>127?n-256:n};
function tcD(){const d=+g("tc-d").value;if(isNaN(d)||d<-128||d>127){g("tc-out").textContent="范围 −128 至 127";return}
 let t=`${d} → ${fmt(to8(d))}`;if(d<0){const p=to8(-d===128?0:-d);t+=`\n步骤：+${-d} = ${fmt(-d===128?"10000000":p)} → 反转 ${fmt(p.split("").map(c=>c==="0"?"1":"0").join(""))} → +1 = ${fmt(to8(d))}`}g("tc-out").textContent=t}
function tcB(){const b=g("tc-b").value.replace(/\s/g,"");if(!/^[01]{8}$/.test(b)){g("tc-out").textContent="输入 8 位二进制";return}g("tc-out").textContent=`${fmt(b)} = ${val8(b)}（MSB ${b[0]==="1"?"=1，负数":"=0，正数"}）`}
function tcAdd(){const a=g("ad-a").value.replace(/\s/g,""),b=g("ad-b").value.replace(/\s/g,"");if(!/^[01]{8}$/.test(a)||!/^[01]{8}$/.test(b)){g("ad-out").textContent="两个都要 8 位";return}
 const x=val8(a),y=val8(b),s=x+y,r=to8(s),carry=(parseInt(a,2)+parseInt(b,2))>255;const ov=s>127||s<-128;
 g("ad-out").textContent=`${fmt(a)} (${x})\n+ ${fmt(b)} (${y})\n= ${fmt(r)} (${val8(r)})${carry?"  [最高位进位已丢弃]":""}\n真实结果 ${s} → ${ov?"OVERFLOW：两个同号数相加得到异号结果":"没有 overflow"}`}
function subnet(){const ip=g("sn-ip").value.split(".").map(Number),p=+g("sn-p").value;if(ip.length!==4||ip.some(x=>isNaN(x)||x<0||x>255)||!(p>=0&&p<=32)){g("sn-out").textContent="输入无效";return}
 const n=ip.reduce((a,x)=>a*256+x,0),m=p===0?0:(2**32-2**(32-p)),net=Number(BigInt(n)&BigInt(m)),bc=net+2**(32-p)-1;
 const d=v=>[24,16,8,0].map(s=>Math.floor(v/2**s)%256).join(".");const pr=(ip[0]===10)||(ip[0]===172&&ip[1]>=16&&ip[1]<=31)||(ip[0]===192&&ip[1]===168);
 g("sn-out").textContent=`Subnet mask   ${d(m)}\nNetwork addr  ${d(net)}\nBroadcast     ${d(bc)}\n可用主机       ${p>=31?0:2**(32-p)-2}（${p<31?d(net+1)+" – "+d(bc-1):""}）\n${pr?"这是 private IP，需要 NAT 才能上 Internet":"这是 public IP"}\n二进制 IP     ${ip.map(x=>x.toString(2).padStart(8,"0")).join(".")}\n二进制 mask   ${d(m).split(".").map(x=>(+x).toString(2).padStart(8,"0")).join(".")}`}
let DB=null;
const SEED=`CREATE TABLE CLUB(CID TEXT PRIMARY KEY, CNAME TEXT, TEACHER TEXT);
INSERT INTO CLUB VALUES('C1','Robotics','Mr Lam'),('C2','Orchestra','Ms Lee'),('C3','Coding','Mr Chan');
CREATE TABLE STUDENT(SID TEXT PRIMARY KEY, NAME TEXT, CLASS TEXT, CID TEXT REFERENCES CLUB(CID));
INSERT INTO STUDENT VALUES('S01','Tom Ho','5A','C3'),('S02','Amy Chan','5A','C2'),('S03','Ben Lau','5B','C1'),('S04','Cathy Ho','5B','C3'),('S05','David Ng','5C',NULL),('S06','Eva Lam','5A','C1'),('S07','Kelvin Yip','5C','C2');
CREATE TABLE RESULT(SID TEXT, SUBJECT TEXT, SCORE INTEGER, PRIMARY KEY(SID,SUBJECT));
INSERT INTO RESULT VALUES('S01','ICT',88),('S01','M2',75),('S02','ICT',64),('S02','M2',81),('S03','ICT',52),('S04','ICT',91),('S04','M2',60),('S05','ICT',47),('S06','ICT',73),('S07','ICT',69),('S07','M2',58);`;
const EX=["SELECT S.NAME, C.CNAME, C.TEACHER\nFROM STUDENT S, CLUB C\nWHERE S.CID = C.CID\nORDER BY C.CNAME;","SELECT NAME, CLASS FROM STUDENT WHERE NAME LIKE '_a%';","SELECT NAME FROM STUDENT\nWHERE SID IN (SELECT SID FROM RESULT WHERE SUBJECT='ICT' AND SCORE > (SELECT AVG(SCORE) FROM RESULT WHERE SUBJECT='ICT'));","SELECT * FROM STUDENT;"];
function sqlEx(i){g("sql").value=EX[i];runSQL()}
function initTools(){if(g("b-v"))baseConv();if(g("tc-d"))tcD();if(g("ad-a"))tcAdd();if(g("sn-ip"))subnet();if(!g("sql"))return;
 if(!window.initSqlJs){const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";s.onload=loadDB;document.head.appendChild(s)}else loadDB()}
function loadDB(){if(DB)return;initSqlJs({locateFile:f=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/"+f}).then(S=>{DB=new S.Database();DB.run(SEED);g("sql-out").innerHTML="<p class='sub'>数据库已就绪。</p>"}).catch(e=>g("sql-out").textContent="SQL 引擎载入失败："+e)}
function runSQL(){if(!DB){g("sql-out").textContent="SQL 引擎还在载入…";return}try{const r=DB.exec(g("sql").value);g("sql-out").innerHTML=r.length?r.map(t=>`<table><tr>${t.columns.map(c=>`<th>${c}</th>`).join("")}</tr>${t.values.map(v=>`<tr>${v.map(x=>`<td>${x===null?"NULL":x}</td>`).join("")}</tr>`).join("")}</table>`).join(""):"<p class='sub'>执行成功（没有返回行）</p>"}catch(e){g("sql-out").innerHTML=`<p style="color:var(--bad)">错误：${e.message}</p>`}}
function tbl(h,rows){return `<table><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</table>`}
function trace(){const al=g("al").value,inp=g("al-in").value,t=+g("al-t").value;let out="";
 if(al==="bin"){let x=parseInt(inp)||0,rows=[],s="";if(x===0)rows.push([0,0,0]);while(x>0){rows.push([x,x%2,Math.floor(x/2)]);s=(x%2)+s;x=Math.floor(x/2)}
  out=tbl(["X","X mod 2（输出）","X ← X div 2"],rows)+`<p>余数按顺序输出：${rows.map(r=>r[1]).join("")}；倒过来读才是二进制：<b>${s||0}</b></p>`}
 else{let a=inp.split(",").map(x=>+x.trim()).filter(x=>!isNaN(x));
  if(al==="bub"){let rows=[],n=a.length;for(let p=1;p<n;p++){let sw=false;for(let i=0;i<n-p;i++){const c=`${a[i]} > ${a[i+1]}?`;if(a[i]>a[i+1]){[a[i],a[i+1]]=[a[i+1],a[i]];sw=true;rows.push([p,i+1,c+" 交换",a.join(", ")])}else rows.push([p,i+1,c+" 不换",a.join(", ")])}if(!sw){rows.push([p,"-","这一轮没有交换，提早结束",a.join(", ")]);break}}out=tbl(["Pass","比较位置","比较","列表"],rows)}
  else if(al==="bs"){a.sort((x,y)=>x-y);let lo=0,hi=a.length-1,rows=[],f=-1;while(lo<=hi){const m=Math.floor((lo+hi)/2);rows.push([lo+1,hi+1,m+1,a[m],a[m]===t?"找到":a[m]<t?"目标较大 → low = mid+1":"目标较小 → high = mid−1"]);if(a[m]===t){f=m;break}if(a[m]<t)lo=m+1;else hi=m-1}
   out=`<p class="sub">已先排序：${a.join(", ")}（位置从 1 开始）</p>`+tbl(["low","high","mid","A[mid]","动作"],rows)+`<p>${f>=0?`在位置 ${f+1} 找到，比较 ${rows.length} 次`:`找不到，比较 ${rows.length} 次`}</p>`}
  else{let rows=[],f=-1;for(let i=0;i<a.length;i++){rows.push([i+1,a[i],a[i]===t?"找到":"继续"]);if(a[i]===t){f=i;break}}out=tbl(["i","A[i]","动作"],rows)+`<p>${f>=0?`位置 ${f+1}，比较 ${rows.length} 次`:"找不到"}</p>`}}
 g("al-out").innerHTML=out}
