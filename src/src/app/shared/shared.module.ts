import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared-services/material.module';
import { MatDialogModule, MatAutocompleteModule } from '@angular/material';
import { ErrorComponent } from './components/error/error.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DecisionDialogBoxComponent } from './components/decision-dialog-box/decision-dialog-box.component';
import { ApplyFunctionPipe } from './pipes/apply-function.pipe';
import { ResponsiveHeightDirective } from './directives/responsive-height.directive';
import { TimeZoneConverterPipePipe } from './pipes/timeZoneConverterPipe.pipe';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteSearchBoxComponent } from './components/auto-complete-search-box/auto-complete-search-box.component';
import { RestrictSpecialCharacterDirective } from './components/directives/restrictSpecialChracter.directive';
import { OnlyNumericDirective } from './components/directives/onlyNumeric.directive';
import { RemainingCharactorsCountPipe } from './pipes/remainingCharactersCount.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  declarations: [
    ErrorComponent,
    FileUploadComponent,
    DecisionDialogBoxComponent,
    ApplyFunctionPipe,
    ResponsiveHeightDirective,
    TimeZoneConverterPipePipe,
    SearchBoxComponent,
    AutoCompleteSearchBoxComponent,
    RestrictSpecialCharacterDirective,
    OnlyNumericDirective,
    RemainingCharactorsCountPipe,
  ],
  exports: [
    ErrorComponent,
    FileUploadComponent,
    DecisionDialogBoxComponent,
    ApplyFunctionPipe,
    ResponsiveHeightDirective,
    TimeZoneConverterPipePipe,
    SearchBoxComponent,
    AutoCompleteSearchBoxComponent,
    RestrictSpecialCharacterDirective,
    OnlyNumericDirective,
    RemainingCharactorsCountPipe,
  ],
})
export class SharedModule {}
