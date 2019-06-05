import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGarageCode } from 'app/shared/model/garage-code.model';

@Component({
  selector: 'jhi-garage-code-detail',
  templateUrl: './garage-code-detail.component.html'
})
export class GarageCodeDetailComponent implements OnInit {
  garageCode: IGarageCode;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ garageCode }) => {
      this.garageCode = garageCode;
    });
  }

  previousState() {
    window.history.back();
  }
}
