import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('app.js','utf8');
function load(page,language){
 const app={innerHTML:''},root={innerHTML:''},redirects=[],buttons=['28','29'].map(day=>({dataset:{menuDay:day},setAttribute(){},addEventListener(){}})),langs=['en','fr','mr'].map(lang=>({dataset:{lang},addEventListener(type,cb){this.click=cb}}));
 const context={localStorage:{getItem:()=>language,setItem(){}},window:{location:{replace:url=>redirects.push(url)}},document:{body:{dataset:{page}},documentElement:{},getElementById:id=>id==='app'?app:root,querySelectorAll:selector=>selector==='[data-lang]'?langs:buttons}};
 vm.createContext(context);vm.runInContext(source,context);
 return {app,root,redirects,langs,run:code=>vm.runInContext(code,context)};
}
for(const lang of ['en','fr','mr']){
 const home=load('home',lang);
 assert.equal(home.app.innerHTML.includes('href="menu.html"'),lang!=='mr');
 const m=load('menu',lang);
 if(lang==='mr'){assert.deepEqual(m.redirects,['index.html']);assert.equal(m.app.innerHTML,'');assert.equal(m.root.innerHTML,'');continue;}
 for(const day of ['28','29']){
 m.run('renderMenu("'+day+'")');
 assert(!/to be confirmed|à confirmer|current selections|restent à confirmer/.test(m.app.innerHTML+m.root.innerHTML));
 assert(m.root.innerHTML.includes('<strong>'));
 assert(m.root.innerHTML.includes('role="img"'));
 assert(m.root.innerHTML.includes(lang==='fr'?'contact croisé':'cross-contact'));
 if(lang==='fr')assert(!/creamy almond|warming black|Cooking style|Welcome drinks|Main course/.test(m.root.innerHTML));
 }
 m.langs[2].click();assert.deepEqual(m.redirects,['index.html']);assert.equal(m.app.innerHTML,'');
}
const data=load('menu','en').run('MENU');
assert.equal(data.reduce((n,d)=>n+d.sections.reduce((n,c)=>n+c.items.length,0),0),47);
for(const d of data)for(const c of d.sections)for(const i of c.items){
 assert(i.fr);
 if(/^(Chicken|Mutton)/.test(i.name))assert(i.tags.includes('meat'));
 if(/^Fish/.test(i.name))assert(i.tags.includes('fish'));
}
for(const page of ['index','menu','venue','programme','gifts']){
const html=fs.readFileSync(page+'.html','utf8');assert(html.includes('id="app"'));assert(html.includes('src="app.js"'));
}
console.log('PASS: home/menu language rendering, both days, direct MR access, MR switch, French copy, dietary icons, and page entry points');

