import { Moment } from 'moment';
import { IGarage } from 'app/shared/model/garage.model';

export interface IGarageCode {
  id?: number;
  createdAt?: Moment;
  validUntil?: Moment;
  garageId?: IGarage;
}

export class GarageCode implements IGarageCode {
  constructor(public id?: number, public createdAt?: Moment, public validUntil?: Moment, public garageId?: IGarage) {}
}
