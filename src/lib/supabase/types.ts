export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          city: string;
          complement: string | null;
          created_at: string;
          id: string;
          is_default: boolean;
          label: string | null;
          neighborhood: string;
          number: string;
          profile_id: string;
          recipient_name: string;
          state: string;
          street: string;
          zip_code: string;
        };
        Insert: {
          city: string;
          complement?: string | null;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          neighborhood: string;
          number: string;
          profile_id: string;
          recipient_name: string;
          state: string;
          street: string;
          zip_code: string;
        };
        Update: {
          city?: string;
          complement?: string | null;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          label?: string | null;
          neighborhood?: string;
          number?: string;
          profile_id?: string;
          recipient_name?: string;
          state?: string;
          street?: string;
          zip_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      admin_users: {
        Row: {
          active: boolean;
          created_at: string;
          created_by: string | null;
          email: string;
          full_name: string;
          id: string;
          role: Database["public"]["Enums"]["admin_role"];
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          created_by?: string | null;
          email: string;
          full_name: string;
          id: string;
          role?: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          created_by?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          role?: Database["public"]["Enums"]["admin_role"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_users_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_log: {
        Row: {
          action: string;
          admin_email: string | null;
          admin_user_id: string | null;
          created_at: string;
          details: Json | null;
          id: string;
          resource_id: string | null;
          resource_type: string;
        };
        Insert: {
          action: string;
          admin_email?: string | null;
          admin_user_id?: string | null;
          created_at?: string;
          details?: Json | null;
          id?: string;
          resource_id?: string | null;
          resource_type: string;
        };
        Update: {
          action?: string;
          admin_email?: string | null;
          admin_user_id?: string | null;
          created_at?: string;
          details?: Json | null;
          id?: string;
          resource_id?: string | null;
          resource_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_log_admin_user_id_fkey";
            columns: ["admin_user_id"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          },
        ];
      };
      banners: {
        Row: {
          active: boolean;
          button_text: string | null;
          created_at: string;
          ends_at: string | null;
          id: string;
          image_url: string;
          link_url: string | null;
          mobile_image_url: string | null;
          placement: string;
          sort_order: number;
          starts_at: string | null;
          subtitle: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          button_text?: string | null;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          image_url: string;
          link_url?: string | null;
          mobile_image_url?: string | null;
          placement?: string;
          sort_order?: number;
          starts_at?: string | null;
          subtitle?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          button_text?: string | null;
          created_at?: string;
          ends_at?: string | null;
          id?: string;
          image_url?: string;
          link_url?: string | null;
          mobile_image_url?: string | null;
          placement?: string;
          sort_order?: number;
          starts_at?: string | null;
          subtitle?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          active: boolean;
          created_at: string;
          description: string | null;
          group_name: Database["public"]["Enums"]["category_group"];
          highlight: boolean;
          icon: string | null;
          id: string;
          image_url: string | null;
          name: string;
          parent_id: string | null;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string | null;
          group_name?: Database["public"]["Enums"]["category_group"];
          highlight?: boolean;
          icon?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          parent_id?: string | null;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string | null;
          group_name?: Database["public"]["Enums"]["category_group"];
          highlight?: boolean;
          icon?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          parent_id?: string | null;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      coupons: {
        Row: {
          active: boolean;
          code: string;
          created_at: string;
          expires_at: string | null;
          id: string;
          min_order_value: number;
          starts_at: string | null;
          type: Database["public"]["Enums"]["coupon_type"];
          usage_limit: number | null;
          used_count: number;
          value: number;
        };
        Insert: {
          active?: boolean;
          code: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          min_order_value?: number;
          starts_at?: string | null;
          type?: Database["public"]["Enums"]["coupon_type"];
          usage_limit?: number | null;
          used_count?: number;
          value: number;
        };
        Update: {
          active?: boolean;
          code?: string;
          created_at?: string;
          expires_at?: string | null;
          id?: string;
          min_order_value?: number;
          starts_at?: string | null;
          type?: Database["public"]["Enums"]["coupon_type"];
          usage_limit?: number | null;
          used_count?: number;
          value?: number;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: {
          created_at: string;
          email: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          image_url: string | null;
          order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
          variant_id: string | null;
          variant_label: string | null;
        };
        Insert: {
          id?: string;
          image_url?: string | null;
          order_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          unit_price: number;
          variant_id?: string | null;
          variant_label?: string | null;
        };
        Update: {
          id?: string;
          image_url?: string | null;
          order_id?: string;
          product_id?: string | null;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          variant_id?: string | null;
          variant_label?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      order_status_history: {
        Row: {
          changed_by: string | null;
          created_at: string;
          id: string;
          note: string | null;
          order_id: string;
          status: Database["public"]["Enums"]["order_status"];
        };
        Insert: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          note?: string | null;
          order_id: string;
          status: Database["public"]["Enums"]["order_status"];
        };
        Update: {
          changed_by?: string | null;
          created_at?: string;
          id?: string;
          note?: string | null;
          order_id?: string;
          status?: Database["public"]["Enums"]["order_status"];
        };
        Relationships: [
          {
            foreignKeyName: "order_status_history_changed_by_fkey";
            columns: ["changed_by"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_status_history_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          coupon_code: string | null;
          coupon_id: string | null;
          created_at: string;
          discount: number;
          guest_email: string | null;
          guest_name: string | null;
          guest_phone: string | null;
          id: string;
          notes: string | null;
          order_number: number;
          payment_method: Database["public"]["Enums"]["payment_method"] | null;
          payment_status: Database["public"]["Enums"]["payment_status"];
          profile_id: string | null;
          shipping_address: Json;
          shipping_cost: number;
          status: Database["public"]["Enums"]["order_status"];
          stripe_payment_intent: string | null;
          stripe_session_id: string | null;
          subtotal: number;
          total: number;
          updated_at: string;
        };
        Insert: {
          coupon_code?: string | null;
          coupon_id?: string | null;
          created_at?: string;
          discount?: number;
          guest_email?: string | null;
          guest_name?: string | null;
          guest_phone?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: number;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          profile_id?: string | null;
          shipping_address: Json;
          shipping_cost?: number;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_payment_intent?: string | null;
          stripe_session_id?: string | null;
          subtotal?: number;
          total?: number;
          updated_at?: string;
        };
        Update: {
          coupon_code?: string | null;
          coupon_id?: string | null;
          created_at?: string;
          discount?: number;
          guest_email?: string | null;
          guest_name?: string | null;
          guest_phone?: string | null;
          id?: string;
          notes?: string | null;
          order_number?: number;
          payment_method?: Database["public"]["Enums"]["payment_method"] | null;
          payment_status?: Database["public"]["Enums"]["payment_status"];
          profile_id?: string | null;
          shipping_address?: Json;
          shipping_cost?: number;
          status?: Database["public"]["Enums"]["order_status"];
          stripe_payment_intent?: string | null;
          stripe_session_id?: string | null;
          subtotal?: number;
          total?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt: string | null;
          id: string;
          product_id: string;
          sort_order: number;
          url: string;
        };
        Insert: {
          alt?: string | null;
          id?: string;
          product_id: string;
          sort_order?: number;
          url: string;
        };
        Update: {
          alt?: string | null;
          id?: string;
          product_id?: string;
          sort_order?: number;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_kit_items: {
        Row: {
          id: string;
          kit_id: string;
          product_id: string;
          quantity: number;
        };
        Insert: {
          id?: string;
          kit_id: string;
          product_id: string;
          quantity?: number;
        };
        Update: {
          id?: string;
          kit_id?: string;
          product_id?: string;
          quantity?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_kit_items_kit_id_fkey";
            columns: ["kit_id"];
            isOneToOne: false;
            referencedRelation: "product_kits";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_kit_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_kits: {
        Row: {
          active: boolean;
          created_at: string;
          description: string | null;
          id: string;
          image_url: string | null;
          name: string;
          price: number;
          slug: string;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          price: number;
          slug: string;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          price?: number;
          slug?: string;
        };
        Relationships: [];
      };
      product_variants: {
        Row: {
          active: boolean;
          color: string | null;
          created_at: string;
          hair_length: string | null;
          id: string;
          image_url: string | null;
          price_override: number | null;
          product_id: string;
          size: string | null;
          sku: string | null;
          stock: number;
          texture: string | null;
        };
        Insert: {
          active?: boolean;
          color?: string | null;
          created_at?: string;
          hair_length?: string | null;
          id?: string;
          image_url?: string | null;
          price_override?: number | null;
          product_id: string;
          size?: string | null;
          sku?: string | null;
          stock?: number;
          texture?: string | null;
        };
        Update: {
          active?: boolean;
          color?: string | null;
          created_at?: string;
          hair_length?: string | null;
          id?: string;
          image_url?: string | null;
          price_override?: number | null;
          product_id?: string;
          size?: string | null;
          sku?: string | null;
          stock?: number;
          texture?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          active: boolean;
          avg_rating: number;
          brand: string | null;
          category_id: string | null;
          color: string | null;
          created_at: string;
          depth_cm: number | null;
          description: string | null;
          hair_length: string | null;
          height_cm: number | null;
          id: string;
          is_bestseller: boolean;
          is_featured: boolean;
          is_new: boolean;
          is_offer: boolean;
          name: string;
          price: number;
          reviews_count: number;
          sale_price: number | null;
          short_description: string | null;
          size: string | null;
          sku: string | null;
          slug: string;
          stock: number;
          texture: string | null;
          updated_at: string;
          weight_grams: number | null;
          width_cm: number | null;
        };
        Insert: {
          active?: boolean;
          avg_rating?: number;
          brand?: string | null;
          category_id?: string | null;
          color?: string | null;
          created_at?: string;
          depth_cm?: number | null;
          description?: string | null;
          hair_length?: string | null;
          height_cm?: number | null;
          id?: string;
          is_bestseller?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          is_offer?: boolean;
          name: string;
          price: number;
          reviews_count?: number;
          sale_price?: number | null;
          short_description?: string | null;
          size?: string | null;
          sku?: string | null;
          slug: string;
          stock?: number;
          texture?: string | null;
          updated_at?: string;
          weight_grams?: number | null;
          width_cm?: number | null;
        };
        Update: {
          active?: boolean;
          avg_rating?: number;
          brand?: string | null;
          category_id?: string | null;
          color?: string | null;
          created_at?: string;
          depth_cm?: number | null;
          description?: string | null;
          hair_length?: string | null;
          height_cm?: number | null;
          id?: string;
          is_bestseller?: boolean;
          is_featured?: boolean;
          is_new?: boolean;
          is_offer?: boolean;
          name?: string;
          price?: number;
          reviews_count?: number;
          sale_price?: number | null;
          short_description?: string | null;
          size?: string | null;
          sku?: string | null;
          slug?: string;
          stock?: number;
          texture?: string | null;
          updated_at?: string;
          weight_grams?: number | null;
          width_cm?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          accepts_marketing: boolean;
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          phone: string | null;
          updated_at: string;
        };
        Insert: {
          accepts_marketing?: boolean;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          phone?: string | null;
          updated_at?: string;
        };
        Update: {
          accepts_marketing?: boolean;
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      promo_messages: {
        Row: {
          active: boolean;
          created_at: string;
          id: string;
          message: string;
          sort_order: number;
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          id?: string;
          message: string;
          sort_order?: number;
        };
        Update: {
          active?: boolean;
          created_at?: string;
          id?: string;
          message?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          approved: boolean;
          comment: string | null;
          created_at: string;
          customer_name: string;
          id: string;
          product_id: string;
          profile_id: string | null;
          rating: number;
        };
        Insert: {
          approved?: boolean;
          comment?: string | null;
          created_at?: string;
          customer_name: string;
          id?: string;
          product_id: string;
          profile_id?: string | null;
          rating: number;
        };
        Update: {
          approved?: boolean;
          comment?: string | null;
          created_at?: string;
          customer_name?: string;
          id?: string;
          product_id?: string;
          profile_id?: string | null;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      wishlists: {
        Row: {
          created_at: string;
          product_id: string;
          profile_id: string;
        };
        Insert: {
          created_at?: string;
          product_id: string;
          profile_id: string;
        };
        Update: {
          created_at?: string;
          product_id?: string;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "wishlists_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      current_admin_role: {
        Args: never;
        Returns: Database["public"]["Enums"]["admin_role"];
      };
      decrement_product_stock: {
        Args: { p_product_id: string; p_qty: number };
        Returns: undefined;
      };
      decrement_variant_stock: {
        Args: { p_qty: number; p_variant_id: string };
        Returns: undefined;
      };
      is_admin: {
        Args: { allowed_roles?: Database["public"]["Enums"]["admin_role"][] };
        Returns: boolean;
      };
      redeem_coupon: {
        Args: { p_code: string; p_order_total: number };
        Returns: {
          active: boolean;
          code: string;
          created_at: string;
          expires_at: string | null;
          id: string;
          min_order_value: number;
          starts_at: string | null;
          type: Database["public"]["Enums"]["coupon_type"];
          usage_limit: number | null;
          used_count: number;
          value: number;
        };
      };
      validate_coupon: {
        Args: { p_code: string; p_order_total: number };
        Returns: {
          active: boolean;
          code: string;
          created_at: string;
          expires_at: string | null;
          id: string;
          min_order_value: number;
          starts_at: string | null;
          type: Database["public"]["Enums"]["coupon_type"];
          usage_limit: number | null;
          used_count: number;
          value: number;
        };
      };
    };
    Enums: {
      admin_role: "super_admin" | "admin" | "editor_marketing" | "atendimento" | "estoque";
      category_group: "wigs_e_cabelos" | "acessorios" | "cuidados";
      coupon_type: "percent" | "fixed";
      order_status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "canceled" | "refunded";
      payment_method: "pix" | "credit_card" | "debit_card" | "boleto";
      payment_status: "pending" | "paid" | "failed" | "refunded" | "canceled";
    };
    CompositeTypes: { [_ in never]: never };
  };
};

type DefaultSchema = Database["public"];

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]),
> = (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
  Row: infer R;
}
  ? R
  : never;

export type TablesInsert<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I } ? I : never;

export type TablesUpdate<DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U } ? U : never;

export type Enums<DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions];

export type AdminRole = Enums<"admin_role">;
export type Product = Tables<"products"> & {
  product_images?: Tables<"product_images">[];
  product_variants?: Tables<"product_variants">[];
  categories?: Tables<"categories"> | null;
};
export type Category = Tables<"categories">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type Banner = Tables<"banners">;
export type PromoMessage = Tables<"promo_messages">;
export type Coupon = Tables<"coupons">;
export type AdminUser = Tables<"admin_users">;
