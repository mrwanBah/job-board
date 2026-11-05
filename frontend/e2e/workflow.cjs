const { chromium, expect } = require('@playwright/test');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({channel:process.env.E2E_BROWSER_CHANNEL || undefined,headless:true});
 const output=process.env.E2E_OUTPUT_DIR || 'test-results';fs.mkdirSync(output,{recursive:true});
 const errors=[],serverErrors=[];
 const track=page=>{page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});page.on('response',r=>{if(r.status()>=500)serverErrors.push({url:r.url(),status:r.status()})})};
 const company=await browser.newContext({viewport:{width:1280,height:900}}), applicant=await browser.newContext({viewport:{width:375,height:812}});
 const cp=await company.newPage(), ap=await applicant.newPage();track(cp);track(ap);
 const base=process.env.E2E_BASE_URL || 'http://localhost:5173',unique=Date.now();
 async function register(page,role){await page.goto(base+'/register');await page.getByLabel('I am a').selectOption(role);await page.getByLabel(role==='COMPANY'?'Company name':'Full name').fill(role==='COMPANY'?'Browser Test Company':'Browser Test Applicant');await page.getByLabel('Email').fill(role.toLowerCase()+unique+'@example.com');await page.getByLabel('Password').fill('BrowserTest123!');await page.getByRole('button',{name:'Create account'}).click();await expect(page).toHaveURL(/dashboard$/)}
 await register(cp,'COMPANY');
 await cp.goto(base+'/dashboard/company');await cp.getByLabel('Website').fill('https://example.com');await cp.getByRole('button',{name:'Save profile'}).click();await expect(cp.getByText('Company profile saved.')).toBeVisible();
 await cp.goto(base+'/dashboard/jobs/new');await cp.getByLabel('Title',{exact:true}).fill('Browser workflow role');await cp.getByLabel('Description',{exact:true}).fill('A role created by the browser integration check.');await cp.getByLabel('Salary min').fill('100');await cp.getByLabel('Expires').fill('2099-12-31');
 const response=cp.waitForResponse(r=>r.url().endsWith('/api/jobs')&&r.request().method()==='POST');await cp.getByRole('button',{name:'Post job',exact:true}).click();const created=await (await response).json();if(!created.id)throw new Error('No job created');await expect(cp).toHaveURL(/dashboard\/jobs$/);
 await register(ap,'APPLICANT');
 await ap.goto(base+'/jobs/'+created.id);await ap.getByLabel('Cover letter (optional)').fill('I would like to work on this role.');await ap.getByRole('button',{name:'Apply',exact:true}).click();await expect(ap.getByText('Application status: PENDING')).toBeVisible();
 await cp.goto(base+'/dashboard/jobs/'+created.id+'/applications');await cp.getByRole('button',{name:'Accept',exact:true}).click();await expect(cp.getByText('Accepted',{exact:true})).toBeVisible();
 await ap.goto(base+'/dashboard/applications');await expect(ap.getByText('Accepted',{exact:true})).toBeVisible();
 await ap.screenshot({path:output+'/'+'browser-applicant-mobile.png',fullPage:true});
 await ap.goto(base+'/jobs/'+created.id);await expect(ap.getByText('Application status: ACCEPTED')).toBeVisible();
 for(const route of ['/','/dashboard/applications','/jobs/'+created.id]) {await ap.goto(base+route);await ap.waitForLoadState('networkidle');if(await ap.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth))throw new Error('Horizontal overflow at '+route)}
 await cp.goto(base+'/dashboard/jobs/'+created.id+'/edit');await expect(cp.getByLabel('Expires')).toHaveValue('2099-12-31');await cp.getByRole('button',{name:'Save changes'}).click();await expect(cp).toHaveURL(/dashboard\/jobs$/);
 await cp.screenshot({path:output+'/'+'browser-company.png',fullPage:true});
 await cp.goto(base+'/dashboard/company');await cp.screenshot({path:output+'/'+'browser-company-profile.png',fullPage:true});
 await ap.goto(base+'/');await ap.screenshot({path:output+'/'+'browser-home-mobile.png',fullPage:true});
 const result={workflow:'passed',mobileWidth:375,consoleErrors:errors,serverErrors};fs.writeFileSync(output+'/browser-results.json',JSON.stringify(result,null,2));await browser.close();console.log(JSON.stringify(result));if(errors.length||serverErrors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});


