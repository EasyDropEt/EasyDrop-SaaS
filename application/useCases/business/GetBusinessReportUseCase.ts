import { BusinessReportDto, BusinessReportParams } from '@/domain/entities/Report';
import { ReportRepository } from '@/infrastructure/repositories/ReportRepository';

export class GetBusinessReportUseCase {
  constructor(private reportRepository: ReportRepository) {}

  async execute(params: BusinessReportParams): Promise<BusinessReportDto> {
    return this.reportRepository.getBusinessReport(params);
  }
}
