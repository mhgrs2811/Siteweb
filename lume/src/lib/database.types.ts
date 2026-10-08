/**
 * Database types for the Supabase client.
 *
 * Written by hand from the migrations in `supabase/migrations/` and kept in the generated
 * format so `supabase gen types typescript` can replace this file once the project is linked.
 * The mapping tests in src/features/profile guard the shape against the onboarding model.
 *
 * Rows are declared as type aliases, not interfaces: the client's generic schema requires an
 * implicit index signature, which interfaces do not carry.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileRow = {
  id: string;
  first_name: string;
  age_band: string;
  locale: string;
  photo_consent_at: string | null;
  photo_consent_version: string | null;
  keep_photos: boolean;
  notifications_opt_in: boolean;
  onboarding_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileInsert = {
  id: string;
  first_name: string;
  age_band: string;
  locale?: string;
  photo_consent_at?: string | null;
  photo_consent_version?: string | null;
  keep_photos?: boolean;
  notifications_opt_in?: boolean;
  onboarding_completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<ProfileInsert>;

export type SkinProfileRow = {
  user_id: string;
  skin_type: string;
  goals: string[];
  sensitivities: string[];
  routine_level: string;
  monthly_budget: string | null;
  lifestyle: Json;
  updated_at: string;
};

export type SkinProfileInsert = {
  user_id: string;
  skin_type: string;
  goals?: string[];
  sensitivities?: string[];
  routine_level: string;
  monthly_budget?: string | null;
  lifestyle?: Json;
  updated_at?: string;
};

export type SkinProfileUpdate = Partial<SkinProfileInsert>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      skin_profiles: {
        Row: SkinProfileRow;
        Insert: SkinProfileInsert;
        Update: SkinProfileUpdate;
        Relationships: [
          {
            foreignKeyName: 'skin_profiles_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
