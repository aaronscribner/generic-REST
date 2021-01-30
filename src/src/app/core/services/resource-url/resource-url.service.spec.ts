import { environment } from '../../../../environments/environment';
import { HttpVerb } from './enums/http-verbs.enum';
import { ResourceConfig } from './models/resource-config.model';
import { ResourceUrlService } from './resource-url.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ResourceUrlService', () => {
  const endpointConfig: ResourceConfig = require('../../../../assets/mocks/config/resource-endpoints.json');
  const resources = JSON.stringify(endpointConfig);
  const BaseUri = 'http://localhost/api';
  let sut: ResourceUrlService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [ResourceUrlService],
    });
    sut = TestBed.get(ResourceUrlService);
    sut.config = resources;
  });

  describe('when retrieving a configuration URI for environment local-dev', () => {
    it('should return the specific version for a given verb if defined', () => {
      environment.resourceEnvironment = 'local-dev';

      const resultUri = sut.resourceUrl('ResourceOne', HttpVerb.GET);

      expect(resultUri.endpoint).toEqual(`${BaseUri}/ones`);
    });

    it('should return the default version for a given verb if undefined', () => {
      environment.resourceEnvironment = 'local-dev';

      const resultUri = sut.resourceUrl('ResourceOne', HttpVerb.POST);

      expect(resultUri.endpoint).toEqual(`${BaseUri}/ones`);
    });

    it('should return undefined for the URI if the configuration is incorrect', () => {
      environment.resourceEnvironment = 'local-dev';

      const resultUri = sut.resourceUrl('Something', HttpVerb.GET);

      expect(resultUri).toEqual(undefined);
    });
  });

  describe('when retrieving a configuration URI for environment local-mock', () => {
    it('should return the specific version for a given verb if defined', () => {
      environment.resourceEnvironment = 'local-mock';

      const resultUri = sut.resourceUrl('ResourceOne', HttpVerb.GET);

      expect(resultUri.endpoint).toEqual(`${BaseUri}/ones`);
    });

    it('should return the default version for a given verb if undefined', () => {
      environment.resourceEnvironment = 'local-mock';

      const resultUri = sut.resourceUrl('ResourceOne', HttpVerb.POST);

      expect(resultUri.endpoint).toEqual(`${BaseUri}/ones`);
    });

    it('should return undefined for the URI if the configuration is incorrect', () => {
      environment.resourceEnvironment = 'local-mock';

      const resultUri = sut.resourceUrl('Something', HttpVerb.GET);

      expect(resultUri).toEqual(undefined);
    });
  });
});
