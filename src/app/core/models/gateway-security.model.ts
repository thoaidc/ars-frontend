export interface RateLimiterDTO {
  routeId: string;
  banThreshold: number;
  windowSeconds: number;
  banDurationMinutes: number;
}
