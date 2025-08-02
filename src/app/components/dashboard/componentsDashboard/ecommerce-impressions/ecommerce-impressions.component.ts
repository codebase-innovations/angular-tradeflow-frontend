import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-ecommerce-impressions',
    standalone: true,
    templateUrl: './ecommerce-impressions.component.html',
    styleUrls: ['./ecommerce-impressions.component.scss'],
      imports: [
                CommonModule,
                MatCardModule,
                MatButtonModule,
                MatCheckboxModule,
                MatMenuModule,
              ],
})
export class EcommerceImpressionsComponent {

    constructor(
        public themeService: CustomizerSettingsService
    ) {}

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}