import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGarage } from 'app/shared/model/garage.model';
import { Account, AccountService } from 'app/core';

@Component({
  selector: 'jhi-garage-detail',
  templateUrl: './garage-detail.component.html'
})
export class GarageDetailComponent implements OnInit {
  garage: IGarage;
  account: Account;

  constructor(protected activatedRoute: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ garage }) => {
      this.garage = garage;
    });
    this.accountService.identity().then((account: Account) => {
      this.account = account;
    });
  }

  previousState() {
    window.history.back();
  }

  isAuthenticated() {
    return this.accountService.isAuthenticated();
  }
}
