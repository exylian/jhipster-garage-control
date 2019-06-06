/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { GarageControlTestModule } from '../../../test.module';
import { GarageCodeUpdateComponent } from 'app/entities/garage-code/garage-code-update.component';
import { GarageCodeService } from 'app/entities/garage-code/garage-code.service';
import { GarageCode } from 'app/shared/model/garage-code.model';

describe('Component Tests', () => {
  describe('GarageCode Management Update Component', () => {
    let comp: GarageCodeUpdateComponent;
    let fixture: ComponentFixture<GarageCodeUpdateComponent>;
    let service: GarageCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GarageControlTestModule],
        declarations: [GarageCodeUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(GarageCodeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GarageCodeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GarageCodeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new GarageCode(123);
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
        const entity = new GarageCode();
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
