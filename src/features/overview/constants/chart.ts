import { PARTNER_TIER, type PartnerTier } from '@/features/partners/constants/partner-options';
import { PAYOUT_METHOD, type PayoutMethod } from '@/features/payouts/constants/payout-options';

// One fixed plot height shared by every chart and its skeleton, so nothing
// moves when a chart replaces its skeleton (no aspect-ratio-based height).
export const CHART_PLOT_HEIGHT = 'h-[280px]';
/** The donut is shorter: its legend rows sit under it in the same card */
export const DONUT_PLOT_HEIGHT = 'h-[200px]';

// Series colors are the theme's chart tokens. The donut's legend is HTML outside the
// chart container (where `--color-<key>` isn't defined), so it reads these directly.
export const CHART_COLOR = {
  ONE: 'var(--chart-1)',
  TWO: 'var(--chart-2)',
  THREE: 'var(--chart-3)'
} as const;

export const TIER_CHART_COLOR: Record<PartnerTier, string> = {
  [PARTNER_TIER.GOLD]: CHART_COLOR.ONE,
  [PARTNER_TIER.SILVER]: CHART_COLOR.TWO,
  [PARTNER_TIER.BRONZE]: CHART_COLOR.THREE
};

export const METHOD_CHART_COLOR: Record<PayoutMethod, string> = {
  [PAYOUT_METHOD.BANK_TRANSFER]: CHART_COLOR.ONE,
  [PAYOUT_METHOD.PAYPAL]: CHART_COLOR.TWO,
  [PAYOUT_METHOD.WISE]: CHART_COLOR.THREE
};

/** Longest partner name on the top-partners axis before it's cut with an ellipsis */
export const TOP_PARTNER_NAME_MAX_LENGTH = 18;
/** Width (px) of the top-partners name axis; fits a name of the max length above */
export const TOP_PARTNER_AXIS_WIDTH = 140;
