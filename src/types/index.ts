export type Role = "volunteer" | "organization";

export type Cause =
  | "Environment"
  | "Education"
  | "Community"
  | "Animals"
  | "Health"
  | "Technology"
  | "Elderly Care"
  | "Arts & Culture"
  | "Humanitarian Work"
  | "Children";

export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  role: Role;
  avatarInitials: string;
}

export interface VolunteerProfile {
  id: string;
  volunteerId: string;
  name: string;
  email: string;
  bio: string;
  location: string;
  avatarInitials: string;
  causes: Cause[];
  skills: string[];
  availability: string[];
  preferredType: "In Person" | "Remote" | "Both";
  impactPoints: number;
  rankId: string;
  reliability: {
    score: number;
    effort: number;
    reliability: number;
    conduct: number;
  };
  contributions: number;
  badgeIds: string[];
  joinedOn: string;
}

export interface Organization {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  website: string;
  contactPerson: string;
  causes: Cause[];
  verified: boolean;
  rating: number;
  opportunityCount: number;
}

export interface Opportunity {
  id: string;
  title: string;
  organizationId: string;
  cause: Cause;
  location: string;
  remote: boolean;
  date: string;
  duration: string;
  commitment: string;
  skills: string[];
  impactPoints: number;
  matchScore: number;
  matchReasons: string[];
  summary: string;
  responsibilities: string[];
  schedule: string;
  beneficiaries: string;
  capacity: number;
  filled: number;
  status: "active" | "draft" | "closed" | "completed";
  createdAt: string;
}

export type ApplicationStatus =
  | "Requested"
  | "Accepted"
  | "Upcoming"
  | "In Progress"
  | "Completed"
  | "Awaiting Rating"
  | "Verified";

export interface Application {
  id: string;
  opportunityId: string;
  volunteerId: string;
  status: ApplicationStatus;
  appliedOn: string;
  completedOn?: string;
  pointsAwarded?: number;
  ratingId?: string;
  certificateId?: string;
  recommendationId?: string;
}

export interface ImpactTransaction {
  id: string;
  date: string;
  opportunityTitle: string;
  organizationName: string;
  cause: Cause;
  points: number;
  status: ApplicationStatus;
  ratingScore?: number;
  certificateId?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedOn?: string;
  tone: "primary" | "coral" | "sky" | "lilac" | "sunbeam";
}

export interface Rank {
  id: string;
  name: string;
  minPoints: number;
  description: string;
}

export interface Certificate {
  id: string;
  title: string;
  type: "organization" | "kindquest";
  recipient: string;
  issuer: string;
  achievement: string;
  issuedOn: string;
  verified: boolean;
}

export interface Rating {
  id: string;
  volunteerId: string;
  organizationName: string;
  opportunityTitle: string;
  overall: number;
  effort: number;
  reliability: number;
  conduct: number;
  feedback: string;
  recommended: boolean;
  date: string;
}

export interface Recommendation {
  id: string;
  organizationName: string;
  volunteerName: string;
  opportunityTitle: string;
  text: string;
  date: string;
}

export interface ChainMember {
  id: string;
  name: string;
  action: string;
  date: string;
  status: "completed" | "in progress" | "invited";
}

export interface Chain {
  id: string;
  cause: Cause;
  originalAction: string;
  startedOn: string;
  members: ChainMember[];
}

export interface PaymentRecord {
  id: string;
  date: string;
  organizationName: string;
  opportunityTitle: string;
  type: "Stipend" | "Reimbursement" | "Donation";
  amount: number;
  status: "Paid" | "Processing" | "Recorded";
  volunteerId: string;
}

export interface Professional {
  id: string;
  name: string;
  profession: string;
  location: string;
  verified: boolean;
  availability: string;
  contact: string;
  rating: number;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: "application" | "impact" | "certificate" | "chain" | "recommendation";
}

export interface ChatMessage {
  id: string;
  from: "kindquest" | "user";
  text: string;
}
