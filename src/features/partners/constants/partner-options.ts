export const PARTNER_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  PENDING: 'pending'
} as const;

export type PartnerStatus = (typeof PARTNER_STATUS)[keyof typeof PARTNER_STATUS];

export const PARTNER_STATUS_LABEL: Record<PartnerStatus, string> = {
  [PARTNER_STATUS.ACTIVE]: 'Active',
  [PARTNER_STATUS.PAUSED]: 'Paused',
  [PARTNER_STATUS.PENDING]: 'Pending'
};

export const partnerStatusOptions = Object.values(PARTNER_STATUS).map((value) => ({
  value,
  label: PARTNER_STATUS_LABEL[value]
}));

export const PARTNER_TIER = {
  GOLD: 'gold',
  SILVER: 'silver',
  BRONZE: 'bronze'
} as const;

export type PartnerTier = (typeof PARTNER_TIER)[keyof typeof PARTNER_TIER];

export const PARTNER_TIER_LABEL: Record<PartnerTier, string> = {
  [PARTNER_TIER.GOLD]: 'Gold',
  [PARTNER_TIER.SILVER]: 'Silver',
  [PARTNER_TIER.BRONZE]: 'Bronze'
};

export const partnerTierOptions = Object.values(PARTNER_TIER).map((value) => ({
  value,
  label: PARTNER_TIER_LABEL[value]
}));
