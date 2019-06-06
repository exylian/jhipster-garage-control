/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { GarageControlTestModule } from '../../../test.module';
import { GarageCodeDeleteDialogComponent } from 'app/entities/garage-code/garage-code-delete-dialog.component';
import { GarageCodeService } from 'app/entities/garage-code/garage-code.service';

describe('Component Tests', () => {
  describe('GarageCode Management Delete Component', () => {
    let comp: GarageCodeDeleteDialogComponent;
    let fixture: ComponentFixture<GarageCodeDeleteDialogComponent>;
    let service: GarageCodeService;
    let mockEventManager: any;
    let mockActiveModal: any;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GarageControlTestModule],
        declarations: [GarageCodeDeleteDialogComponent]
      })
        .overrideTemplate(GarageCodeDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GarageCodeDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GarageCodeService);
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
