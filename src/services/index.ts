/**
 * KindQuest service layer.
 *
 * These are MOCK implementations backed by local data in `src/data`.
 * No backend is connected. Every function is async so that swapping the
 * body for a real API/database call later requires no component changes.
 */
import {
  activeOpportunities,
  opportunities,
  opportunityById,
} from "@/data/opportunities";
import { organizationById, organizations } from "@/data/organizations";
import {
  applications,
  badges,
  certificates,
  chains,
  demoVolunteer,
  impactHistory,
  nextRankFor,
  notifications,
  paymentRecords,
  professionals,
  rankFor,
  ranks,
  ratings,
  recommendations,
  savedOpportunityIds,
} from "@/data/volunteer";
import type { ChatMessage, Opportunity } from "@/types";
import { supabase } from "@/lib/supabase";

const delay = <T>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const opportunityService = {
  list: async () => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("status", "active");
      if (!error && data && data.length > 0) {
        return data.map((o: any) => ({
          ...o,
          organizationId: o.organization_id,
          organizationName: o.organization_name,
          spotsLeft: o.spots_left,
          spotsTotal: o.spots_total,
          impactPoints: o.impact_points,
          matchScore: 85,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch failed, fallback to mock opportunities");
    }
    return delay(activeOpportunities);
  },
  listAll: async () => {
    try {
      const { data, error } = await supabase.from("opportunities").select("*");
      if (!error && data && data.length > 0) {
        return data.map((o: any) => ({
          ...o,
          organizationId: o.organization_id,
          organizationName: o.organization_name,
          spotsLeft: o.spots_left,
          spotsTotal: o.spots_total,
          impactPoints: o.impact_points,
          matchScore: 85,
        }));
      }
    } catch (e) {
      console.warn("Supabase fetch failed");
    }
    return delay(opportunities);
  },
  get: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) {
        return {
          ...data,
          organizationId: data.organization_id,
          organizationName: data.organization_name,
          spotsLeft: data.spots_left,
          spotsTotal: data.spots_total,
          impactPoints: data.impact_points,
          matchScore: 90,
        };
      }
    } catch (e) {}
    return delay(opportunityById(id));
  },
  recommended: async (limit = 6) => {
    const list = await opportunityService.list();
    return list.slice(0, limit);
  },
  nearby: async (city = "Hyderabad", limit = 4) => {
    const list = await opportunityService.list();
    return list.filter((o) => !o.remote && o.location.includes(city)).slice(0, limit);
  },
  remote: async (limit = 4) => {
    const list = await opportunityService.list();
    return list.filter((o) => o.remote).slice(0, limit);
  },
  byCause: async (cause: string) => {
    const list = await opportunityService.list();
    return list.filter((o) => o.cause === cause);
  },
  saved: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("saved_opportunities")
          .select("opportunity_id")
          .eq("user_id", session.user.id);
        if (!error && data && data.length > 0) {
          const ids = data.map((d: any) => d.opportunity_id);
          const all = await opportunityService.listAll();
          return all.filter((o) => ids.includes(o.id));
        }
      }
    } catch (e) {}
    return delay(activeOpportunities.filter((o) => savedOpportunityIds.includes(o.id)));
  },
};

export const volunteerService = {
  profile: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: prof } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        const { data: vProf } = await supabase
          .from("volunteer_profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (prof && vProf) {
          return {
            id: prof.id,
            volunteerId: vProf.volunteer_id,
            name: prof.full_name,
            email: prof.email,
            bio: vProf.bio || "",
            location: prof.location || "Hyderabad, India",
            avatarInitials: prof.full_name.slice(0, 2).toUpperCase(),
            causes: vProf.causes || [],
            skills: vProf.skills || [],
            availability: vProf.availability || [],
            preferredType: (vProf.preferred_type || "Both") as "In-person" | "Remote" | "Both",
            impactPoints: vProf.impact_points || 0,
            rankId: vProf.rank_id || "r1",
            reliability: vProf.reliability || { score: 100, effort: 100, reliability: 100, conduct: 100 },
            contributions: vProf.contributions || 0,
            badgeIds: vProf.badge_ids || [],
            joinedOn: vProf.joined_on || "Aug 2026",
          };
        }
      }
    } catch (e) {}
    return delay(demoVolunteer);
  },
  applications: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("opportunity_applications")
          .select("*")
          .eq("volunteer_id", session.user.id);
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: a.id,
            opportunityId: a.opportunity_id,
            volunteerId: session.user.id,
            status: a.status,
            appliedOn: a.applied_on,
            completedOn: a.completed_on,
            pointsAwarded: a.points_awarded,
          }));
        }
      }
    } catch (e) {}
    return delay(applications);
  },
  impactHistory: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("opportunity_applications")
          .select("*, opportunities(*)")
          .eq("volunteer_id", session.user.id)
          .eq("status", "Verified");
        if (!error && data && data.length > 0) {
          return data.map((a: any) => ({
            id: a.id,
            date: a.completed_on || a.applied_on,
            opportunityTitle: a.opportunities?.title || "Volunteering Action",
            organizationName: a.opportunities?.organization_name || "Partner Organization",
            cause: a.opportunities?.cause || "Community",
            points: a.points_awarded || 50,
            status: "Verified" as const,
          }));
        }
      }
    } catch (e) {}
    return delay(impactHistory);
  },
  badges: async () => {
    try {
      const { data, error } = await supabase.from("badges").select("*");
      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({ ...b, earned: true }));
      }
    } catch (e) {}
    return delay(badges);
  },
  ranks: () => delay(ranks),
  rank: (points: number) => rankFor(points),
  nextRank: (points: number) => nextRankFor(points),
  notifications: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", session.user.id);
        if (!error && data && data.length > 0) {
          return data;
        }
      }
    } catch (e) {}
    return delay(notifications);
  },
};

