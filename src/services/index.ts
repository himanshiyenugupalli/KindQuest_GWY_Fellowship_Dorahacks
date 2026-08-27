/**
 * KindQuest service layer.
 *
 * These are MOCK implementations backed by local data in `src/data`.
 * No backend is connected. Every function is async so that swapping the
 * body for a real API/database call later requires no component changes.
 */
import { activeOpportunities, opportunities, opportunityById } from "@/data/opportunities";
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
    const { data, error } = await supabase.from("opportunities").select("*").eq("status", "active");
    if (error) {
      console.error("Error fetching active opportunities:", error);
      throw error;
    }
    if (data && data.length > 0) {
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
    return activeOpportunities;
  },
  listAll: async () => {
    const { data, error } = await supabase.from("opportunities").select("*");
    if (error) {
      console.error("Error fetching all opportunities:", error);
      throw error;
    }
    if (data && data.length > 0) {
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
    return opportunities;
  },
  get: async (id: string) => {
    const { data, error } = await supabase.from("opportunities").select("*").eq("id", id).single();
    if (error) {
      console.error(`Error fetching opportunity ${id}:`, error);
      const staticMatch = opportunityById(id);
      if (staticMatch) return staticMatch;
      throw error;
    }
    return {
      ...data,
      organizationId: data.organization_id,
      organizationName: data.organization_name,
      spotsLeft: data.spots_left,
      spotsTotal: data.spots_total,
      impactPoints: data.impact_points,
      matchScore: 90,
    };
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
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return [];
    const { data, error } = await supabase
      .from("saved_opportunities")
      .select("opportunity_id")
      .eq("user_id", session.user.id);
    if (error) {
      console.error("Error fetching saved opportunities:", error);
      throw error;
    }
    const ids = data ? data.map((d: any) => d.opportunity_id) : [];
    const all = await opportunityService.listAll();
    return all.filter((o) => ids.includes(o.id));
  },
};

export const volunteerService = {
  profile: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;
    const { data: prof, error: profErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (profErr) {
      console.error("Error fetching profile:", profErr);
      throw profErr;
    }

    const { data: vProf } = await supabase
      .from("volunteer_profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    return {
      id: prof.id,
      volunteerId: vProf?.volunteer_id || "KQ-00000",
      name: prof.full_name,
      email: prof.email,
      bio: vProf?.bio || "",
      location: prof.location || "Hyderabad, India",
      avatarInitials: prof.full_name.slice(0, 2).toUpperCase(),
      causes: vProf?.causes || [],
      skills: vProf?.skills || [],
      availability: vProf?.availability || [],
      preferredType: (vProf?.preferred_type || "Both") as "In-person" | "Remote" | "Both",
      impactPoints: vProf?.impact_points || 0,
      rankId: vProf?.rank_id || "r1",
      reliability: vProf?.reliability || {
        score: 100,
        effort: 100,
        reliability: 100,
        conduct: 100,
      },
      contributions: vProf?.contributions || 0,
      badgeIds: vProf?.badge_ids || [],
      joinedOn: vProf?.joined_on || "Aug 2026",
    };
  },
  applications: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return [];
    const { data, error } = await supabase
      .from("opportunity_applications")
      .select("*")
      .eq("volunteer_id", session.user.id);
    if (error) {
      console.error("Error fetching user applications:", error);
      throw error;
    }
    return (data || []).map((a: any) => ({
      id: a.id,
      opportunityId: a.opportunity_id,
      volunteerId: session.user.id,
      status: a.status,
      appliedOn: a.applied_on,
      completedOn: a.completed_on,
      pointsAwarded: a.points_awarded,
    }));
  },
  impactHistory: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return [];
    const { data, error } = await supabase
      .from("opportunity_applications")
      .select("*, opportunities(*)")
      .eq("volunteer_id", session.user.id)
      .eq("status", "Verified");
    if (error) {
      console.error("Error fetching impact history:", error);
      throw error;
    }
    return (data || []).map((a: any) => ({
      id: a.id,
      date: a.completed_on || a.applied_on,
      opportunityTitle: a.opportunities?.title || "Volunteering Action",
      organizationName: a.opportunities?.organization_name || "Partner Organization",
      cause: a.opportunities?.cause || "Community",
      points: a.points_awarded || 50,
      status: "Verified" as const,
    }));
  },
  badges: async () => {
    const { data, error } = await supabase.from("badges").select("*");
    if (error) {
      console.error("Error fetching badges:", error);
      throw error;
    }
    if (data && data.length > 0) {
      return data.map((b: any) => ({ ...b, earned: true }));
    }
    return badges;
  },
  ranks: () => ranks,
  rank: (points: number) => rankFor(points),
  nextRank: (points: number) => nextRankFor(points),
  notifications: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return [];
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id);
    if (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
    return data || [];
  },
};

