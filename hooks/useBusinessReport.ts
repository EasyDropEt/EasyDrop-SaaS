import { useState, useEffect } from 'react';
import { BusinessReportDto, BusinessReportParams } from '@/domain/entities/Report';
import { GetBusinessReportUseCase } from '@/application/useCases/business/GetBusinessReportUseCase';
import { ReportRepository } from '@/infrastructure/repositories/ReportRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { useBusinessContext } from '@/context/BusinessContext';

export const useBusinessReport = (
  startDate?: string, 
  endDate?: string
) => {
  const { business, token, isAuthenticated } = useBusinessContext();
  const [report, setReport] = useState<BusinessReportDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    if (!business?.id || !isAuthenticated || !token) {
      setError('Not authenticated or business data not available');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a separate API client instance for reports
      const apiClient = new ApiClient();
      apiClient.setAuthToken(token);
      
      // The ReportRepository will set the base URL to NEXT_PUBLIC_API_URL_CORE
      const reportRepository = new ReportRepository(apiClient);
      const getBusinessReportUseCase = new GetBusinessReportUseCase(reportRepository);

      const params: BusinessReportParams = {
        businessId: business.id,
        startDate,
        endDate
      };

      const reportData = await getBusinessReportUseCase.execute(params);
      setReport(reportData);
    } catch (err) {
      console.error('Failed to fetch business report:', err);
      setError('Failed to fetch report data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (business?.id && isAuthenticated) {
      fetchReport();
    }
  }, [business?.id, isAuthenticated, startDate, endDate]);

  return {
    report,
    loading,
    error,
    refreshReport: fetchReport
  };
}; 