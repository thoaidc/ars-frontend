import {HttpBackend} from '@angular/common/http';
import {TranslateLoader} from '@ngx-translate/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';

export function CustomHttpLoaderFactory(http: HttpBackend): TranslateLoader {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/en/', suffix: '.json' },
    { prefix: './assets/i18n/vi/', suffix: '.json' }
  ]);
}
