/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GarageControlTestModule } from '../../../test.module';
import { GarageCodeComponent } from 'app/entities/garage-code/garage-code.component';
import { GarageCodeService } from 'app/entities/garage-code/garage-code.service';
import { GarageCode } from 'app/shared/model/garage-code.model';

describe('Component Tests', () => {
  describe('GarageCode Management Component', () => {
    let comp: GarageCodeComponent;
    let fixture: ComponentFixture<GarageCodeComponent>;
    let service: GarageCodeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GarageControlTestModule],
        declarations: [GarageCodeComponent],
        providers: []
      })
        .overrideTemplate(GarageCodeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GarageCodeComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GarageCodeService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new GarageCode(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.garageCodes[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
