import { Injectable } from '@angular/core';
import * as HttpCodeMessages from '@assets/config/http-code-messages.json'
import { HttpVerb } from '@core/services/resource-url/enums/http-verbs.enum';
import { HttpCodeMessageConfig } from '@core/services/http-code-message/models/http-code-message-config.model';
import { HttpCodeMessage } from '@core/services/http-code-message/models/http-code-message.model';

@Injectable({
  providedIn: 'root'
})
export class HttpCodeMessageService {
  // tslint:disable-next-line: no-any
  private httpCodeMessageConfig = (HttpCodeMessages as any).default as HttpCodeMessageConfig;

  public getErrorMessage(statusCode: number, httpVerb: HttpVerb, resourceName: string): HttpCodeMessage {
    return this.httpCodeMessageConfig.resources
        .find(x => x.resourceName === resourceName && x.httpCode === statusCode) ||
      this.httpCodeMessageConfig.messages
        .find(x => x.httpCode === statusCode && x.);
  }
}
