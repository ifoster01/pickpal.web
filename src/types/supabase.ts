export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
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
          team1: string | null;
          team1_name: string | null;
          team1_pic_png: string | null;
          team1_pic_url: string | null;
          team2: string | null;
          team2_name: string | null;
          team2_pic_png: string | null;
          team2_pic_url: string | null;
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
          team1?: string | null;
          team1_name?: string | null;
          team1_pic_png?: string | null;
          team1_pic_url?: string | null;
          team2?: string | null;
          team2_name?: string | null;
          team2_pic_png?: string | null;
          team2_pic_url?: string | null;
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
          team1?: string | null;
          team1_name?: string | null;
          team1_pic_png?: string | null;
          team1_pic_url?: string | null;
          team2?: string | null;
          team2_name?: string | null;
          team2_pic_png?: string | null;
          team2_pic_url?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      liked_atp_games: {
        Row: {
          game_id: string | null;
          id: number;
          saved_at: string;
          saving_user_id: string | null;
        };
        Insert: {
          game_id?: string | null;
          id?: number;
          saved_at?: string;
          saving_user_id?: string | null;
        };
        Update: {
          game_id?: string | null;
          id?: number;
          saved_at?: string;
          saving_user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'liked_atp_games_game_id_fkey';
            columns: ['game_id'];
            isOneToOne: false;
            referencedRelation: 'upcoming_atp_odds';
            referencedColumns: ['game_id'];
          },
        ];
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
      liked_fights: {
        Row: {
          fight_id: string | null;
          id: number;
          saved_at: string;
          saving_user_id: string | null;
        };
        Insert: {
          fight_id?: string | null;
          id?: number;
          saved_at?: string;
          saving_user_id?: string | null;
        };
        Update: {
          fight_id?: string | null;
          id?: number;
          saved_at?: string;
          saving_user_id?: string | null;
        };
        Relationships: [];
      };
      liked_nba_games: {
        Row: {
          game_id: string | null;
          id: number;
          saved_at: string;
          saving_user_id: string | null;
        };
        Insert: {
          game_id?: string | null;
          id?: number;
          saved_at?: string;
          saving_user_id?: string | null;
        };
        Update: {
          game_id?: string | null;
          id?: number;
          saved_at?: string;
          saving_user_id?: string | null;
        };
        Relationships: [];
      };
      liked_nfl_games: {
        Row: {
          game_id: string | null;
          id: number;
          saved_at: string;
          saving_user_id: string | null;
        };
        Insert: {
          game_id?: string | null;
          id?: number;
          saved_at?: string;
          saving_user_id?: string | null;
        };
        Update: {
          game_id?: string | null;
          id?: number;
          saved_at?: string;
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
      upcoming_atp_odds: {
        Row: {
          created_at: string;
          game_date: string | null;
          game_datetime: string | null;
          game_id: string;
          game_name: string | null;
          odds1: number | null;
          odds2: number | null;
          opp: string | null;
          opp_book_odds: number | null;
          opp_name: string | null;
          opp_pic_url: string | null;
          team: string | null;
          team_book_odds: number | null;
          team_name: string | null;
          team_pic_url: string | null;
        };
        Insert: {
          created_at?: string;
          game_date?: string | null;
          game_datetime?: string | null;
          game_id: string;
          game_name?: string | null;
          odds1?: number | null;
          odds2?: number | null;
          opp?: string | null;
          opp_book_odds?: number | null;
          opp_name?: string | null;
          opp_pic_url?: string | null;
          team?: string | null;
          team_book_odds?: number | null;
          team_name?: string | null;
          team_pic_url?: string | null;
        };
        Update: {
          created_at?: string;
          game_date?: string | null;
          game_datetime?: string | null;
          game_id?: string;
          game_name?: string | null;
          odds1?: number | null;
          odds2?: number | null;
          opp?: string | null;
          opp_book_odds?: number | null;
          opp_name?: string | null;
          opp_pic_url?: string | null;
          team?: string | null;
          team_book_odds?: number | null;
          team_name?: string | null;
          team_pic_url?: string | null;
        };
        Relationships: [];
      };
      upcoming_fight_odds: {
        Row: {
          created_at: string;
          f1_book_odds: number | null;
          f1_pic_url: string | null;
          f2_book_odds: number | null;
          f2_pic_url: string | null;
          fight_date: string | null;
          fight_id: string;
          fight_name: string | null;
          fighter1: string | null;
          fighter2: string | null;
          id: number;
          odds1: number | null;
          odds2: number | null;
        };
        Insert: {
          created_at?: string;
          f1_book_odds?: number | null;
          f1_pic_url?: string | null;
          f2_book_odds?: number | null;
          f2_pic_url?: string | null;
          fight_date?: string | null;
          fight_id: string;
          fight_name?: string | null;
          fighter1?: string | null;
          fighter2?: string | null;
          id?: number;
          odds1?: number | null;
          odds2?: number | null;
        };
        Update: {
          created_at?: string;
          f1_book_odds?: number | null;
          f1_pic_url?: string | null;
          f2_book_odds?: number | null;
          f2_pic_url?: string | null;
          fight_date?: string | null;
          fight_id?: string;
          fight_name?: string | null;
          fighter1?: string | null;
          fighter2?: string | null;
          id?: number;
          odds1?: number | null;
          odds2?: number | null;
        };
        Relationships: [];
      };
      upcoming_nba_odds: {
        Row: {
          created_at: string;
          game_date: string | null;
          game_id: string;
          game_name: string | null;
          odds1: number | null;
          odds2: number | null;
          opp: string | null;
          opp_book_odds: number | null;
          opp_name: string | null;
          opp_pic_png: string | null;
          opp_pic_url: string | null;
          team: string | null;
          team_book_odds: number | null;
          team_name: string | null;
          team_pic_png: string | null;
          team_pic_url: string | null;
        };
        Insert: {
          created_at?: string;
          game_date?: string | null;
          game_id: string;
          game_name?: string | null;
          odds1?: number | null;
          odds2?: number | null;
          opp?: string | null;
          opp_book_odds?: number | null;
          opp_name?: string | null;
          opp_pic_png?: string | null;
          opp_pic_url?: string | null;
          team?: string | null;
          team_book_odds?: number | null;
          team_name?: string | null;
          team_pic_png?: string | null;
          team_pic_url?: string | null;
        };
        Update: {
          created_at?: string;
          game_date?: string | null;
          game_id?: string;
          game_name?: string | null;
          odds1?: number | null;
          odds2?: number | null;
          opp?: string | null;
          opp_book_odds?: number | null;
          opp_name?: string | null;
          opp_pic_png?: string | null;
          opp_pic_url?: string | null;
          team?: string | null;
          team_book_odds?: number | null;
          team_name?: string | null;
          team_pic_png?: string | null;
          team_pic_url?: string | null;
        };
        Relationships: [];
      };
      upcoming_nfl_odds: {
        Row: {
          created_at: string;
          game_date: string | null;
          game_id: string;
          game_name: string | null;
          odds1: number | null;
          odds2: number | null;
          opp: string | null;
          opp_book_odds: number | null;
          opp_name: string | null;
          opp_pic_url: string | null;
          team: string | null;
          team_book_odds: number | null;
          team_name: string | null;
          team_pic_url: string | null;
        };
        Insert: {
          created_at?: string;
          game_date?: string | null;
          game_id: string;
          game_name?: string | null;
          odds1?: number | null;
          odds2?: number | null;
          opp?: string | null;
          opp_book_odds?: number | null;
          opp_name?: string | null;
          opp_pic_url?: string | null;
          team?: string | null;
          team_book_odds?: number | null;
          team_name?: string | null;
          team_pic_url?: string | null;
        };
        Update: {
          created_at?: string;
          game_date?: string | null;
          game_id?: string;
          game_name?: string | null;
          odds1?: number | null;
          odds2?: number | null;
          opp?: string | null;
          opp_book_odds?: number | null;
          opp_name?: string | null;
          opp_pic_url?: string | null;
          team?: string | null;
          team_book_odds?: number | null;
          team_name?: string | null;
          team_pic_url?: string | null;
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
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
