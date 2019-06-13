import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { LoginModalService, AccountService, Account } from 'app/core';
import { IGarage } from 'app/shared/model/garage.model';
import { GarageService } from 'app/entities/garage/garage.service';
import { GarageCodeService } from 'app/entities/garage-code';
import { filter, map } from 'rxjs/operators';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { IGarageCode } from 'app/shared/model/garage-code.model';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.scss']
})
export class HomeComponent implements OnInit {
  account: Account;
  modalRef: NgbModalRef;
  garages: IGarage[];
  garageCodes: IGarageCode[];

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private eventManager: JhiEventManager,
    private garageService: GarageService,
    private jhiAlertService: JhiAlertService,
    private garageCodeService: GarageCodeService
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
  getCode() {
    this.garageCodeService.query().pipe(filter());
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then((account: Account) => {
      this.account = account;
    });
    this.registerAuthenticationSuccess();
  }

  registerAuthenticationSuccess() {
    this.eventManager.subscribe('authenticationSuccess', message => {
      this.accountService.identity().then(account => {
        this.account = account;
      });
    });
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }

  login() {
    this.modalRef = this.loginModalService.open();
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
