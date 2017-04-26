import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// import { UpgradeModule } from '@angular/upgrade/static';

import { AppModule } from './app/app.module';

import { enableProdMode } from '@angular/core';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
// platformBrowserDynamic().bootstrapModule(AppModule).then(platformRef => {
//   const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
//   upgrade.bootstrap(document.body, ['leansite'], {strictDi: false});
// });