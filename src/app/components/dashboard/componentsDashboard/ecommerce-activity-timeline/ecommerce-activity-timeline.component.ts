import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-ecommerce-activity-timeline',
    standalone: true,
    templateUrl: './ecommerce-activity-timeline.component.html',
    styleUrls: ['./ecommerce-activity-timeline.component.scss'],
    imports: [
            CommonModule,
            MatCardModule,
            MatButtonModule,
            MatCheckboxModule,
            MatMenuModule,
          ],
})
export class EcommerceActivityTimelineComponent {

    constructor(
        public themeService: CustomizerSettingsService
    ) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}