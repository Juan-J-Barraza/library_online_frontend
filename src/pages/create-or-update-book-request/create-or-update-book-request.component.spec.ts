import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrUpdateBookRequestComponent } from './create-or-update-book-request.component';

describe('CreateOrUpdateBookRequestComponent', () => {
  let component: CreateOrUpdateBookRequestComponent;
  let fixture: ComponentFixture<CreateOrUpdateBookRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateOrUpdateBookRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrUpdateBookRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
