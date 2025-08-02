import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Order {
  orderId : number;
  orderNumber : number;
  status : string;
  createdOn: string;
}

export interface TopSellingItem {
  itemId : number;
  itemName : string;
  imageUrl : string;
  totalQuantitySold: number;
  totalPriceSold: number;
}

export interface MonthlySales {
  month : string;
  totalSales : number;
}

export interface WeeklySales {
  weekRange : string;
  totalSales : number;
}

export interface OrderSummary {
  recentOrders : Order[];
  topSellingItems : TopSellingItem[];
  totalPendingOrders : number;
  totalCompletedOrders : number;
  totalSalesOrders : number;
  monthlySalesDTOS : MonthlySales[];
  weeklySalesDTOS : WeeklySales[];
}

export interface DashboardResponse {
  message: string;
  error: string | null;
  status: number;
  data: {
    orderSummary: OrderSummary;
  };
}  

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
   private apiUrl = 'http://localhost:3030/user-microservice/api/v1/last-five-orders';

  constructor(
    private http: HttpClient
  ) { }

  getDashboardData(): Observable<DashboardResponse> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No authentication token found.');
      alert('No authentication token found. Please log in again.');
    }

    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    });


    return this.http.post<DashboardResponse>(this.apiUrl, {}, { headers });
  }
}
