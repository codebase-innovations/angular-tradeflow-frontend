import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-order-place-modal',
  templateUrl: './order-place-modal.component.html',
  styleUrls: ['./order-place-modal.component.scss'],
   standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule
  ]
})
export class OrderPlaceModalComponent {
  isModalOpen: boolean = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}