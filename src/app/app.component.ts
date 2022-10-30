import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Bienvenidos a Angular';
  curso: string = 'Curso de Spring 5 con Angular 10';
  profesor: string = 'Adriel Alejandro Aliaga Benavides';
}
