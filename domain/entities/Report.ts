export interface ReportMetric {
  value: number | string;
  change?: number; // Percentage change from previous period
  trend?: 'up' | 'down' | 'stable';
}

// Raw API response format
export interface BusinessReportApiResponse {
  total_orders: number;
  completed_deliveries: number;
  cancelled_deliveries: number;
  pending_deliveries: number;
  failed_deliveries: number;
  delivery_success_rate: number;
  total_revenue_birr: number;
  average_order_value_birr: number;
  report_start_date: string;
  report_end_date: string;
  average_delivery_time_minutes: number;
  average_delivery_distance_km: number;
  on_time_delivery_rate: number;
  late_deliveries: number;
  customer_satisfaction_average_rating: number;
  customer_retention_rate: number;
  new_customers: number;
  repeat_customers: number;
  average_driver_rating: number;
  peak_delivery_hours: Record<string, number>;
  peak_delivery_days: Record<string, number>;
  delivery_performance_data: any[];
  orders: {
    id: string;
    /**
     * Some API responses use the key `order_status` instead of `status`. Keep both optional
     * to ensure type-safety while maintaining backward compatibility.
     */
    status?: string;
    order_status?: string;
    created_at?: string;
    latest_time_of_delivery?: string;
  }[];
}

// Transformed report format used in the UI
export interface BusinessReportDto {
  totalOrders: ReportMetric;
  completedDeliveries: ReportMetric;
  avgDeliveryTime: ReportMetric;
  customerSatisfaction: ReportMetric;
  cancelledDeliveries: ReportMetric;
  pendingDeliveries: ReportMetric;
  failedDeliveries: ReportMetric;
  deliverySuccessRate: ReportMetric;
  totalRevenue: ReportMetric;
  averageOrderValue: ReportMetric;
  onTimeDeliveryRate: ReportMetric;
  lateDeliveries: ReportMetric;
  customerRetentionRate: ReportMetric;
  newCustomers: ReportMetric;
  repeatCustomers: ReportMetric;
  averageDeliveryDistance: ReportMetric;
  averageDriverRating: ReportMetric;
  recentOrders: {
    id: string;
    status: string;
    createdAt: string;
  }[];
  // Could add more metrics as needed
}

export interface BusinessReportParams {
  businessId: string;
  startDate?: string;
  endDate?: string;
}

// Generic response format that matches the API
export interface GenericResponse<T> {
  is_success: boolean;
  message: string;
  data: T;
  errors: string[];
} 