export const organizationService = {
  list: async () => {
    const { data, error } = await supabase.from("organization_profiles").select("*");
    if (error) {
      console.error("Error fetching organizations:", error);
      throw error;
    }
    if (data && data.length > 0) {
      return data;
    }
    return organizations;
  },
  get: async (id: string) => organizationById(id),
  opportunities: async (orgId: string) => {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("organization_id", orgId);
    if (error) {
      console.error("Error fetching org opportunities:", error);
      throw error;
    }
    if (data && data.length > 0) {
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
    return opportunities.filter((o) => o.organizationId === orgId);
  },
  professionals: async () => {
    const { data, error } = await supabase.from("professionals").select("*");
    if (error) {
      console.error("Error fetching professionals:", error);
      return professionals;
    }
    return data && data.length > 0 ? data : professionals;
  },
};

export const certificateService = {
  list: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return [];
    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .eq("recipient_id", session.user.id);
    if (error) {
      console.error("Error fetching certificates:", error);
      throw error;
    }
    return data || [];
  },
  get: async (id: string) => certificates.find((c) => c.id === id),
};

export const impactService = {
  history: () => volunteerService.impactHistory(),
  total: async () => {
    const prof = await volunteerService.profile();
    return prof?.impactPoints || 0;
  },
};

export const ratingService = {
  received: async () => ratings,
  recommendations: async () => recommendations,
  submit: async (payload: unknown) => {
    const { data, error } = await supabase.from("organization_ratings").insert([payload as any]);
    if (error) {
      console.error("Error submitting rating:", error);
      throw error;
    }
    return { ok: true, data };
  },
};

export const chainService = {
  list: async () => {
    const { data, error } = await supabase.from("chain_of_kindness").select("*");
    if (error) {
      console.error("Error fetching chain of kindness:", error);
      throw error;
    }
    return data && data.length > 0 ? data : chains;
  },
  nominate: async (payload: unknown) => {
    const { data, error } = await supabase.from("chain_of_kindness").insert([payload as any]);
    if (error) {
      console.error("Error submitting chain nomination:", error);
      throw error;
    }
    return { ok: true, data };
  },
};

export const paymentService = {
  records: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return [];
    const { data, error } = await supabase
      .from("payment_records")
      .select("*")
      .or(`volunteer_id.eq.${session.user.id},organization_id.eq.${session.user.id}`);
    if (error) {
      console.error("Error fetching payment records:", error);
      throw error;
    }
    return data || [];
  },
};

/**
 * AI abstraction. The provider is intentionally not fixed — a real
 * implementation (Gemini / NVIDIA / Ollama / other) would replace the mock
 * responder behind this same interface. No keys live in the frontend.
 */
export interface AiProvider {
  name: string;
  reply(
    history: ChatMessage[],
    input: string,
  ): Promise<{ text: string; suggestions: string[]; done: boolean }>;
  extractInterests(history: ChatMessage[]): Promise<string[]>;
  recommend(interests: string[]): Promise<Opportunity[]>;
}

const mockProvider: AiProvider = {
  name: "mock",
  async reply(history, input) {
    const turn = history.filter((m) => m.from === "user").length;
    const lower = input.toLowerCase();
    if (turn === 0) {
      const topic =
        lower.includes("kid") || lower.includes("teach") || lower.includes("student")
          ? "education-focused volunteering"
          : lower.includes("tree") || lower.includes("environment") || lower.includes("clean")
            ? "environment work"
            : "community work";
      return delay(
        {
          text: `That sounds like a great fit for ${topic}. Would you prefer something nearby or remote?`,
          suggestions: ["Nearby, please", "Remote works better", "I'm open to both"],
          done: false,
        },
        700,
      );
    }
    if (turn === 1) {
      return delay(
        {
          text: "Good to know. Roughly how much time can you give in a week, and which days work best?",
          suggestions: [
            "About 2 hours on weekends",
            "A few weekday evenings",
            "Only one-off events",
          ],
          done: false,
        },
        700,
      );
    }
    return delay(
      {
        text: "Thank you — that's enough for me to start. Here are opportunities that fit what you told me.",
        suggestions: [],
        done: true,
      },
      800,
    );
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
