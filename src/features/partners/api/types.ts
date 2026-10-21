import type { PartnerStatus, PartnerTier } from '../constants/partner-options';
import type { Payout } from '@/features/payouts/api/types';

export type Partner = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  tier: PartnerTier;
  status: PartnerStatus;
  /** ISO 3166-1 alpha-2 code */
  country: string;
  /** Lifetime revenue in USD */
  revenue: number;
  /** Lifetime paid payouts in USD */
  payoutsTotal: number;
  joinedAt: string;
};

export type PartnerFilters = {
  page?: number;
  limit?: number;
  search?: string;
  /** Comma-separated PartnerStatus values */
  status?: string;
  /** Comma-separated PartnerTier values */
  tier?: string;
  sort?: string;
};

export type PartnersResponse = {
  success: boolean;
  time: string;
  message: string;
  total_partners: number;
  offset: number;
  limit: number;
  partners: Partner[];
};

export type PartnerStats = {
  paidTotal: number;
  pendingTotal: number;
  payoutCount: number;
};

export type PartnerDetailResponse = {
  success: boolean;
  partner: Partner;
  recentPayouts: Payout[];
  stats: PartnerStats;
};
