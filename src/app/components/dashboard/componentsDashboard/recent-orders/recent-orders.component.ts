import { AfterViewInit, Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { Order } from '../../dashboard.service';

@Component({
    selector: 'app-recent-orders',
    standalone: true,
    templateUrl: './recent-orders.component.html',
    styleUrls: ['./recent-orders.component.scss'],
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
    ],
})
export class RecentOrdersComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() orders: Order[] = [];

  displayedColumns: string[] = [
    'position',
    'product',
    'date',
    'status',
  ];

  dataSource = new MatTableDataSource<PeriodicElement>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['orders'] && this.orders) {
    this.dataSource.data = this.orders.map((order: Order) => ({
      position: order.orderId,
      product: {
        productName: order.orderNumber.toString(),
      },
      date: order.createdOn,
      status: {
        pending: order.status === 'PENDING' ? 'Pending' : null,
        outOfStock: order.status === 'OUT_OF_STOCK' ? 'Out of Stock' : null,
        delivered: order.status === 'ORDER_PLACED' ? 'Delivered' : null,
      },
    }));
  }
}
}

export interface PeriodicElement {
    position: number;
    product: {
        productName: string;
    };
    status: {
        pending?: string | null;
        outOfStock?: string | null;
        delivered?: string | null;
    };
}
