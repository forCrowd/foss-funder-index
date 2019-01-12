import { BrowserModule } from "@angular/platform-browser";
import { Component, NgModule } from "@angular/core";
import { AppCoreModule } from "./app-core.module";

// App component
@Component({
  selector: "app",
  template: "<core></core>"
})
export class AppComponent { }

@NgModule({
  bootstrap: [
    AppComponent
  ],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppCoreModule,
  ],
})
export class AppModule { }
