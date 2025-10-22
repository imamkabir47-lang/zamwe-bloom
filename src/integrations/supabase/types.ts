export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string
          created_at: string
          description: string
          icon: string | null
          id: string
          name: string
          points: number
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          icon?: string | null
          id?: string
          name: string
          points?: number
          requirement_type: string
          requirement_value: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          icon?: string | null
          id?: string
          name?: string
          points?: number
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_type: string
          created_at: string
          description: string | null
          end_time: string
          id: string
          meeting_link: string | null
          mentor_id: string
          notes: string | null
          start_time: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_type: string
          created_at?: string
          description?: string | null
          end_time: string
          id?: string
          meeting_link?: string | null
          mentor_id: string
          notes?: string | null
          start_time: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_type?: string
          created_at?: string
          description?: string | null
          end_time?: string
          id?: string
          meeting_link?: string | null
          mentor_id?: string
          notes?: string | null
          start_time?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          phone: string | null
          read_at: string | null
          submitted_at: string
        }
        Insert: {
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          phone?: string | null
          read_at?: string | null
          submitted_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          phone?: string | null
          read_at?: string | null
          submitted_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string
          created_at: string
          description: string
          duration_hours: number | null
          enrollments_count: number | null
          id: string
          instructor_id: string
          is_published: boolean | null
          level: string
          price: number | null
          rating: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          duration_hours?: number | null
          enrollments_count?: number | null
          id?: string
          instructor_id: string
          is_published?: boolean | null
          level: string
          price?: number | null
          rating?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration_hours?: number | null
          enrollments_count?: number | null
          id?: string
          instructor_id?: string
          is_published?: boolean | null
          level?: string
          price?: number | null
          rating?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      enrollments: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          progress: number | null
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string
          email: string
          event_id: string
          full_name: string
          id: string
          phone_number: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          full_name: string
          id?: string
          phone_number?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          event_date: string
          id: string
          image_url: string | null
          location: string
          max_attendees: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          event_date: string
          id?: string
          image_url?: string | null
          location: string
          max_attendees?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          event_date?: string
          id?: string
          image_url?: string | null
          location?: string
          max_attendees?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      forum_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          likes_count: number | null
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "forum_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "forum_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string
          category: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          likes_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          likes_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      join_applications: {
        Row: {
          business_name: string
          business_type: string
          contact_address: string
          email: string | null
          full_name: string
          id: string
          membership_plan: Database["public"]["Enums"]["membership_plan"]
          next_of_kin: string
          payment_evidence_url: string | null
          phone_number: string
          photo_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          why_join: string
        }
        Insert: {
          business_name: string
          business_type: string
          contact_address: string
          email?: string | null
          full_name: string
          id?: string
          membership_plan: Database["public"]["Enums"]["membership_plan"]
          next_of_kin: string
          payment_evidence_url?: string | null
          phone_number: string
          photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          why_join: string
        }
        Update: {
          business_name?: string
          business_type?: string
          contact_address?: string
          email?: string | null
          full_name?: string
          id?: string
          membership_plan?: Database["public"]["Enums"]["membership_plan"]
          next_of_kin?: string
          payment_evidence_url?: string | null
          phone_number?: string
          photo_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          why_join?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          content: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          order_number: number
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_number: number
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_number?: number
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          subscribed_at: string
        }
        Insert: {
          email: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          subscribed_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string
          currency: string | null
          id: string
          payment_id: string | null
          product_id: string
          quantity: number
          seller_id: string
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          currency?: string | null
          id?: string
          payment_id?: string | null
          product_id: string
          quantity?: number
          seller_id: string
          shipping_address?: Json | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          payment_id?: string | null
          product_id?: string
          quantity?: number
          seller_id?: string
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          payment_method: string
          payment_type: string
          reference_id: string | null
          status: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method: string
          payment_type: string
          reference_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          payment_method?: string
          payment_type?: string
          reference_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      points_history: {
        Row: {
          created_at: string
          id: string
          points: number
          reason: string
          reference_id: string | null
          reference_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points: number
          reason: string
          reference_id?: string | null
          reference_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          reason?: string
          reference_id?: string | null
          reference_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "points_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          currency: string | null
          description: string
          id: string
          images: Json | null
          is_active: boolean | null
          price: number
          seller_id: string
          stock_quantity: number | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          category: string
          created_at?: string
          currency?: string | null
          description: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          price: number
          seller_id: string
          stock_quantity?: number | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          currency?: string | null
          description?: string
          id?: string
          images?: Json | null
          is_active?: boolean | null
          price?: number
          seller_id?: string
          stock_quantity?: number | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          business_name: string | null
          business_type: string | null
          contact_address: string | null
          created_at: string
          full_name: string
          id: string
          next_of_kin: string | null
          phone_number: string | null
          photo_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name?: string | null
          business_type?: string | null
          contact_address?: string | null
          created_at?: string
          full_name: string
          id?: string
          next_of_kin?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string | null
          business_type?: string | null
          contact_address?: string | null
          created_at?: string
          full_name?: string
          id?: string
          next_of_kin?: string | null
          phone_number?: string | null
          photo_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          answers: Json
          attempted_at: string
          id: string
          passed: boolean
          quiz_id: string
          score: number
          user_id: string
        }
        Insert: {
          answers: Json
          attempted_at?: string
          id?: string
          passed: boolean
          quiz_id: string
          score: number
          user_id: string
        }
        Update: {
          answers?: Json
          attempted_at?: string
          id?: string
          passed?: boolean
          quiz_id?: string
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          options: Json
          order_number: number
          question: string
          quiz_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          options: Json
          order_number: number
          question: string
          quiz_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          options?: Json
          order_number?: number
          question?: string
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          passing_score: number | null
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          passing_score?: number | null
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          passing_score?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          file_url: string
          id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url: string
          id?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          file_url?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      testimonials: {
        Row: {
          business_name: string
          content: string
          created_at: string
          id: string
          is_featured: boolean
          member_name: string
          photo_url: string | null
        }
        Insert: {
          business_name: string
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean
          member_name: string
          photo_url?: string | null
        }
        Update: {
          business_name?: string
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          member_name?: string
          photo_url?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          key: string
          language: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          language: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          language?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_points: {
        Row: {
          level: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          level?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          level?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          duration: number | null
          id: string
          is_featured: boolean | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
          views: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
          views?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          is_featured?: boolean | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      application_status: "pending" | "approved" | "rejected"
      membership_plan: "starter" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      application_status: ["pending", "approved", "rejected"],
      membership_plan: ["starter", "pro"],
    },
  },
} as const
