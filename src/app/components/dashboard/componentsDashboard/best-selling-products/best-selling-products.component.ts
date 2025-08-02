import { Component, Input } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { TopSellingItem } from '../../dashboard.service';

@Component({
    selector: 'app-best-selling-products',
    standalone: true,
    templateUrl: './best-selling-products.component.html',
    styleUrls: ['./best-selling-products.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatMenuModule,
    ],
})
export class BestSellingProductsComponent {
    @Input() products: TopSellingItem[] = [];
    constructor(public themeService: CustomizerSettingsService) {}

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
