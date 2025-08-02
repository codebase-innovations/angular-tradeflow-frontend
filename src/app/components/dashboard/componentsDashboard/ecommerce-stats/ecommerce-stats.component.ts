import { Component, Input } from '@angular/core';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../dashboard.service';

@Component({
    selector: 'app-ecommerce-stats',
    standalone: true,
    templateUrl: './ecommerce-stats.component.html',
    styleUrls: ['./ecommerce-stats.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatMenuModule,
    ],
})
export class EcommerceStatsComponent {
    @Input() totalSales: number = 0;
    @Input() totalOrders: number = 0;
    @Input() pendingOrders?: number;

    constructor(
        public themeService: CustomizerSettingsService,
        private dashboardService: DashboardService
    ) {}

    // ngOnInit(): void {
    //     this.dashboardService.getDashboardData().subscribe({
    //         next: (res) => {
    //             this.totalOrders = res.data.orderSummary.totalCompletedOrders;
    //         },
    //     });
    // }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }
}
