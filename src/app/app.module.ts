import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { SharedModule } from './shared/shared.module';
import { DialogComponent } from './dialogs/dialog/dialog.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [AppComponent, DialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatSidenavModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
