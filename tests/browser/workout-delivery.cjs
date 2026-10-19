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
      let account = { profile: { name:'QA Coach',studio:'QA',whatsapp:'11999999999' },students:[{id:'qa-student',name:'QA Workout',goal:'Força',limitation:'Nenhuma',workout:[],weightHistory:[],measures:{}}] };
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

      const openWorkout=async()=>{
        await page.getByRole('button',{name:'Aba Alunos',exact:true}).click();
        await page.locator('main').getByText('QA Workout',{exact:true}).click();
        await page.getByRole('button',{name:'Abrir treino',exact:true}).click();
      };
      await openWorkout();
      await page.getByRole('button',{name:'Adicionar exercício da biblioteca',exact:true}).click();
      await page.getByRole('button',{name:'Selecionar Supino reto com barra',exact:true}).click();
      await page.getByLabel('Séries (vezes)',{exact:true}).fill('4');
      await page.getByLabel('Repetições ou duração',{exact:true}).fill('8–12');
      await page.getByLabel('Carga ou intensidade',{exact:true}).fill('22,5 kg');
      await page.getByLabel('Descanso em segundos',{exact:true}).fill('90');
      await page.getByRole('button',{name:'Adicionar à ficha',exact:true}).click();
      assert.equal(await page.getByLabel('Buscar exercício na biblioteca',{exact:true}).count(),0,'library closes after addition');
      await page.getByRole('button',{name:'Salvar treino',exact:true}).click();
      await page.getByText('Treino salvo na sua conta',{exact:true}).waitFor();
      await page.reload();await openWorkout();
      if(real)account=(await page.evaluate(()=>window.PersonalProCloud.request('/rest/v1/personal_pro_accounts?select=profile,students')))[0];
      const ex=account.students[0].workout[0];
      assert.equal(ex.series,'4');assert.equal(ex.repetitions,'8–12');assert.equal(ex.load,'22,5 kg');assert.equal(ex.rest,90);
      console.log('Prescription persisted',JSON.stringify({series:ex.series,repetitions:ex.repetitions,load:ex.load,rest:ex.rest}));
      await page.getByRole('button',{name:'PDF para o aluno',exact:true}).click();
      await page.getByRole('button',{name:'Gerar ficha',exact:true}).click();
      await page.getByRole('button',{name:'Baixar PDF',exact:true}).waitFor();
      const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Baixar PDF',exact:true}).click()]);
      const output='/tmp/pp-workout-'+viewport.width+'.pdf';await download.saveAs(output);
      assert.equal(fs.readFileSync(output).subarray(0,5).toString(),'%PDF-');
      await page.getByRole('button',{name:'Fechar PDF',exact:true}).click();
      await page.getByRole('button',{name:'Voltar à ficha',exact:true}).click();
      await page.getByRole('button',{name:'Abrir atendimentos',exact:true}).click();

      await page.getByRole('button',{name:'Adicionar contratação',exact:true}).click();
      await page.getByLabel('Aulas contratadas',{exact:true}).fill('12');
      await page.getByRole('button',{name:'Adicionar dia e horário',exact:true}).click();
      await page.getByLabel('Dia da semana',{exact:true}).selectOption(String(new Date().getDay()));
      await page.getByLabel('Horário do atendimento',{exact:true}).fill('18:00');
      await page.getByLabel('Local do atendimento',{exact:true}).fill('Academia QA');
      await page.getByRole('button',{name:'Salvar horários',exact:true}).click();
      await page.getByText(/Horários salvos. Próximo atendimento/).waitFor();
      if(!real)assert.equal(account.students[0].servicePackages[0].slots[0].time,'18:00');
      await page.reload();
      await page.getByRole('button',{name:'Aba Alunos',exact:true}).click();
      await page.locator('main').getByText('QA Workout',{exact:true}).click();
      await page.getByRole('button',{name:'Abrir atendimentos',exact:true}).click();
      await page.getByText(/18:00–19:00 · Academia QA/).waitFor();
      assert.deepEqual(errors,[]);
      console.log(`PASS ${viewport.width}×${viewport.height}: prescription reload, library closes, actual PDF download, confirmed appointment reload`);
      if(real){await page.getByRole('button',{name:'Voltar à ficha',exact:true}).click();await page.getByRole('button',{name:'Fechar ficha',exact:true}).click();await page.getByRole('button',{name:'Sair da conta',exact:true}).click();}
      await page.close();
    }
  } finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
}
main().catch(e=>{console.error(e);process.exitCode=1});
