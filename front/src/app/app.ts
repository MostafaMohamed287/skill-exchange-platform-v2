import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './shared/header/header';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    Header,
    Navbar,
    Footer
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 'skill-exchange-frontend';
}