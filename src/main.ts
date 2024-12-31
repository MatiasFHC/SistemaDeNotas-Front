import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, RouterModule, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './app/component/login/login.component';
import { MainComponent } from './app/component/main/main.component';
import { RegistrarComponent } from './app/component/registrar/registrar.component';
import { AddNoteComponent } from './app/component/add-note/add-note.component';
import { SelectedNoteComponent } from './app/component/selected-note/selected-note.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'main',  component: MainComponent},
  { path: 'register',  component: RegistrarComponent},
  { path: 'register-note',  component: AddNoteComponent},
  { path: 'selected-note/:id', component: SelectedNoteComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), 
    importProvidersFrom(HttpClientModule, RouterModule, MatToolbarModule, BrowserAnimationsModule), provideAnimationsAsync(), provideAnimationsAsync(), provideAnimationsAsync()]
});