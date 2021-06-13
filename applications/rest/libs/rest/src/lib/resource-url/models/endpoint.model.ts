import { Version } from './version.model';
import { HttpPermission } from '../enums/http-permissions.enum';

export class Endpoint {
  public resource: string;
  public url: string;
  public versions?: Version[];
}
