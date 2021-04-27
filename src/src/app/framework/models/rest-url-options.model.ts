export class RestUrlOptions {
  public header: {[key: string]: number};
  public params: {[key: string]: number};

  public get queryString(): string {
    if (this.params.length === 0) {
      return '';
    }

    return Object.keys(this.params).map((key) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(this.params[key])}`;
    }).join('&');
  }
}
