import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as moment from 'moment';
import { JhiAlertService } from 'ng-jhipster';
import { IGarageCode, GarageCode } from 'app/shared/model/garage-code.model';
import { GarageCodeService } from './garage-code.service';
import { IGarage } from 'app/shared/model/garage.model';
import { GarageService } from 'app/entities/garage';

@Component({
  selector: 'jhi-garage-code-update',
  templateUrl: './garage-code-update.component.html'
})
export class GarageCodeUpdateComponent implements OnInit {
  garageCode: IGarageCode;
  isSaving: boolean;

  garages: IGarage[];
  createdAtDp: any;
  validUntilDp: any;

  editForm = this.fb.group({
    id: [],
    createdAt: [],
    validUntil: [],
    garageId: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected garageCodeService: GarageCodeService,
    protected garageService: GarageService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ garageCode }) => {
      this.updateForm(garageCode);
      this.garageCode = garageCode;
    });
    this.garageService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IGarage[]>) => mayBeOk.ok),
        map((response: HttpResponse<IGarage[]>) => response.body)
      )
      .subscribe((res: IGarage[]) => (this.garages = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(garageCode: IGarageCode) {
    this.editForm.patchValue({
      id: garageCode.id,
      createdAt: garageCode.createdAt,
      validUntil: garageCode.validUntil,
      garageId: garageCode.garageId
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const garageCode = this.createFromForm();
    if (garageCode.id !== undefined) {
      this.subscribeToSaveResponse(this.garageCodeService.update(garageCode));
    } else {
      this.subscribeToSaveResponse(this.garageCodeService.create(garageCode));
    }
  }

  private createFromForm(): IGarageCode {
    const entity = {
      ...new GarageCode(),
      id: this.editForm.get(['id']).value,
      createdAt: this.editForm.get(['createdAt']).value,
      validUntil: this.editForm.get(['validUntil']).value,
      garageId: this.editForm.get(['garageId']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGarageCode>>) {
    result.subscribe((res: HttpResponse<IGarageCode>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackGarageById(index: number, item: IGarage) {
    return item.id;
  }
}
