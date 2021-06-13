import { Version } from './version.model';
import { Context } from './context.model';

export class Environment {
  public name: string;
  public domain?: string;
  public versions?: Version[];
  public contexts: Context[];
}
