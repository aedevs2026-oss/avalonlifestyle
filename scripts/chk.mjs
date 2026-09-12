import { chromium } from 'playwright';
for (const ch of ['msedge','chrome']) {
  try { const b = await chromium.launch({ channel: ch }); console.log('OK channel:', ch, '-', b.version()); await b.close(); process.exit(0); }
  catch (e) { console.log('FAIL', ch, ':', String(e.message).split('\n')[0]); }
}
process.exit(1);
