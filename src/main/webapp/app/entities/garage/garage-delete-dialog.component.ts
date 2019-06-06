import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGarage } from 'app/shared/model/garage.model';
import { GarageService } from './garage.service';

@Component({
  selector: 'jhi-garage-delete-dialog',
  templateUrl: './garage-delete-dialog.component.html'
})
export class GarageDeleteDialogComponent {
  garage: IGarage;

  constructor(protected garageService: GarageService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.garageService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'garageListModification',
        content: 'Deleted an garage'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-garage-delete-popup',
  template: ''
})
export class GarageDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ garage }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(GarageDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.garage = garage;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/garage', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/garage', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
