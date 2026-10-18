import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../gifts.js', import.meta.url), 'utf8');
function setup() {
  const listeners = {};
  const node = () => ({ innerHTML: '', hidden: false, addEventListener(type, fn) { this[type] = fn; }, querySelector() { return null; }, remove() {}, classList: { add() {}, remove() {} } });
  const root = node(), status = node(), dialog = node(), selects = [{value:'SGD'}, {value:'SGD'}];
  const document = {
    getElementById: id => id === 'gift-grid' ? root : status,
    createElement: () => dialog,
    body: { appendChild() {}, classList: { add() {}, remove() {} } },
    addEventListener(type, fn) { listeners[type] = fn; },
    querySelectorAll: () => selects
  };
  const sandbox = {
    window: {}, document, Intl, AbortController, crypto: { randomUUID: () => 'draft-1' }, matchMedia: () => ({matches:true}),
    setInterval: () => 1, clearInterval() {},
    fetch: async () => ({ ok: true, json: async () => ({ gifts: ['flights','hotel','rail','restaurants','onsen','pokemon','together'].map(id => ({id, contributedCents: id === 'restaurants' ? 5000 : 0})) }) })
  };
  vm.createContext(sandbox);
  vm.runInContext(source.replace('return { render, mount };', 'return { render, mount, rates, inputAmount, euroCents, contributionCents, selectLanguage, getCurrency: () => currency };'), sandbox);
  return { api: sandbox.window.WeddingGifts, root, dialog, selects, listeners };
}
test('language defaults and manual currency choices', async () => {
  const {api, root, listeners, selects} = setup();
  for (const [lang, currency] of [['en','SGD'], ['fr','EUR'], ['mr','INR']]) {
    assert(api.render(lang).includes('value="'+currency+'" selected'));
    assert.equal(api.getCurrency(), currency);
  }
  api.render('en');
  api.mount('en', () => '', () => '');
  await new Promise(resolve => setImmediate(resolve));
  assert.match(root.innerHTML, /SGD/);
  assert.match(root.innerHTML, /1,728/); // Flights: EUR 1,200.
  assert.match(root.innerHTML, /Sushi experience/);
  assert.match(root.innerHTML, /exceptional restaurant/);
  assert(!root.innerHTML.includes('tiny ramen'));
  for (const currency of ['INR','EUR','SGD']) {
    listeners.change({ target: { matches: () => true, value: currency } });
    assert.equal(api.getCurrency(), currency);
    assert(root.innerHTML.includes(currency));
    assert(selects.every(select => select.value === currency));
  }
  api.render('fr');
  assert.equal(api.getCurrency(), 'EUR');
});
test('fixed estimates convert contributions back into shared euro cents', () => {
  const {api} = setup();
  assert.equal(api.inputAmount(20000, 'SGD'), '288.00');
  assert.equal(api.inputAmount(20000, 'INR'), '21400.00');
  assert.equal(api.euroCents('144', 'SGD'), 10000);
  assert.equal(api.euroCents('10700', 'INR'), 10000);
  for (const currency of ['EUR','SGD','INR']) {
    for (const cents of [1, 33, 101, 12345, 19999]) {
      assert.equal(api.contributionCents(api.inputAmount(cents, currency), currency, cents), cents);
    }
  }
  assert.equal(api.contributionCents('72', 'SGD', 20000), 5000);
  // A stale full amount must not silently turn into the new remaining amount.
  assert.equal(api.contributionCents('288', 'SGD', 15000), 20000);
  assert.equal(api.contributionCents('0', 'INR'), 0);
  assert(Number.isNaN(api.contributionCents('bad', 'SGD')));
});
test('switching currency preserves an open contribution draft and updates limits', async () => {
  const {api, root, dialog, listeners} = setup();
  const input = {value:'72.00', readOnly:false};
  const label = {replaceChildren(text) {this.textContent=text;}};
  const image = {getBoundingClientRect:()=>({width:100}), querySelector:()=>({style:{}})};
  const nodes = {
    '[name="amount"]': input,
    '[data-gift-amount-label]': label,
    '[data-gift-dialog-price]': {},
    '.gift-dialog-image': image,
    '.gift-dialog-progress': {},
    '.gift-payment-area': {},
    '.gift-checking': {},
    '.gift-record-toggle': {toggleAttribute() {}}
  };
  dialog.querySelector = selector => nodes[selector] || null;
  dialog.setAttribute = () => {};
  dialog.showModal = () => {dialog.open=true;};
  api.render('en');api.mount('en', () => '', () => '');
  await new Promise(resolve => setImmediate(resolve));
  const button = {dataset:{gift:'restaurants'}, querySelector:()=>({getBoundingClientRect:()=>({width:100}),style:{}})};
  root.click({target:{closest:()=>button}});
  await new Promise(resolve => setImmediate(resolve));
  assert(dialog.open);
  assert(dialog.innerHTML.includes('Your contribution (SGD)'));
  const originalMarkup=dialog.innerHTML;
  listeners.change({target:{matches:()=>true,value:'INR'}});
  assert.equal(input.value,'5350.00');
  assert.equal(input.max,'16050.00');
  assert.equal(label.textContent,'Your contribution (INR)');
  assert.match(nodes['[data-gift-dialog-price]'].textContent,/INR/);
  assert.equal(dialog.innerHTML,originalMarkup);
  input.readOnly=true;
  listeners.change({target:{matches:()=>true,value:'EUR'}});
  assert.equal(input.value,'150.00');
  assert.equal(input.max,'150.00');
});

