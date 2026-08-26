import type {
  Application,
  Badge,
  Certificate,
  Chain,
  ImpactTransaction,
  Notification,
  PaymentRecord,
  Professional,
  Rank,
  Rating,
  Recommendation,
  VolunteerProfile,
} from "@/types";

export const ranks: Rank[] = [
  { id: "r1", name: "First Step", minPoints: 0, description: "You showed up. That already counts." },
  { id: "r2", name: "Kind Explorer", minPoints: 150, description: "Trying different causes and finding your fit." },
  { id: "r3", name: "Community Helper", minPoints: 500, description: "A familiar, dependable face." },
  { id: "r4", name: "Impact Builder", minPoints: 1000, description: "Consistent contribution across causes." },
  { id: "r5", name: "Community Builder", minPoints: 1500, description: "Others rely on your work." },
  { id: "r6", name: "Changemaker", minPoints: 2500, description: "Your contribution shapes whole projects." },
];

export const badges: Badge[] = [
  { id: "b1", title: "First Impact", description: "Completed your first volunteering opportunity.", icon: "Sprout", earned: true, earnedOn: "14 Mar 2026", tone: "primary" },
  { id: "b2", title: "Remote Volunteer", description: "Completed 5 remote contributions.", icon: "Wifi", earned: true, earnedOn: "2 May 2026", tone: "sky" },
  { id: "b3", title: "Weekend Helper", description: "Volunteered on 8 different weekends.", icon: "CalendarHeart", earned: true, earnedOn: "21 Jun 2026", tone: "coral" },
  { id: "b4", title: "Eco Advocate", description: "Earned 300 points in environment causes.", icon: "Leaf", earned: true, earnedOn: "9 Jul 2026", tone: "primary" },
  { id: "b5", title: "Community Helper", description: "Contributed to 3 community-led projects.", icon: "Users", earned: true, earnedOn: "28 Jul 2026", tone: "lilac" },
  { id: "b6", title: "Helping Hand", description: "Received a 5-star effort rating.", icon: "HandHeart", earned: true, earnedOn: "3 Aug 2026", tone: "coral" },
  { id: "b7", title: "Chain Starter", description: "Started your first Chain of Kindness.", icon: "Link2", earned: true, earnedOn: "10 Aug 2026", tone: "sunbeam" },
  { id: "b8", title: "Consistent Contributor", description: "Volunteer at least once a month for 6 months.", icon: "Repeat", earned: false, tone: "sky" },
  { id: "b9", title: "Mentor", description: "Complete 10 mentoring or teaching sessions.", icon: "GraduationCap", earned: false, tone: "lilac" },
  { id: "b10", title: "Crisis Responder", description: "Support a humanitarian relief effort.", icon: "LifeBuoy", earned: false, tone: "coral" },
  { id: "b11", title: "Animal Ally", description: "Earn 200 points in animal welfare causes.", icon: "PawPrint", earned: false, tone: "sunbeam" },
  { id: "b12", title: "Community Builder", description: "Reach the Community Builder rank.", icon: "Building2", earned: false, tone: "primary" },
];

export const demoVolunteer: VolunteerProfile = {
  id: "vol-1",
  volunteerId: "KQ-10248",
  name: "Himanshi Yenugupalli",
  email: "himanshi@example.com",
  bio: "Engineering student who likes teaching kids, lake clean-ups and anything that gets neighbours talking to each other.",
  location: "Hyderabad, India",
  avatarInitials: "HY",
  causes: ["Education", "Environment", "Community"],
  skills: ["Communication", "Teaching", "Coordination", "Writing"],
  availability: ["Saturday mornings", "Sunday mornings", "Weekday evenings"],
  preferredType: "Both",
  impactPoints: 1240,
  rankId: "r4",
  reliability: { score: 92, effort: 95, reliability: 92, conduct: 96 },
  contributions: 14,
  badgeIds: ["b1", "b2", "b3", "b4", "b5", "b6", "b7"],
  joinedOn: "12 Mar 2026",
};

