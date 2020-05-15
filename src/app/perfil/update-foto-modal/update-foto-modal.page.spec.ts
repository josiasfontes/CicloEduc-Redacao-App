import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UpdateFotoModalPage } from './update-foto-modal.page';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('UpdateFotoModalPage', () => {
  let component: UpdateFotoModalPage;
  let fixture: ComponentFixture<UpdateFotoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateFotoModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFotoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
