import { HttpHeaders, HttpParams } from '@angular/common/http';

export interface HttpRequestInformation {
  endpoint: string;
  httpOptions: {
    headers: HttpHeaders;
    params?:
      | HttpParams
      | {
          [operation: string]: string | string[];
        };
  }
}
