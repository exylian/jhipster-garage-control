import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGarage } from 'app/shared/model/garage.model';

@Component({
  selector: 'jhi-garage-detail',
  templateUrl: './garage-detail.component.html'
})
export class GarageDetailComponent implements OnInit {
  garage: IGarage;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ garage }) => {
      this.garage = garage;
    });
  }

  previousState() {
    window.history.back();
  }
}
