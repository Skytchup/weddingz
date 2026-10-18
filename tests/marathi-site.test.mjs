import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';

execFileSync(process.execPath, ['scripts/build-marathi.mjs']);
const source = fs.readFileSync('marathi-dist/app.js','utf8');
function render(page) {
  const app={innerHTML:''};
  const sandbox={
    document:{body:{dataset:{page}},documentElement:{},getElementById:()=>app},
    WeddingGifts:{render:lang=>'<section data-gift-language="'+lang+'"></section>',mount(lang){assert.equal(lang,'mr');}},
    localStorage:{getItem(){throw Error('Language must not depend on browser preference');}}
  };
  vm.createContext(sandbox);vm.runInContext(source,sandbox);
  return {html:app.innerHTML,lang:sandbox.document.documentElement.lang};
}
test('separate invitation is Marathi-only with exactly three homepage categories',()=>{
  const {html,lang}=render('home');
  assert.equal(lang,'mr');
  assert.deepEqual([...html.matchAll(/class="tile" href="([^"]+)"/g)].map(x=>x[1]),['venue.html','programme.html','gifts.html']);
  assert(!html.includes('data-lang'));
  assert(!html.includes('menu.html'));
  assert(html.includes('२९ जानेवारी २०२७'));
  assert(!html.includes('२८'));
});
test('programme shows only all four 29 January events and no day-one information',()=>{
  const {html}=render('programme');
  assert.deepEqual([...html.matchAll(/<time>(.*?)<\/time>/g)].map(x=>x[1]),['08:00','11:30','13:00','14:30']);
  for(const forbidden of ['२८','28 January','haldi','mehendi','sangeet','10:30','16:30','19:00']) assert(!html.toLowerCase().includes(forbidden));
  assert.equal((html.match(/class="schedule-day"/g)||[]).length,1);
  assert(!source.includes('"day1"'));
});
test('venue and gift pages remain Marathi; payment details and same-origin API stay available',()=>{
  assert(render('venue').html.includes('Marigold'));
  assert(render('gifts').html.includes('data-gift-language="mr"'));
  for(const detail of ['08251610007531','HDFC0000825','FR76 1313','97721021'])assert(source.includes(detail));
  const giftSource=fs.readFileSync('marathi-dist/gifts.js','utf8');
  assert(giftSource.includes("fetch('/api/gifts'"));
  assert(giftSource.includes("fetch('/api/gifts/contributions'"));
  assert(!giftSource.includes('A tiny ramen'));
});
test('build publishes only one-day pages and no menu, source files, or full-site link',()=>{
  const files=fs.readdirSync('marathi-dist');
  assert(!files.includes('menu.html'));
  assert(!files.includes('README.md'));
  assert(files.includes('404.html'));
  for(const name of files.filter(x=>/\.(html|js)$/.test(x))) {
    const text=fs.readFileSync('marathi-dist/'+name,'utf8');
    assert(!text.includes('wedding-98k.pages.dev'));
    assert(!text.includes('28–29'));
    if(name.endsWith('.html'))assert(text.includes('lang="mr"'));
  }
});
