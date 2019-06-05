export interface IGarage {
  id?: number;
  description?: string;
}

export class Garage implements IGarage {
  constructor(public id?: number, public description?: string) {}
}
