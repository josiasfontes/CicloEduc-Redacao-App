import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroModalPage } from './cadastro-modal.page';

describe('CadastroModalPage', () => {
  let component: CadastroModalPage;
  let fixture: ComponentFixture<CadastroModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadastroModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
