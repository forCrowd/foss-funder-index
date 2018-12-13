import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { Element, Project, ProjectService, ElementField, ElementItem, ElementCell } from "@forcrowd/backbone-client-core";

import { Subscription } from "rxjs";
import { mergeMap, map, filter } from "rxjs/operators";

import { settings } from "src/settings/settings";

export interface IConfig {
  projectId: number,
}

@Component({
  selector: "core",
  templateUrl: "core.component.html",
  styleUrls: ["core.component.css"]
})
export class CoreComponent implements OnInit {
  config: IConfig = { projectId: settings.content.rootProjectId };
  errorMessage: string;
  project: Project;
  elementItemSet: ElementItem[];

  get selectedElement(): Element {
    return this.fields.selectedElement;
  }
  set selectedElement(value: Element) {
    if (this.fields.selectedElement !== value) {
      this.fields.selectedElement = value;
    }
  }

  get selectedField(): ElementField {
    return this.fields.selectedField;
  }

  private fields: {
    selectedElement: Element,
    selectedField: ElementField,
  } = {
    selectedElement: null,
    selectedField: null
    }

  constructor(private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private router: Router,
    private projectService: ProjectService) {
  }

  loadProject(): void {

    this.errorMessage = "";

    this.projectService.getProjectExpanded<Project>(this.config.projectId)
      .subscribe(project => {

        if (!project) {
          this.errorMessage = "Invalid project";
          return;
        }

        this.project = project;

        // Selected element
        this.selectedElement = this.project.ElementSet[0];

        // Items
        this.elementItemSet = this.selectedElement.ElementItemSet;

      });
  }

  ngOnInit() {

    // Title
    // https://toddmotto.com/dynamic-page-titles-angular-2-router-events
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter(route => route.outlet === "primary"),
      mergeMap(route => route.data))
      .subscribe(data => {
        if (data.title) {
          this.titleService.setTitle(`Foss Funder Index ${data.title}`);
        }
      });

      this.loadProject();
  }

}
