// import {
//   HttpClientTestingModule,
//   HttpTestingController,
// } from '@angular/common/http/testing';
// import { TestBed } from '@angular/core/testing';
// import { HttpVerb } from '../resource-url-service/enums/http-verbs.enum';
// import { Resource } from '../../../shared/models/resource.model';
// import { ResourceConfig } from '../resource-url-service/models/resource-config.model';
// import { ResourceUrlService } from '../resource-url-service/resource-url.service';
// import { HttpResourceService } from './http-resource-service';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
//
// class MockResourceUrlService {
//   public resourceUrl(resource: string, verb: HttpVerb): string {
//     return 'http://test-service.com';
//   }
// }
//
// class Fake extends Resource {
//   public id = 123;
// }
//
// class FakeHttpService extends HttpResourceService<Fake> {
//   constructor(httpClient: HttpClient, resourceUrlService: ResourceUrlService) {
//     super('Fake', httpClient, resourceUrlService);
//   }
// }
//
// describe('HttpResourceService', () => {
//   let httpMock: HttpTestingController;
//   let resourceServiceMock: ResourceUrlService;
//   let service: FakeHttpService;
//   let client: HttpClient;
//   const fakeResource = new Fake();
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientModule, HttpClientTestingModule],
//       providers: [
//         { provide: ResourceUrlService, useClass: MockResourceUrlService },
//       ],
//     });
//     httpMock = TestBed.get(HttpTestingController);
//     resourceServiceMock = TestBed.get(ResourceUrlService);
//     client = TestBed.get(HttpClient);
//     service = new FakeHttpService(client, resourceServiceMock);
//   });
//
//   afterEach(() => {
//     httpMock.verify();
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//
//   describe('when the service is called', () => {
//     xit('should make a GET request when the list method is invoked', () => {
//       service.list().subscribe(response => {
//         expect(response).toBeTruthy();
//       });
//
//       const fakeResponse = httpMock.expectOne(`http://test-service.com`);
//
//       expect(fakeResponse.request.method).toBe(HttpVerb.GET);
//       fakeResponse.flush({});
//     });
//
//     xit('should make a POST request when the create method is invoked', () => {
//       service.create(fakeResource).subscribe(response => {
//         expect(response).toBeTruthy();
//       });
//
//       const fakeResponse = httpMock.expectOne(`http://test-service.com`);
//
//       expect(fakeResponse.request.method).toBe(HttpVerb.POST);
//       fakeResponse.flush({});
//     });
//
//     xit('should make a GET request when the read method is invoked', () => {
//       service.read('abc-123').subscribe(response => {
//         expect(response).toBeTruthy();
//       });
//
//       const fakeResponse = httpMock.expectOne(
//         `http://test-service.com/${fakeResource.id}`
//       );
//
//       expect(fakeResponse.request.method).toBe(HttpVerb.GET);
//       fakeResponse.flush({});
//     });
//
//     xit('should make a single call when the update method is invoked', () => {
//       service.update(fakeResource).subscribe(response => {
//         expect(response).toBeTruthy();
//       });
//
//       const fakeResponse = httpMock.expectOne(
//         `http://test-service.com/${fakeResource.id}`
//       );
//
//       expect(fakeResponse.request.method).toBe(HttpVerb.PUT);
//       fakeResponse.flush({});
//     });
//
//     xit('should make a single call when the delete method is invoked', () => {
//       service.delete('abc-123').subscribe(response => {
//         expect(response).toBeTruthy();
//       });
//
//       const fakeResponse = httpMock.expectOne(
//         `http://test-service.com/${fakeResource.id}`
//       );
//
//       expect(fakeResponse.request.method).toBe(HttpVerb.DELETE);
//       fakeResponse.flush({});
//     });
//   });
// });
