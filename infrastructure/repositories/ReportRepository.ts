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
      recentOrders: (apiData.orders || []).map(order => ({
        id: order.id,
        status: order.status,
        createdAt: order.created_at
      }))
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