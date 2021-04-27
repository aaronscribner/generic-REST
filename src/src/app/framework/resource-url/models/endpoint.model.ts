import { Version } from './version.model';
import { HttpPermission } from '../enums/http-permissions.enum';

export class Endpoint {
  public resource: string;
  public children: Endpoint[];
  public baseUrl?: string;
  public url: string;
  public versions?: Version[];
  public allowOnly?: HttpPermission[];
  public deny?: HttpPermission[];
  public dontAppendId?: boolean;
}