export const impactHistory: ImpactTransaction[] = [
  { id: "t1", date: "10 Aug 2026", opportunityTitle: "Weekend Reading Mentor", organizationName: "Bright Minds Learning Trust", cause: "Education", points: 50, status: "Verified", ratingScore: 5, certificateId: "cert-1" },
  { id: "t2", date: "2 Aug 2026", opportunityTitle: "Monsoon Sapling Care Round", organizationName: "GreenRoots Collective", cause: "Environment", points: 50, status: "Verified", ratingScore: 5 },
  { id: "t3", date: "26 Jul 2026", opportunityTitle: "Remote Tutoring Session", organizationName: "Bright Minds Learning Trust", cause: "Education", points: 30, status: "Verified", ratingScore: 4 },
  { id: "t4", date: "12 Jul 2026", opportunityTitle: "Community Food Drive", organizationName: "Anna Seva Relief Network", cause: "Humanitarian Work", points: 100, status: "Verified", ratingScore: 5, certificateId: "cert-2" },
  { id: "t5", date: "28 Jun 2026", opportunityTitle: "Lake Clean-Up Crew", organizationName: "GreenRoots Collective", cause: "Environment", points: 80, status: "Verified", ratingScore: 5 },
  { id: "t6", date: "14 Jun 2026", opportunityTitle: "Digital Help Companion", organizationName: "Saathi Elder Care Society", cause: "Elderly Care", points: 55, status: "Verified", ratingScore: 4 },
  { id: "t7", date: "31 May 2026", opportunityTitle: "Homework Helpline", organizationName: "Bright Minds Learning Trust", cause: "Education", points: 75, status: "Verified", ratingScore: 5 },
  { id: "t8", date: "17 May 2026", opportunityTitle: "Composting Steward", organizationName: "GreenRoots Collective", cause: "Community", points: 40, status: "Verified", ratingScore: 4 },
];

export const applications: Application[] = [
  { id: "app-1", opportunityId: "opp-1", volunteerId: "KQ-10248", status: "Accepted", appliedOn: "18 Aug 2026" },
  { id: "app-2", opportunityId: "opp-10", volunteerId: "KQ-10248", status: "Requested", appliedOn: "21 Aug 2026" },
  { id: "app-3", opportunityId: "opp-5", volunteerId: "KQ-10248", status: "In Progress", appliedOn: "1 Aug 2026" },
  { id: "app-4", opportunityId: "opp-22", volunteerId: "KQ-10248", status: "Verified", appliedOn: "20 Jul 2026", completedOn: "2 Aug 2026", pointsAwarded: 50, ratingId: "rate-1", certificateId: "cert-1", recommendationId: "rec-1" },
  { id: "app-5", opportunityId: "opp-6", volunteerId: "KQ-10248", status: "Awaiting Rating", appliedOn: "1 Jul 2026", completedOn: "12 Jul 2026", pointsAwarded: 100 },
];

export const savedOpportunityIds = ["opp-3", "opp-16"];

export const certificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Certificate of Volunteer Contribution",
    type: "organization",
    recipient: "Himanshi Yenugupalli",
    issuer: "GreenRoots Collective",
    achievement: "Completed the Monsoon Sapling Care Round and helped 1,200 saplings survive their first monsoon.",
    issuedOn: "5 Aug 2026",
    verified: true,
  },
  {
    id: "cert-2",
    title: "Certificate of Appreciation",
    type: "organization",
    recipient: "Himanshi Yenugupalli",
    issuer: "Anna Seva Relief Network",
    achievement: "Supported the July community food drive, helping distribute 800 ration kits.",
    issuedOn: "15 Jul 2026",
    verified: true,
  },
  {
    id: "cert-3",
    title: "KindQuest Impact Builder",
    type: "kindquest",
    recipient: "Himanshi Yenugupalli",
    issuer: "KindQuest",
    achievement: "Reached 1,000 Impact Points across education, environment and community causes.",
    issuedOn: "28 Jul 2026",
    verified: true,
  },
  {
    id: "cert-4",
    title: "KindQuest First Impact",
    type: "kindquest",
    recipient: "Himanshi Yenugupalli",
    issuer: "KindQuest",
    achievement: "Completed a first verified volunteering contribution on KindQuest.",
    issuedOn: "14 Mar 2026",
    verified: true,
  },
];

