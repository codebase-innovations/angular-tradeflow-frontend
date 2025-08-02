import { Component } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
    selector: 'app-new-customers',
    standalone: true,
    templateUrl: './new-customers.component.html',
    styleUrls: ['./new-customers.component.scss'],
          imports: [
                    CommonModule,
                    MatCardModule,
                    MatButtonModule,
                    MatCheckboxModule,
                    MatMenuModule,
                    NgApexchartsModule,
                  ],
})
export class NewCustomersComponent {

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