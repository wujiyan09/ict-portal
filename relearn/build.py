# Builds data/relearn.json for the /ict/relearn/ tool from catalog, book and DSE data.
import json,re,glob,collections,os
os.chdir(os.path.dirname(os.path.abspath(__file__))+"/..")
cat=json.load(open('data/catalog.json'))
STOP=set("the a an of to and or in on for is are be by with which following as that this its it from at can will not used use using following statements about correct incorrect best describes what how why".split())
def toks(s):
    s=re.sub(r'<[^>]+>',' ',s or '').lower()
    return [w for w in re.findall(r'[a-z][a-z0-9\-]{2,}',s) if w not in STOP]
def strip(s): return re.sub(r'\s+',' ',re.sub(r'<[^>]+>',' ',s or '')).strip()
def kw(html):
    m=re.search(r'Exam wording[:：]?\s*</b>(?:</p>)?(.*?)(?=<p><b>|$)',html,re.S)
    if not m: return []
    seg=m.group(1)
    items=[strip(x) for x in re.findall(r'<li>(.*?)</li>',seg,re.S)]
    if not items:
        t=strip(seg)
        if t: items=[t]
    return [i for i in items if i][:5]
books={}; chs=[]
for b in cat['books']:
    bk=json.load(open(f"data/book-{b['id']}.json")); books[b['id']]=bk
    for ch in bk['chs']:
        ch['_book']=b['id']; ch['_el']=bool(b.get('elective')) or b['id'] in('EA','EB','EC')
        chs.append(ch)
# DSE MC
dse=[]
for f in sorted(glob.glob('data/dse-*.json')):
    d=json.load(open(f)); y=str(d['year']); Y=y.upper() if y in('sp','pp') else y
    for q in d.get('mc',[]):
        if q.get('fig') or q.get('cancel'): continue
        if not q.get('o') or q.get('a') not in 'ABCD': continue
        dse.append(dict(q=q['q'],st=q.get('st') or [],o=q['o'],a='ABCD'.index(q['a']),e=q.get('exp',''),src=f"HKDSE {Y} Paper 1 Q{q['n']}",pct=q.get('pct',''),topic=q.get('topic'),code=q.get('code',False)))
# idf
docs={}
for ch in chs:
    t=ch['t']+' '+' '.join(ch['sec'])+' '+' '.join(c['t']+' '+c['t']+' '+strip(c['en'])[:300] for c in ch['cards'])
    docs[ch['id']]=collections.Counter(toks(t))
df=collections.Counter(w for c in docs.values() for w in c)
import math
N=len(docs)
def score(q,cid):
    d=docs[cid];tot=sum(d.values())
    return sum((d[w]/tot)*math.log(N/(1+df[w])) for w in set(toks(q)))
TOP={'A1':['A1C1','A1C2','A1C3'],'A2':['A2C4','A2C5'],'B':['BC1','BC2','BC3'],'C1':['C1C1','C1C2','C1C3'],'C2':['C2C4','C2C5','C2C6'],'D2':['D2C4','D2C5','D2C6'],'E':['EC1','EC2','EC3']}
pools=collections.defaultdict(list); d1=[]
for q in dse:
    text=q['q']+' '+' '.join(q['st'])+' '+' '.join(q['o'])
    if q['topic']=='D1': d1.append(q);continue
    cands=TOP.get(q['topic'])
    if not cands: continue
    best=max(cands,key=lambda c:score(text,c)); pools[best].append(q)
def mmc(m,ch):
    return dict(q=m['q'],st=[],o=m['o'],a=m['a'],e=m.get('e',''),ez=m.get('ez',''),src=m.get('src') or f"Textbook {ch['_book']} Ch{ch['n']} chapter practice",code=m.get('code',False))
out=dict(v=1,chs=[],el={})
D1=dict(id='D1',book='D1',n=0,t='Basic Programming Concepts (Algorithms)',tz='基本编程概念（算法）',sec=['Problem solving & algorithms','Flowcharts & pseudocode','Data types & variables','Control structures','Trace tables'],items=[],mc=d1[:60],link=None)
for ch in chs:
    items=[]
    for i,c in enumerate(ch['cards']):
        items.append(dict(i=i,t=c['t'],tz=c.get('tz',''),s=c.get('sec',''),k=kw(c['en'])))
    tb=[mmc(m,ch) for m in ch['mc']]
    tbs=[m for m in tb if not m['src'].endswith('chapter practice')]
    rec=dict(id=ch['id'],book=ch['_book'],n=ch['n'],t=ch['t'],tz=ch['tz'],sec=ch['sec'],items=items)
    if ch['_el']:
        out['el'][ch['id']]=rec; rec['mc']=tbs+[m for m in tb if m not in tbs][:max(0,30-len(tbs))]
    else:
        rec['mc']=pools[ch['id']]+tbs+[m for m in tb if m not in tbs][:20]
        out['chs'].append(rec)
        if ch['id']=='C1C3': pass
# insert D1 after C2 chapters
ix=[i for i,c in enumerate(out['chs']) if c['book']=='C2'][-1]+1
out['chs'].insert(ix,D1)
# web theory DSE MC for Elective B, database DSE for Elective A
webk=re.compile(r'\b(http|https|cookie|session|client[- ]side|server[- ]side|php|javascript|html|css|web server|url|browser|ssl|tls|form)\b',re.I)
dbk=re.compile(r'\b(sql|database|primary key|foreign key|normal|relation|query|dbms|field|record|table)\b',re.I)
out['dseWeb']=[q for q in dse if webk.search(q['q']+' '+' '.join(q['o']))][:80]
out['dseDb']=[q for q in dse if dbk.search(q['q']+' '+' '.join(q['o']))][:80]
for q in dse: q.pop('topic',None)
json.dump(out,open('data/relearn.json','w'),ensure_ascii=False,separators=(',',':'))
for c in out['chs']: print(c['id'],len(c['mc']),sum(1 for m in c['mc'] if m['src'].startswith('HKDSE')),sum(1 for it in c['items'] if it['k']))
print(len(out['dseWeb']),len(out['dseDb']),os.path.getsize('data/relearn.json'))
