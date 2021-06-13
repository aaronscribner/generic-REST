import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ServicesModule } from './services/services.module';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ServicesModule
  ],
  declarations: [],
  exports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ServicesModule
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'Core Module is already loaded. Import it in the AppModule only.'
      );
    }
  }
}
