import {
  Award,
  BadgeIndianRupee,
  Bell,
  Building2,
  Compass,
  CreditCard,
  FileBadge,
  Heart,
  IdCard,
  LayoutDashboard,
  Link2,
  ListChecks,
  Medal,
  Search,
  Settings,
  Sparkles,
  Stethoscope,
  Star,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const volunteerPrimaryNav: NavItem[] = [
  { label: "Discover", to: "/discover", icon: Compass },
  { label: "Browse", to: "/browse", icon: Search },
  { label: "My Opportunities", to: "/my-opportunities", icon: ListChecks },
  { label: "Volunteer ID", to: "/volunteer-id", icon: IdCard },
  { label: "Chain of Kindness", to: "/chain-of-kindness", icon: Link2 },
];

export const volunteerSecondaryNav: NavItem[] = [
  { label: "Impact", to: "/impact", icon: TrendingUp },
  { label: "Badges", to: "/badges", icon: Medal },
  { label: "Certificates", to: "/certificates", icon: Award },
  { label: "Payment Records", to: "/payments", icon: CreditCard },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Settings", to: "/settings", icon: Settings },
];

export const organizationNav: NavItem[] = [
  { label: "Dashboard", to: "/organization", icon: LayoutDashboard },
  { label: "Opportunities", to: "/organization/opportunities", icon: Sparkles },
  { label: "Volunteers", to: "/organization/volunteers", icon: Users },
  { label: "Professional Directory", to: "/organization/directory", icon: Stethoscope },
  { label: "Ratings", to: "/organization/ratings", icon: Star },
  { label: "Certificates", to: "/organization/certificates", icon: FileBadge },
  { label: "Payment Records", to: "/organization/payments", icon: BadgeIndianRupee },
  { label: "Settings", to: "/organization/settings", icon: Settings },
];

export const mobileVolunteerNav: NavItem[] = [
  { label: "Discover", to: "/discover", icon: Compass },
  { label: "Browse", to: "/browse", icon: Search },
  { label: "Mine", to: "/my-opportunities", icon: ListChecks },
  { label: "ID", to: "/volunteer-id", icon: IdCard },
];

export const orgIcon = Building2;
export const heartIcon = Heart;
