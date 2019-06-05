import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IGarage } from 'app/shared/model/garage.model';

type EntityResponseType = HttpResponse<IGarage>;
type EntityArrayResponseType = HttpResponse<IGarage[]>;

@Injectable({ providedIn: 'root' })
export class GarageService {
  public resourceUrl = SERVER_API_URL + 'api/garages';

  constructor(protected http: HttpClient) {}

  create(garage: IGarage): Observable<EntityResponseType> {
    return this.http.post<IGarage>(this.resourceUrl, garage, { observe: 'response' });
  }

  update(garage: IGarage): Observable<EntityResponseType> {
    return this.http.put<IGarage>(this.resourceUrl, garage, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGarage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGarage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
