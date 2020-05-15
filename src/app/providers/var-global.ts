import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class VarGlobalProvider {

  public status: boolean = false;

  constructor() { }

  setStatusScript(status: boolean) {
    this.status = status;
  }

  getStatusScript() {
    return this.status;
  }

}
