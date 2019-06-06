import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { IGarageCode } from 'app/shared/model/garage-code.model';
import { AccountService } from 'app/core';
import { GarageCodeService } from './garage-code.service';

@Component({
  selector: 'jhi-garage-code',
  templateUrl: './garage-code.component.html'
})
export class GarageCodeComponent implements OnInit, OnDestroy {
  garageCodes: IGarageCode[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected garageCodeService: GarageCodeService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.garageCodeService
      .query()
      .pipe(
        filter((res: HttpResponse<IGarageCode[]>) => res.ok),
        map((res: HttpResponse<IGarageCode[]>) => res.body)
      )
      .subscribe(
        (res: IGarageCode[]) => {
          this.garageCodes = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInGarageCodes();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: IGarageCode) {
    return item.id;
  }

  registerChangeInGarageCodes() {
    this.eventSubscriber = this.eventManager.subscribe('garageCodeListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
