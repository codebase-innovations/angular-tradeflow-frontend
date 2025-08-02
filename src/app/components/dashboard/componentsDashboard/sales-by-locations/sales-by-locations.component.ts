import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-sales-by-locations',
  standalone: true,
  templateUrl: './sales-by-locations.component.html',
  styleUrls: ['./sales-by-locations.component.scss'],
   imports: [
          CommonModule,
          MatCardModule,
          MatButtonModule,
          MatCheckboxModule,
          MatMenuModule,
          MatPaginatorModule,
          MatProgressBarModule,
      ],
})
export class SalesByLocationsComponent {

}
