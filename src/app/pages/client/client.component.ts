import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-client-main',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent {}
