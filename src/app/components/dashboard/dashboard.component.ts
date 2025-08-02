import { Component, OnInit } from '@angular/core';
import { AudienceOverviewComponent } from './componentsDashboard/audience-overview/audience-overview.component';
import { BestSellingProductsComponent } from './componentsDashboard/best-selling-products/best-selling-products.component';
import { EcommerceActivityTimelineComponent } from './componentsDashboard/ecommerce-activity-timeline/ecommerce-activity-timeline.component';
import { EcommerceImpressionsComponent } from './componentsDashboard/ecommerce-impressions/ecommerce-impressions.component';
import { EcommerceRatingsComponent } from './componentsDashboard/ecommerce-ratings/ecommerce-ratings.component';
import { EcommerceStatsComponent } from './componentsDashboard/ecommerce-stats/ecommerce-stats.component';
import { LiveVisitsOnOurSiteComponent } from './componentsDashboard/live-visits-on-our-site/live-visits-on-our-site.component';
import { NewCustomersComponent } from './componentsDashboard/new-customers/new-customers.component';
import { RecentOrdersComponent } from './componentsDashboard/recent-orders/recent-orders.component';
import { RevenueStatusComponent } from './componentsDashboard/revenue-status/revenue-status.component';
import { SalesByLocationsComponent } from './componentsDashboard/sales-by-locations/sales-by-locations.component';
import { TeamMembersListComponent } from './componentsDashboard/team-members-list/team-members-list.component';
import { VisitsByDayComponent } from './componentsDashboard/visits-by-day/visits-by-day.component';
import { DashboardService, OrderSummary, Order, WeeklySales, MonthlySales } from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [
        AudienceOverviewComponent,
        BestSellingProductsComponent,
        EcommerceActivityTimelineComponent,
        EcommerceImpressionsComponent,
        EcommerceRatingsComponent,
        EcommerceStatsComponent,
        LiveVisitsOnOurSiteComponent,
        NewCustomersComponent,
        RecentOrdersComponent,
        RevenueStatusComponent,
        SalesByLocationsComponent,
        TeamMembersListComponent,
        VisitsByDayComponent,
    ],
})
export class DashboardComponent implements OnInit {
    orderSummary!: OrderSummary;
    loading = true;
    ordersData: Order[] = [];

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.dashboardService.getDashboardData().subscribe({
            next: (res) => {
                this.orderSummary = res.data.orderSummary;
                this.loading = false;
            },
            error: (err) => {
                console.error('Error loading dashboard:', err);
                this.loading = false;
            },
        });
    }
}
