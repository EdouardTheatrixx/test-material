import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor() {
    const element = document.body;
    element.classList.add('theme-light');
  }
  title = 'test';
  array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  toggleTheme() {
    const element = document.body;
    element.classList.toggle('theme-dark');
    element.classList.toggle('theme-light');
  }
}
