import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideEchartsCore } from 'ngx-echarts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideEchartsCore({
      echarts: () => import('echarts')
    }), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));