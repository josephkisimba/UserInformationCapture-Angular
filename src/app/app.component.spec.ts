import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { isPlatformBrowser } from '@angular/common';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [AppComponent], // Declare the component here
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should initialize the map on the browser platform', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    spyOn(app, 'initializeMap'); // Spy on the initializeMap method

    fixture.detectChanges();

    // Access the platformId property from the CommonModule
    if (isPlatformBrowser(app.constructor.prototype.platformId)) {
      expect(app.initializeMap).toHaveBeenCalled();
    } else {
      expect(app.initializeMap).not.toHaveBeenCalled();
    }
  });

  // Add more tests based on your application logic
});