export const ratings: Rating[] = [
  {
    id: "rate-1",
    volunteerId: "KQ-10248",
    organizationName: "GreenRoots Collective",
    opportunityTitle: "Monsoon Sapling Care Round",
    overall: 5,
    effort: 5,
    reliability: 5,
    conduct: 5,
    feedback: "Arrived early, stayed until the last row was watered, and kept the survival log spotless.",
    recommended: true,
    date: "5 Aug 2026",
  },
  {
    id: "rate-2",
    volunteerId: "KQ-10248",
    organizationName: "Bright Minds Learning Trust",
    opportunityTitle: "Weekend Reading Mentor",
    overall: 5,
    effort: 5,
    reliability: 4,
    conduct: 5,
    feedback: "Her student's reading confidence changed visibly over eight weeks. Warm and very patient.",
    recommended: true,
    date: "12 Aug 2026",
  },
];

export const recommendations: Recommendation[] = [
  {
    id: "rec-1",
    organizationName: "GreenRoots Collective",
    volunteerName: "Himanshi Yenugupalli",
    opportunityTitle: "Monsoon Sapling Care Round",
    text: "Himanshi is the volunteer you want on a field day. She took ownership of an entire plot without being asked, and her record-keeping made our survival reporting far easier.",
    date: "5 Aug 2026",
  },
  {
    id: "rec-2",
    organizationName: "Bright Minds Learning Trust",
    volunteerName: "Himanshi Yenugupalli",
    opportunityTitle: "Weekend Reading Mentor",
    text: "Eight weeks, never once late, and a genuinely kind presence for a shy nine-year-old. We would gladly have her mentor again.",
    date: "12 Aug 2026",
  },
];

export const chains: Chain[] = [
  {
    id: "chain-1",
    cause: "Education",
    originalAction: "Mentored a Grade 4 student in weekend reading",
    startedOn: "10 Aug 2026",
    members: [
      { id: "cm-1", name: "Himanshi Yenugupalli (you)", action: "Mentored a Grade 4 student in weekend reading", date: "10 Aug 2026", status: "completed" },
      { id: "cm-2", name: "Aarav Nair", action: "Ran a Sunday maths doubt circle", date: "16 Aug 2026", status: "completed" },
      { id: "cm-3", name: "Sneha Kapoor", action: "Donated and catalogued 60 story books", date: "20 Aug 2026", status: "completed" },
      { id: "cm-4", name: "Rahul Verma", action: "Teaching evening English at a night school", date: "23 Aug 2026", status: "in progress" },
      { id: "cm-5", name: "Invited: Priya Das", action: "Nomination sent — awaiting response", date: "24 Aug 2026", status: "invited" },
    ],
  },
  {
    id: "chain-2",
    cause: "Environment",
    originalAction: "Cleaned a 200m stretch of lake edge",
    startedOn: "28 Jun 2026",
    members: [
      { id: "cm-6", name: "Himanshi Yenugupalli (you)", action: "Cleaned a 200m stretch of lake edge", date: "28 Jun 2026", status: "completed" },
      { id: "cm-7", name: "Karthik Reddy", action: "Set up segregation bins in his apartment", date: "5 Jul 2026", status: "completed" },
      { id: "cm-8", name: "Divya Menon", action: "Started a weekly composting round", date: "19 Jul 2026", status: "completed" },
    ],
  },
];

