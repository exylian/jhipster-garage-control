import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GarageControlSharedModule } from 'app/shared';
import {
  GarageCodeComponent,
  GarageCodeDetailComponent,
  GarageCodeUpdateComponent,
  GarageCodeDeletePopupComponent,
  GarageCodeDeleteDialogComponent,
  garageCodeRoute,
  garageCodePopupRoute
} from './';

const ENTITY_STATES = [...garageCodeRoute, ...garageCodePopupRoute];

@NgModule({
  imports: [GarageControlSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    GarageCodeComponent,
    GarageCodeDetailComponent,
    GarageCodeUpdateComponent,
    GarageCodeDeleteDialogComponent,
    GarageCodeDeletePopupComponent
  ],
  entryComponents: [GarageCodeComponent, GarageCodeUpdateComponent, GarageCodeDeleteDialogComponent, GarageCodeDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GarageControlGarageCodeModule {}
