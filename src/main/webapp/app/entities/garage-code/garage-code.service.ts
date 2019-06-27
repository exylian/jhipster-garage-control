import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IGarageCode } from 'app/shared/model/garage-code.model';

type EntityResponseType = HttpResponse<IGarageCode>;
type EntityArrayResponseType = HttpResponse<IGarageCode[]>;

@Injectable({ providedIn: 'root' })
export class GarageCodeService {
  public resourceUrl = SERVER_API_URL + 'api/garage-codes';

  constructor(protected http: HttpClient) {}

  create(garageCode: IGarageCode): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(garageCode);
    return this.http
      .post<IGarageCode>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(garageCode: IGarageCode): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(garageCode);
    return this.http
      .put<IGarageCode>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IGarageCode>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IGarageCode[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(garageCode: IGarageCode): IGarageCode {
    const copy: IGarageCode = Object.assign({}, garageCode, {
      createdAt: garageCode.createdAt != null && garageCode.createdAt.isValid() ? garageCode.createdAt.format(DATE_FORMAT) : null,
      validUntil: garageCode.validUntil != null && garageCode.validUntil.isValid() ? garageCode.validUntil.format(DATE_FORMAT) : null
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdAt = res.body.createdAt != null ? moment(res.body.createdAt) : null;
      res.body.validUntil = res.body.validUntil != null ? moment(res.body.validUntil) : null;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((garageCode: IGarageCode) => {
        garageCode.createdAt = garageCode.createdAt != null ? moment(garageCode.createdAt) : null;
        garageCode.validUntil = garageCode.validUntil != null ? moment(garageCode.validUntil) : null;
      });
    }
    return res;
  }
}
