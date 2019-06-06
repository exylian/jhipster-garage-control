/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { GarageControlTestModule } from '../../../test.module';
import { GarageUpdateComponent } from 'app/entities/garage/garage-update.component';
import { GarageService } from 'app/entities/garage/garage.service';
import { Garage } from 'app/shared/model/garage.model';

describe('Component Tests', () => {
  describe('Garage Management Update Component', () => {
    let comp: GarageUpdateComponent;
    let fixture: ComponentFixture<GarageUpdateComponent>;
    let service: GarageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GarageControlTestModule],
        declarations: [GarageUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(GarageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GarageUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GarageService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Garage(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Garage();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
