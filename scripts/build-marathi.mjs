import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'marathi-dist');
const read = file => fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
let app = read('app.js');
const prefixEnd = app.indexOf('const MENU=');
if (prefixEnd < 0) throw new Error('Missing translation boundary');
const translations = vm.runInNewContext(app.slice(0, prefixEnd) + ';T');
const mr = {
  ...translations.mr,
  date: '२९ जानेवारी २०२७ · पुणे, भारत',
  exploreSub: 'या दिवसासाठी तुम्हाला आवश्यक असलेली माहिती.',
  programmeShort: 'विवाहसोहळ्याचा कार्यक्रम',
  programmeLead: '२९ जानेवारीच्या विवाहसोहळ्याचा कार्यक्रम.'
};
for (const key of ['day1', 'haldi', 'haldiDesc', 'mehendi', 'mehendiDesc', 'sangeet', 'sangeetDesc', 'menu', 'menuShort', 'menuLead']) delete mr[key];
const suffixStart = app.indexOf('const page=');
app = 'const T=' + JSON.stringify({mr}) + ';const I=' + JSON.stringify({
  venue: 'https://pub-2e3024c43ee34ef781ed4df20ecad1c8.r2.dev/flowers.png',
  programme: 'https://pub-2e3024c43ee34ef781ed4df20ecad1c8.r2.dev/dance.png',
  gifts: 'https://pub-2e3024c43ee34ef781ed4df20ecad1c8.r2.dev/japan.jpg'
}) + ';' + app.slice(suffixStart);
function replaceOnce(before, after) {
  if (!app.includes(before)) throw new Error('Source changed; missing Marathi build marker: ' + before.slice(0, 70));
  app = app.replace(before, () => after);
}
replaceOnce('let lang=localStorage.getItem("wedding-lang")||"en";if(!T[lang])lang="en";', 'const lang="mr";');
const headerStart = app.indexOf('function header()'), headerEnd = app.indexOf('function foot()', headerStart);
app = app.slice(0, headerStart) + 'function header(){return \'<header class="site-header"><a class="brand" href="index.html">R & A</a></header>\'}' + app.slice(headerEnd);
replaceOnce('28 — 29 · 01 · 2027', '२९ · ०१ · २०२७');
replaceOnce('Marigold website ↗', 'Marigold संकेतस्थळ ↗');
replaceOnce('["venue","programme","menu","gifts"].filter(k=>lang!=="mr"||k!=="menu")', '["venue","programme","gifts"]');
replaceOnce('\'<div class="schedule-day"><h2>\'+t("day1")+\'</h2>\'+events([["10:30","haldi","haldiDesc"],["16:30–19:00","mehendi","mehendiDesc"],["19:00 →","sangeet","sangeetDesc"]])+\'</div><div class="schedule-day"><h2>\'', '\'<div class="schedule-day"><h2>\'');
const menuStart = app.indexOf('if(page==="menu")body='), menuEnd = app.indexOf('if(page==="gifts")body=', menuStart);
if (menuStart < 0 || menuEnd < 0) throw new Error('Missing menu content boundary');
app = app.slice(0, menuStart) + app.slice(menuEnd);
const helpersStart = app.indexOf('const DIET_LABELS='), helpersEnd = app.indexOf('function giftPaymentMethods()', helpersStart);
if (helpersStart < 0 || helpersEnd < 0) throw new Error('Missing menu helper boundary');
app = app.slice(0, helpersStart) + app.slice(helpersEnd);
const renderStart = app.indexOf('function render(){');
app = app.slice(0, renderStart) + 'function render(){document.documentElement.lang=lang;document.title=(page==="home"?"रुजुता आणि अलेक्झांद्र":t(page)+" · रुजुता आणि अलेक्झांद्र");el.innerHTML=header()+content()+foot();if(page==="gifts")WeddingGifts.mount(lang,t,giftPaymentMethods)}render();\n';

let gifts = read('gifts.js');
const copyStart = gifts.indexOf('  const copy = '), copyEnd = gifts.indexOf('  // Keep translated labels', copyStart);
const copySource = gifts.slice(copyStart, copyEnd);
const giftCopy = vm.runInNewContext(copySource + ';copy');
gifts = gifts.slice(0, copyStart) + '  const copy = ' + JSON.stringify({mr: giftCopy.mr}) + ';\n' + gifts.slice(copyEnd);
gifts = gifts.replaceAll('copy.en', 'copy.mr');
const pages = {};
for (const page of ['index','venue','programme','gifts']) {
  pages[page + '.html'] = '<!doctype html><html lang="mr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#fbf5e9"><meta name="robots" content="noindex, nofollow"><meta name="description" content="रुजुता आणि अलेक्झांद्र यांचा विवाहसोहळा, २९ जानेवारी २०२७, पुणे."><link rel="stylesheet" href="styles.css">' +
    (page === 'gifts' ? '<link rel="stylesheet" href="gifts.css">' : '') +
    '<title>रुजुता आणि अलेक्झांद्र</title></head><body data-page="' + (page === 'index' ? 'home' : page) +
    '"><div id="app"></div><noscript><p>कृपया ही वेबसाइट पाहण्यासाठी JavaScript सुरू करा.</p></noscript>' +
    (page === 'gifts' ? '<script src="gifts.js" defer></script>' : '') +
    '<script src="app.js" defer></script></body></html>\n';
}
// Do not recursively clear a directory: refuse unexpected files instead.
const files = {
  ...pages, 'app.js': app, 'gifts.js': gifts, 'styles.css': read('styles.css'), 'gifts.css': read('gifts.css'),
  '_routes.json': read('_routes.json'),
  '_headers': '/*\n  X-Robots-Tag: noindex, nofollow\n',
  '_redirects': '/menu / 302\n/menu.html / 302\n',
  '404.html': pages['index.html']
};
fs.mkdirSync(output, {recursive:true});
for (const name of fs.readdirSync(output)) if (!Object.hasOwn(files, name)) throw new Error('Unexpected build output file: ' + name);
for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(output, name), content);
console.log('Built Marathi-only 29 January invitation in marathi-dist (shared same-origin gift API).');
