import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";
import { switchMap } from "rxjs/operators";

import * as toastr from "toastr";

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuider: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T) {
      this.route = this.injector.get(ActivatedRoute);
      this.router = this.injector.get(Router);
      this.formBuider = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if(this.currentAction == 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  protected setPageTitle() {
    if(this.currentAction == 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return "Novo";
  }

  protected editionPageTitle(): string {
    return "Atualizado";
  }

  protected setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource() {
    if(this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      )
      .subscribe(r => {
         this.resource = r;
         this.resourceForm.patchValue(r);
      }, 
      (e) => alert('Ocorreu um erro no servidor, tente mais tarde'));
    }
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.create(resource)
      .subscribe(e => this.actionsForError(e), r => this.actionsForSuccess(r));
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);
    this.resourceService.update(resource)
      .subscribe( e => this.actionsForError(e), c => this.actionsForSuccess(c));
  }

  protected actionsForSuccess(resource: T) {
    toastr.success("Solicitação processada com sucesso");
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true })
      .then(() => this.router.navigate([baseComponentPath, resource.id, 'edit']));
  }

  protected actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação');
    this.submittingForm = false;
    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error.body); // Adequar de acordo com o backend que estiver utilizando.
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

  protected abstract buildResourceForm(): void;
}
