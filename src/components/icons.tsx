import {
  IconBuildingStore,
  IconCash,
  IconCopy,
  IconMail,
  IconWallet,
  IconWorld,
  IconAlertCircle,
  IconAlertTriangle,
  IconBold,
  IconBox,
  IconBrightness,
  IconCalendar,
  IconDatabase,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconTable,
  IconChevronsDown,
  IconChevronsRight,
  IconCircleCheck,
  IconCircleX,
  IconClipboardText,
  IconClock,
  IconCode,
  IconCommand,
  IconDeviceLaptop,
  IconDotsVertical,
  IconEdit,
  IconExternalLink,
  IconEye,
  IconEyeOff,
  IconFile,
  IconInfoCircle,
  IconItalic,
  IconLayoutDashboard,
  IconLayoutSidebar,
  IconLayoutList,
  IconLayoutRows,
  IconLoader2,
  IconLock,
  IconLogout,
  IconMinus,
  IconMoon,
  IconMusic,
  IconPalette,
  IconPhone,
  IconPlus,
  IconProps,
  IconSearch,
  IconSelector,
  IconSend,
  IconSettings,
  IconSlash,
  IconSun,
  IconTrash,
  IconTrendingDown,
  IconTrendingUp,
  IconTypography,
  IconUnderline,
  IconUpload,
  IconUser,
  IconUserCircle,
  IconUsers,
  IconX,
  IconBrowser,
  IconRefresh,
  IconServer,
  IconShieldLock
} from '@tabler/icons-react';

export type Icon = React.ComponentType<IconProps>;

export const Icons = {
  // General
  alertCircle: IconAlertCircle,
  warning: IconAlertTriangle,
  check: IconCheck,
  circleCheck: IconCircleCheck,
  close: IconX,
  clock: IconClock,
  code: IconCode,
  ellipsis: IconDotsVertical,
  externalLink: IconExternalLink,
  info: IconInfoCircle,
  spinner: IconLoader2,
  search: IconSearch,
  settings: IconSettings,
  trash: IconTrash,

  // Navigation / Chevrons
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  chevronsDown: IconChevronsDown,
  chevronsRight: IconChevronsRight,
  chevronsUpDown: IconSelector,

  // Layout
  dashboard: IconLayoutDashboard,
  panelLeft: IconLayoutSidebar,
  rowsCompact: IconLayoutList,
  rowsComfortable: IconLayoutRows,

  // User
  user: IconUser,
  account: IconUserCircle,
  teams: IconUsers,

  // Brand
  logo: IconCommand,

  // Communication
  phone: IconPhone,
  send: IconSend,

  // Files
  page: IconFile,
  music: IconMusic,

  // Actions
  add: IconPlus,
  edit: IconEdit,
  upload: IconUpload,
  logout: IconLogout,

  // Shapes / Indicators
  circleX: IconCircleX,
  xCircle: IconCircleX,
  minus: IconMinus,

  // Theme
  sun: IconSun,
  moon: IconMoon,
  brightness: IconBrightness,
  laptop: IconDeviceLaptop,
  palette: IconPalette,

  // Commerce / Plans
  partners: IconBuildingStore,
  payouts: IconCash,
  wallet: IconWallet,
  world: IconWorld,
  mail: IconMail,
  copy: IconCopy,
  lock: IconLock,

  // Data / Charts
  trendingDown: IconTrendingDown,
  trendingUp: IconTrendingUp,
  eye: IconEye,
  eyeOff: IconEyeOff,

  // Text formatting
  bold: IconBold,
  italic: IconItalic,
  underline: IconUnderline,
  text: IconTypography,

  // Toast

  // Misc
  forms: IconClipboardText,
  product: IconBox,
  table: IconTable,
  database: IconDatabase,
  slash: IconSlash,
  calendar: IconCalendar,

  // Examples
  browser: IconBrowser,
  refresh: IconRefresh,
  server: IconServer,
  shield: IconShieldLock
};
