import { After, Before, setDefaultTimeout, setWorldConstructor, World } from '@cucumber/cucumber';
import type { IWorldOptions } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import type { Browser, BrowserContext, Page } from 'playwright';

setDefaultTimeout(30_000);

export class StoreWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) { super(options); }
}

setWorldConstructor(StoreWorld);

Before(async function (this: StoreWorld) {
  this.browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  this.context = await this.browser.newContext({ viewport: { width: 1440, height: 900 } });
  this.page = await this.context.newPage();
});

After(async function (this: StoreWorld, scenario) {
  if (scenario.result?.status === 'FAILED') {
    await this.page.screenshot({ path: `reports/cucumber/${scenario.pickle.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`, fullPage: true });
  }
  await this.context?.close();
  await this.browser?.close();
});
