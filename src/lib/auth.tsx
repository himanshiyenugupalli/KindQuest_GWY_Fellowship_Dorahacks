import React, { createContext, useContext, useEffect, useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export interface UserProfile {
  id: string;
  role: "volunteer" | "organization";
  full_name: string;
  email: string;
  location?: string;
  avatar_url?: string;
}

export interface VolunteerProfileData {
  id: string;
  volunteer_id: string;
  bio?: string;
  causes: string[];
  skills: string[];
  availability: string[];
  preferred_type: string;
  impact_points: number;
  rank_id: string;
  reliability: { score: number; effort: number; reliability: number; conduct: number };
  contributions: number;
  badge_ids: string[];
  joined_on: string;
}

export interface OrganizationProfileData {
  id: string;
  org_id: string;
  name: string;
  type: string;
  description?: string;
  location?: string;
  verified: boolean;
  contact_email?: string;
  website?: string;
  logo_url?: string;
  total_volunteers: number;
  rating: number;
  active_opportunities: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  volunteerProfile: VolunteerProfileData | null;
  orgProfile: OrganizationProfileData | null;
  loading: boolean;
  role: "volunteer" | "organization" | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  volunteerProfile: null,
  orgProfile: null,
  loading: true,
  role: null,
  refreshProfile: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [volunteerProfile, setVolunteerProfile] = useState<VolunteerProfileData | null>(null);
  const [orgProfile, setOrgProfile] = useState<OrganizationProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data: prof, error: profErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      if (profErr || !prof) return;

      setProfile(prof as UserProfile);

      if (prof.role === "volunteer") {
        const { data: vProf } = await supabase
          .from("volunteer_profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        if (vProf) setVolunteerProfile(vProf as VolunteerProfileData);
      } else if (prof.role === "organization") {
        const { data: oProf } = await supabase
          .from("organization_profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        if (oProf) setOrgProfile(oProf as OrganizationProfileData);
      }
    } catch (err) {
      console.error("Error fetching user profile from Supabase:", err);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        fetchProfile(currentUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
        setVolunteerProfile(null);
        setOrgProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setVolunteerProfile(null);
    setOrgProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        volunteerProfile,
        orgProfile,
        loading,
        role: profile?.role ?? null,
        refreshProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
