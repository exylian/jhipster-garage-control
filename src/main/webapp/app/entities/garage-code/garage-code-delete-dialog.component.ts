import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IGarageCode } from 'app/shared/model/garage-code.model';
import { GarageCodeService } from './garage-code.service';

@Component({
  selector: 'jhi-garage-code-delete-dialog',
  templateUrl: './garage-code-delete-dialog.component.html'
})
export class GarageCodeDeleteDialogComponent {
  garageCode: IGarageCode;

  constructor(
    protected garageCodeService: GarageCodeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.garageCodeService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'garageCodeListModification',
        content: 'Deleted an garageCode'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-garage-code-delete-popup',
  template: ''
})
export class GarageCodeDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ garageCode }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(GarageCodeDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.garageCode = garageCode;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/garage-code', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/garage-code', { outlets: { popup: null } }]);
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
