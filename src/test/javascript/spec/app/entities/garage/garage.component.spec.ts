/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GarageControlTestModule } from '../../../test.module';
import { GarageComponent } from 'app/entities/garage/garage.component';
import { GarageService } from 'app/entities/garage/garage.service';
import { Garage } from 'app/shared/model/garage.model';

describe('Component Tests', () => {
  describe('Garage Management Component', () => {
    let comp: GarageComponent;
    let fixture: ComponentFixture<GarageComponent>;
    let service: GarageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GarageControlTestModule],
        declarations: [GarageComponent],
        providers: []
      })
        .overrideTemplate(GarageComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GarageComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(GarageService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Garage(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.garages[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
