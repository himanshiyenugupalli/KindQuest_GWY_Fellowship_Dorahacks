import type { Organization } from "@/types";

export const organizations: Organization[] = [
  {
    id: "org-1",
    name: "GreenRoots Collective",
    type: "Environmental non-profit",
    description:
      "A neighbourhood-led group restoring urban tree cover, cleaning lakes and running composting hubs across the city.",
    location: "Hyderabad, India",
    website: "greenroots.org",
    contactPerson: "Meera Rao",
    causes: ["Environment", "Community"],
    verified: true,
    rating: 4.8,
    opportunityCount: 4,
  },
  {
    id: "org-2",
    name: "Bright Minds Learning Trust",
    type: "Education trust",
    description:
      "Free after-school tutoring and reading circles for students from low-income government schools.",
    location: "Bengaluru, India",
    website: "brightmindstrust.org",
    contactPerson: "Anand Kulkarni",
    causes: ["Education", "Children"],
    verified: true,
    rating: 4.9,
    opportunityCount: 5,
  },
  {
    id: "org-3",
    name: "Second Chance Animal Shelter",
    type: "Animal welfare shelter",
    description:
      "Rescue, rehabilitation and adoption support for street dogs and cats, run entirely by volunteers and two vets.",
    location: "Pune, India",
    website: "secondchanceshelter.in",
    contactPerson: "Riya Fernandes",
    causes: ["Animals", "Community"],
    verified: true,
    rating: 4.6,
    opportunityCount: 3,
  },
  {
    id: "org-4",
    name: "Saathi Elder Care Society",
    type: "Elder care society",
    description:
      "Companionship visits, medicine reminders and digital-help sessions for elders living alone.",
    location: "Chennai, India",
    website: "saathieldercare.org",
    contactPerson: "Lakshmi Iyer",
    causes: ["Elderly Care", "Health"],
    verified: true,
    rating: 4.7,
    opportunityCount: 3,
  },
  {
    id: "org-5",
    name: "OpenCode Foundation",
    type: "Technology non-profit",
    description:
      "Builds free digital tools for grassroots non-profits and teaches basic coding to first-generation learners.",
    location: "Remote-first",
    website: "opencodefoundation.dev",
    contactPerson: "Dev Sharma",
    causes: ["Technology", "Education"],
    verified: true,
    rating: 4.5,
    opportunityCount: 4,
  },
  {
    id: "org-6",
    name: "Kalakriti Arts Circle",
    type: "Arts & culture collective",
    description:
      "Community art workshops, mural projects and heritage documentation with local schools and artisans.",
    location: "Jaipur, India",
    website: "kalakriti.art",
    contactPerson: "Ishaan Mehta",
    causes: ["Arts & Culture", "Community"],
    verified: false,
    rating: 4.3,
    opportunityCount: 2,
  },
  {
    id: "org-7",
    name: "Anna Seva Relief Network",
    type: "Humanitarian relief network",
    description:
      "Emergency food distribution, flood relief kits and community kitchens coordinated with local volunteers.",
    location: "Mumbai, India",
    website: "annaseva.org",
    contactPerson: "Farah Sheikh",
    causes: ["Humanitarian Work", "Health"],
    verified: true,
    rating: 4.8,
    opportunityCount: 3,
  },
];

export const organizationById = (id: string) => organizations.find((o) => o.id === id);
export const organizationName = (id: string) =>
  organizationById(id)?.name ?? "Unknown organization";
