import type { Cause } from "@/types";
import { supabase } from "./supabase";

export type ActivityPreference =
  | "Hands-on"
  | "Outdoor"
  | "Community-based"
  | "People-focused"
  | "Remote"
  | "Creative"
  | "Problem-solving"
  | "Quiet independent"
  | "Teaching";

export type DiscoveredSkill =
  | "Care"
  | "Communication"
  | "Creativity"
  | "Design"
  | "Organization"
  | "Planning"
  | "Problem Solving"
  | "Teaching"
  | "Teamwork"
  | "Technology"
  | "Writing";

export type VolunteeringMode = "in-person" | "remote" | "both";

export type ExplorationSessionType = "initial" | "deeper";

export interface InteractionRecord {
  id: string;
  destinationId: string;
  destinationName: string;
  label: string;
  completedAt: string;
  sessionType: ExplorationSessionType;
  discoveries: {
    causes: Cause[];
    activityPreferences: ActivityPreference[];
    skills: DiscoveredSkill[];
    volunteeringMode: VolunteeringMode[];
  };
}

export interface AdventureSession {
  adventureProgress: number;
  visitedDestinations: string[];
  completedInteractions: string[];
  discoveredInterests: Cause[];
  activityPreferences: ActivityPreference[];
  discoveredSkills: DiscoveredSkill[];
  volunteeringMode: VolunteeringMode[];
  availability: string[];
  explorationHistory: InteractionRecord[];
  updatedAt: string | null;
}

const STORAGE_KEY = "kindquest-adventure-session";

export const emptyAdventureSession = (): AdventureSession => ({
  adventureProgress: 0,
  visitedDestinations: [],
  completedInteractions: [],
  discoveredInterests: [],
  activityPreferences: [],
  discoveredSkills: [],
  volunteeringMode: [],
  availability: [],
  explorationHistory: [],
  updatedAt: null,
});

export function uniqueItems<T>(items: readonly T[]) {
  return Array.from(new Set(items));
}

export async function loadAdventureSessionAsync(): Promise<AdventureSession> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from("adventure_sessions")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (data && !error) {
        return {
          adventureProgress: data.adventure_progress || 0,
          visitedDestinations: data.visited_destinations || [],
          completedInteractions: data.completed_interactions || [],
          discoveredInterests: data.discovered_interests || [],
          activityPreferences: data.activity_preferences || [],
          discoveredSkills: data.discovered_skills || [],
          volunteeringMode: data.volunteering_mode || [],
          availability: data.availability || [],
          explorationHistory: data.exploration_history || [],
          updatedAt: data.updated_at || null,
        };
      }
    }
  } catch (err) {
    console.error("Error loading adventure session from Supabase:", err);
  }
  return loadAdventureSession();
}

export function loadAdventureSession(): AdventureSession {
  if (typeof window === "undefined") return emptyAdventureSession();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyAdventureSession();

  try {
    const parsed = JSON.parse(raw) as Partial<AdventureSession>;
    return {
      ...emptyAdventureSession(),
      ...parsed,
      visitedDestinations: Array.isArray(parsed.visitedDestinations) ? parsed.visitedDestinations : [],
      completedInteractions: Array.isArray(parsed.completedInteractions)
        ? parsed.completedInteractions
        : [],
      discoveredInterests: Array.isArray(parsed.discoveredInterests) ? parsed.discoveredInterests : [],
      activityPreferences: Array.isArray(parsed.activityPreferences) ? parsed.activityPreferences : [],
      discoveredSkills: Array.isArray(parsed.discoveredSkills) ? parsed.discoveredSkills : [],
      volunteeringMode: Array.isArray(parsed.volunteeringMode) ? parsed.volunteeringMode : [],
      availability: Array.isArray(parsed.availability) ? parsed.availability : [],
      explorationHistory: Array.isArray(parsed.explorationHistory) ? parsed.explorationHistory : [],
    };
  } catch {
    return emptyAdventureSession();
  }
}

export async function saveAdventureSessionAsync(session: AdventureSession): Promise<void> {
  saveAdventureSession(session);
  try {
    const { data: { session: authSession } } = await supabase.auth.getSession();
    if (authSession?.user) {
      await supabase.from("adventure_sessions").upsert({
        user_id: authSession.user.id,
        adventure_progress: session.adventureProgress,
        visited_destinations: session.visitedDestinations,
        completed_interactions: session.completedInteractions,
        discovered_interests: session.discoveredInterests,
        activity_preferences: session.activityPreferences,
        discovered_skills: session.discoveredSkills,
        volunteering_mode: session.volunteeringMode,
        availability: session.availability,
        exploration_history: session.explorationHistory,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("Error saving adventure session to Supabase:", err);
  }
}

export function saveAdventureSession(session: AdventureSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAdventureSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}