export const paymentRecords: PaymentRecord[] = [
  { id: "pay-1", date: "6 Aug 2026", organizationName: "GreenRoots Collective", opportunityTitle: "Monsoon Sapling Care Round", type: "Reimbursement", amount: 480, status: "Paid", volunteerId: "KQ-10248" },
  { id: "pay-2", date: "15 Jul 2026", organizationName: "Anna Seva Relief Network", opportunityTitle: "Community Food Drive", type: "Stipend", amount: 1500, status: "Paid", volunteerId: "KQ-10248" },
  { id: "pay-3", date: "1 Jul 2026", organizationName: "Bright Minds Learning Trust", opportunityTitle: "Homework Helpline", type: "Stipend", amount: 1200, status: "Processing", volunteerId: "KQ-10248" },
  { id: "pay-4", date: "18 Jun 2026", organizationName: "Saathi Elder Care Society", opportunityTitle: "Digital Help Companion", type: "Reimbursement", amount: 260, status: "Recorded", volunteerId: "KQ-10248" },
  { id: "pay-5", date: "2 Jun 2026", organizationName: "GreenRoots Collective", opportunityTitle: "Lake Clean-Up Crew", type: "Donation", amount: 1000, status: "Recorded", volunteerId: "KQ-10248" },
];

export const professionals: Professional[] = [
  { id: "pro-1", name: "Dr. Anjali Deshmukh", profession: "General Physician", location: "Madhapur, Hyderabad", verified: true, availability: "Weekdays, 10 AM–4 PM", contact: "+91 90000 11221", rating: 4.8 },
  { id: "pro-2", name: "Suresh Kumar", profession: "Electrician", location: "Kukatpally, Hyderabad", verified: true, availability: "All days, on call", contact: "+91 90000 33445", rating: 4.6 },
  { id: "pro-3", name: "Ramesh Yadav", profession: "Plumber", location: "Gachibowli, Hyderabad", verified: false, availability: "Mon–Sat, 9 AM–7 PM", contact: "+91 90000 55667", rating: 4.2 },
  { id: "pro-4", name: "Dr. Neha Bhatt", profession: "Paediatrician", location: "Banjara Hills, Hyderabad", verified: true, availability: "Weekends only", contact: "+91 90000 77889", rating: 4.9 },
  { id: "pro-5", name: "Imran Qureshi", profession: "AC & Appliance Technician", location: "Ameerpet, Hyderabad", verified: true, availability: "Mon–Fri, 11 AM–8 PM", contact: "+91 90000 99001", rating: 4.4 },
  { id: "pro-6", name: "Lata Srinivasan", profession: "Physiotherapist", location: "Kondapur, Hyderabad", verified: true, availability: "Tue, Thu, Sat", contact: "+91 90000 22334", rating: 4.7 },
  { id: "pro-7", name: "Vikram Singh", profession: "Carpenter", location: "Secunderabad", verified: false, availability: "Mon–Sat, 8 AM–6 PM", contact: "+91 90000 44556", rating: 4.1 },
  { id: "pro-8", name: "Dr. Faisal Ahmed", profession: "Dentist", location: "Begumpet, Hyderabad", verified: true, availability: "Weekdays, 5 PM–9 PM", contact: "+91 90000 66778", rating: 4.5 },
];

export const notifications: Notification[] = [
  { id: "n1", title: "Your volunteer request was accepted", body: "Bright Minds Learning Trust accepted you for Weekend Reading Mentor.", date: "2 hours ago", read: false, kind: "application" },
  { id: "n2", title: "You earned 50 Impact Points", body: "Weekend Reading Mentor was verified by the organization.", date: "Yesterday", read: false, kind: "impact" },
  { id: "n3", title: "Your certificate is ready", body: "GreenRoots Collective issued a Certificate of Volunteer Contribution.", date: "5 Aug 2026", read: false, kind: "certificate" },
  { id: "n4", title: "Someone continued your Chain of Kindness", body: "Rahul Verma accepted a nomination and is teaching evening English.", date: "23 Aug 2026", read: true, kind: "chain" },
  { id: "n5", title: "Your profile received a recommendation", body: "Bright Minds Learning Trust wrote a recommendation for you.", date: "12 Aug 2026", read: true, kind: "recommendation" },
  { id: "n6", title: "Rating received", body: "GreenRoots Collective rated your contribution 5 out of 5 for effort.", date: "5 Aug 2026", read: true, kind: "impact" },
];

export const rankFor = (points: number): Rank => {
  let current = ranks[0]!;
  for (const r of ranks) if (points >= r.minPoints) current = r;
  return current;
};

export const nextRankFor = (points: number): Rank | undefined =>
  ranks.find((r) => r.minPoints > points);
