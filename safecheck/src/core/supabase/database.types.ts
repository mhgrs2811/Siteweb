/**
 * Types de la base Supabase.
 * Régénérer après chaque migration : `npm run supabase:types` (nécessite `supabase start`).
 * Cette version est maintenue à la main en miroir de `supabase/migrations/*.sql`
 * pour permettre le développement sans instance locale.
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type IdentifierKindDb = 'phone' | 'email' | 'website';
export type ReportCategoryDb =
  | 'phishing'
  | 'fake_bank'
  | 'fake_delivery'
  | 'tech_support'
  | 'romance'
  | 'investment'
  | 'fake_shop'
  | 'impersonation_admin'
  | 'subscription_trap'
  | 'harassment'
  | 'other';
export type ReportStatusDb = 'pending' | 'approved' | 'rejected';
export type ContactChannelDb = 'call' | 'sms' | 'email' | 'website' | 'messaging' | 'other';
export type AlertSeverityDb = 'info' | 'warning' | 'critical';
export type PlanDb = 'free' | 'premium' | 'family' | 'business';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          plan: PlanDb;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          plan?: PlanDb;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          plan?: PlanDb;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      entities: {
        Row: { id: string; kind: IdentifierKindDb; value: string; created_at: string };
        Insert: { id?: string; kind: IdentifierKindDb; value: string; created_at?: string };
        Update: { id?: string; kind?: IdentifierKindDb; value?: string; created_at?: string };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          entity_id: string;
          reporter_id: string | null;
          category: ReportCategoryDb;
          channel: ContactChannelDb | null;
          description: string | null;
          had_financial_loss: boolean | null;
          status: ReportStatusDb;
          moderated_at: string | null;
          moderated_by: string | null;
          moderation_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          reporter_id?: string | null;
          category: ReportCategoryDb;
          channel?: ContactChannelDb | null;
          description?: string | null;
          had_financial_loss?: boolean | null;
          status?: ReportStatusDb;
          moderated_at?: string | null;
          moderated_by?: string | null;
          moderation_note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
        Relationships: [];
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          summary: string;
          body: string;
          severity: AlertSeverityDb;
          region: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          summary: string;
          body: string;
          severity?: AlertSeverityDb;
          region?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['alerts']['Insert']>;
        Relationships: [];
      };
      learn_articles: {
        Row: {
          id: string;
          slug: string;
          title: string;
          summary: string;
          body: string;
          category: string;
          reading_minutes: number;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          summary: string;
          body: string;
          category?: string;
          reading_minutes?: number;
          published_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['learn_articles']['Insert']>;
        Relationships: [];
      };
      feature_flags: {
        Row: { key: string; enabled: boolean; min_plan: PlanDb; updated_at: string };
        Insert: { key: string; enabled?: boolean; min_plan?: PlanDb; updated_at?: string };
        Update: { key?: string; enabled?: boolean; min_plan?: PlanDb; updated_at?: string };
        Relationships: [];
      };
      check_logs: {
        Row: { id: number; requester_hash: string; created_at: string };
        Insert: { id?: never; requester_hash: string; created_at?: string };
        Update: { id?: never; requester_hash?: string; created_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      check_identifier: {
        Args: { p_kind: IdentifierKindDb; p_value: string };
        Returns: Json;
      };
      submit_report: {
        Args: {
          p_kind: IdentifierKindDb;
          p_value: string;
          p_category: ReportCategoryDb;
          p_channel?: ContactChannelDb | null;
          p_description?: string | null;
          p_had_financial_loss?: boolean | null;
        };
        Returns: Database['public']['Tables']['reports']['Row'];
      };
      list_my_reports: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          kind: IdentifierKindDb;
          value: string;
          category: ReportCategoryDb;
          status: ReportStatusDb;
          created_at: string;
        }[];
      };
      delete_my_account: { Args: Record<string, never>; Returns: undefined };
      purge_check_logs: { Args: Record<string, never>; Returns: undefined };
      normalize_identifier: { Args: { p_kind: IdentifierKindDb; p_value: string }; Returns: string };
    };
    Enums: {
      identifier_kind: IdentifierKindDb;
      report_category: ReportCategoryDb;
      report_status: ReportStatusDb;
      contact_channel: ContactChannelDb;
      alert_severity: AlertSeverityDb;
      plan: PlanDb;
    };
    CompositeTypes: Record<string, never>;
  };
}
