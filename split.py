#!/usr/bin/env python3
"""Splits data/book-*.json into data/ch/<chapter>.json + data/catalog.json for on-demand download in Prism."""
import json, hashlib, os, glob
os.makedirs('data/ch', exist_ok=True)
m = json.load(open('data/manifest.json'))
books = []
for bid in m['books']:
    b = json.load(open(f'data/book-{bid}.json'))
    chs = []
    for c in b['chs']:
        raw = json.dumps(c, ensure_ascii=False, separators=(',', ':')).encode()
        open(f"data/ch/{c['id']}.json", 'wb').write(raw)
        chs.append({'id': c['id'], 'n': c['n'], 't': c['t'], 'tz': c.get('tz', ''), 'sec': c.get('sec', []),
                    'nc': len(c.get('cards') or []), 'nm': len(c.get('mc') or []), 'ns': len(c.get('sq') or []),
                    'np': len(c.get('pr') or []), 'h': hashlib.sha256(raw).hexdigest()[:16], 'size': len(raw)})
    books.append({'id': b['id'], 'name': b['name'], 'elective': b.get('elective'), 'chs': chs})
json.dump({'v': m['v'], 'books': books}, open('data/catalog.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print(len(books), 'books', sum(len(b['chs']) for b in books), 'chapters')
