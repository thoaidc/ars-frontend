
export interface RevenueDashboardReportData {
  date: string;
  amount: number;
}

export interface FinanceData {
  totalRevenue: number;
  totalPlatformFee: number;
  totalProfit: number;
}

export const StatisticType = {
  REVENUE: 1,
  PROFIT: 2,
  PLATFORM_FEE: 3,
  SALES: 1
}

export const BalanceType = {
  ADMIN: 1,
  SHOP: 2
}
