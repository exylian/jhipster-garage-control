import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { GarageCode } from 'app/shared/model/garage-code.model';
import { GarageCodeService } from './garage-code.service';
import { GarageCodeComponent } from './garage-code.component';
import { GarageCodeDetailComponent } from './garage-code-detail.component';
import { GarageCodeUpdateComponent } from './garage-code-update.component';
import { GarageCodeDeletePopupComponent } from './garage-code-delete-dialog.component';
import { IGarageCode } from 'app/shared/model/garage-code.model';

@Injectable({ providedIn: 'root' })
export class GarageCodeResolve implements Resolve<IGarageCode> {
  constructor(private service: GarageCodeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGarageCode> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<GarageCode>) => response.ok),
        map((garageCode: HttpResponse<GarageCode>) => garageCode.body)
      );
    }
    return of(new GarageCode());
  }
}

export const garageCodeRoute: Routes = [
  {
    path: '',
    component: GarageCodeComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GarageCodes'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: GarageCodeDetailComponent,
    resolve: {
      garageCode: GarageCodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GarageCodes'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: GarageCodeUpdateComponent,
    resolve: {
      garageCode: GarageCodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GarageCodes'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: GarageCodeUpdateComponent,
    resolve: {
      garageCode: GarageCodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GarageCodes'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const garageCodePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: GarageCodeDeletePopupComponent,
    resolve: {
      garageCode: GarageCodeResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'GarageCodes'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
