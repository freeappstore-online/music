"""Parse the actual public build before upload; never infer validity from source strings."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import json
import sys
import xml.etree.ElementTree as ET

class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.meta = {}
        self.canonicals = []
        self.title = ''
        self.h1 = ''
        self.target = None
        self.json_text = None
        self.structured = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'meta':
            key = a.get('name', a.get('property', ''))
            if key in ['description', 'og:title', 'og:description']:
                assert len(attrs) == 2 and a.get('content'), f'Malformed/truncated meta attributes: {attrs}'
                self.meta[key] = a['content']
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonicals.append(a.get('href'))
        if tag in ['title', 'h1']:
            self.target = tag
        if tag == 'script' and a.get('type') == 'application/ld+json':
            self.json_text = ''

    def handle_data(self, data):
        if self.json_text is not None:
            self.json_text += data
        elif self.target:
            setattr(self, self.target, getattr(self, self.target) + data)

    def handle_endtag(self, tag):
        if tag == self.target:
            self.target = None
        if tag == 'script' and self.json_text is not None:
            self.structured.append(json.loads(self.json_text))
            self.json_text = None

root = Path(sys.argv[1] if len(sys.argv) > 1 else 'web/dist')
urls = [element.text for element in ET.parse(root/'sitemap.xml').findall('{*}url/{*}loc')]
assert len(urls) == len(set(urls)) and len(urls) >= 108
for url in urls:
    parsed = urlsplit(url)
    assert parsed.scheme == 'https' and parsed.netloc == 'music.freeappstore.online', url
    file = root/(parsed.path.lstrip('/') or 'index.html')
    page = Page()
    page.feed(file.read_text())
    assert page.canonicals == [url], (url, page.canonicals)
    assert page.title and page.meta.get('description'), url
    for item in page.structured:
        if item.get('@type') in ['MusicGroup', 'MusicComposition', 'Person']:
            assert item['name'] in page.title, (url, item['name'], page.title)
            assert item['name'] == page.h1, (url, item['name'], page.h1)
            assert page.meta['og:description'] == item['description'], url
            if item['@type'] == 'MusicComposition':
                assert item['name'] in page.meta['description'], url
    assert page.json_text is None, f'Unclosed JSON-LD block: {url}'
print(f'Parsed {len(urls)} built sitemap pages: intact metadata, canonical URLs and valid JSON-LD')
