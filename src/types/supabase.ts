export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)';
  };
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string;
          email: string | null;
          id: number;
          message: string | null;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: number;
          message?: string | null;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: number;
          message?: string | null;
          name?: string | null;
        };
        Relationships: [];
      };
      event_moneyline_odds: {
        Row: {
          book_odds1: number | null;
          book_odds2: number | null;
          created_at: string;
          event_date: string | null;
          event_datetime: string | null;
          event_name: string | null;
          event_type: string | null;
          id: string;
          odds1: number | null;
          odds2: number | null;
          result: boolean | null;
          team1: string | null;
          team1_name: string | null;
          team1_pic_png: string | null;
          team1_pic_url: string | null;
          team2: string | null;
          team2_name: string | null;
          team2_pic_png: string | null;
          team2_pic_url: string | null;
          tournament: string | null;
          updated_at: string | null;
        };
        Insert: {
          book_odds1?: number | null;
          book_odds2?: number | null;
          created_at?: string;
          event_date?: string | null;
          event_datetime?: string | null;
          event_name?: string | null;
          event_type?: string | null;
          id?: string;
          odds1?: number | null;
          odds2?: number | null;
          result?: boolean | null;
          team1?: string | null;
          team1_name?: string | null;
          team1_pic_png?: string | null;
          team1_pic_url?: string | null;
          team2?: string | null;
          team2_name?: string | null;
          team2_pic_png?: string | null;
          team2_pic_url?: string | null;
          tournament?: string | null;
          updated_at?: string | null;
        };
        Update: {
          book_odds1?: number | null;
          book_odds2?: number | null;
          created_at?: string;
          event_date?: string | null;
          event_datetime?: string | null;
          event_name?: string | null;
          event_type?: string | null;
          id?: string;
          odds1?: number | null;
          odds2?: number | null;
          result?: boolean | null;
          team1?: string | null;
          team1_name?: string | null;
          team1_pic_png?: string | null;
          team1_pic_url?: string | null;
          team2?: string | null;
          team2_name?: string | null;
          team2_pic_png?: string | null;
          team2_pic_url?: string | null;
          tournament?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      liked_events: {
        Row: {
          created_at: string;
          event_id: string | null;
          event_type: string | null;
          id: number;
          saving_user_id: string | null;
        };
        Insert: {
          created_at?: string;
          event_id?: string | null;
          event_type?: string | null;
          id?: number;
          saving_user_id?: string | null;
        };
        Update: {
          created_at?: string;
          event_id?: string | null;
          event_type?: string | null;
          id?: number;
          saving_user_id?: string | null;
        };
        Relationships: [];
      };
      moneyline_book_odds_data: {
        Row: {
          created_at: string;
          event_id: string | null;
          id: string;
          odds1: number | null;
          odds2: number | null;
        };
        Insert: {
          created_at?: string;
          event_id?: string | null;
          id?: string;
          odds1?: number | null;
          odds2?: number | null;
        };
        Update: {
          created_at?: string;
          event_id?: string | null;
          id?: string;
          odds1?: number | null;
          odds2?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'odds_data_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_moneyline_odds';
            referencedColumns: ['id'];
          },
        ];
      };
      parlay_leg: {
        Row: {
          created_at: string;
          event_id: string;
          parlay_id: string;
        };
        Insert: {
          created_at?: string;
          event_id: string;
          parlay_id?: string;
        };
        Update: {
          created_at?: string;
          event_id?: string;
          parlay_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'parlay_leg_event_id_fkey';
            columns: ['event_id'];
            isOneToOne: false;
            referencedRelation: 'event_moneyline_odds';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'parlay_leg_parlay_id_fkey';
            columns: ['parlay_id'];
            isOneToOne: false;
            referencedRelation: 'user_parlays';
            referencedColumns: ['id'];
          },
        ];
      };
      user_parlays: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      append_number_to_array: {
        Args: { element_to_append: number; row_id: string };
        Returns: undefined;
      };
      delete_user: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      get_atp_tournaments: {
        Args: Record<PropertyKey, never>;
        Returns: {
          tournament_name: string;
        }[];
      };
      get_tournament_event_date_ranges: {
        Args: { p_tournament_name: string };
        Returns: {
          earliest_event_datetime: string;
          event_year: number;
          latest_event_datetime: string;
        }[];
      };
      get_tournaments_with_dates: {
        Args: { p_event_type: string };
        Returns: {
          tournament_end_date: string;
          tournament_name: string;
          tournament_start_date: string;
        }[];
      };
      get_ufc_tournaments: {
        Args: Record<PropertyKey, never>;
        Returns: {
          tournament_name: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
