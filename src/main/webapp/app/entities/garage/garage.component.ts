import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGarage } from 'app/shared/model/garage.model';
import { AccountService } from 'app/core';
import { GarageService } from './garage.service';

@Component({
  selector: 'jhi-garage',
  templateUrl: './garage.component.html'
})
export class GarageComponent implements OnInit, OnDestroy {
  garages: IGarage[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected garageService: GarageService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.garageService
      .query()
      .pipe(
        filter((res: HttpResponse<IGarage[]>) => res.ok),
        map((res: HttpResponse<IGarage[]>) => res.body)
      )
      .subscribe(
        (res: IGarage[]) => {
          this.garages = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInGarages();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IGarage) {
    return item.id;
  }

  registerChangeInGarages() {
    this.eventSubscriber = this.eventManager.subscribe('garageListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
