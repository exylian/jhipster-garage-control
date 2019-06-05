import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IGarage, Garage } from 'app/shared/model/garage.model';
import { GarageService } from './garage.service';

@Component({
  selector: 'jhi-garage-update',
  templateUrl: './garage-update.component.html'
})
export class GarageUpdateComponent implements OnInit {
  garage: IGarage;
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    description: []
  });

  constructor(protected garageService: GarageService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ garage }) => {
      this.updateForm(garage);
      this.garage = garage;
    });
  }

  updateForm(garage: IGarage) {
    this.editForm.patchValue({
      id: garage.id,
      description: garage.description
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const garage = this.createFromForm();
    if (garage.id !== undefined) {
      this.subscribeToSaveResponse(this.garageService.update(garage));
    } else {
      this.subscribeToSaveResponse(this.garageService.create(garage));
    }
  }

  private createFromForm(): IGarage {
    const entity = {
      ...new Garage(),
      id: this.editForm.get(['id']).value,
      description: this.editForm.get(['description']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGarage>>) {
    result.subscribe((res: HttpResponse<IGarage>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
