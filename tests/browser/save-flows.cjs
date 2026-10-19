/* Run with PLAYWRIGHT_MODULE and CHROMIUM_PATH pointing to the test runtime.
 * Default: isolated in-memory REST adapter. PP_REAL_EMAIL/PP_REAL_PASSWORD:
 * run against a disposable Supabase account, never a user's account.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = path.resolve(__dirname, '../..');
const real = !!process.env.PP_REAL_EMAIL;
async function main() {
  const server = http.createServer((req, res) => {
    const file = path.resolve(base, '.' + decodeURIComponent(req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
    if (!file.startsWith(base + path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404).end(); return; }
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' }[path.extname(file)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type }); res.end(data);
    });
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = process.env.PP_BASE_URL || 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, proxy: process.env.PP_BROWSER_PROXY?{server:process.env.HTTPS_PROXY,bypass:"127.0.0.1,localhost"}:undefined, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] });
  try {
    for (const viewport of (real ? [{width:390,height:600}] : [{width:320,height:568},{width:390,height:844},{width:1440,height:900}])) {
      const page = await browser.newPage({ viewport,ignoreHTTPSErrors:true });
      page.setDefaultTimeout(60000);
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      const uid = '11111111-1111-4111-8111-111111111111';
      let account = { profile: { name:'QA Coach',studio:'QA',whatsapp:'11999999999' },students:[] };
      let fail = false, writes = 0;
      if (!real) {
        await page.addInitScript(({uid}) => sessionStorage.setItem('personal-pro-session', JSON.stringify({access_token:'test',refresh_token:'test',expires_at:Date.now()/1000+3600,user:{id:uid}})), {uid});
        await page.route('https://lnlwkjsfcpeofhajqesh.supabase.co/**', async route => {
          const req = route.request(), url = req.url(); let data = [];
          if (url.endsWith('/auth/v1/user')) data = {id:uid};
          else if (url.includes('/personal_pro_accounts')) {
            if (req.method() === 'POST') {
              if (fail) { await route.fulfill({status:503,contentType:'application/json',body:'{"message":"Falha simulada de conexão"}'}); return; }
              writes++; account = req.postDataJSON();
            }
            data = [account];
          } else if (url.includes('/pp_members')) data = [{user_id:uid,role:'trainer',name:'QA Coach',created_at:new Date().toISOString()}];
          await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
        });
      }
      await page.goto(url);
      if (real) {
        await page.getByLabel('E-mail',{exact:true}).fill(process.env.PP_REAL_EMAIL);
        await page.getByLabel('Senha',{exact:true}).fill(process.env.PP_REAL_PASSWORD);
        await page.getByRole('button',{name:'Entrar',exact:true}).click();
        await page.getByRole('button',{name:'Aba Alunos',exact:true}).waitFor({timeout:60000}).catch(async err=>{console.log('LOGIN STATE',await page.locator('body').innerText());throw err});
      }
      await page.getByRole('button',{name:'Aba Alunos',exact:true}).click();
      await page.getByRole('button',{name:'Novo aluno',exact:true}).click();
      const dialog = page.getByRole('dialog',{name:'Novo aluno',exact:true});
      await dialog.getByLabel('Nome do aluno',{exact:true}).fill('QA Aluno Salvamento');
      await dialog.getByLabel('WhatsApp',{exact:true}).fill('11987654321');
      await dialog.getByLabel('Mensalidade',{exact:true}).fill('120,50');
      // Physical coordinate click: prove navigation/toasts cannot intercept Save.
      const save = dialog.getByRole('button',{name:'Salvar aluno',exact:true});
      await save.scrollIntoViewIfNeeded();
      const box = await save.boundingBox();
      assert.equal(await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.textContent, {x:box.x+box.width/2,y:box.y+box.height/2}), 'Salvar aluno');
      if (!real) {
        fail = true; await save.click();
        await dialog.getByRole('alert').filter({hasText:'Não foi possível salvar o aluno'}).waitFor();
        assert.equal(await dialog.getByLabel('Nome do aluno',{exact:true}).inputValue(),'QA Aluno Salvamento');
        assert.equal(writes,0); fail = false;
      }
      await save.click(); await dialog.waitFor({state:'detached'});
      await page.getByText('QA Aluno Salvamento',{exact:true}).waitFor();
      await page.reload();
      await page.getByRole('button',{name:'Aba Alunos',exact:true}).click();
      await page.getByText('QA Aluno Salvamento',{exact:true}).waitFor();
      await page.getByRole('button',{name:'Aba Financeiro',exact:true}).click();
      await page.getByRole('button',{name:'＋ Novo lançamento',exact:true}).click();
      await page.getByLabel('Valor (R$)',{exact:true}).fill('1.234,56');
      await page.getByLabel('Descrição',{exact:true}).fill('QA recebimento persistido');
      if (!real) {
        fail = true;
        await page.getByRole('button',{name:'Adicionar lançamento',exact:true}).click();
        await page.getByRole('alert').filter({hasText:'Não foi possível salvar o lançamento'}).waitFor();
        assert.equal(await page.getByLabel('Valor (R$)',{exact:true}).inputValue(),'1.234,56');
        fail = false;
      }
      await page.getByRole('button',{name:'Adicionar lançamento',exact:true}).click();
      await page.getByText('Lançamento registrado e salvo',{exact:true}).first().waitFor();
      await page.reload();
      await page.getByRole('button',{name:'Aba Financeiro',exact:true}).click();
      await page.getByRole('button',{name:'Lançamentos',exact:true}).click();
      await page.getByText(/^QA recebimento persistido ·/).waitFor();
      if (!real) {assert.equal(account.students.length,1);assert.equal(account.students[0].planValue,120.5);assert.equal(account.profile.financialEntries.length,1);assert.equal(account.profile.financialEntries[0].amount,1234.56);}
      assert.deepEqual(errors,[]);
      console.log(`PASS ${real?'Supabase real':'isolated REST'} ${viewport.width}×${viewport.height}: student + BRL ledger persist after reload${real?'':'; failures preserve fields; retry creates no duplicates'}`);
      if (real) {
        // Verify a fresh login reads server data, then revoke this QA session.
        await page.getByRole('button',{name:'Sair da conta',exact:true}).click();
        await page.getByLabel('E-mail',{exact:true}).fill(process.env.PP_REAL_EMAIL);
        await page.getByLabel('Senha',{exact:true}).fill(process.env.PP_REAL_PASSWORD);
        await page.getByRole('button',{name:'Entrar',exact:true}).click();
        await page.getByRole('button',{name:'Aba Alunos',exact:true}).waitFor({timeout:60000}).catch(async err=>{console.log('LOGIN STATE',await page.locator('body').innerText());throw err});
        await page.getByRole('button',{name:'Aba Alunos',exact:true}).click();
        await page.getByText('QA Aluno Salvamento',{exact:true}).waitFor();
        await page.getByRole('button',{name:'Aba Financeiro',exact:true}).click();
        await page.getByRole('button',{name:'Lançamentos',exact:true}).click();
        await page.getByText(/^QA recebimento persistido ·/).waitFor();
        await page.getByRole('button',{name:'Sair da conta',exact:true}).click();
        console.log('PASS fresh login reads both saved records; QA session signed out');
      }
      await page.close();
    }
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
}
main().catch(e=>{console.error(e);process.exitCode=1});
