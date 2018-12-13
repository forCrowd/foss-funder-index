import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { CoreModule, ICoreConfig, ProjectService } from "@forcrowd/backbone-client-core";

import { SharedModule } from "./shared/shared.module";

import { settings } from "../settings/settings";

// Components
import { CoreComponent } from "./components/core.component";

// Services
import { AppProjectService } from "./app-project.service";

export { AppProjectService }

const appCoreRoutes: Routes = [
  { path: "", component: CoreComponent, data: { title: "Home" } },
];

const coreConfig: ICoreConfig = {
  environment: settings.environment,
  serviceApiUrl: settings.serviceApiUrl,
  serviceODataUrl: settings.serviceODataUrl
};

@NgModule({
  declarations: [
    CoreComponent,
  ],
  entryComponents: [
  ],
  exports: [
    RouterModule,
    CoreComponent,
  ],
  imports: [
    SharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appCoreRoutes),
    CoreModule.configure(coreConfig),
  ],
  providers: [
    // Project service
    {
      provide: ProjectService,
      useClass: AppProjectService,
    },
  ]
})
export class AppCoreModule { }
