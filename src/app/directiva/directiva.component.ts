import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent{
  listaCurso: string[] = ['TypeScript','JavaScript', 'Java', 'C Sharp', 'C++'];
  habilitar: boolean = true;
  constructor() { }

}
