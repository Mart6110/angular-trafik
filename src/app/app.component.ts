// Importing necessary Angular core functionality and components
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./components/dashboard/dashboard.component";

// Define the root component for the Angular application
@Component({
  selector: 'app-root',                   // The CSS selector for this component in HTML
  standalone: true,                        // Marks this component as standalone
  imports: [RouterOutlet, DashboardComponent],  // Declares imported components/directives for use in this component
  templateUrl: './app.component.html',     // Specifies the HTML template file for the component
  styleUrl: './app.component.scss'         // Specifies the stylesheet for the component
})
export class AppComponent {
  title = 'angular-trafik';                // Property to hold the app's title
}
