import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideEchartsCore } from 'ngx-echarts';

bootstrapApplication(AppComponent, {
  providers: [
    provideEchartsCore({
      echarts: () => import('echarts')
    })
  ]
}).catch(err => console.error(err));