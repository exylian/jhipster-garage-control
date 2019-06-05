import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GarageControlSharedModule } from 'app/shared';
import {
  GarageComponent,
  GarageDetailComponent,
  GarageUpdateComponent,
  GarageDeletePopupComponent,
  GarageDeleteDialogComponent,
  garageRoute,
  garagePopupRoute
} from './';

const ENTITY_STATES = [...garageRoute, ...garagePopupRoute];

@NgModule({
  imports: [GarageControlSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [GarageComponent, GarageDetailComponent, GarageUpdateComponent, GarageDeleteDialogComponent, GarageDeletePopupComponent],
  entryComponents: [GarageComponent, GarageUpdateComponent, GarageDeleteDialogComponent, GarageDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GarageControlGarageModule {}
