import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Garage } from 'app/shared/model/garage.model';
import { GarageService } from './garage.service';
import { GarageComponent } from './garage.component';
import { GarageDetailComponent } from './garage-detail.component';
import { GarageUpdateComponent } from './garage-update.component';
import { GarageDeletePopupComponent } from './garage-delete-dialog.component';
import { IGarage } from 'app/shared/model/garage.model';

@Injectable({ providedIn: 'root' })
export class GarageResolve implements Resolve<IGarage> {
  constructor(private service: GarageService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IGarage> {
    const id = route.params['id'] ? route.params['id'] : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Garage>) => response.ok),
        map((garage: HttpResponse<Garage>) => garage.body)
      );
    }
    return of(new Garage());
  }
}

export const garageRoute: Routes = [
  {
    path: '',
    component: GarageComponent,
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Garages'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/view',
    component: GarageDetailComponent,
    resolve: {
      garage: GarageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Garages'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: 'new',
    component: GarageUpdateComponent,
    resolve: {
      garage: GarageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Garages'
    },
    canActivate: [UserRouteAccessService]
  },
  {
    path: ':id/edit',
    component: GarageUpdateComponent,
    resolve: {
      garage: GarageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Garages'
    },
    canActivate: [UserRouteAccessService]
  }
];

export const garagePopupRoute: Routes = [
  {
    path: ':id/delete',
    component: GarageDeletePopupComponent,
    resolve: {
      garage: GarageResolve
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'Garages'
    },
    canActivate: [UserRouteAccessService],
    outlet: 'popup'
  }
];
