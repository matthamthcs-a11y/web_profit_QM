export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TimestampColumns = {
  created_at: string;
  updated_at: string;
};

type OptionalTimestampColumns = {
  created_at?: string;
  updated_at?: string;
};

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          id: string;
          role: "admin" | "editor" | string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          id: string;
          role?: "admin" | "editor" | string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          id?: string;
          role?: "admin" | "editor" | string;
        };
        Relationships: [];
      };
      brands: {
        Row: TimestampColumns & {
          description: Json | null;
          id: string;
          is_active: boolean;
          logo_path: string | null;
          name: string;
          origin: string | null;
          slug: string;
          sort_order: number;
        };
        Insert: OptionalTimestampColumns & {
          description?: Json | null;
          id?: string;
          is_active?: boolean;
          logo_path?: string | null;
          name: string;
          origin?: string | null;
          slug: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: TimestampColumns & {
          description: Json | null;
          id: string;
          is_active: boolean;
          is_featured: boolean;
          name: Json;
          slug: string;
          sort_order: number;
        };
        Insert: OptionalTimestampColumns & {
          description?: Json | null;
          id?: string;
          is_active?: boolean;
          is_featured?: boolean;
          name: Json;
          slug: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      contact_leads: {
        Row: TimestampColumns & {
          email: string | null;
          id: string;
          message: string | null;
          name: string | null;
          phone: string;
          product_id: string | null;
          source: string;
          status: "new" | "contacted" | "closed" | "spam" | string;
        };
        Insert: OptionalTimestampColumns & {
          email?: string | null;
          id?: string;
          message?: string | null;
          name?: string | null;
          phone: string;
          product_id?: string | null;
          source?: string;
          status?: "new" | "contacted" | "closed" | "spam" | string;
        };
        Update: Partial<Database["public"]["Tables"]["contact_leads"]["Insert"]>;
        Relationships: [];
      };
      dealers: {
        Row: TimestampColumns & {
          address: string | null;
          city: string | null;
          id: string;
          is_active: boolean;
          map_url: string | null;
          name: string;
          phone: string | null;
          sort_order: number;
          zalo: string | null;
        };
        Insert: OptionalTimestampColumns & {
          address?: string | null;
          city?: string | null;
          id?: string;
          is_active?: boolean;
          map_url?: string | null;
          name: string;
          phone?: string | null;
          sort_order?: number;
          zalo?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["dealers"]["Insert"]>;
        Relationships: [];
      };
      documents: {
        Row: TimestampColumns & {
          description: Json | null;
          file_path: string | null;
          id: string;
          is_published: boolean;
          sort_order: number;
          thumbnail_path: string | null;
          title: Json;
          type: "catalog" | "certificate" | "coa" | "attp" | string;
        };
        Insert: OptionalTimestampColumns & {
          description?: Json | null;
          file_path?: string | null;
          id?: string;
          is_published?: boolean;
          sort_order?: number;
          thumbnail_path?: string | null;
          title: Json;
          type: "catalog" | "certificate" | "coa" | "attp" | string;
        };
        Update: Partial<Database["public"]["Tables"]["documents"]["Insert"]>;
        Relationships: [];
      };
      home_banners: {
        Row: TimestampColumns & {
          alt: Json | null;
          ends_at: string | null;
          id: string;
          image_path: string;
          is_active: boolean;
          link_url: string | null;
          mobile_image_path: string | null;
          sort_order: number;
          starts_at: string | null;
        };
        Insert: OptionalTimestampColumns & {
          alt?: Json | null;
          ends_at?: string | null;
          id?: string;
          image_path: string;
          is_active?: boolean;
          link_url?: string | null;
          mobile_image_path?: string | null;
          sort_order?: number;
          starts_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["home_banners"]["Insert"]>;
        Relationships: [];
      };
      product_audiences: ProductJsonChildTable;
      product_benefits: ProductJsonChildTable;
      product_flavors: ProductJsonNameChildTable;
      product_ingredients: {
        Row: {
          amount: string;
          id: string;
          name: string;
          product_id: string;
          sort_order: number;
        };
        Insert: {
          amount: string;
          id?: string;
          name: string;
          product_id: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["product_ingredients"]["Insert"]>;
        Relationships: [];
      };
      product_sizes: {
        Row: {
          id: string;
          label: string;
          product_id: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          label: string;
          product_id: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["product_sizes"]["Insert"]>;
        Relationships: [];
      };
      product_usage: ProductJsonChildTable;
      products: {
        Row: TimestampColumns & {
          brand_id: string | null;
          category_id: string | null;
          currency: string;
          id: string;
          image_path: string | null;
          is_best_seller: boolean;
          is_featured: boolean;
          is_published: boolean;
          name: Json;
          nutrition_image_path: string | null;
          origin: string | null;
          package_type: "gel" | "tube" | "tub" | "pouch" | string | null;
          price: number;
          primary_goal: Json | null;
          short_description: Json | null;
          slug: string;
          sort_order: number;
          visual_accent: string | null;
          visual_background: string | null;
        };
        Insert: OptionalTimestampColumns & {
          brand_id?: string | null;
          category_id?: string | null;
          currency?: string;
          id?: string;
          image_path?: string | null;
          is_best_seller?: boolean;
          is_featured?: boolean;
          is_published?: boolean;
          name: Json;
          nutrition_image_path?: string | null;
          origin?: string | null;
          package_type?: "gel" | "tube" | "tub" | "pouch" | string | null;
          price?: number;
          primary_goal?: Json | null;
          short_description?: Json | null;
          slug: string;
          sort_order?: number;
          visual_accent?: string | null;
          visual_background?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [];
      };
      related_products: {
        Row: {
          product_id: string;
          related_product_id: string;
          sort_order: number;
        };
        Insert: {
          product_id: string;
          related_product_id: string;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["related_products"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          is_public: boolean;
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          is_public?: boolean;
          key: string;
          updated_at?: string;
          value: Json;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      testimonials: {
        Row: TimestampColumns & {
          id: string;
          is_published: boolean;
          name: string;
          quote: Json;
          rating: number;
          role: string | null;
          sort_order: number;
        };
        Insert: OptionalTimestampColumns & {
          id?: string;
          is_published?: boolean;
          name: string;
          quote: Json;
          rating?: number;
          role?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      set_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type ProductJsonChildTable = {
  Row: {
    content: Json;
    id: string;
    product_id: string;
    sort_order: number;
  };
  Insert: {
    content: Json;
    id?: string;
    product_id: string;
    sort_order?: number;
  };
  Update: Partial<ProductJsonChildTable["Insert"]>;
  Relationships: [];
};

type ProductJsonNameChildTable = {
  Row: {
    id: string;
    name: Json;
    product_id: string;
    sort_order: number;
  };
  Insert: {
    id?: string;
    name: Json;
    product_id: string;
    sort_order?: number;
  };
  Update: Partial<ProductJsonNameChildTable["Insert"]>;
  Relationships: [];
};

export type Tables<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Row"];

export type TablesInsert<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Insert"];

export type TablesUpdate<TableName extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][TableName]["Update"];
