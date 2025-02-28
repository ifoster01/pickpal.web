export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          id: number
          message: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          message?: string | null
          name?: string | null
        }
        Relationships: []
      }
      liked_atp_games: {
        Row: {
          game_id: string | null
          id: number
          saved_at: string
          saving_user_id: string | null
        }
        Insert: {
          game_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Update: {
          game_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "liked_atp_games_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "upcoming_atp_odds"
            referencedColumns: ["game_id"]
          },
        ]
      }
      liked_fights: {
        Row: {
          fight_id: string | null
          id: number
          saved_at: string
          saving_user_id: string | null
        }
        Insert: {
          fight_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Update: {
          fight_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Relationships: []
      }
      liked_nba_games: {
        Row: {
          game_id: string | null
          id: number
          saved_at: string
          saving_user_id: string | null
        }
        Insert: {
          game_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Update: {
          game_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Relationships: []
      }
      liked_nfl_games: {
        Row: {
          game_id: string | null
          id: number
          saved_at: string
          saving_user_id: string | null
        }
        Insert: {
          game_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Update: {
          game_id?: string | null
          id?: number
          saved_at?: string
          saving_user_id?: string | null
        }
        Relationships: []
      }
      upcoming_atp_odds: {
        Row: {
          created_at: string
          game_date: string | null
          game_id: string
          game_name: string | null
          odds1: number | null
          odds2: number | null
          opp: string | null
          opp_book_odds: number | null
          opp_name: string | null
          opp_pic_url: string | null
          team: string | null
          team_book_odds: number | null
          team_name: string | null
          team_pic_url: string | null
        }
        Insert: {
          created_at?: string
          game_date?: string | null
          game_id: string
          game_name?: string | null
          odds1?: number | null
          odds2?: number | null
          opp?: string | null
          opp_book_odds?: number | null
          opp_name?: string | null
          opp_pic_url?: string | null
          team?: string | null
          team_book_odds?: number | null
          team_name?: string | null
          team_pic_url?: string | null
        }
        Update: {
          created_at?: string
          game_date?: string | null
          game_id?: string
          game_name?: string | null
          odds1?: number | null
          odds2?: number | null
          opp?: string | null
          opp_book_odds?: number | null
          opp_name?: string | null
          opp_pic_url?: string | null
          team?: string | null
          team_book_odds?: number | null
          team_name?: string | null
          team_pic_url?: string | null
        }
        Relationships: []
      }
      upcoming_fight_odds: {
        Row: {
          created_at: string
          f1_book_odds: number | null
          f1_pic_url: string | null
          f2_book_odds: number | null
          f2_pic_url: string | null
          fight_date: string | null
          fight_id: string
          fight_name: string | null
          fighter1: string | null
          fighter2: string | null
          id: number
          odds1: number | null
          odds2: number | null
        }
        Insert: {
          created_at?: string
          f1_book_odds?: number | null
          f1_pic_url?: string | null
          f2_book_odds?: number | null
          f2_pic_url?: string | null
          fight_date?: string | null
          fight_id: string
          fight_name?: string | null
          fighter1?: string | null
          fighter2?: string | null
          id?: number
          odds1?: number | null
          odds2?: number | null
        }
        Update: {
          created_at?: string
          f1_book_odds?: number | null
          f1_pic_url?: string | null
          f2_book_odds?: number | null
          f2_pic_url?: string | null
          fight_date?: string | null
          fight_id?: string
          fight_name?: string | null
          fighter1?: string | null
          fighter2?: string | null
          id?: number
          odds1?: number | null
          odds2?: number | null
        }
        Relationships: []
      }
      upcoming_nba_odds: {
        Row: {
          created_at: string
          game_date: string | null
          game_id: string
          game_name: string | null
          odds1: number | null
          odds2: number | null
          opp: string | null
          opp_book_odds: number | null
          opp_name: string | null
          opp_pic_png: string | null
          opp_pic_url: string | null
          team: string | null
          team_book_odds: number | null
          team_name: string | null
          team_pic_png: string | null
          team_pic_url: string | null
        }
        Insert: {
          created_at?: string
          game_date?: string | null
          game_id: string
          game_name?: string | null
          odds1?: number | null
          odds2?: number | null
          opp?: string | null
          opp_book_odds?: number | null
          opp_name?: string | null
          opp_pic_png?: string | null
          opp_pic_url?: string | null
          team?: string | null
          team_book_odds?: number | null
          team_name?: string | null
          team_pic_png?: string | null
          team_pic_url?: string | null
        }
        Update: {
          created_at?: string
          game_date?: string | null
          game_id?: string
          game_name?: string | null
          odds1?: number | null
          odds2?: number | null
          opp?: string | null
          opp_book_odds?: number | null
          opp_name?: string | null
          opp_pic_png?: string | null
          opp_pic_url?: string | null
          team?: string | null
          team_book_odds?: number | null
          team_name?: string | null
          team_pic_png?: string | null
          team_pic_url?: string | null
        }
        Relationships: []
      }
      upcoming_nfl_odds: {
        Row: {
          created_at: string
          game_date: string | null
          game_id: string
          game_name: string | null
          odds1: number | null
          odds2: number | null
          opp: string | null
          opp_book_odds: number | null
          opp_name: string | null
          opp_pic_url: string | null
          team: string | null
          team_book_odds: number | null
          team_name: string | null
          team_pic_url: string | null
        }
        Insert: {
          created_at?: string
          game_date?: string | null
          game_id: string
          game_name?: string | null
          odds1?: number | null
          odds2?: number | null
          opp?: string | null
          opp_book_odds?: number | null
          opp_name?: string | null
          opp_pic_url?: string | null
          team?: string | null
          team_book_odds?: number | null
          team_name?: string | null
          team_pic_url?: string | null
        }
        Update: {
          created_at?: string
          game_date?: string | null
          game_id?: string
          game_name?: string | null
          odds1?: number | null
          odds2?: number | null
          opp?: string | null
          opp_book_odds?: number | null
          opp_name?: string | null
          opp_pic_url?: string | null
          team?: string | null
          team_book_odds?: number | null
          team_name?: string | null
          team_pic_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
