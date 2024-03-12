import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { toLonLat, fromLonLat } from 'ol/proj';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  // Inject PLATFORM_ID to check the platform
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  title = 'user-info-capture';

  capturedUsers: any[] = [];
  currentUserIndex: number | null = null;

  user: any = {
    initials: '',
    name: '',
    middleName: '',
    surname: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: null,
    },
    contactNumber: null,
  };

  loc: any = {
    latitude: null,
    longitude: null
  };

  map!: Map;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeMap();
    }
  }

  initializeMap() {
    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      layers: [osmLayer],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    this.map.on('click', (event) => {
      const clickedCoordinate = event.coordinate;
      const [longitude, latitude] = toLonLat(clickedCoordinate);

      // Update the latitude and longitude fields
      this.loc.latitude = latitude;
      this.loc.longitude = longitude;

      // Optional: You can update the view to the clicked point
      this.map.getView().setCenter(clickedCoordinate);
    });
  }
  updateMapView() {
    const latitude = parseFloat(this.loc.latitude);
    const longitude = parseFloat(this.loc.longitude);

    if (!isNaN(latitude) && !isNaN(longitude)) {
      const newCoordinate = fromLonLat([longitude, latitude]);
      this.map.getView().setCenter(newCoordinate);
    }
  }

  submitForm() {
    console.log('User Data', this.user);

    if (this.currentUserIndex !== null) {
      // Update existing user if editing
      this.capturedUsers[this.currentUserIndex] = { ...this.user };
      this.currentUserIndex = null; // Reset current user index after editing
    } else {
      // Add a new user if not editing
      this.capturedUsers.push({ ...this.user });
    }
  
    this.user = {
      initials: '',
      name: '',
      middleName: '',
      surname: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: null,
      },
      contactNumber: null,
    };
  }

  isFormValid(): boolean {
    // Check if all required fields are filled
    return (
      this.user.initials &&
      this.user.name &&
      this.user.surname &&
      this.user.contactNumber
    );
  }

  isDuplicateUser(newUser: any): boolean {
    return this.capturedUsers.some(user => this.areUsersEqual(user, newUser));
  }

  areUsersEqual(user1: any, user2: any): boolean {
    // Check if the users have the same initials, name, and surname
    return (
      user1.initials === user2.initials &&
      user1.name === user2.name &&
      user1.surname === user2.surname
    );
  }

  editUser(index: number) {
    // Set the current user for editing when clicked
    this.currentUserIndex = index;
    this.user = { ...this.capturedUsers[index] };
  }

  addUser(user: any) {
    let users: any[] = [];

    // Retrieve existing users from localStorage
    const storedUsers = localStorage.getItem('Users');

    if (storedUsers) {
      try {
        // Attempt to parse existing users
        users = JSON.parse(storedUsers);
        if (!Array.isArray(users)) {
          // If the parsed data is not an array, fallback to an empty array
          users = [];
        }
      } catch (error) {
        console.error('Error parsing stored users:', error);
        // If there's an error parsing, fallback to an empty array
        users = [];
      }
    }

    // Add the current user to the array
    users.push(user);

    // Save the updated array back to localStorage
    localStorage.setItem('Users', JSON.stringify(users));
  }

  deleteUser(index: number) {
    // Remove the user at the specified index
    this.capturedUsers.splice(index, 1);

    // If the user being deleted is the one being edited, reset the form
    if (index === this.currentUserIndex) {
      this.user = {
        initials: '',
        name: '',
        middleName: '',
        surname: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: null,
        },
        contactNumber: null,
      };
      this.currentUserIndex = null;
    }

    // Save the updated array back to localStorage
    localStorage.setItem('Users', JSON.stringify(this.capturedUsers));
  }
}
