import { ApiClient } from '../api/ApiClient';
import { 
  BusinessReportDto, 
  BusinessReportParams, 
  GenericResponse,
  BusinessReportApiResponse,
  ReportMetric 
} from '@/domain/entities/Report';

export class ReportRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
    // Override the base URL to use NEXT_PUBLIC_API_URL_CORE for reports
    const coreApiUrl = process.env.NEXT_PUBLIC_API_URL_CORE || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    this.apiClient.setBaseUrl(coreApiUrl);
    console.log('Report API URL:', coreApiUrl);
  }

  async getBusinessReport(params: BusinessReportParams): Promise<BusinessReportDto> {
    const { businessId, startDate, endDate } = params;
    
    // Build the query string for optional parameters
    let queryParams = '';
    if (startDate || endDate) {
      const searchParams = new URLSearchParams();
      if (startDate) searchParams.append('start_date', startDate);
      if (endDate) searchParams.append('end_date', endDate);
      queryParams = `?${searchParams.toString()}`;
    }
    
    const response = await this.apiClient.get<GenericResponse<BusinessReportApiResponse>>(
      `/businesses/${businessId}/report${queryParams}`
    );
    
    // Transform the API response to match our UI structure
    return this.transformApiResponseToUiFormat(response);
  }

  private transformApiResponseToUiFormat(response: GenericResponse<BusinessReportApiResponse>): BusinessReportDto {
    const apiData = response.data;
    
    // Create a formatted report with default values in case some data is missing
    const report: BusinessReportDto = {
      totalOrders: this.createMetric(apiData.total_orders),
      completedDeliveries: this.createMetric(apiData.completed_deliveries),
      avgDeliveryTime: this.createMetric(apiData.average_delivery_time_minutes),
      customerSatisfaction: this.createMetric(apiData.customer_satisfaction_average_rating),
      cancelledDeliveries: this.createMetric(apiData.cancelled_deliveries),
      pendingDeliveries: this.createMetric(apiData.pending_deliveries),
      failedDeliveries: this.createMetric(apiData.failed_deliveries),
      deliverySuccessRate: this.createMetric(apiData.delivery_success_rate),
      totalRevenue: this.createMetric(apiData.total_revenue_birr),
      averageOrderValue: this.createMetric(apiData.average_order_value_birr),
      onTimeDeliveryRate: this.createMetric(apiData.on_time_delivery_rate),
      lateDeliveries: this.createMetric(apiData.late_deliveries),
      customerRetentionRate: this.createMetric(apiData.customer_retention_rate),
      newCustomers: this.createMetric(apiData.new_customers),
      repeatCustomers: this.createMetric(apiData.repeat_customers),
      averageDeliveryDistance: this.createMetric(apiData.average_delivery_distance_km),
      averageDriverRating: this.createMetric(apiData.average_driver_rating),
      recentOrders: (apiData.orders || []).map(order => {
        // Some backend versions send `order_status` instead of `status`
        const orderStatus: string | undefined = order.order_status ?? order.status;
        return {
          id: order.id,
          status: orderStatus ?? 'unknown',
          createdAt: order.created_at ?? (order as any).latest_time_of_delivery ?? (order as any).latest_time_of_arrival ?? ''
        };
      })
    };
    
    return report;
  }
  
  private createMetric(value: number | undefined): ReportMetric {
    // For now, just create a basic metric without trend data
    return {
      value: value !== undefined ? value : 0
    };
  }
} 