export const organizationService = {
  list: async () => {
    try {
      const { data, error } = await supabase.from("organization_profiles").select("*");
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {}
    return delay(organizations);
  },
  get: async (id: string) => delay(organizationById(id)),
  opportunities: async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("organization_id", orgId);
      if (!error && data && data.length > 0) {
        return data.map((o: any) => ({
          ...o,
          organizationId: o.organization_id,
          organizationName: o.organization_name,
          spotsLeft: o.spots_left,
          spotsTotal: o.spots_total,
          impactPoints: o.impact_points,
          matchScore: 85,
        }));
      }
    } catch (e) {}
    return delay(opportunities.filter((o) => o.organizationId === orgId));
  },
  professionals: () => delay(professionals),
};

export const certificateService = {
  list: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .eq("recipient_id", session.user.id);
        if (!error && data && data.length > 0) {
          return data;
        }
      }
    } catch (e) {}
    return delay(certificates);
  },
  get: (id: string) => delay(certificates.find((c) => c.id === id)),
};

export const impactService = {
  history: () => volunteerService.impactHistory(),
  total: async () => {
    const prof = await volunteerService.profile();
    return prof.impactPoints;
  },
};

export const ratingService = {
  received: () => delay(ratings),
  recommendations: () => delay(recommendations),
  submit: async (payload: unknown) => {
    try {
      await supabase.from("organization_ratings").insert([payload as any]);
    } catch (e) {}
    return delay({ ok: true, payload });
  },
};

export const chainService = {
  list: async () => {
    try {
      const { data, error } = await supabase.from("chain_of_kindness").select("*");
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {}
    return delay(chains);
  },
  nominate: async (payload: unknown) => {
    try {
      await supabase.from("chain_of_kindness").insert([payload as any]);
    } catch (e) {}
    return delay({ ok: true, payload });
  },
};

export const paymentService = {
  records: () => delay(paymentRecords),
};

/**
 * AI abstraction. The provider is intentionally not fixed — a real
 * implementation (Gemini / NVIDIA / Ollama / other) would replace the mock
 * responder behind this same interface. No keys live in the frontend.
 */
export interface AiProvider {
  name: string;
  reply(history: ChatMessage[], input: string): Promise<{ text: string; suggestions: string[]; done: boolean }>;
  extractInterests(history: ChatMessage[]): Promise<string[]>;
  recommend(interests: string[]): Promise<Opportunity[]>;
}

const mockProvider: AiProvider = {
  name: "mock",
  async reply(history, input) {
    const turn = history.filter((m) => m.from === "user").length;
    const lower = input.toLowerCase();
    if (turn === 0) {
      const topic = lower.includes("kid") || lower.includes("teach") || lower.includes("student")
        ? "education-focused volunteering"
        : lower.includes("tree") || lower.includes("environment") || lower.includes("clean")
          ? "environment work"
          : "community work";
      return delay({
        text: `That sounds like a great fit for ${topic}. Would you prefer something nearby or remote?`,
        suggestions: ["Nearby, please", "Remote works better", "I'm open to both"],
        done: false,
      }, 700);
    }
    if (turn === 1) {
      return delay({
        text: "Good to know. Roughly how much time can you give in a week, and which days work best?",
        suggestions: ["About 2 hours on weekends", "A few weekday evenings", "Only one-off events"],
        done: false,
      }, 700);
    }
    return delay({
      text: "Thank you — that's enough for me to start. Here are opportunities that fit what you told me.",
      suggestions: [],
      done: true,
    }, 800);
  },
  async extractInterests() {
    return delay(["Education", "Environment", "Community"], 400);
  },
  async recommend() {
    const opps = await opportunityService.list();
    return delay(opps.slice(0, 3), 500);
  },
};

export const aiService: AiProvider = mockProvider;
