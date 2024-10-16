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
      liked_props: {
        Row: {
          americanOdds: number | null
          category: string | null
          created_at: string
          eventDate: string | null
          eventId: number | null
          eventName: string | null
          id: string
          label: string | null
          leagueId: number | null
          leagueName: string | null
          line: string | null
          propLabel: string | null
          providerOutcomeId: string | null
          userId: string | null
        }
        Insert: {
          americanOdds?: number | null
          category?: string | null
          created_at?: string
          eventDate?: string | null
          eventId?: number | null
          eventName?: string | null
          id?: string
          label?: string | null
          leagueId?: number | null
          leagueName?: string | null
          line?: string | null
          propLabel?: string | null
          providerOutcomeId?: string | null
          userId?: string | null
        }
        Update: {
          americanOdds?: number | null
          category?: string | null
          created_at?: string
          eventDate?: string | null
          eventId?: number | null
          eventName?: string | null
          id?: string
          label?: string | null
          leagueId?: number | null
          leagueName?: string | null
          line?: string | null
          propLabel?: string | null
          providerOutcomeId?: string | null
          userId?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
