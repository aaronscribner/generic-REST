import { Injectable } from '@angular/core';
import { ResourceConfig } from '@core/services/resource-url/models/resource-config.model';
import * as HttpCodeMessage from '@assets/config/http-code-messages.json'
import { HttpVerb } from '@core/services/resource-url/enums/http-verbs.enum';

@Injectable({
  providedIn: 'root'
})
export class HttpCodeMessageService {
  // tslint:disable-next-line: no-any
  private resourceConfig = (HttpCodeMessage as any).default as ResourceConfig;

  public getErrorMessage(statusCode: string, httpVerb: HttpVerb, componentName: string) {

  }
}
