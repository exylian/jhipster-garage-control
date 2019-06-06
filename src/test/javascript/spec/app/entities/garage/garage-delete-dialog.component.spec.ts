/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { GarageControlTestModule } from '../../../test.module';
import { GarageDeleteDialogComponent } from 'app/entities/garage/garage-delete-dialog.component';
import { GarageService } from 'app/entities/garage/garage.service';

describe('Component Tests', () => {
  describe('Garage Management Delete Component', () => {
    let comp: GarageDeleteDialogComponent;
    let fixture: ComponentFixture<GarageDeleteDialogComponent>;
    let service: GarageService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GarageControlTestModule],
        declarations: [GarageDeleteDialogComponent]
      })
        .overrideTemplate(GarageDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GarageDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GarageService);
      mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
      mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
          expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
        })
      ));
    });
  });
});
