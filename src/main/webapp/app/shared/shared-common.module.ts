import { NgModule } from '@angular/core';

import { GarageControlSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [GarageControlSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [GarageControlSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class GarageControlSharedCommonModule {}
