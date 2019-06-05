import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GarageControlSharedLibsModule, GarageControlSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [GarageControlSharedLibsModule, GarageControlSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [GarageControlSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GarageControlSharedModule {
  static forRoot() {
    return {
      ngModule: GarageControlSharedModule
    };
  }
}
