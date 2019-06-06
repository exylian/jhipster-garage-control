import { Moment } from 'moment';
import { IGarage } from 'app/shared/model/garage.model';

export interface IGarageCode {
  id?: number;
  code?: number;
  customer?: string;
  createdAt?: Moment;
  validUntil?: Moment;
  garageId?: IGarage;
}

export class GarageCode implements IGarageCode {
  constructor(
    public id?: number,
    public code?: number,
    public customer?: string,
    public createdAt?: Moment,
    public validUntil?: Moment,
    public garageId?: IGarage
  ) {}
}
