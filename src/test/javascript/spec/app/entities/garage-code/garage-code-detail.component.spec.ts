/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GarageControlTestModule } from '../../../test.module';
import { GarageCodeDetailComponent } from 'app/entities/garage-code/garage-code-detail.component';
import { GarageCode } from 'app/shared/model/garage-code.model';

describe('Component Tests', () => {
  describe('GarageCode Management Detail Component', () => {
    let comp: GarageCodeDetailComponent;
    let fixture: ComponentFixture<GarageCodeDetailComponent>;
    const route = ({ data: of({ garageCode: new GarageCode(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GarageControlTestModule],
        declarations: [GarageCodeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(GarageCodeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GarageCodeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should call load all on init', () => {
        // GIVEN

        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.garageCode).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
