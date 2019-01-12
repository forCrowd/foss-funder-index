import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Title } from "@angular/platform-browser";
import {
  Element,
  Project,
  ProjectService,
  ElementField,
  ElementItem,
  ElementCell
} from "@forcrowd/backbone-client-core";
import { Subscription } from "rxjs";
import { mergeMap, map, filter } from "rxjs/operators";

import { settings } from "src/settings/settings";
import { elementEventFullName } from "@angular/core/src/view";

export interface IConfig {
  projectId: number;
}

@Component({
  selector: "core",
  templateUrl: "core.component.html",
  styleUrls: ["core.component.css"]
})
export class CoreComponent implements OnInit {
  config: IConfig = { projectId: settings.content.rootProjectId };
  project: Project;
  elementItemSet: ElementItem[];

  get selectedElement(): Element {
    return this.fields.selectedElement;
  }
  set selectedElement(value: Element) {
    if (this.fields.selectedElement !== value) {
      this.fields.selectedElement = value;

      this.elementItemSet = this.selectedElement.ElementItemSet;

      console.log("itemSet", this.elementItemSet);
    }
  }

  private fields: {
    selectedElement: Element;
  } = {
    selectedElement: null
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private router: Router,
    private projectService: ProjectService
  ) {}

  changeSelectedElement(elementName: string) {
    this.selectedElement = this.project.ElementSet.find(
      e => e.Name === elementName
    );
  }

  getEmployees(item: ElementItem) {
    return this.getCellValue(item, "Employees");
  }

  getInvestment(item: ElementItem) {
    return this.getCellValue(item, "Investment");
  }

  getVerified(item: ElementItem): boolean {
    return this.getCellValue(item, "Verified") === "y";
  }

  private getCellValue(item: ElementItem, filterName: string) {
    return item.ElementCellSet.filter(
      cell => cell.ElementField.Name === filterName
    )[0].StringValue;
  }

  loadProject(): void {
    this.projectService
      .getProjectExpanded<Project>(this.config.projectId)
      .subscribe(project => {
        if (!project) {
          console.log("Invalid project");
          return;
        }

        this.project = project;

        // Fix field sort order
        this.project.ElementSet.forEach(element => {
          element.ElementFieldSet.sort(field => field.SortOrder);
          element.ElementItemSet.forEach(item => {
            item.ElementCellSet.sort(cell => cell.ElementField.SortOrder);
          });
        });

        this.selectedElement = this.project.ElementSet[0];
      });
  }

  ngOnInit() {
    // Title
    // https://toddmotto.com/dynamic-page-titles-angular-2-router-events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === "primary"),
        mergeMap(route => route.data)
      )
      .subscribe(data => {
        if (data.title) {
          this.titleService.setTitle(`Foss Funder Index ${data.title}`);
        }
      });

    this.loadProject();
  }
}
