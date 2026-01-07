import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const taskConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
