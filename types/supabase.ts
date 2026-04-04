export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          opportunity_id: string | null
          company_id: string | null
          status: string | null
          submitted_at: string | null
          ref: string | null
          step: number | null
        }
        Insert: {
          id?: string
          opportunity_id?: string | null
          company_id?: string | null
          status?: string | null
          submitted_at?: string | null
          ref?: string | null
          step?: number | null
        }
        Update: {
          id?: string
          opportunity_id?: string | null
          company_id?: string | null
          status?: string | null
          submitted_at?: string | null
          ref?: string | null
          step?: number | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          entity_id: string | null
          timestamp: string | null
          status: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          entity_id?: string | null
          timestamp?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          entity_id?: string | null
          timestamp?: string | null
          status?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          tax_id: string | null
          ruge_id: string | null
          type: string | null
          sector: string[] | null
          status: string | null
          compliance_score: number | null
          address: string | null
          email: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          tax_id?: string | null
          ruge_id?: string | null
          type?: string | null
          sector?: string[] | null
          status?: string | null
          compliance_score?: number | null
          address?: string | null
          email?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          tax_id?: string | null
          ruge_id?: string | null
          type?: string | null
          sector?: string[] | null
          status?: string | null
          compliance_score?: number | null
          address?: string | null
          email?: string | null
          created_at?: string | null
        }
      }
      contract_milestones: {
        Row: {
          id: string
          contract_id: string | null
          description: string
          deadline: string
          status: string | null
        }
        Insert: {
          id?: string
          contract_id?: string | null
          description: string
          deadline: string
          status?: string | null
        }
        Update: {
          id?: string
          contract_id?: string | null
          description?: string
          deadline?: string
          status?: string | null
        }
      }
      contracts: {
        Row: {
          id: string
          ref: string
          title: string
          awarded_to: string
          company_id: string | null
          status: string | null
          value: number | null
          start_date: string | null
          end_date: string | null
          progress: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          ref: string
          title: string
          awarded_to: string
          company_id?: string | null
          status?: string | null
          value?: number | null
          start_date?: string | null
          end_date?: string | null
          progress?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          ref?: string
          title?: string
          awarded_to?: string
          company_id?: string | null
          status?: string | null
          value?: number | null
          start_date?: string | null
          end_date?: string | null
          progress?: number | null
          created_at?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          participant_name: string
          participant_role: string | null
          avatar: string | null
          last_message: string | null
          timestamp: string | null
          unread_count: number | null
        }
        Insert: {
          id?: string
          participant_name: string
          participant_role?: string | null
          avatar?: string | null
          last_message?: string | null
          timestamp?: string | null
          unread_count?: number | null
        }
        Update: {
          id?: string
          participant_name?: string
          participant_role?: string | null
          avatar?: string | null
          last_message?: string | null
          timestamp?: string | null
          unread_count?: number | null
        }
      }
      documents: {
        Row: {
          id: string
          entity_id: string
          entity_type: string
          name: string
          category: string
          status: string | null
          url: string
          size: string | null
          format: string | null
          expiry_date: string | null
          feedback: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          entity_id: string
          entity_type: string
          name: string
          category: string
          status?: string | null
          url: string
          size?: string | null
          format?: string | null
          expiry_date?: string | null
          feedback?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          entity_id?: string
          entity_type?: string
          name?: string
          category?: string
          status?: string | null
          url?: string
          size?: string | null
          format?: string | null
          expiry_date?: string | null
          feedback?: string | null
          created_at?: string | null
        }
      }
      help_requests: {
        Row: {
          id: string
          company_id: string | null
          type: string
          urgency: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          type: string
          urgency?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          type?: string
          urgency?: string | null
          status?: string | null
          created_at?: string | null
        }
      }
      job_offers: {
        Row: {
          id: string
          title: Json
          company_id: string | null
          location: string | null
          tags: string[] | null
          posted_at: string | null
          description: Json | null
          category: string | null
        }
        Insert: {
          id?: string
          title: Json
          company_id?: string | null
          location?: string | null
          tags?: string[] | null
          posted_at?: string | null
          description?: Json | null
          category?: string | null
        }
        Update: {
          id?: string
          title?: Json
          company_id?: string | null
          location?: string | null
          tags?: string[] | null
          posted_at?: string | null
          description?: Json | null
          category?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string | null
          text: string
          timestamp: string | null
          is_read: boolean | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          text: string
          timestamp?: string | null
          is_read?: boolean | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          text?: string
          timestamp?: string | null
          is_read?: boolean | null
        }
      }
      news_articles: {
        Row: {
          id: string
          title: Json
          summary: Json | null
          content: Json | null
          category: string | null
          status: string | null
          author: string | null
          publish_date: string | null
          featured_image: string | null
        }
        Insert: {
          id?: string
          title: Json
          summary?: Json | null
          content?: Json | null
          category?: string | null
          status?: string | null
          author?: string | null
          publish_date?: string | null
          featured_image?: string | null
        }
        Update: {
          id?: string
          title?: Json
          summary?: Json | null
          content?: Json | null
          category?: string | null
          status?: string | null
          author?: string | null
          publish_date?: string | null
          featured_image?: string | null
        }
      }
      opportunities: {
        Row: {
          id: string
          title: Json
          description: Json | null
          category: string | null
          budget: number | null
          deadline: string | null
          status: string | null
          petrolera_id: string | null
          location: string | null
          requirements: string[] | null
          ref: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: Json
          description?: Json | null
          category?: string | null
          budget?: number | null
          deadline?: string | null
          status?: string | null
          petrolera_id?: string | null
          location?: string | null
          requirements?: string[] | null
          ref?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: Json
          description?: Json | null
          category?: string | null
          budget?: number | null
          deadline?: string | null
          status?: string | null
          petrolera_id?: string | null
          location?: string | null
          requirements?: string[] | null
          ref?: string | null
          created_at?: string | null
        }
      }
      social_projects: {
        Row: {
          id: string
          title: Json
          description: Json | null
          impact: string | null
          location: string | null
          image: string | null
          petrolera_id: string | null
          status: string | null
          budget: number | null
          progress: number | null
          end_date: string | null
          investor: string | null
        }
        Insert: {
          id?: string
          title: Json
          description?: Json | null
          impact?: string | null
          location?: string | null
          image?: string | null
          petrolera_id?: string | null
          status?: string | null
          budget?: number | null
          progress?: number | null
          end_date?: string | null
          investor?: string | null
        }
        Update: {
          id?: string
          title?: Json
          description?: Json | null
          impact?: string | null
          location?: string | null
          image?: string | null
          petrolera_id?: string | null
          status?: string | null
          budget?: number | null
          progress?: number | null
          end_date?: string | null
          investor?: string | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: string
          status?: string | null
          created_at?: string | null
        }
      }
      web_categories: {
        Row: {
          id: string
          name: Json
          description: Json | null
          icon: string | null
          status: string | null
        }
        Insert: {
          id?: string
          name: Json
          description?: Json | null
          icon?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          name?: Json
          description?: Json | null
          icon?: string | null
          status?: string | null
        }
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
