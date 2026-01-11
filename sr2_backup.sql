--
-- PostgreSQL database dump
--

\restrict 2yDCr5JfWDpu9E4IahfvP2QWGYA2OMWJWMkRfFZspr1zFst8J5Vp7g3v7cR8hIc

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: analytics_device_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.analytics_device_type AS ENUM (
    'desktop',
    'mobile',
    'tablet',
    'unknown'
);


--
-- Name: analytics_event_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.analytics_event_type AS ENUM (
    'page_view',
    'action',
    'conversion'
);


--
-- Name: apartment_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.apartment_type AS ENUM (
    'studio',
    '1k',
    '2k',
    '3k'
);


--
-- Name: attachment_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.attachment_type_enum AS ENUM (
    'document',
    'image',
    'archive',
    'other'
);


--
-- Name: audit_action_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.audit_action_enum AS ENUM (
    'user_created',
    'user_updated',
    'user_deleted',
    'user_restored',
    'user_password_changed',
    'user_password_reset_requested',
    'user_email_verified',
    'user_profile_updated',
    'role_granted',
    'role_revoked',
    'user_blocked',
    'user_unblocked',
    'deletion_requested',
    'deletion_approved',
    'deletion_rejected',
    'deletion_completed',
    'claim_created',
    'claim_status_changed',
    'claim_approved',
    'claim_rejected',
    'claim_documents_requested',
    'listing_created',
    'listing_updated',
    'listing_submitted',
    'listing_approved',
    'listing_rejected',
    'listing_archived',
    'listing_renewed',
    'listing_deleted',
    'publication_created',
    'publication_updated',
    'publication_submitted',
    'publication_approved',
    'publication_rejected',
    'publication_archived',
    'publication_published',
    'publication_pinned',
    'publication_unpinned',
    'publication_moderation_vote',
    'publication_deleted',
    'news_created',
    'news_updated',
    'news_published',
    'news_scheduled',
    'news_archived',
    'news_deleted',
    'news_telegram_sent',
    'feedback_created',
    'feedback_status_changed',
    'feedback_priority_changed',
    'feedback_assigned',
    'feedback_forwarded',
    'feedback_responded',
    'feedback_closed',
    'feedback_reopened',
    'directory_item_created',
    'directory_item_updated',
    'directory_item_deleted',
    'directory_category_created',
    'directory_category_updated',
    'directory_category_deleted',
    'building_created',
    'building_updated',
    'apartment_created',
    'apartment_updated',
    'parking_created',
    'parking_updated',
    'settings_updated',
    'entity_viewed',
    'entity_exported'
);


--
-- Name: audit_entity_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.audit_entity_type_enum AS ENUM (
    'user',
    'user_role',
    'user_block',
    'deletion_request',
    'property_claim',
    'listing',
    'news',
    'publication',
    'feedback',
    'directory_category',
    'directory_item',
    'directory_tag',
    'building',
    'apartment',
    'parking',
    'settings'
);


--
-- Name: block_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.block_category_enum AS ENUM (
    'rules_violation',
    'fraud',
    'spam',
    'abuse',
    'other'
);


--
-- Name: channel_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.channel_type AS ENUM (
    'telegram',
    'max',
    'whatsapp',
    'vk',
    'email',
    'other'
);


--
-- Name: claim_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.claim_status AS ENUM (
    'pending',
    'review',
    'approved',
    'rejected',
    'documents_requested'
);


--
-- Name: claim_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.claim_type AS ENUM (
    'apartment',
    'parking',
    'commercial'
);


--
-- Name: deletion_request_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.deletion_request_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'completed'
);


--
-- Name: directory_contact_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.directory_contact_type AS ENUM (
    'phone',
    'email',
    'address',
    'telegram',
    'whatsapp',
    'website',
    'vk',
    'other'
);


--
-- Name: directory_entry_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.directory_entry_type AS ENUM (
    'contact',
    'organization',
    'location',
    'document'
);


--
-- Name: directory_event_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.directory_event_type AS ENUM (
    'search',
    'tag_click',
    'entry_view',
    'entry_call',
    'entry_link'
);


--
-- Name: directory_scope; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.directory_scope AS ENUM (
    'core',
    'commerce',
    'city',
    'promoted'
);


--
-- Name: event_recurrence_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.event_recurrence_type_enum AS ENUM (
    'none',
    'daily',
    'weekly',
    'monthly',
    'yearly'
);


--
-- Name: feedback_history_action_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_history_action_enum AS ENUM (
    'created',
    'status_changed',
    'priority_changed',
    'assigned',
    'unassigned',
    'forwarded',
    'responded',
    'note_added',
    'closed',
    'reopened'
);


--
-- Name: feedback_priority_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_priority_enum AS ENUM (
    'low',
    'normal',
    'high',
    'urgent'
);


--
-- Name: feedback_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_status_enum AS ENUM (
    'new',
    'in_progress',
    'forwarded',
    'resolved',
    'closed'
);


--
-- Name: feedback_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.feedback_type_enum AS ENUM (
    'complaint',
    'suggestion',
    'request',
    'question',
    'other'
);


--
-- Name: knowledge_base_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.knowledge_base_status AS ENUM (
    'draft',
    'published',
    'archived'
);


--
-- Name: listing_archive_reason; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.listing_archive_reason AS ENUM (
    'manual',
    'expired',
    'rights_revoked',
    'admin'
);


--
-- Name: listing_property_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.listing_property_type AS ENUM (
    'apartment',
    'parking'
);


--
-- Name: listing_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.listing_status AS ENUM (
    'draft',
    'pending_moderation',
    'approved',
    'rejected',
    'archived'
);


--
-- Name: listing_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.listing_type AS ENUM (
    'rent',
    'sale'
);


--
-- Name: map_provider_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.map_provider_enum AS ENUM (
    'yandex',
    '2gis',
    'google',
    'apple',
    'osm'
);


--
-- Name: media_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.media_type_enum AS ENUM (
    'image',
    'document',
    'video',
    'other'
);


--
-- Name: message_complaint_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_complaint_status AS ENUM (
    'pending',
    'reviewed',
    'resolved',
    'dismissed'
);


--
-- Name: message_complaint_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_complaint_type AS ENUM (
    'spam',
    'harassment',
    'fraud',
    'inappropriate',
    'other'
);


--
-- Name: message_scope; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_scope AS ENUM (
    'complex',
    'building',
    'entrance',
    'floor',
    'apartment',
    'parking',
    'parking_floor',
    'parking_spot',
    'uk',
    'chairman'
);


--
-- Name: message_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.message_status AS ENUM (
    'draft',
    'pending',
    'sent',
    'delivered',
    'rejected'
);


--
-- Name: moderation_vote_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.moderation_vote_enum AS ENUM (
    'approve',
    'reject',
    'request_changes'
);


--
-- Name: news_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.news_status_enum AS ENUM (
    'draft',
    'scheduled',
    'published',
    'archived'
);


--
-- Name: news_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.news_type_enum AS ENUM (
    'announcement',
    'event',
    'maintenance',
    'update',
    'community',
    'urgent'
);


--
-- Name: notification_category_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_category_enum AS ENUM (
    'claims',
    'messages',
    'system'
);


--
-- Name: notification_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.notification_type_enum AS ENUM (
    'claim_submitted',
    'claim_approved',
    'claim_rejected',
    'claim_cancelled',
    'claim_documents',
    'tenant_claim',
    'property_revoked',
    'message',
    'system',
    'admin'
);


--
-- Name: organization_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.organization_type AS ENUM (
    'store',
    'restaurant',
    'service',
    'other'
);


--
-- Name: parking_spot_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.parking_spot_type AS ENUM (
    'moto',
    'standard',
    'wide'
);


--
-- Name: publication_history_action_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publication_history_action_enum AS ENUM (
    'created',
    'updated',
    'submitted',
    'approved',
    'rejected',
    'archived',
    'published',
    'pinned',
    'unpinned',
    'moderation_vote'
);


--
-- Name: publication_status_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publication_status_enum AS ENUM (
    'draft',
    'pending',
    'published',
    'rejected',
    'archived'
);


--
-- Name: publication_target_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publication_target_type_enum AS ENUM (
    'complex',
    'uk',
    'building',
    'entrance',
    'floor'
);


--
-- Name: publication_type_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.publication_type_enum AS ENUM (
    'announcement',
    'event',
    'help_request',
    'lost_found',
    'recommendation',
    'question',
    'discussion'
);


--
-- Name: resolution_template; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.resolution_template AS ENUM (
    'approved_all_correct',
    'approved_custom',
    'rejected_no_documents',
    'rejected_invalid_documents',
    'rejected_no_reason',
    'rejected_custom'
);


--
-- Name: revocation_template; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.revocation_template AS ENUM (
    'community_rules_violation',
    'role_owner_change',
    'custom'
);


--
-- Name: rules_violation_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rules_violation_enum AS ENUM (
    '3.1',
    '3.2',
    '3.3',
    '3.4',
    '3.5',
    '4.1',
    '4.2',
    '4.3',
    '5.1',
    '5.2'
);


--
-- Name: user_gender_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_gender_enum AS ENUM (
    'Male',
    'Female',
    'Unspecified'
);


--
-- Name: user_property_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_property_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role_enum AS ENUM (
    'Root',
    'SuperAdmin',
    'Admin',
    'ApartmentOwner',
    'ApartmentResident',
    'ParkingOwner',
    'ParkingResident',
    'Editor',
    'Moderator',
    'Guest',
    'BuildingChairman',
    'ComplexChairman',
    'ComplexRepresenative',
    'StoreOwner',
    'StoreRepresenative'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- Name: account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account (
    user_id character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    provider character varying(255) NOT NULL,
    provider_account_id character varying(255) NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type character varying(255),
    scope character varying(255),
    id_token text,
    session_state character varying(255)
);


--
-- Name: analytics_conversion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_conversion (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(500),
    event_name character varying(100) NOT NULL,
    default_value character varying(20),
    is_active timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: analytics_event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_event (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id uuid NOT NULL,
    user_id character varying(255),
    event_type public.analytics_event_type NOT NULL,
    event_name character varying(100) NOT NULL,
    event_category character varying(50),
    page_path character varying(500) NOT NULL,
    page_title character varying(200),
    referrer character varying(1000),
    properties jsonb,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    load_time_ms character varying(10)
);


--
-- Name: analytics_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics_session (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(255),
    started_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_activity_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    device_type public.analytics_device_type DEFAULT 'unknown'::public.analytics_device_type NOT NULL,
    browser character varying(100),
    os character varying(100),
    screen_resolution character varying(20),
    entry_page character varying(500) NOT NULL,
    referrer character varying(1000),
    utm_source character varying(100),
    utm_medium character varying(100),
    utm_campaign character varying(100),
    utm_term character varying(100),
    utm_content character varying(100),
    country character varying(2),
    city character varying(100)
);


--
-- Name: apartment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.apartment (
    id character varying(255) NOT NULL,
    floor_id character varying(255) NOT NULL,
    number character varying(10) NOT NULL,
    type public.apartment_type NOT NULL,
    layout_code character varying(255)
);


--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type public.audit_entity_type_enum NOT NULL,
    entity_id character varying(255) NOT NULL,
    action public.audit_action_enum NOT NULL,
    actor_id character varying(255),
    previous_state jsonb,
    new_state jsonb,
    changed_fields jsonb,
    description text NOT NULL,
    metadata jsonb,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: building; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.building (
    id character varying(255) NOT NULL,
    number smallint,
    title character varying(255),
    liter character varying(255),
    active boolean
);


--
-- Name: building_channel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.building_channel (
    id character varying(255) NOT NULL,
    building_id character varying(255),
    channel_type public.channel_type NOT NULL,
    channel_id character varying(500) NOT NULL,
    name character varying(255),
    is_active integer DEFAULT 1 NOT NULL,
    is_primary integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: claim_document; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.claim_document (
    id character varying(255) NOT NULL,
    claim_id character varying(255) NOT NULL,
    document_type character varying(100) NOT NULL,
    file_url character varying(500),
    file_name character varying(255),
    file_size character varying(20),
    mime_type character varying(100),
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: claim_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.claim_history (
    id character varying(255) NOT NULL,
    claim_id character varying(255) NOT NULL,
    from_status public.claim_status,
    to_status public.claim_status NOT NULL,
    resolution_template public.resolution_template,
    resolution_text text,
    changed_by character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: contact_group_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_group_tags (
    contact_group_id character varying(36) NOT NULL,
    tag_id character varying(36) NOT NULL
);


--
-- Name: contact_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_groups (
    id character varying(36) NOT NULL,
    title text NOT NULL,
    description text,
    type text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: deletion_request; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.deletion_request (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    status public.deletion_request_status DEFAULT 'pending'::public.deletion_request_status NOT NULL,
    reason text,
    admin_notes text,
    processed_by character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at timestamp with time zone
);


--
-- Name: directory_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_analytics (
    id character varying(255) NOT NULL,
    event_type public.directory_event_type NOT NULL,
    search_query character varying(255),
    tag_id character varying(255),
    entry_id character varying(255),
    contact_id character varying(255),
    user_id character varying(255),
    results_count integer,
    metadata text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: directory_contact; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_contact (
    id character varying(255) NOT NULL,
    entry_id character varying(255) NOT NULL,
    type public.directory_contact_type NOT NULL,
    value character varying(500) NOT NULL,
    label character varying(100),
    is_primary integer DEFAULT 0 NOT NULL,
    "order" integer DEFAULT 0,
    subtitle character varying(255),
    has_whatsapp integer DEFAULT 0 NOT NULL,
    has_telegram integer DEFAULT 0 NOT NULL,
    is_24h integer DEFAULT 0 NOT NULL,
    schedule_note character varying(255)
);


--
-- Name: directory_contact_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_contact_tag (
    contact_id character varying(255) NOT NULL,
    tag_id character varying(255) NOT NULL
);


--
-- Name: directory_entry; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_entry (
    id character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    type public.directory_entry_type NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    content text,
    building_id character varying(255),
    floor_number smallint,
    icon character varying(50),
    "order" integer DEFAULT 0,
    is_active integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    subtitle character varying(255)
);


--
-- Name: directory_entry_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_entry_stats (
    id character varying(255) NOT NULL,
    entry_id character varying(255) NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    call_count integer DEFAULT 0 NOT NULL,
    link_count integer DEFAULT 0 NOT NULL,
    last_viewed_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: directory_entry_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_entry_tag (
    entry_id character varying(255) NOT NULL,
    tag_id character varying(255) NOT NULL
);


--
-- Name: directory_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_schedule (
    id character varying(255) NOT NULL,
    entry_id character varying(255) NOT NULL,
    day_of_week smallint NOT NULL,
    open_time time without time zone,
    close_time time without time zone,
    note character varying(255)
);


--
-- Name: directory_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_tag (
    id character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    slug character varying(100) NOT NULL,
    parent_id character varying(255),
    synonyms text,
    icon character varying(50),
    "order" integer DEFAULT 0,
    description text,
    scope public.directory_scope DEFAULT 'core'::public.directory_scope NOT NULL
);


--
-- Name: directory_tag_stats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.directory_tag_stats (
    id character varying(255) NOT NULL,
    tag_id character varying(255) NOT NULL,
    click_count integer DEFAULT 0 NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    last_clicked_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: email_verification_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_verification_token (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: entrance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entrance (
    id character varying(255) NOT NULL,
    building_id character varying(255) NOT NULL,
    entrance_number smallint NOT NULL
);


--
-- Name: feedback; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type public.feedback_type_enum DEFAULT 'suggestion'::public.feedback_type_enum NOT NULL,
    title character varying(255),
    content text NOT NULL,
    status public.feedback_status_enum DEFAULT 'new'::public.feedback_status_enum NOT NULL,
    priority public.feedback_priority_enum DEFAULT 'normal'::public.feedback_priority_enum NOT NULL,
    contact_name character varying(255),
    contact_email character varying(255),
    contact_phone character varying(20),
    attachments jsonb DEFAULT '[]'::jsonb,
    photos jsonb DEFAULT '[]'::jsonb,
    submitted_by_user_id character varying(255),
    ip_address character varying(45),
    user_agent text,
    is_anonymous boolean DEFAULT true NOT NULL,
    assigned_to_id character varying(255),
    forwarded_to character varying(500),
    internal_note text,
    response text,
    responded_at timestamp with time zone,
    responded_by_id character varying(255),
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by_id character varying(255),
    delete_reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: feedback_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feedback_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    feedback_id uuid NOT NULL,
    action public.feedback_history_action_enum NOT NULL,
    from_status public.feedback_status_enum,
    to_status public.feedback_status_enum,
    from_priority public.feedback_priority_enum,
    to_priority public.feedback_priority_enum,
    assigned_to_id character varying(255),
    forwarded_to character varying(500),
    response text,
    internal_note text,
    changed_by_id character varying(255),
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: floor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.floor (
    id character varying(255) NOT NULL,
    entrance_id character varying(255) NOT NULL,
    floor_number smallint NOT NULL
);


--
-- Name: knowledge_base_article; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_base_article (
    id character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    excerpt text,
    content text,
    status public.knowledge_base_status DEFAULT 'draft'::public.knowledge_base_status NOT NULL,
    building_id character varying(255),
    icon character varying(50),
    author_id character varying(255),
    "order" integer DEFAULT 0,
    view_count integer DEFAULT 0 NOT NULL,
    helpful_count integer DEFAULT 0 NOT NULL,
    not_helpful_count integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    published_at timestamp without time zone
);


--
-- Name: knowledge_base_article_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge_base_article_tag (
    article_id character varying(255) NOT NULL,
    tag_id character varying(255) NOT NULL
);


--
-- Name: listing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    listing_type public.listing_type NOT NULL,
    property_type public.listing_property_type NOT NULL,
    apartment_id character varying(255),
    parking_spot_id character varying(255),
    title character varying(255) NOT NULL,
    description text,
    price integer NOT NULL,
    utilities_included boolean DEFAULT true,
    status public.listing_status DEFAULT 'draft'::public.listing_status NOT NULL,
    moderated_by character varying(255),
    moderated_at timestamp with time zone,
    rejection_reason text,
    view_count integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published_at timestamp with time zone,
    archived_by character varying(255),
    archived_at timestamp with time zone,
    is_stale boolean DEFAULT false NOT NULL,
    stale_at timestamp with time zone,
    archive_reason public.listing_archive_reason,
    archived_comment text,
    renewed_at timestamp with time zone,
    show_phone boolean DEFAULT true NOT NULL,
    show_telegram boolean DEFAULT false NOT NULL,
    show_max boolean DEFAULT false NOT NULL,
    show_whatsapp boolean DEFAULT false NOT NULL
);


--
-- Name: listing_photo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.listing_photo (
    id character varying(255) NOT NULL,
    listing_id character varying(255) NOT NULL,
    url character varying(500) NOT NULL,
    sort_order smallint DEFAULT 0 NOT NULL,
    is_main boolean DEFAULT false NOT NULL,
    alt_text character varying(255),
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    filename character varying(255) NOT NULL,
    original_filename character varying(255) NOT NULL,
    mime_type character varying(100) NOT NULL,
    size integer NOT NULL,
    path character varying(500) NOT NULL,
    url character varying(500) NOT NULL,
    width integer,
    height integer,
    type public.media_type_enum DEFAULT 'image'::public.media_type_enum NOT NULL,
    alt character varying(255),
    title character varying(255),
    description text,
    uploaded_by character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message (
    id character varying(255) NOT NULL,
    thread_id character varying(255) CONSTRAINT message_thread_id_not_null1 NOT NULL,
    sender_id character varying(255) NOT NULL,
    content text NOT NULL,
    is_rich_text boolean DEFAULT false NOT NULL,
    status public.message_status DEFAULT 'sent'::public.message_status NOT NULL,
    moderated_by character varying(255),
    moderated_at timestamp without time zone,
    moderation_comment text,
    reply_to_id character varying(255),
    is_edited boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    edited_at timestamp without time zone,
    deleted_at timestamp without time zone
);


--
-- Name: message_attachment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_attachment (
    id character varying(255) NOT NULL,
    message_id character varying(255) NOT NULL,
    file_type character varying(50) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_url character varying(500) NOT NULL,
    file_size integer,
    mime_type character varying(100),
    width integer,
    height integer,
    thumbnail_url character varying(500),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: message_complaint; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_complaint (
    id character varying(255) NOT NULL,
    message_id character varying(255) NOT NULL,
    reporter_id character varying(255) NOT NULL,
    complaint_type public.message_complaint_type NOT NULL,
    description text,
    status public.message_complaint_status DEFAULT 'pending'::public.message_complaint_status NOT NULL,
    reviewed_by character varying(255),
    reviewed_at timestamp without time zone,
    review_comment text,
    action_taken text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: message_quota; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_quota (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    daily_limit integer DEFAULT 5 NOT NULL,
    daily_used integer DEFAULT 0 NOT NULL,
    daily_reset_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    weekly_limit integer DEFAULT 20 NOT NULL,
    weekly_used integer DEFAULT 0 NOT NULL,
    weekly_reset_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_blocked boolean DEFAULT false NOT NULL,
    blocked_reason text,
    blocked_at timestamp without time zone,
    blocked_by character varying(255),
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: message_recipient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_recipient (
    id character varying(255) NOT NULL,
    message_id character varying(255) NOT NULL,
    recipient_id character varying(255) NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp without time zone,
    is_archived boolean DEFAULT false NOT NULL,
    is_deleted boolean DEFAULT false NOT NULL
);


--
-- Name: message_thread; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.message_thread (
    id character varying(255) NOT NULL,
    subject character varying(255),
    created_by character varying(255) NOT NULL,
    scope public.message_scope NOT NULL,
    building_id character varying(255),
    entrance_id character varying(255),
    floor_id character varying(255),
    apartment_id character varying(255),
    parking_id character varying(255),
    parking_floor_id character varying(255),
    parking_spot_id character varying(255),
    recipient_id character varying(255),
    is_archived boolean DEFAULT false NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    last_message_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: news; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    excerpt text,
    cover_image character varying(500),
    content jsonb NOT NULL,
    type public.news_type_enum DEFAULT 'announcement'::public.news_type_enum NOT NULL,
    status public.news_status_enum DEFAULT 'draft'::public.news_status_enum NOT NULL,
    publish_at timestamp with time zone,
    is_pinned boolean DEFAULT false NOT NULL,
    is_highlighted boolean DEFAULT false NOT NULL,
    author_id character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_anonymous boolean DEFAULT false NOT NULL
);


--
-- Name: news_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.news_tag (
    news_id uuid NOT NULL,
    tag_id character varying(255) NOT NULL
);


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    from_user_id character varying(255),
    type public.notification_type_enum NOT NULL,
    category public.notification_category_enum NOT NULL,
    title character varying(255) NOT NULL,
    message text,
    entity_type character varying(50),
    entity_id character varying(255),
    action_url character varying(500),
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: organization; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization (
    id character varying(255) NOT NULL,
    building_id character varying(255) NOT NULL,
    floor_number integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    logo character varying(255),
    schedule jsonb NOT NULL,
    type public.organization_type NOT NULL
);


--
-- Name: organization_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_tag (
    id character varying(255) NOT NULL,
    name character varying(100) NOT NULL
);


--
-- Name: organization_to_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_to_tag (
    organization_id character varying(255) NOT NULL,
    tag_id character varying(255) NOT NULL
);


--
-- Name: parking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parking (
    id character varying(255) NOT NULL,
    building_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: parking_floor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parking_floor (
    id character varying(255) NOT NULL,
    parking_id character varying(255) NOT NULL,
    floor_number smallint NOT NULL
);


--
-- Name: parking_spot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.parking_spot (
    id character varying(255) NOT NULL,
    floor_id character varying(255) NOT NULL,
    number character varying(10) NOT NULL,
    type public.parking_spot_type NOT NULL
);


--
-- Name: password_reset_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_token (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post (
    id integer NOT NULL,
    name character varying(256),
    created_by character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone
);


--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.properties (
    id character varying(36) NOT NULL,
    group_id character varying(36),
    key text NOT NULL,
    value text NOT NULL,
    type text NOT NULL,
    "order" integer DEFAULT 0
);


--
-- Name: property_claim; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_claim (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    claim_type public.claim_type NOT NULL,
    claimed_role public.user_role_enum NOT NULL,
    apartment_id character varying(255),
    parking_spot_id character varying(255),
    organization_id character varying(255),
    status public.claim_status DEFAULT 'pending'::public.claim_status NOT NULL,
    user_comment text,
    admin_comment text,
    reviewed_by character varying(255),
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: property_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_groups (
    id character varying(36) NOT NULL,
    contact_group_id character varying(36),
    name text NOT NULL,
    "order" integer DEFAULT 0
);


--
-- Name: publication; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    content jsonb NOT NULL,
    cover_image character varying(500),
    type public.publication_type_enum DEFAULT 'announcement'::public.publication_type_enum NOT NULL,
    status public.publication_status_enum DEFAULT 'draft'::public.publication_status_enum NOT NULL,
    building_id character varying(255),
    is_pinned boolean DEFAULT false NOT NULL,
    is_urgent boolean DEFAULT false NOT NULL,
    author_id character varying(255) NOT NULL,
    moderated_by character varying(255),
    moderated_at timestamp with time zone,
    moderation_comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    event_start_at timestamp with time zone,
    event_end_at timestamp with time zone,
    event_location character varying(500),
    event_latitude text,
    event_longitude text,
    event_max_attendees integer,
    event_external_url character varying(500),
    event_organizer character varying(255),
    event_organizer_phone character varying(20),
    is_anonymous boolean DEFAULT false NOT NULL,
    publish_at timestamp with time zone,
    publish_to_telegram boolean DEFAULT false NOT NULL,
    event_recurrence_type public.event_recurrence_type_enum DEFAULT 'none'::public.event_recurrence_type_enum,
    event_recurrence_interval integer DEFAULT 1,
    event_recurrence_day_of_week integer,
    event_recurrence_start_day integer,
    event_recurrence_end_day integer,
    event_recurrence_until timestamp with time zone,
    linked_article_id uuid
);


--
-- Name: publication_attachment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication_attachment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_id uuid NOT NULL,
    file_name character varying(255) NOT NULL,
    file_type public.attachment_type_enum NOT NULL,
    mime_type character varying(100) NOT NULL,
    file_size integer NOT NULL,
    url character varying(500) NOT NULL,
    description character varying(255),
    sort_order integer DEFAULT 0 NOT NULL,
    uploaded_by character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: publication_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_id uuid NOT NULL,
    action public.publication_history_action_enum NOT NULL,
    from_status public.publication_status_enum,
    to_status public.publication_status_enum,
    moderation_comment text,
    changed_by_id character varying(255) NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: publication_moderation_vote; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication_moderation_vote (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_id uuid NOT NULL,
    moderator_id character varying(255) NOT NULL,
    vote public.moderation_vote_enum NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: publication_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication_tag (
    publication_id uuid NOT NULL,
    tag_id character varying(255) NOT NULL
);


--
-- Name: publication_target; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.publication_target (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    publication_id uuid NOT NULL,
    target_type public.publication_target_type_enum NOT NULL,
    target_id character varying(255)
);


--
-- Name: session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.session (
    session_token character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL
);


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_settings (
    key character varying(100) NOT NULL,
    value jsonb NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id character varying(36) NOT NULL,
    name text NOT NULL
);


--
-- Name: telegram_auth_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.telegram_auth_token (
    id character varying(255) NOT NULL,
    code character varying(6) NOT NULL,
    telegram_id character varying(50),
    telegram_username character varying(100),
    telegram_first_name character varying(255),
    telegram_last_name character varying(255),
    verified boolean DEFAULT false NOT NULL,
    verified_at timestamp with time zone,
    expires timestamp with time zone NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id character varying(255) NOT NULL,
    name character varying(255),
    email character varying(255) NOT NULL,
    email_verified timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    image character varying(255),
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    password_hash character varying(255),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_apartment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_apartment (
    user_id character varying(255) NOT NULL,
    apartment_id character varying(255) NOT NULL,
    status public.user_property_status DEFAULT 'pending'::public.user_property_status NOT NULL,
    role public.user_role_enum NOT NULL,
    revoked_at timestamp with time zone,
    revoked_by character varying(255),
    revocation_template public.revocation_template,
    revocation_reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_block; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_block (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    blocked_by character varying(255) NOT NULL,
    category public.block_category_enum NOT NULL,
    violated_rules text,
    reason text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    unblocked_at timestamp with time zone,
    unblocked_by character varying(255),
    unblock_reason text
);


--
-- Name: user_interest_building; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_interest_building (
    user_id character varying(255) NOT NULL,
    building_id character varying(255) NOT NULL,
    auto_added boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_parking_spot; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_parking_spot (
    user_id character varying(255) NOT NULL,
    parking_spot_id character varying(255) NOT NULL,
    status public.user_property_status DEFAULT 'pending'::public.user_property_status NOT NULL,
    role public.user_role_enum NOT NULL,
    revoked_at timestamp with time zone,
    revoked_by character varying(255),
    revocation_template public.revocation_template,
    revocation_reason text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: user_profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profile (
    id character varying(255) NOT NULL,
    user_id character varying(255) NOT NULL,
    first_name character varying(255),
    last_name character varying(255),
    middle_name character varying(255),
    display_name character varying(255),
    phone character varying(20),
    hide_phone boolean DEFAULT false NOT NULL,
    hide_name boolean DEFAULT false NOT NULL,
    hide_gender boolean DEFAULT false NOT NULL,
    hide_birthday boolean DEFAULT false NOT NULL,
    avatar character varying(255),
    date_of_birth timestamp without time zone,
    gender public.user_gender_enum,
    telegram_username character varying(100),
    telegram_id character varying(50),
    telegram_verified boolean DEFAULT false NOT NULL,
    telegram_verified_at timestamp with time zone,
    max_username character varying(100),
    whatsapp_phone character varying(20),
    hide_messengers boolean DEFAULT false NOT NULL,
    map_provider public.map_provider_enum DEFAULT 'yandex'::public.map_provider_enum,
    tagline character varying(100),
    tagline_set_by_admin boolean DEFAULT false NOT NULL
);


--
-- Name: user_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_role (
    user_id character varying(255) NOT NULL,
    role public.user_role_enum NOT NULL
);


--
-- Name: verification_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.verification_token (
    identifier character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    expires timestamp with time zone NOT NULL
);


--
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account (user_id, type, provider, provider_account_id, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
c8071a46-c3b5-408d-8607-e3f0fca56936	oauth	yandex	111713931	2:AAA:AAAAAAaonos:1:qTBTnrXBU5iOuvKO:wSIvg0Ezj0CtmamVm7H-5PrBjbOIs-hfr_h_Z24itZ_GiRGd0EdX_Qq7ZKJvWqLryvfa8cw3tfskUFI:kvMRAWwaF42ZduE8MefsoA	y0__xCLvaI1GNaYLyDcpMj1FTD9srydCBP2CcpvLe9EalZs_p-_MJhFPI_m	1798882141	bearer	login:email login:info login:avatar	\N	\N
\.


--
-- Data for Name: analytics_conversion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_conversion (id, name, description, event_name, default_value, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: analytics_event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_event (id, session_id, user_id, event_type, event_name, event_category, page_path, page_title, referrer, properties, created_at, load_time_ms) FROM stdin;
c534d715-0892-496d-afb5-bb8ff5fdb115	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:09:04.218652+00	\N
49f4279a-a30a-4872-b4c9-a24bd34779bc	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:10:01.748898+00	\N
4208369f-1d5c-4a0c-9659-93315fd01aea	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/analytics	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:11:36.495696+00	\N
3cc5a1d5-99d3-4610-8764-e3b5393bb710	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:11:50.816034+00	\N
39099455-d107-492d-a7d7-46affb5be345	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:11:58.904257+00	\N
30fc853c-6e43-4965-b39a-0943e3f40def	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:12:09.43687+00	\N
3ced8aa2-4ed8-4c4a-abe9-d4ed4816d967	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:14:28.409956+00	\N
9413467c-83f7-4f1b-a39c-85ea486206d7	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:14:55.31238+00	\N
931cd17b-7e50-4ae3-9749-0ccb3564b777	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:20:01.376369+00	\N
230fea5c-960d-45f9-9a84-981b0775664b	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:20:20.081877+00	\N
4eeb2659-7ed3-44d2-8091-fef4cf9a0482	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/logs	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:20:35.4619+00	\N
b4ec5491-65fb-489e-89fd-29575befb5da	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Сердце Ростова 2	http://localhost:3000/admin/logs	\N	2026-01-11 13:20:50.693129+00	\N
6ce3d521-f931-48d6-8e2d-ab9a14220de5	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:21:41.321256+00	\N
b6319966-d893-473f-9e19-5c5e0a442d15	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:21:46.6058+00	\N
54038f21-4ea3-402a-b8e3-3764146be6e5	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:22:06.742132+00	\N
fda3f54b-47af-403a-bd37-bd610e23fd8a	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:22:10.643105+00	\N
71e7d3fd-c657-4781-96a2-c8c5c355f393	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:23:00.155179+00	\N
41a29933-20a9-47a6-a2db-2193fbd75536	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:23:26.930425+00	\N
b674b10a-b207-4ec9-8d96-5bd45133a92d	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:24:50.448361+00	\N
adf08611-8f9c-400b-a2d1-1b937d5c8633	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:28:56.558157+00	\N
c8968eaa-ccd5-4ab9-b852-4063f1fe0399	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users/operations	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin/users/operations	\N	2026-01-11 13:36:53.882814+00	\N
465f72fc-cb83-4a79-8733-7666e6413723	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:41:13.365091+00	\N
d2f1470c-823b-40e9-b134-489910dc999e	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:42:24.61041+00	\N
625b41c5-d378-4ec6-9e18-a33819185a1e	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:46:20.444471+00	\N
62a91f30-6251-4712-ac7f-c91933c635e3	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/	\N	2026-01-11 13:46:21.119268+00	\N
a1ea740d-fbed-4ee7-b5f6-d9b4a75f0eb4	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:46:52.367929+00	\N
db642546-cd48-4ed8-b570-419eeea10339	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/	\N	2026-01-11 13:46:54.042663+00	\N
39c4d446-ca21-4408-86ac-ef3e8172462b	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:47:45.289617+00	\N
7eaf6fb9-77d9-4418-ad73-518d58fbe3cf	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/	\N	2026-01-11 13:47:45.725434+00	\N
6ab6e95d-f36c-4103-97b8-4b3db34c7cda	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/users	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:49:47.257181+00	\N
b804d4ed-4437-4d9b-806a-671d9a278156	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:49:48.712675+00	\N
0747a9b5-f330-4911-8c86-df03095b0560	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/buildings	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 13:53:00.190344+00	\N
60b8dfa2-0508-4707-8593-902a204fd539	5b1914bf-1f58-40d6-bf3d-75927d914b9b	\N	page_view	page_view	\N	/	Справочная | SR2		\N	2026-01-11 13:55:30.269371+00	\N
a1cf1d94-e21f-45c6-8b19-07ea79a13464	5b1914bf-1f58-40d6-bf3d-75927d914b9b	\N	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/info	\N	2026-01-11 13:56:16.26455+00	\N
547a5aae-7753-4d82-b228-519814301453	5b1914bf-1f58-40d6-bf3d-75927d914b9b	\N	page_view	page_view	\N	/login	Сердце Ростова 2		\N	2026-01-11 13:56:35.05815+00	\N
79bb7198-e6e3-4506-b490-0b5713ebf4ce	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/my	Сердце Ростова 2	http://localhost:3000/login	\N	2026-01-11 13:56:57.372172+00	\N
f5928f5a-d27a-46fd-9c87-ed6055c0ac43	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/login	\N	2026-01-11 13:57:10.895679+00	\N
f8fb4ce2-4986-4022-83de-e582a9426ccc	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/admin/users	Админ-панель | Сердце Ростова 2		\N	2026-01-11 13:57:38.623784+00	\N
d1ca5c78-062e-48c5-bf92-295b122cad9a	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/admin	\N	2026-01-11 14:12:36.922083+00	\N
5b468349-05ba-4176-9002-509149d44deb	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/admin/users/operations	Админ-панель | Сердце Ростова 2		\N	2026-01-11 13:58:06.372336+00	\N
3b5ca5bf-365a-4c0d-9119-b55f1d69ec54	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/admin/analytics	Админ-панель | Сердце Ростова 2		\N	2026-01-11 13:58:13.497416+00	\N
2a0567ed-8bdf-4243-a473-63289b5e960d	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/news	Новости | SR2		\N	2026-01-11 13:59:11.475503+00	\N
b97b592c-812a-4447-9c60-9ee553df3dd4	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/my	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:12:34.580215+00	\N
d049c81e-daab-4188-87d2-5a5d09292c14	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/admin/directory	Админ-панель | Сердце Ростова 2		\N	2026-01-11 13:58:32.545603+00	\N
db91e5bf-5af6-494e-b79c-4db006e0d59f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:22:26.045313+00	\N
bcec3e75-ee67-4b6e-b6b0-21a4dfb83338	5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	page_view	page_view	\N	/admin/news	Админ-панель | Сердце Ростова 2		\N	2026-01-11 13:58:55.407306+00	\N
4de14571-bb8d-47f8-8d6a-18e2c4e9a99f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:04:08.861849+00	\N
bdf015a4-b7b9-4da4-bcd2-34f396e20a12	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/buildings	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:22:17.242783+00	\N
fe76fe58-de3d-4beb-b23e-27eb764d10f1	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory/tags	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:29:40.03195+00	\N
eb3822a5-6397-4c00-843f-3b783e93e1d5	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:30:06.184665+00	\N
2a86668f-db08-4e4a-bb59-3faab1cbed8a	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory/tags	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:30:09.660464+00	\N
ffdd2972-cc1b-4d45-a1c7-f6d23d682000	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:30:11.630085+00	\N
abceab20-d480-4566-82e9-b4d327f2fcad	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory/3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:31:47.851087+00	\N
88285b62-b09b-42b8-bcaa-e1f445f0370d	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 14:32:39.904108+00	\N
0fb6c38b-9012-4e83-8392-3d5792aad476	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin/directory	\N	2026-01-11 14:35:32.241875+00	\N
31f211ab-6cca-4dfc-ba73-51787f1e0271	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory/tags	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin/directory	\N	2026-01-11 14:38:00.325632+00	\N
ac9cd98b-8832-4e70-a43d-4c825736f90f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/directory	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin/directory	\N	2026-01-11 14:38:02.326425+00	\N
f4cb6638-0416-488e-a441-996ce165f4b0	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2		\N	2026-01-11 14:41:25.739075+00	\N
021886ae-7800-48d4-bd44-0d98104bdc0a	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2		\N	2026-01-11 14:41:33.589837+00	\N
fb497b1f-a2e8-4599-8cd4-6e7834759be0	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2		\N	2026-01-11 15:39:48.546804+00	\N
ad239c5d-663e-4801-9a17-44375c84815d	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2		\N	2026-01-11 15:39:51.909712+00	\N
cbd0111b-3595-4e3d-a60f-4c27000d9d25	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2		\N	2026-01-11 15:40:00.605586+00	\N
1be9db09-4787-4f2e-bd87-c859a62c7f20	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2		\N	2026-01-11 15:42:55.433272+00	\N
f72f222a-1090-4aab-9b1e-bc5c26a63e9b	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/chats	Чаты — Сообщество СР2		\N	2026-01-11 15:42:59.221625+00	\N
beaeb2d7-b198-4d05-952b-8d90bb0bfaec	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/rules	Правила сообщества — СР2		\N	2026-01-11 15:43:00.028217+00	\N
bd68876f-e0ef-478a-869f-fcea9925dba4	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2		\N	2026-01-11 15:43:01.444775+00	\N
72437d68-fc8d-4f3a-a4d1-da92bd4eb423	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/howtos	Чего		\N	2026-01-11 15:43:09.086227+00	\N
e044a388-a812-4916-a72c-e72642e70eca	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2		\N	2026-01-11 15:44:32.112499+00	\N
8e5ba360-143f-4615-aeaa-91dcbb2bc036	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2		\N	2026-01-11 15:45:20.332622+00	\N
7d05176d-0b16-4c92-8ec3-8d38368f8855	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:48:28.544697+00	\N
8149f9ce-b514-48da-81f3-3e7c17d6ad6f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:57:28.092866+00	\N
a9748e22-132f-44b4-bc88-aa447b579e0d	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:57:59.540523+00	\N
2757028e-ed24-40d4-a264-ecd68c387738	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:00.862241+00	\N
bc659475-7426-46ff-9bb1-d650f7838d4c	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/contribute	Как помочь проекту — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:03.057054+00	\N
01da7d4f-e450-451d-8b5c-33eb86e16303	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:58:10.305343+00	\N
7013cafb-94a2-4f4b-8eab-9a6da258a59b	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/contribute	Как помочь проекту — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:13.188568+00	\N
84a791d7-ec84-4d79-bb48-72c27a6a9ea4	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:58:19.832254+00	\N
4ac30dd0-8a05-4b55-8f13-90de4212c741	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/contribute	Как помочь проекту — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:26.248301+00	\N
9ae4649b-7d37-42e6-98d4-5816538532bb	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/rules	Правила сообщества — СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:50.393736+00	\N
e9d4bee0-d653-4f26-b3b6-7c5e026e3a9f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/contribute	Как помочь проекту — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:51.071796+00	\N
3aee1c24-d575-4379-9b49-f61aa1cd5220	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/rules	Правила сообщества — СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:51.708098+00	\N
6f407dbe-2e92-4396-84ce-d36294593719	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/contribute	Как помочь проекту — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:52.855366+00	\N
c67f8fc1-4485-4af1-a0b0-7bd431d509fe	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/rules	Правила сообщества — СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:53.020057+00	\N
ea8653d4-fd33-48d0-8e71-ad53506e0f02	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/listings	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:59:02.750358+00	\N
e0d820d3-0032-44c3-b1e9-7e7e22b885bf	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/contribute	Как помочь проекту — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:54.192143+00	\N
a8333009-3d69-4377-9c39-692b710c5c83	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/rules	Правила сообщества — СР2	http://localhost:3000/admin	\N	2026-01-11 15:58:54.75679+00	\N
69494e1d-bff8-4ba2-ae4d-3ad4b5516927	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/chats	Чаты — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 16:14:27.950182+00	\N
fc84a618-dcf4-4767-baa3-564cc3328c31	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/contribute	Как помочь проекту — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:59:02.106561+00	\N
a3282cad-db8d-4fff-bc14-5fb8fb612c3f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/claims	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:02:36.536996+00	\N
c472f9f2-c1b3-4d94-80c2-57d42cbf8226	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:59:06.063596+00	\N
42b0672f-7bba-4c5d-9b58-5656abdaca69	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:59:33.337226+00	\N
1dda35e2-f70c-4ee0-90d9-a9a56274879b	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 16:11:24.538489+00	\N
baedc944-58cc-4c91-b84d-4823fca00abc	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/guide	Как пользоваться — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 16:12:04.701853+00	\N
82637007-90e3-4092-97d1-01610c08ff4f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 15:59:07.4157+00	\N
6f49716e-b779-42d3-97c2-9ab5badcdb11	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/howtos	Чего	http://localhost:3000/admin	\N	2026-01-11 15:59:07.897298+00	\N
11a5213e-ddf8-4e4e-aa10-3202051205a6	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/deletion-requests	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:59:58.241591+00	\N
dc4a1693-0ef4-4f2a-8ad5-02d95d5a0cab	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/feedback	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:14:14.652307+00	\N
e61f78e1-36c3-401b-b9c2-1274ac785849	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/guide	Как пользоваться — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 16:14:16.53861+00	\N
d13e2ea5-0477-4660-a716-ec796d1ca88a	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/admin	\N	2026-01-11 15:59:09.072066+00	\N
381e702e-d9ce-4237-8a40-04fd4b4addf4	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/my	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:03:32.383467+00	\N
52f0e910-5617-4213-b13c-b7d599a89add	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/my	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 15:59:32.01457+00	\N
cfc6e4e1-736c-447b-bb9e-8cc4d07f02a0	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/listings	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:02:44.226033+00	\N
92866ce5-d625-40b0-8ea2-91a4fb1f5c36	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/admin	\N	2026-01-11 16:15:14.522391+00	\N
e4c97bb5-bce7-4174-91cf-f9cf75e442ce	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/	Справочная | SR2	http://localhost:3000/admin	\N	2026-01-11 16:03:36.370034+00	\N
cd5c45f1-7c23-424c-9c9e-c0b14d800d8b	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community	О проекте — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 16:14:26.141454+00	\N
6e33f677-e10b-41c3-acc6-12b364ebc8e8	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/guide	Как пользоваться — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 16:14:27.62664+00	\N
84348aaa-050f-41ff-95ab-7512a46682a7	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/community/guide	Как пользоваться — Сообщество СР2	http://localhost:3000/admin	\N	2026-01-11 16:15:04.786108+00	\N
1775ddfe-1e2c-4ae0-8522-b29dbe621b96	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/listings	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:15:11.139256+00	\N
6202926e-84af-4dae-9753-c47c8d77bec0	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/howtos	Чего	http://localhost:3000/admin	\N	2026-01-11 16:15:12.418574+00	\N
97a9b6db-2fbc-421c-aa0b-f6e9bd9c0f4e	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/my	Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:24:55.950021+00	\N
4e111d93-7a2f-46b5-90c4-3066c291960f	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:24:57.35399+00	\N
23538dbb-eb6c-43a5-b35b-fb982f190a59	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/news	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:25:00.814065+00	\N
adb9c8a3-d1ab-405b-9457-4455f181100c	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/news/new	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:25:03.311445+00	\N
3d7b207c-15fa-4457-aa88-97258740d76b	1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	page_view	page_view	\N	/admin/news/121041f7-7c03-4f0f-810b-eda1e8f38076	Админ-панель | Сердце Ростова 2	http://localhost:3000/admin	\N	2026-01-11 16:26:00.747071+00	\N
\.


--
-- Data for Name: analytics_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics_session (id, user_id, started_at, last_activity_at, device_type, browser, os, screen_resolution, entry_page, referrer, utm_source, utm_medium, utm_campaign, utm_term, utm_content, country, city) FROM stdin;
1228bd16-f1ee-4852-b269-cafc82cc1cdb	c8071a46-c3b5-408d-8607-e3f0fca56936	2026-01-11 13:09:03.735738+00	2026-01-11 16:26:00.738+00	desktop	Chrome	macOS	1440x932	/admin	http://localhost:3000/admin	\N	\N	\N	\N	\N	\N	\N
5b1914bf-1f58-40d6-bf3d-75927d914b9b	test-superadmin-inventory-2024	2026-01-11 13:55:30.00889+00	2026-01-11 13:59:11.466+00	desktop	Chrome	macOS	1440x932	/	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: apartment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.apartment (id, floor_id, number, type, layout_code) FROM stdin;
584ee546-47b9-472e-92ec-6246bcf482ea	6bcc61e9-baf3-48e1-a402-1da96c06f7da	1	2k	\N
52fe3e97-f75a-4715-8385-ddc256ff633d	6bcc61e9-baf3-48e1-a402-1da96c06f7da	2	2k	\N
832a5ee8-1792-4fa7-9a42-a479618a7c2a	6bcc61e9-baf3-48e1-a402-1da96c06f7da	3	1k	\N
3d59e7da-e196-4596-b1c1-1517051fd8a1	6bcc61e9-baf3-48e1-a402-1da96c06f7da	4	1k	\N
8ad70508-828d-4f6d-af5d-0cf6ed3f3224	6bcc61e9-baf3-48e1-a402-1da96c06f7da	5	2k	\N
7603562c-d4cb-4a78-9d5c-68a87dea1848	6bcc61e9-baf3-48e1-a402-1da96c06f7da	6	1k	\N
bb9903a4-1fc4-48d4-ab07-c950a069be4d	6bcc61e9-baf3-48e1-a402-1da96c06f7da	7	2k	\N
98395858-efb3-4374-9762-ed0ec1274089	6bcc61e9-baf3-48e1-a402-1da96c06f7da	8	1k	\N
da259efd-afee-4201-8429-304a935dd370	6bcc61e9-baf3-48e1-a402-1da96c06f7da	9	1k	\N
474c755d-4c76-4336-9540-af6587f85fff	6bcc61e9-baf3-48e1-a402-1da96c06f7da	10	1k	\N
6d5ee3a9-4d97-4afc-bec9-f0c8968f46ee	6bcc61e9-baf3-48e1-a402-1da96c06f7da	11	3k	\N
fc80c425-8e50-4c6c-adef-c08a346d9144	af7cf218-62c2-4042-8db5-0555e9f17ada	12	2k	\N
bfd64b2f-19c4-4342-b57a-2c0d253cc679	af7cf218-62c2-4042-8db5-0555e9f17ada	13	2k	\N
b594fc1e-0b5f-42aa-832c-f04fef52e236	af7cf218-62c2-4042-8db5-0555e9f17ada	14	1k	\N
1a4272ff-eb6e-4eea-a810-54f0865c43b2	af7cf218-62c2-4042-8db5-0555e9f17ada	15	1k	\N
eac3bd32-37a8-4130-8535-e40babf6bf9c	af7cf218-62c2-4042-8db5-0555e9f17ada	16	2k	\N
564ce686-5974-4ea5-9cb8-ef632287a293	af7cf218-62c2-4042-8db5-0555e9f17ada	17	1k	\N
728c01cd-39ea-46cb-bced-66ad664aa4a3	af7cf218-62c2-4042-8db5-0555e9f17ada	18	2k	\N
d68b197e-dd5c-49a5-9eef-d4bdb2582861	af7cf218-62c2-4042-8db5-0555e9f17ada	19	1k	\N
dc248347-9d7e-4deb-a985-b1dc18fc5852	af7cf218-62c2-4042-8db5-0555e9f17ada	20	1k	\N
d64f3680-6c0c-4231-b254-4221863a92e9	af7cf218-62c2-4042-8db5-0555e9f17ada	21	1k	\N
6702e3e9-d997-43cb-b177-105b4d5e8fdb	af7cf218-62c2-4042-8db5-0555e9f17ada	22	3k	\N
ecbbfa42-f89e-49cb-a248-82855778c3fc	4c56996b-ee15-455a-a9b4-9b2caad45d95	23	2k	\N
25ff7c5c-c826-4fbc-b079-ddcb0410af0c	4c56996b-ee15-455a-a9b4-9b2caad45d95	24	2k	\N
8a0154c0-b6f3-46c2-8c1e-0dbc4a492cb2	4c56996b-ee15-455a-a9b4-9b2caad45d95	25	1k	\N
1dcccf2a-879c-4784-9bd4-1cd78c2091da	4c56996b-ee15-455a-a9b4-9b2caad45d95	26	1k	\N
7fa30a21-c3a8-4309-8785-76978b45a8e3	4c56996b-ee15-455a-a9b4-9b2caad45d95	27	2k	\N
6872a2e4-b887-465e-a2d6-291b189a33b5	4c56996b-ee15-455a-a9b4-9b2caad45d95	28	1k	\N
e7ba1cfc-b4f6-4666-880a-fbdacad56de1	4c56996b-ee15-455a-a9b4-9b2caad45d95	29	2k	\N
6800a444-6a67-4e9c-bf3c-209773c20242	4c56996b-ee15-455a-a9b4-9b2caad45d95	30	1k	\N
e8606bb6-a37f-40b1-b50a-aad7a4688648	4c56996b-ee15-455a-a9b4-9b2caad45d95	31	1k	\N
bcdffa27-fdea-431a-bffe-383f4c6f2ac8	4c56996b-ee15-455a-a9b4-9b2caad45d95	32	1k	\N
b85d4835-187c-427b-b59f-56a5a8875b03	4c56996b-ee15-455a-a9b4-9b2caad45d95	33	3k	\N
188c1b21-e33a-42bf-9446-fdc6ba2f6df3	4880285f-f97e-4f97-ad3a-13cc391e4fba	34	2k	\N
8dbf19d6-d12e-4ba9-80ae-ff60db8b6ae3	4880285f-f97e-4f97-ad3a-13cc391e4fba	35	2k	\N
4aff95f7-1741-48cc-b742-02bd550e9f6f	4880285f-f97e-4f97-ad3a-13cc391e4fba	36	1k	\N
57f04637-a568-4c14-9052-337eb295033b	4880285f-f97e-4f97-ad3a-13cc391e4fba	37	1k	\N
281a5c49-6592-4b8a-a6c8-b7efa6d463cc	4880285f-f97e-4f97-ad3a-13cc391e4fba	38	2k	\N
17c67b1b-f2cf-48f6-bcbf-077b6a3f3446	4880285f-f97e-4f97-ad3a-13cc391e4fba	39	1k	\N
4f6e1003-a725-40c5-943c-6d12a782fba6	4880285f-f97e-4f97-ad3a-13cc391e4fba	40	2k	\N
cdf14a29-dc43-4fe1-9a27-e49ca860c9f0	4880285f-f97e-4f97-ad3a-13cc391e4fba	41	1k	\N
8b741919-8224-40af-8c9c-bfc1790a82d8	4880285f-f97e-4f97-ad3a-13cc391e4fba	42	1k	\N
dd7c9f7f-498c-4675-9602-3a24a3555866	4880285f-f97e-4f97-ad3a-13cc391e4fba	43	1k	\N
6229a6b5-ea8b-44bf-8151-8c8f57d39a66	4880285f-f97e-4f97-ad3a-13cc391e4fba	44	3k	\N
5934b0b4-eee0-43c4-ba56-12c262b17658	1d4a30b3-0253-4839-a656-ea429be2865a	45	2k	\N
aacbba15-3693-495f-97e5-3a7118ec6b88	1d4a30b3-0253-4839-a656-ea429be2865a	46	2k	\N
5d76b3d4-298f-4ea0-9133-9cda8fb0d1ed	1d4a30b3-0253-4839-a656-ea429be2865a	47	1k	\N
808edf62-43ee-4b7a-a359-6702a06c7ffa	1d4a30b3-0253-4839-a656-ea429be2865a	48	1k	\N
c9e18ff4-5831-4220-84a3-90c327eaef4f	1d4a30b3-0253-4839-a656-ea429be2865a	49	2k	\N
52e5fb88-2ae9-492b-9c53-e06ce48ab438	1d4a30b3-0253-4839-a656-ea429be2865a	50	1k	\N
82758b10-e912-424b-8260-d99424d53b31	1d4a30b3-0253-4839-a656-ea429be2865a	51	2k	\N
715c522e-f9fe-4cf9-b231-acbe2d7f6872	1d4a30b3-0253-4839-a656-ea429be2865a	52	1k	\N
0d41c35e-fb2c-4434-a5bd-52b2d366d917	1d4a30b3-0253-4839-a656-ea429be2865a	53	1k	\N
b3da8e01-c1a4-4b3c-9960-ca78de59d6bb	1d4a30b3-0253-4839-a656-ea429be2865a	54	1k	\N
bc2da8c7-090e-48e0-a0b9-9accaef785ef	1d4a30b3-0253-4839-a656-ea429be2865a	55	3k	\N
873de941-214a-4c5c-a00d-a62dd4ba20cb	a4463fbc-2104-4769-8eff-3e07ca248673	56	2k	\N
e3a050fa-03a7-4001-a55d-09a5c975ade6	a4463fbc-2104-4769-8eff-3e07ca248673	57	2k	\N
69116c02-cd53-4a07-b7b8-7e206c576df2	a4463fbc-2104-4769-8eff-3e07ca248673	58	1k	\N
0165772f-a551-4ed2-8734-012545ad077d	a4463fbc-2104-4769-8eff-3e07ca248673	59	1k	\N
317cb7be-55d3-4699-bfe1-2965cf6d27bf	a4463fbc-2104-4769-8eff-3e07ca248673	60	2k	\N
ba1fb418-94f0-4b09-b578-7371b27265e4	a4463fbc-2104-4769-8eff-3e07ca248673	61	1k	\N
bb49283a-a08a-40df-a53c-7b501c32fd24	a4463fbc-2104-4769-8eff-3e07ca248673	62	2k	\N
cc4b2d89-eb24-4652-9485-06e4f1e3a037	a4463fbc-2104-4769-8eff-3e07ca248673	63	1k	\N
0b643b30-7f1c-4120-978e-6c22e1727436	a4463fbc-2104-4769-8eff-3e07ca248673	64	1k	\N
f4aa324a-62e8-401c-9d3b-fa9712c8c8a3	a4463fbc-2104-4769-8eff-3e07ca248673	65	1k	\N
f422013b-64ea-45dd-a64e-8cdbce2fe2ee	a4463fbc-2104-4769-8eff-3e07ca248673	66	3k	\N
7efa2b3d-3edb-4ff1-b3da-acbe7b12687f	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	67	2k	\N
d711bdc2-383b-44de-8232-0af501b2a588	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	68	2k	\N
9efda9f8-9e6e-4777-bb8c-8b7b4faae743	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	69	1k	\N
6041a3aa-3899-4652-b177-07407ab60e59	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	70	1k	\N
e2a5d425-64d3-4b08-aa7b-25018ac138d7	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	71	2k	\N
1b2e86de-eaa6-4647-82ef-b57094238c17	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	72	1k	\N
d93ae720-23a5-4421-9afb-bd9207d3bb42	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	73	2k	\N
a37d3457-cf79-4946-8d4b-e062e93d44eb	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	74	1k	\N
abcb5d46-1294-413b-ad87-a91787441f14	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	75	1k	\N
55e559f2-5368-4472-8c02-fcd15fa073dd	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	76	1k	\N
e154abe9-bb8d-4091-a745-744d0d1a3d08	ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	77	3k	\N
c58ea132-dd35-45df-9079-e222c960b2fc	06757690-b911-422a-b414-79d3659d3b93	78	2k	\N
8f3cdb72-5a57-4bf4-a25b-98ebc4588b18	06757690-b911-422a-b414-79d3659d3b93	79	2k	\N
bf339121-bc03-4a45-99c3-404d9027e631	06757690-b911-422a-b414-79d3659d3b93	80	1k	\N
b5162535-7f0d-4e48-84ca-804b6acb35a3	06757690-b911-422a-b414-79d3659d3b93	81	1k	\N
7a757c50-e8fd-45ab-b4ee-86646a936114	06757690-b911-422a-b414-79d3659d3b93	82	2k	\N
3ce73162-1e3a-45ef-b23c-17f1128ad709	06757690-b911-422a-b414-79d3659d3b93	83	1k	\N
9e15baab-c101-4a15-bd1c-69f93e1998fc	06757690-b911-422a-b414-79d3659d3b93	84	2k	\N
eba164d1-3667-4fdd-b4a9-354f598cbbc0	06757690-b911-422a-b414-79d3659d3b93	85	1k	\N
627ec8b7-02b5-4a74-92c0-a15a0d0ee3e5	06757690-b911-422a-b414-79d3659d3b93	86	1k	\N
1188cbf6-705e-4f19-a2e1-d834a51af5eb	06757690-b911-422a-b414-79d3659d3b93	87	1k	\N
0a765211-6c34-4860-ac94-c269e248d493	06757690-b911-422a-b414-79d3659d3b93	88	3k	\N
b9263e65-2f57-48c0-bc94-e177916d6e9f	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	89	2k	\N
c4a59e86-8435-4dba-b9bf-560f09dd2675	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	90	2k	\N
14df7c85-c5db-45e5-87c1-132e92a7d4b5	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	91	1k	\N
50f820aa-d819-4fbf-946c-02eb2a99894a	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	92	1k	\N
13fa197b-80da-4d96-ba8f-2ef8adaabe0a	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	93	2k	\N
c03ff8eb-3e56-46e7-9e23-39367bf5e12f	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	94	1k	\N
1e3a7624-58bc-4434-886a-64c5e39ee20d	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	95	2k	\N
8b392171-5c2f-4b97-bd39-dd5c9c24d90c	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	96	1k	\N
12f40bd2-53ad-451a-9e79-22900326558d	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	97	1k	\N
8b829ef6-8362-4135-ad9d-62ace6941d21	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	98	1k	\N
727adff4-6608-4c64-a3f1-0b5b8ebbddc2	2b5cf20b-ad0f-40a1-b3cd-0a4393879348	99	3k	\N
e40ba2fa-dc15-4805-b2f8-554ee69cd73f	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	100	2k	\N
b5a2f0bf-cbd9-467f-a696-770d5d68d644	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	101	2k	\N
11f8570b-20dc-471f-86d2-492fc16b2133	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	102	1k	\N
7eb65ca4-436d-4a95-b6d5-cf6d8b252bf9	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	103	1k	\N
915f096b-23e4-47ba-88ab-3152d97733bb	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	104	2k	\N
21dfb862-e61a-4e92-8d24-0afa2d2e4a5c	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	105	1k	\N
acc87940-5755-44e7-a3f6-25105cc6c587	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	106	2k	\N
7056a8f9-d1a6-4586-9d90-4af3ffe9aa6a	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	107	1k	\N
1273d608-0f0d-42b4-9c06-363e4fd58f3b	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	108	1k	\N
e64b0127-0a2c-415a-a224-fd1f01f4189d	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	109	1k	\N
6c2cfcfc-17d0-4dde-8bf3-0933dc2aeda1	8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	110	3k	\N
4db98317-f6a3-41a4-994b-7f7d189dfa59	987e7fe0-816d-410e-9a3b-a0efb20cc621	111	2k	\N
95a55656-8457-47df-a947-d482829d0fd0	987e7fe0-816d-410e-9a3b-a0efb20cc621	112	2k	\N
9655bda9-a7df-4b23-a4fe-8c97862411e2	987e7fe0-816d-410e-9a3b-a0efb20cc621	113	1k	\N
7450a818-5244-4a04-a3ed-157a80fba39b	987e7fe0-816d-410e-9a3b-a0efb20cc621	114	1k	\N
0f9efd59-eb42-4749-aa93-b5d39f66e7e4	987e7fe0-816d-410e-9a3b-a0efb20cc621	115	2k	\N
fc1a0e3c-75a9-42e1-88c3-24451b5556f5	987e7fe0-816d-410e-9a3b-a0efb20cc621	116	1k	\N
b0e07f3a-5324-470c-bbf2-188293bad8ee	987e7fe0-816d-410e-9a3b-a0efb20cc621	117	2k	\N
5e261a5e-84de-488b-a2d5-86cb16e3bc1d	987e7fe0-816d-410e-9a3b-a0efb20cc621	118	1k	\N
ea0abef1-290f-4ef9-a691-73bf92974b87	987e7fe0-816d-410e-9a3b-a0efb20cc621	119	1k	\N
113117e7-7866-46cf-8247-072c00e6ae17	987e7fe0-816d-410e-9a3b-a0efb20cc621	120	1k	\N
48a9e27f-0d2e-4358-acdd-bc18338aa3f0	987e7fe0-816d-410e-9a3b-a0efb20cc621	121	3k	\N
fa40b73e-bb48-43d4-8c3a-e3153e850966	1d107470-0807-4ef3-a187-463d6757cb47	122	2k	\N
31fbc26e-d933-4dc1-b308-97d6550faf14	1d107470-0807-4ef3-a187-463d6757cb47	123	2k	\N
1d1e6974-fa03-4d4b-a655-f5ce4dc7b9f9	1d107470-0807-4ef3-a187-463d6757cb47	124	1k	\N
7b2abb9d-70f7-4c6e-92b5-b75384fbca35	1d107470-0807-4ef3-a187-463d6757cb47	125	1k	\N
8ec9d2c0-ac6c-462a-84b3-010e90b9265f	1d107470-0807-4ef3-a187-463d6757cb47	126	2k	\N
da157cbb-446e-4356-b431-6009f8795352	1d107470-0807-4ef3-a187-463d6757cb47	127	1k	\N
db74c845-8b93-4408-b4d1-e2b5fe4f1316	1d107470-0807-4ef3-a187-463d6757cb47	128	2k	\N
590a6acf-6ffd-4f9f-bb88-e549fdc58209	1d107470-0807-4ef3-a187-463d6757cb47	129	1k	\N
331a0494-8b07-4a88-9efd-2bfd769cfc84	1d107470-0807-4ef3-a187-463d6757cb47	130	1k	\N
08335969-708c-4565-8056-ee3250d14888	1d107470-0807-4ef3-a187-463d6757cb47	131	1k	\N
0901b5fa-f54c-4082-9a60-2849caaf2696	1d107470-0807-4ef3-a187-463d6757cb47	132	3k	\N
980a738b-52ed-44e1-bd8d-98c31567f451	6621008a-64f2-46dc-afce-f324f497d0ed	133	2k	\N
6559ec1d-bad2-4592-a62f-44c955acf389	6621008a-64f2-46dc-afce-f324f497d0ed	134	2k	\N
0a993700-3e45-4c45-a168-7edb66eb2e65	6621008a-64f2-46dc-afce-f324f497d0ed	135	1k	\N
1c469cc7-2382-4850-a1bd-c3219e04c7b2	6621008a-64f2-46dc-afce-f324f497d0ed	136	1k	\N
4d8ede93-bd9f-4876-898b-72f1a3fd289f	6621008a-64f2-46dc-afce-f324f497d0ed	137	2k	\N
fbf20ccc-f95d-4342-a409-83c23f45a0b2	6621008a-64f2-46dc-afce-f324f497d0ed	138	1k	\N
e38d5a53-095b-4ada-b730-0e2228180ab3	6621008a-64f2-46dc-afce-f324f497d0ed	139	2k	\N
afca1e81-c713-464f-a67d-784f31621b3c	6621008a-64f2-46dc-afce-f324f497d0ed	140	1k	\N
7c79c81f-4843-42f2-a940-0f74e2fa1fee	6621008a-64f2-46dc-afce-f324f497d0ed	141	1k	\N
737ba4dc-fc2e-4139-ace2-744a9d849f25	6621008a-64f2-46dc-afce-f324f497d0ed	142	1k	\N
a2eb05fe-c896-4fce-b432-0ee763811d5c	6621008a-64f2-46dc-afce-f324f497d0ed	143	3k	\N
ef49f544-4eeb-4fb4-ac3f-14c8a6f36315	d1a9b2ee-a9c2-4258-ae85-8bc616737393	144	2k	\N
5e808474-2739-41ce-a225-e0694b4d16a8	d1a9b2ee-a9c2-4258-ae85-8bc616737393	145	2k	\N
595f56d3-1f05-49d2-99ee-696497d46b38	d1a9b2ee-a9c2-4258-ae85-8bc616737393	146	1k	\N
52f82bba-cf16-4f15-9846-8e0b8f2612ad	d1a9b2ee-a9c2-4258-ae85-8bc616737393	147	1k	\N
7d81afe2-fd02-4c41-96ec-7bb726d21899	d1a9b2ee-a9c2-4258-ae85-8bc616737393	148	2k	\N
7bcb47cd-7f57-4e6e-a708-fadaaaf7bdce	d1a9b2ee-a9c2-4258-ae85-8bc616737393	149	1k	\N
1871a312-c695-4891-bde1-391bac4c9eae	d1a9b2ee-a9c2-4258-ae85-8bc616737393	150	2k	\N
b35fe5bc-9ec7-4f4a-b9fa-52810e742b9b	d1a9b2ee-a9c2-4258-ae85-8bc616737393	151	1k	\N
6e569c67-3cda-44b8-be29-6287d5569fdf	d1a9b2ee-a9c2-4258-ae85-8bc616737393	152	1k	\N
d1d9ce17-e1b3-48c1-adfc-be45d43e303a	d1a9b2ee-a9c2-4258-ae85-8bc616737393	153	1k	\N
ec8ed5f8-a694-443f-84b8-24955f39c021	d1a9b2ee-a9c2-4258-ae85-8bc616737393	154	3k	\N
3a836aae-fb8c-47dc-8599-10e8302ef9c7	b908d372-161b-4a4e-a140-6581e81501cc	155	2k	\N
60384ef3-2453-417f-9006-8582e9e1385b	b908d372-161b-4a4e-a140-6581e81501cc	156	2k	\N
4d385987-946d-430a-87fe-994a964c55a4	b908d372-161b-4a4e-a140-6581e81501cc	157	1k	\N
022ebcaf-49fa-4ef9-8b24-fbf76c56c058	b908d372-161b-4a4e-a140-6581e81501cc	158	1k	\N
fdb41b53-c550-4caf-b3bf-120cc237b14b	b908d372-161b-4a4e-a140-6581e81501cc	159	2k	\N
9e62dbb6-e923-4ff3-936e-9a744cc4ea83	b908d372-161b-4a4e-a140-6581e81501cc	160	1k	\N
d100b52e-ca76-474e-a0a2-7fa6086aa0b1	b908d372-161b-4a4e-a140-6581e81501cc	161	2k	\N
b444e573-bd26-467f-b963-f082a3fe972b	b908d372-161b-4a4e-a140-6581e81501cc	162	1k	\N
722276e8-e278-46c1-9ce9-246af106aa2e	b908d372-161b-4a4e-a140-6581e81501cc	163	1k	\N
2a934d80-6ad8-4e10-9609-289f7b67d19d	b908d372-161b-4a4e-a140-6581e81501cc	164	1k	\N
788e502d-c7bf-4b9c-b652-5b84bf86e555	b908d372-161b-4a4e-a140-6581e81501cc	165	3k	\N
e7b8fa1e-7f8e-4089-a732-a7a3ab427513	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	166	2k	\N
35390a76-eebf-4c49-9e1e-7bfb1d69b6ad	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	167	2k	\N
f1cc6258-098e-47b3-b993-80f26b2d4006	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	168	1k	\N
842e0cb2-df21-461a-aaae-8eb295ae249b	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	169	1k	\N
91d8d618-c8fc-433d-9090-5355ed8f2f0f	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	170	2k	\N
a1a141f6-de56-4b5b-8b01-b054e1db6af8	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	171	1k	\N
8c7c8288-7972-4e2c-8f5f-81db83718e14	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	172	2k	\N
b462aa9f-b48b-4881-b9da-74594b0cfb9b	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	173	1k	\N
eada0bb7-c6c1-4c4e-8d03-375504978a74	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	174	1k	\N
51b8a2ab-d87f-4347-86c9-2bd84d8a1c32	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	175	1k	\N
8207de51-bc37-4378-ad4c-4dec466a239d	b3a07ec5-797f-4a73-91c6-fd3d34ed594d	176	3k	\N
75e4a8f3-3c83-4cea-9841-729f18a27316	24f5e234-a7cd-49e4-946a-1726f72f3602	177	2k	\N
d1575a11-6362-4174-a990-d13bcca64a1a	24f5e234-a7cd-49e4-946a-1726f72f3602	178	2k	\N
d454824a-368a-43b0-b477-c34ca4687de1	24f5e234-a7cd-49e4-946a-1726f72f3602	179	1k	\N
687cbd06-9a4e-4917-8005-97d6100da916	24f5e234-a7cd-49e4-946a-1726f72f3602	180	1k	\N
9a6decdf-d68b-46fa-9881-affc05bd1d2b	24f5e234-a7cd-49e4-946a-1726f72f3602	181	2k	\N
df61aa8a-4db7-4f7e-b88b-ee03a88142f3	24f5e234-a7cd-49e4-946a-1726f72f3602	182	1k	\N
657d8a7d-8062-4ea7-aa85-da3f7c64bfea	24f5e234-a7cd-49e4-946a-1726f72f3602	183	2k	\N
d278b36b-8fed-44ae-a2dd-bbe12df9c636	24f5e234-a7cd-49e4-946a-1726f72f3602	184	1k	\N
65b9607b-c7f6-43ce-ad3c-5d1668aa0c03	24f5e234-a7cd-49e4-946a-1726f72f3602	185	1k	\N
ec33fba0-c64c-4a68-8fb1-b23e96d7ac3c	24f5e234-a7cd-49e4-946a-1726f72f3602	186	1k	\N
1c4fe0eb-e760-423e-b31c-362fb3b1eed5	24f5e234-a7cd-49e4-946a-1726f72f3602	187	3k	\N
a25d4325-2cd4-48e7-9c39-3eef514581ef	96e7720d-4ab9-4096-8d12-4825385d711f	188	2k	\N
f719b971-3aa2-454f-80be-8631e5a44e73	96e7720d-4ab9-4096-8d12-4825385d711f	189	2k	\N
c9cb7b75-6aa6-47c0-8721-45e4bd6aac3f	96e7720d-4ab9-4096-8d12-4825385d711f	190	1k	\N
e28a5808-ebe4-443f-bde2-78574523e72c	96e7720d-4ab9-4096-8d12-4825385d711f	191	1k	\N
0f172145-2591-4fc7-ba26-0944259e1d94	96e7720d-4ab9-4096-8d12-4825385d711f	192	2k	\N
9974b6e0-9cbf-4ca9-ad43-92598e414fb5	96e7720d-4ab9-4096-8d12-4825385d711f	193	1k	\N
3c6b53c4-5c23-44c2-ab97-2c38832c7bdc	96e7720d-4ab9-4096-8d12-4825385d711f	194	2k	\N
3423cf8b-bf45-4482-a6e6-c634d64d5190	96e7720d-4ab9-4096-8d12-4825385d711f	195	1k	\N
5da56be9-be2b-40c1-9362-57b6d8e0b8b5	96e7720d-4ab9-4096-8d12-4825385d711f	196	1k	\N
a19b78c1-e52b-42b7-ac75-76ce4cfe2cf3	96e7720d-4ab9-4096-8d12-4825385d711f	197	1k	\N
c104194b-69d2-420d-a668-71fb66889657	96e7720d-4ab9-4096-8d12-4825385d711f	198	3k	\N
61a03e90-e83f-4092-a50a-4a3a767ef1ee	8e65f253-aab8-4564-a9d4-01f036e58515	199	2k	\N
de469a04-749e-4841-b8f9-985ff6444a8e	8e65f253-aab8-4564-a9d4-01f036e58515	200	2k	\N
cef30d75-1cfe-4234-abd5-22fe8d507b5b	8e65f253-aab8-4564-a9d4-01f036e58515	201	1k	\N
36ea4ee5-f33d-4955-9b92-237c30c83854	8e65f253-aab8-4564-a9d4-01f036e58515	202	1k	\N
1c2d73de-c4d7-4ae9-8a2a-a03bfa8421e8	8e65f253-aab8-4564-a9d4-01f036e58515	203	2k	\N
588a9c7b-5805-44cd-9cfb-3d5a1bb275b4	8e65f253-aab8-4564-a9d4-01f036e58515	204	1k	\N
bd895f45-81c3-47e8-b54e-1bfd9265d681	8e65f253-aab8-4564-a9d4-01f036e58515	205	2k	\N
22f50253-a59e-49a6-9efe-a7911c028014	8e65f253-aab8-4564-a9d4-01f036e58515	206	1k	\N
dfcd708c-e71d-461a-beb8-fee34f582e15	8e65f253-aab8-4564-a9d4-01f036e58515	207	1k	\N
fb1ffc4f-c94d-4b9b-8188-e9b05215908d	8e65f253-aab8-4564-a9d4-01f036e58515	208	1k	\N
32271528-e180-4701-9a4c-53879046b3b6	8e65f253-aab8-4564-a9d4-01f036e58515	209	3k	\N
99034f16-a54c-4cfe-b1fc-d65c1bb0dd8f	e7d12919-a237-408e-81a1-c503ea5c849c	210	2k	\N
eca357bd-5d81-4de5-badb-bceaeaac32ae	e7d12919-a237-408e-81a1-c503ea5c849c	211	2k	\N
fe7ede9f-b0ca-42c1-8e48-19404d591947	e7d12919-a237-408e-81a1-c503ea5c849c	212	1k	\N
6d52721d-1152-42bd-9af6-09a1cfa82c09	e7d12919-a237-408e-81a1-c503ea5c849c	213	1k	\N
1878060e-28dd-4198-90f9-9e8837c89162	e7d12919-a237-408e-81a1-c503ea5c849c	214	2k	\N
5d866f87-b724-4a3e-80b0-8d019201b4db	e7d12919-a237-408e-81a1-c503ea5c849c	215	1k	\N
79eaf9b4-1436-4812-838b-28eab9a23c2e	e7d12919-a237-408e-81a1-c503ea5c849c	216	2k	\N
b8a60784-ee84-4b71-87d5-3be84c874ba5	e7d12919-a237-408e-81a1-c503ea5c849c	217	1k	\N
ebd1a410-547e-4868-ba71-9d7fac386909	e7d12919-a237-408e-81a1-c503ea5c849c	218	1k	\N
4926b85e-7b14-456f-87ef-f6a44ef68a42	e7d12919-a237-408e-81a1-c503ea5c849c	219	1k	\N
6283564f-8178-4b48-9c51-a192dd6df2e1	e7d12919-a237-408e-81a1-c503ea5c849c	220	3k	\N
770b9dc7-510c-4de6-acd9-bcf85a50d57c	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	221	2k	\N
f733bc81-f5a4-4cf5-a67f-36a7ad35f0f8	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	222	2k	\N
48c96d0c-f88e-4e60-8be1-fe9dc3be997d	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	223	1k	\N
5082ec0e-1f7c-476a-a0c6-b875aee5da3b	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	224	1k	\N
62acc48f-86d4-4fc2-a228-1a8eb964503c	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	225	2k	\N
dfdb1351-09ab-4dcb-80f7-18bf3d697501	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	226	1k	\N
ac2a71dd-03d9-45a5-b3c9-c8d30d9fdbfc	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	227	2k	\N
0e7f0fdd-e3ce-427b-af15-21c9a36cb807	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	228	1k	\N
a2a69e0f-3892-443f-b404-fceb16f75b70	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	229	1k	\N
4e6bac4c-e8ed-4d63-821b-2ba4b861427d	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	230	1k	\N
f2928525-72d8-406c-a7c8-c7a9b2ff36b9	e20aaab9-67ac-4a4e-9a19-4e768c0d715f	231	3k	\N
61a2249d-8b95-4050-ae50-662218b734fe	1f372600-f0c4-45b0-a26b-c0cf9caee35f	232	2k	\N
d29fc418-43ab-478b-81ab-900f7ea8ae81	1f372600-f0c4-45b0-a26b-c0cf9caee35f	233	2k	\N
f528d44f-286c-4a9e-ab32-593ac78a7e34	1f372600-f0c4-45b0-a26b-c0cf9caee35f	234	1k	\N
a8dca099-22ca-4ac0-84db-c3d957fa32b5	1f372600-f0c4-45b0-a26b-c0cf9caee35f	235	1k	\N
30f3b969-53df-47c2-b63e-79212db9b919	1f372600-f0c4-45b0-a26b-c0cf9caee35f	236	2k	\N
6b7e42f4-bb79-4ec7-b269-32950c147fa0	1f372600-f0c4-45b0-a26b-c0cf9caee35f	237	1k	\N
29911be1-51a0-4422-9cbd-ca9dd2b2978d	1f372600-f0c4-45b0-a26b-c0cf9caee35f	238	2k	\N
8cc676a3-9f70-4ea0-b939-d566cdccf717	1f372600-f0c4-45b0-a26b-c0cf9caee35f	239	1k	\N
09cdda38-81ad-443b-83a2-cde19173c74a	1f372600-f0c4-45b0-a26b-c0cf9caee35f	240	1k	\N
81655282-a78b-4a64-adcc-54d1ec5ac950	1f372600-f0c4-45b0-a26b-c0cf9caee35f	241	1k	\N
e12bccf9-38ab-4f2a-93f6-7070dba058dd	1f372600-f0c4-45b0-a26b-c0cf9caee35f	242	3k	\N
a426709b-7ea7-4aad-b9f7-6e1a3e07fc58	91a0607a-e00e-4b06-9a34-b93446a7f8c1	243	2k	\N
28bfb2e1-36a1-4e21-ad7b-c9b79006cce6	91a0607a-e00e-4b06-9a34-b93446a7f8c1	244	2k	\N
6ac4a88b-fcb2-4871-adc4-d353c1598d8f	91a0607a-e00e-4b06-9a34-b93446a7f8c1	245	1k	\N
f5de5ba8-b826-4db3-af6d-cf345998270b	91a0607a-e00e-4b06-9a34-b93446a7f8c1	246	1k	\N
c6d93a92-dc04-4df3-9a7b-a5444ca9fbf4	91a0607a-e00e-4b06-9a34-b93446a7f8c1	247	2k	\N
36243bf8-bb0a-4473-9273-16e8f63e8d56	91a0607a-e00e-4b06-9a34-b93446a7f8c1	248	1k	\N
07d5591b-1e1b-4db2-8fc9-f4750644d419	91a0607a-e00e-4b06-9a34-b93446a7f8c1	249	2k	\N
38fecd8d-ba72-430f-8ec5-30d08f873365	91a0607a-e00e-4b06-9a34-b93446a7f8c1	250	1k	\N
c4c813c5-fff8-4cfc-b54f-781a9cb7bfe4	91a0607a-e00e-4b06-9a34-b93446a7f8c1	251	1k	\N
16cf0d81-0d47-425f-af9a-20579396b1d0	91a0607a-e00e-4b06-9a34-b93446a7f8c1	252	1k	\N
8a967d66-2ed9-46ab-946c-3ac2096f16cd	91a0607a-e00e-4b06-9a34-b93446a7f8c1	253	3k	\N
0f635fd8-4e53-46ee-8082-62f9dc619ec1	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	254	2k	\N
f0ee2609-b173-4697-a680-b06919356615	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	255	2k	\N
12d2fe11-45f5-40d4-96d7-6a6cfec5ce86	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	256	1k	\N
1c342f92-328a-4dcf-b68e-0619d0629300	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	257	1k	\N
e7f18e0d-dde2-4daf-bb40-3e6b5543e1d1	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	258	2k	\N
6ef164da-e71e-4f38-b429-62916bbd324e	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	259	1k	\N
d88a5ca5-c935-4b02-b7cc-c4f58bea231c	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	260	2k	\N
7e5c9846-e8ea-4b87-807c-80326cdb696e	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	261	1k	\N
0e4ce022-3751-42c0-844a-18ad93ba372c	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	262	1k	\N
c7ee866e-2009-46db-9d0f-1026d8312440	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	263	1k	\N
aebb7791-31b7-400d-9e97-65786bc0eb3c	202bd2bd-4b89-4c66-94a9-a9ffa3aac491	264	3k	\N
065d9a61-c653-41ab-accf-9ca5bbc562b6	ed6f9ec7-cf65-4844-9829-56a6366677b7	265	2k	\N
efedeacf-a55e-4770-a484-3b82d4e26053	ed6f9ec7-cf65-4844-9829-56a6366677b7	266	2k	\N
1cab6805-1152-4b65-9631-fe4a28e0feca	ed6f9ec7-cf65-4844-9829-56a6366677b7	267	1k	\N
064e64cd-9fb4-4f61-a4cc-ce975a3fe087	ed6f9ec7-cf65-4844-9829-56a6366677b7	268	1k	\N
e5028ade-28ec-4f1b-84ad-acca4271ce09	ed6f9ec7-cf65-4844-9829-56a6366677b7	269	2k	\N
3c4cd2df-562e-47fc-a6d1-c32c616df08f	ed6f9ec7-cf65-4844-9829-56a6366677b7	270	1k	\N
35d081b7-ff3d-4218-85e7-5b7f98fed68c	ed6f9ec7-cf65-4844-9829-56a6366677b7	271	2k	\N
f6b97dbf-4b62-42e7-bbd4-94ab08fd6358	ed6f9ec7-cf65-4844-9829-56a6366677b7	272	1k	\N
f64f1560-02b7-4f77-ba08-d90561569ae6	ed6f9ec7-cf65-4844-9829-56a6366677b7	273	1k	\N
aa6a020a-3d7d-47ba-a633-5f4c3c65133d	ed6f9ec7-cf65-4844-9829-56a6366677b7	274	1k	\N
decb3272-e50a-4307-8ba4-95f63c67d332	ed6f9ec7-cf65-4844-9829-56a6366677b7	275	3k	\N
1d80c633-0f14-4ff8-981c-c2b1fbfff254	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	276	2k	\N
85d30e1e-29a1-49e1-bd09-9dc38bbd43c2	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	277	2k	\N
5ff87842-6489-480d-b765-71d2e1406e6a	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	278	1k	\N
936b752f-5d95-4474-983f-8c068c6ae362	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	279	1k	\N
0b901ac5-9e81-43ab-8675-e0f9035e8290	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	280	2k	\N
7a997f87-56ed-4431-ba54-62c28632b376	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	281	1k	\N
2878232d-61f2-4072-8a78-7e5264a56d15	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	282	2k	\N
fbb08ee2-92b4-46da-adaa-acc6028fb900	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	283	1k	\N
85d85809-6f2d-47f4-b013-4308f1ca2920	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	284	1k	\N
d3208215-f1ba-4d12-a981-2d7f74b03d6d	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	285	1k	\N
fc5dbbd8-dfca-4962-b7eb-bfce83249083	bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	286	3k	\N
8713041f-0dd5-4ba8-9fc6-eeb36744989d	d0f2c755-4acb-4d91-ae54-bf85315b6920	287	2k	\N
d0519f1e-3575-4c6a-86a4-c4cc49b74118	d0f2c755-4acb-4d91-ae54-bf85315b6920	288	2k	\N
cef95fcc-99a7-4b92-9485-f02ce4be7bc3	d0f2c755-4acb-4d91-ae54-bf85315b6920	289	1k	\N
64c1de4a-591c-4df6-9a42-95578d477970	d0f2c755-4acb-4d91-ae54-bf85315b6920	290	1k	\N
925a0874-d075-4c59-b7d4-5ae22a2c0856	d0f2c755-4acb-4d91-ae54-bf85315b6920	291	2k	\N
9e666f91-cb0a-49c6-aa76-a25586aec2f5	d0f2c755-4acb-4d91-ae54-bf85315b6920	292	1k	\N
db17b1d4-5fe7-49cc-b7f2-c879676e12eb	d0f2c755-4acb-4d91-ae54-bf85315b6920	293	2k	\N
fb5290bf-c950-461c-8514-f83295ee705a	d0f2c755-4acb-4d91-ae54-bf85315b6920	294	1k	\N
e8479ae4-52d2-4918-b9cb-29eb823d7f72	d0f2c755-4acb-4d91-ae54-bf85315b6920	295	1k	\N
594513a1-d1f5-49f2-bd18-4cdc5cdb9e62	d0f2c755-4acb-4d91-ae54-bf85315b6920	296	1k	\N
b13905c1-81e3-4230-b775-a1331b4504f6	d0f2c755-4acb-4d91-ae54-bf85315b6920	297	3k	\N
ee507042-a6a1-4d2b-8c71-f348e7a2e781	8fa822a2-8b6c-4062-909f-74c8138c5dc9	298	2k	\N
ee6ffabd-80c6-4b33-afdd-72aaa9dc2c1f	8fa822a2-8b6c-4062-909f-74c8138c5dc9	299	2k	\N
c1e4df5b-3912-42d2-bfb4-3a53ec399994	8fa822a2-8b6c-4062-909f-74c8138c5dc9	300	1k	\N
5424900d-cab8-4192-9d5f-2e4513dbb0ad	8fa822a2-8b6c-4062-909f-74c8138c5dc9	301	1k	\N
b748d508-d053-4def-91b7-c2a1669287bb	8fa822a2-8b6c-4062-909f-74c8138c5dc9	302	2k	\N
ed672f0e-a948-44f4-b853-785772bcdb22	8fa822a2-8b6c-4062-909f-74c8138c5dc9	303	1k	\N
a06b6623-aef1-4867-829e-13ff5f8d3993	8fa822a2-8b6c-4062-909f-74c8138c5dc9	304	2k	\N
74db9f11-6684-43a0-a6e5-e5c4f54e5e7f	8fa822a2-8b6c-4062-909f-74c8138c5dc9	305	1k	\N
3ad0389b-16e5-4029-b355-d87f15c48b51	8fa822a2-8b6c-4062-909f-74c8138c5dc9	306	1k	\N
f95bc7f5-75af-4276-b6ea-2eeb122bd48d	8fa822a2-8b6c-4062-909f-74c8138c5dc9	307	1k	\N
387b0133-a2f2-4916-bb14-600c9e31cccc	8fa822a2-8b6c-4062-909f-74c8138c5dc9	308	3k	\N
f5626fc0-e4c2-47f1-bbde-4a719ffa87cf	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	309	2k	\N
1a2d0cd6-0067-42e2-ab81-3adf0c0c602e	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	310	2k	\N
c9161271-a7d6-4b12-b050-eaf2558b1e81	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	311	1k	\N
8917c54f-c79c-4088-ae15-17dd333ab5f5	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	312	1k	\N
2b313ea6-678a-4109-af5e-07a172dee92f	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	313	2k	\N
a7f82e0b-d969-406b-8f63-7cf4c1c9a0b0	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	314	1k	\N
38d4ea0c-c3ce-49aa-9cfe-7601686a4ac8	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	315	2k	\N
3e114c63-086e-4150-8b26-b08aa55ead50	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	316	1k	\N
2dcffe97-971f-4391-af4d-9db11b6c20d9	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	317	1k	\N
af972977-0847-4064-addb-b257a9f2bcfe	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	318	1k	\N
e9addd1d-64d1-462f-9b8e-8da19ad1c595	2891d9b1-dd4a-41b9-bb95-d7d2b917c302	319	3k	\N
a2327594-6c33-4a96-9dfb-0a87c69b4478	06f3c97d-ea82-4f12-92ca-7e260b87f370	320	2k	\N
6e5465fd-27cf-414a-b9df-0bacaea0d3b5	06f3c97d-ea82-4f12-92ca-7e260b87f370	321	2k	\N
29e5066f-3a78-4d23-b98e-4cdc355b16f8	06f3c97d-ea82-4f12-92ca-7e260b87f370	322	1k	\N
1d3f5c9b-97b4-46ef-89a5-47b3864bbbe5	06f3c97d-ea82-4f12-92ca-7e260b87f370	323	1k	\N
d60c32a1-547f-4c9a-90f7-d8c41cc237d4	06f3c97d-ea82-4f12-92ca-7e260b87f370	324	2k	\N
6d8e0797-ddc6-4534-8a7b-5a4f436a1e98	06f3c97d-ea82-4f12-92ca-7e260b87f370	325	1k	\N
3b7437e6-bef9-48b4-b802-53efcde1328f	06f3c97d-ea82-4f12-92ca-7e260b87f370	326	2k	\N
875fb50d-808a-4b52-ad17-14d4971d7cd1	06f3c97d-ea82-4f12-92ca-7e260b87f370	327	1k	\N
4a32853d-5df4-4b1b-b952-241de09b9dc3	06f3c97d-ea82-4f12-92ca-7e260b87f370	328	1k	\N
46775769-d2b1-4ba2-9444-0917c006c4f3	06f3c97d-ea82-4f12-92ca-7e260b87f370	329	1k	\N
e9e88465-78af-403a-9278-244a3ba71ad0	06f3c97d-ea82-4f12-92ca-7e260b87f370	330	3k	\N
7c3f85ea-c97b-4e29-a9c2-efb145f20ac5	4b72bf4f-929b-4f6b-809c-13d879c6b61b	331	2k	\N
8f1c4a39-dcad-4860-aa88-25499ab9b088	4b72bf4f-929b-4f6b-809c-13d879c6b61b	332	2k	\N
d3bc0a77-1a43-47a4-b60b-08a9ee8a800c	4b72bf4f-929b-4f6b-809c-13d879c6b61b	333	1k	\N
c0c59f66-e8e9-4e3c-8ec2-86257984c606	4b72bf4f-929b-4f6b-809c-13d879c6b61b	334	1k	\N
db9a291a-1695-44cf-b04a-4d650abbdca9	4b72bf4f-929b-4f6b-809c-13d879c6b61b	335	2k	\N
8f9e96c7-af50-467a-8660-88da359fb0c2	4b72bf4f-929b-4f6b-809c-13d879c6b61b	336	1k	\N
f00bdd55-f549-4587-a470-398513a912d2	4b72bf4f-929b-4f6b-809c-13d879c6b61b	337	2k	\N
0af79282-3724-4548-830d-83e32c49b404	4b72bf4f-929b-4f6b-809c-13d879c6b61b	338	1k	\N
cf9d9007-0305-46e9-9ea9-9843a5e1f302	4b72bf4f-929b-4f6b-809c-13d879c6b61b	339	1k	\N
4fb09ec4-0a17-433e-823b-38537aa4de3f	4b72bf4f-929b-4f6b-809c-13d879c6b61b	340	1k	\N
43ecb48f-60da-46be-836e-46621374be82	4b72bf4f-929b-4f6b-809c-13d879c6b61b	341	3k	\N
79083c76-c0ae-4dae-8ce0-9e34308a0976	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	342	2k	\N
b809d4a3-4aa0-418c-bf73-5a1654c6e0c7	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	343	2k	\N
f7769b74-38a7-4fb1-8979-b5e27f82f97f	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	344	1k	\N
3c295ab0-c6d7-4980-981e-f34a7e30daae	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	345	1k	\N
ac3f278f-6bc5-4300-84c7-e2c284e7d48d	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	346	2k	\N
6fe6090a-4bad-41a8-bd2f-80c1c34496ac	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	347	1k	\N
08457df0-cf9b-4059-9918-882c6f94e032	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	348	2k	\N
33bc5f9f-f618-4725-a57a-77f76a4e48dd	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	349	1k	\N
265e9688-fb17-45af-a5bb-17ee9d4426b9	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	350	1k	\N
24ff5a6c-8629-4e46-a96a-b7006dd7ef21	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	351	1k	\N
f5824733-18fc-4aa4-963b-3c49f3d3ed35	5563f6dc-79ad-4fdb-af4b-b809058cc3e0	352	3k	\N
193fc6af-1f11-4744-9414-505ce6c3c462	ff2a6dba-f069-49a2-8f51-0b14027457b1	353	2k	\N
0cc64145-142e-4a2f-98f3-d2119fffdb87	ff2a6dba-f069-49a2-8f51-0b14027457b1	354	2k	\N
b64feefe-1ce1-4489-8b5e-8bd0ddeca2af	ff2a6dba-f069-49a2-8f51-0b14027457b1	355	1k	\N
5d51b19a-435b-470d-be56-ea488ab8c51d	ff2a6dba-f069-49a2-8f51-0b14027457b1	356	1k	\N
3ef9a52e-2866-428b-9e2f-007906d9ef68	ff2a6dba-f069-49a2-8f51-0b14027457b1	357	2k	\N
57fb825e-6ba7-44dc-840d-ebcaddedf51a	ff2a6dba-f069-49a2-8f51-0b14027457b1	358	1k	\N
331413e8-43a8-43bd-b206-7a554d16fe3e	ff2a6dba-f069-49a2-8f51-0b14027457b1	359	2k	\N
5ab89660-9e28-4f33-bb66-1c08a79d1d2e	ff2a6dba-f069-49a2-8f51-0b14027457b1	360	1k	\N
2e6f4297-7427-461a-b855-463f52c7073d	ff2a6dba-f069-49a2-8f51-0b14027457b1	361	1k	\N
96b9822b-9c7c-43c1-87e0-1ac07f3ed672	ff2a6dba-f069-49a2-8f51-0b14027457b1	362	1k	\N
d39887fd-6dab-4064-98dd-d6ad112599e6	ff2a6dba-f069-49a2-8f51-0b14027457b1	363	3k	\N
23103307-7332-47ce-86c7-295cbd029fe3	3251fa94-66cd-4dde-a572-95a0c0733755	364	2k	\N
a53e0399-f593-451b-9509-99c72c5b9ab2	3251fa94-66cd-4dde-a572-95a0c0733755	365	2k	\N
1b14ea1e-e339-47e0-bb61-572dc4469856	3251fa94-66cd-4dde-a572-95a0c0733755	366	1k	\N
2e940b48-2133-43ee-95d7-e0d7ada31946	3251fa94-66cd-4dde-a572-95a0c0733755	367	1k	\N
d719b65f-a5c7-4ee3-90c9-bffdcfc0a398	3251fa94-66cd-4dde-a572-95a0c0733755	368	2k	\N
fe52d671-11fe-490a-9148-d8dccadae683	3251fa94-66cd-4dde-a572-95a0c0733755	369	1k	\N
ea26ee06-94b3-4400-a6a3-6a90896d314e	3251fa94-66cd-4dde-a572-95a0c0733755	370	2k	\N
f8da29bc-3796-4d14-bc2b-7fc5109e3939	3251fa94-66cd-4dde-a572-95a0c0733755	371	1k	\N
ac106041-0e70-40d3-a2bd-d90fa421e758	3251fa94-66cd-4dde-a572-95a0c0733755	372	1k	\N
961b9db0-1343-465b-84c8-542620b4bc5d	3251fa94-66cd-4dde-a572-95a0c0733755	373	1k	\N
f05b8b89-9e5b-494d-8d7f-9956e9a85e65	3251fa94-66cd-4dde-a572-95a0c0733755	374	3k	\N
5b4120df-be19-47d1-bd13-088f2972cad4	0b17fef4-4a58-4092-b290-d7e8224f6c00	375	2k	\N
5c5c9588-f52a-44ab-b013-f0ad179141c6	0b17fef4-4a58-4092-b290-d7e8224f6c00	376	2k	\N
0754d504-d497-4ed8-a7e5-894163b59dd1	0b17fef4-4a58-4092-b290-d7e8224f6c00	377	1k	\N
f13fda2d-9bb3-41be-af06-7e2b53974ae6	0b17fef4-4a58-4092-b290-d7e8224f6c00	378	1k	\N
a95eb379-59df-4f57-926d-2eee19cda85a	0b17fef4-4a58-4092-b290-d7e8224f6c00	379	2k	\N
ed78666b-25d2-44d1-bd82-a8dc6d021110	0b17fef4-4a58-4092-b290-d7e8224f6c00	380	1k	\N
7486a432-e6ee-46ce-8b26-ffb6d52f5432	0b17fef4-4a58-4092-b290-d7e8224f6c00	381	2k	\N
749ee937-e0c3-4d7d-9c3a-1ebdcd56f6b8	0b17fef4-4a58-4092-b290-d7e8224f6c00	382	1k	\N
b3e3365d-4450-4993-a8af-96cb2dde958e	0b17fef4-4a58-4092-b290-d7e8224f6c00	383	1k	\N
be752869-9019-46f3-b0ab-f4b4cbb80038	0b17fef4-4a58-4092-b290-d7e8224f6c00	384	1k	\N
0c32e053-915f-4b97-9d7e-e1e4511be37f	0b17fef4-4a58-4092-b290-d7e8224f6c00	385	3k	\N
34d9c50f-7484-4ca3-af7b-040b4fd00240	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	386	2k	\N
ec1b165c-df2b-41fe-b6ed-aa95d85af935	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	387	2k	\N
ed557164-4387-4715-ad39-91b72391e983	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	388	1k	\N
8c336a94-07f1-4630-809f-0093eaf665d0	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	389	1k	\N
8f20b5bd-2497-4441-b4d3-a54a5bfcbbc2	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	390	2k	\N
e7caaefb-2e3d-4558-9e8c-170a3731df7f	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	391	1k	\N
fcd261e2-00fa-483d-aace-fc1d76273524	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	392	2k	\N
1817230e-62c3-48f4-9039-10fc89d6774e	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	393	1k	\N
e1364cb4-b82d-40af-99df-d0c84fc9f095	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	394	1k	\N
c2e3c388-675b-42c1-9b13-46f4dcf350ba	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	395	1k	\N
b08ec2d3-a09e-4065-82a0-074fbc3ed7e4	8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	396	3k	\N
9e53138d-e3ac-4761-8e01-8c5b7f76d591	084cef3d-f16f-4e1a-8a80-8390fae26d44	397	2k	\N
fbf0010f-6d3c-4a8e-b303-19d3c0df04cd	084cef3d-f16f-4e1a-8a80-8390fae26d44	398	2k	\N
e703c1c0-2cf3-4365-b62b-3d7e30ebcfbc	084cef3d-f16f-4e1a-8a80-8390fae26d44	399	1k	\N
c9378c64-79f0-42dc-b7e0-9b007b8b9f0f	084cef3d-f16f-4e1a-8a80-8390fae26d44	400	1k	\N
c4b1d0c2-87b4-493e-81e3-f714cda8a15d	084cef3d-f16f-4e1a-8a80-8390fae26d44	401	2k	\N
670db0c8-132b-4eb0-8a5e-8dabb26ab69f	084cef3d-f16f-4e1a-8a80-8390fae26d44	402	1k	\N
858a0455-dddc-4023-a1be-e3e941a02a64	084cef3d-f16f-4e1a-8a80-8390fae26d44	403	2k	\N
8c49e549-4e2b-4a70-946c-9d6986c6814c	084cef3d-f16f-4e1a-8a80-8390fae26d44	404	1k	\N
5e337e54-fb5a-4e8d-a746-3348f42f61f0	084cef3d-f16f-4e1a-8a80-8390fae26d44	405	1k	\N
65fc2f01-5778-4a01-a0ff-cf4fa362f3b0	084cef3d-f16f-4e1a-8a80-8390fae26d44	406	1k	\N
b148ba46-6c15-4b38-a9ee-32254cf0eeb3	084cef3d-f16f-4e1a-8a80-8390fae26d44	407	3k	\N
0a2f6e36-9d32-4a85-878b-ce48a3d2d22a	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	408	2k	\N
2ed268f0-42ee-40b6-afe0-07a017abb8e3	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	409	2k	\N
393287e9-f556-4fbd-ac56-8d6afbeaf4ed	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	410	1k	\N
d0321586-cba3-4e5a-b5a0-c891ea505fc5	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	411	1k	\N
2ab492f1-0357-4cd5-adac-7efb18020467	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	412	2k	\N
f0f1f328-1831-4841-a846-bbe89d1bc35d	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	413	1k	\N
e51bac7f-2c60-4bb6-b11c-549984669d09	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	414	2k	\N
952fa40e-ee35-4cc7-b60a-ea6a3a244ff5	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	415	1k	\N
94b1579a-c7c3-4f54-afc5-14d041b307a8	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	416	1k	\N
f0cc96bc-af58-4e49-b76e-7f2d53648fa5	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	417	1k	\N
831d569e-30b1-4c67-ba18-e48a573e6ac1	26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	418	3k	\N
5b0cb829-27bf-41bf-97b0-a84380b5fcce	f7109bcc-1854-4bd0-8d1e-229656aa815c	419	2k	\N
cd4b3f6b-75bc-4388-b746-9ac826994783	f7109bcc-1854-4bd0-8d1e-229656aa815c	420	2k	\N
e6e07ce5-2141-47b2-90f5-16befec7ee11	f7109bcc-1854-4bd0-8d1e-229656aa815c	421	1k	\N
0246fc9a-ccb8-47b2-9cd8-371870b59a86	f7109bcc-1854-4bd0-8d1e-229656aa815c	422	1k	\N
7df18308-a297-4265-953d-9a573d046142	f7109bcc-1854-4bd0-8d1e-229656aa815c	423	2k	\N
50ba444d-b8ac-4570-9780-fe12801f8886	f7109bcc-1854-4bd0-8d1e-229656aa815c	424	1k	\N
5c4cca54-ee2c-4528-932c-0ab45f73fa29	f7109bcc-1854-4bd0-8d1e-229656aa815c	425	2k	\N
bf295b48-af41-44f3-9ac9-3ec5127b9641	f7109bcc-1854-4bd0-8d1e-229656aa815c	426	1k	\N
4599dadc-95fd-4cf3-a01a-5028a742963f	f7109bcc-1854-4bd0-8d1e-229656aa815c	427	1k	\N
0580ffe8-1673-4cca-9976-da04662e98ea	f7109bcc-1854-4bd0-8d1e-229656aa815c	428	1k	\N
1b397bd6-5065-4473-8826-ecfea38f5087	f7109bcc-1854-4bd0-8d1e-229656aa815c	429	3k	\N
72c45b85-a27b-42d9-8a76-70a5c9f6f755	43ca345f-99e7-4144-8454-cadeb30016d2	430	2k	\N
fc99b4eb-317a-494b-93da-a59dd24750dd	43ca345f-99e7-4144-8454-cadeb30016d2	431	2k	\N
2dccd41d-8162-4163-9255-05b535ff1a66	43ca345f-99e7-4144-8454-cadeb30016d2	432	1k	\N
329f7adb-523e-4a05-8f92-dffe3f9d586b	43ca345f-99e7-4144-8454-cadeb30016d2	433	1k	\N
c8a9309b-64eb-4497-9246-650a0a327872	43ca345f-99e7-4144-8454-cadeb30016d2	434	2k	\N
6bf526bb-0544-487c-a113-0a902246765e	43ca345f-99e7-4144-8454-cadeb30016d2	435	1k	\N
a4fbe0ea-c6e9-4376-ae17-6e580b954cfd	43ca345f-99e7-4144-8454-cadeb30016d2	436	2k	\N
b162d49e-995d-437e-bc2b-2912acc95a55	43ca345f-99e7-4144-8454-cadeb30016d2	437	1k	\N
8a7cb6b4-d4fd-4b88-9fda-3ebd4fedee72	43ca345f-99e7-4144-8454-cadeb30016d2	438	1k	\N
e9bd4c61-88a0-4bdc-ba2e-9e7a3f891da4	43ca345f-99e7-4144-8454-cadeb30016d2	439	1k	\N
d5406a0f-6f62-476b-8979-7409a1672d0b	43ca345f-99e7-4144-8454-cadeb30016d2	440	3k	\N
f86e9e7f-fb80-4650-a873-49f3e39bfc12	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	441	2k	\N
1aa76f2c-8af6-4375-9799-4eecd334c656	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	442	2k	\N
4e79ef45-203f-427f-be82-b46cdae7d402	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	443	1k	\N
c47754b0-9295-4ff9-a444-1710f2f86e05	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	444	1k	\N
0af0f492-a0d1-4498-a5f7-c6626deaa531	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	445	2k	\N
b1155b84-4d3f-460d-b890-b6082c938f7f	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	446	1k	\N
746676a9-62cc-42f5-a632-0bb75d97d96e	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	447	2k	\N
f5d92aa7-b195-44c4-83d6-33e967591450	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	448	1k	\N
88597680-cf18-431e-aad1-4623c8246862	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	449	1k	\N
5a760bfe-cb3c-4138-98f8-c392eef270bf	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	450	1k	\N
ace88cf8-d5b7-444f-be48-482140fdd1a9	cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	451	3k	\N
96d32ca6-5ca1-4bfe-940e-7223662a1804	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	452	2k	\N
5c834248-3f1e-4599-b493-5155bdcc3d72	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	453	2k	\N
671268fd-88d0-4df9-99b3-2c1ccd164047	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	454	1k	\N
bffaa03d-784a-40dc-97ea-d8aca75ba6eb	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	455	1k	\N
112ccb83-f681-46ab-8ca4-0f7d60b72713	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	456	2k	\N
6a4e1a4a-7dc2-40fa-b824-dc2435891a56	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	457	1k	\N
72352dc3-6686-4ced-b462-7794400628b1	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	458	2k	\N
13105c0b-888f-49b1-89f9-b7201a108585	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	459	1k	\N
ca0d9cc5-efdd-47ea-9c7c-386419a6296e	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	460	1k	\N
207fd700-47f4-4591-b17b-ef755e646e06	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	461	1k	\N
d821f1bb-b3c8-4345-a946-bbcee475fd15	ff41fb3c-647b-4f0d-8721-c65fc09b2e72	462	3k	\N
c1a618c0-ba47-408a-9af2-db1e270701d2	c1fda077-6c21-4d46-9104-3d46324f2f10	463	2k	\N
acc01a32-491e-405f-953e-806f4cac4300	c1fda077-6c21-4d46-9104-3d46324f2f10	464	2k	\N
f17cc441-cfb7-479b-9f33-83429cdbdbc0	c1fda077-6c21-4d46-9104-3d46324f2f10	465	1k	\N
5cc2a965-c14b-4031-92db-b36f65f0600a	c1fda077-6c21-4d46-9104-3d46324f2f10	466	1k	\N
67aa799e-0047-426e-adda-7dd934ac40da	c1fda077-6c21-4d46-9104-3d46324f2f10	467	2k	\N
37f35391-a2ed-4495-8aee-0215623efd1b	c1fda077-6c21-4d46-9104-3d46324f2f10	468	1k	\N
93efb51b-dbb4-4b4f-a395-bde51053db5a	c1fda077-6c21-4d46-9104-3d46324f2f10	469	2k	\N
d86a6d25-0655-488d-9af4-af92fa5961df	c1fda077-6c21-4d46-9104-3d46324f2f10	470	1k	\N
ab69bb5f-9d4b-4e72-8a09-b089b356f92a	c1fda077-6c21-4d46-9104-3d46324f2f10	471	1k	\N
eec7b5bf-5c8c-4113-a6c2-19498abd0e88	c1fda077-6c21-4d46-9104-3d46324f2f10	472	1k	\N
295606fb-7e4a-4cd3-8e12-4b2a881abdc0	c1fda077-6c21-4d46-9104-3d46324f2f10	473	3k	\N
29f57ff6-cb7e-400c-8893-0e4155914392	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	474	2k	\N
5b4a4dca-5396-4960-b2c4-9c831f8db15f	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	475	2k	\N
9474b0a8-c788-47d4-9b9d-6734fb1666d0	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	476	1k	\N
d981f5a2-040b-4f55-9750-55eb890804cb	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	477	1k	\N
e83e73b2-7d4f-4530-ba80-c6f615daaa91	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	478	2k	\N
6f337285-a961-4071-99c8-15c42a763af2	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	479	1k	\N
59aa9727-859a-4846-9bf3-1d5bd19c3339	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	480	2k	\N
26afadc4-dd20-4bff-aff1-8207b4911c23	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	481	1k	\N
2b1faa95-fc66-43d4-a532-859c94aa437b	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	482	1k	\N
1d6e0b27-b30c-48d2-9c38-bf51bde0b93e	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	483	1k	\N
23d79634-5a97-4673-89c6-c8bf818fe8e2	ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	484	3k	\N
c977a310-a6b4-4b7d-8576-7a9a6d461e3b	7191f5eb-b538-4a2c-999f-334bb862e164	1	2k	\N
41f6494b-c47d-465d-b294-a58b44a37215	7191f5eb-b538-4a2c-999f-334bb862e164	2	2k	\N
5b1b4258-9147-449f-91f6-accd87f1fc30	7191f5eb-b538-4a2c-999f-334bb862e164	3	1k	\N
803fbb58-136c-4faa-a40e-e465568c0781	7191f5eb-b538-4a2c-999f-334bb862e164	4	1k	\N
e802e71e-fae7-4c1b-94c1-899221886620	7191f5eb-b538-4a2c-999f-334bb862e164	5	2k	\N
ac29e6c4-8545-4c83-a7b8-46324654b189	7191f5eb-b538-4a2c-999f-334bb862e164	6	1k	\N
40ac60cc-5a55-40fe-9ced-dcc4bd7160d8	7191f5eb-b538-4a2c-999f-334bb862e164	7	2k	\N
4bae4a93-2e18-484c-8217-d0a0ed4fa20a	7191f5eb-b538-4a2c-999f-334bb862e164	8	1k	\N
aeef417c-ea6e-4a78-9b35-5e12b51fbba5	7191f5eb-b538-4a2c-999f-334bb862e164	9	1k	\N
4e600df0-f096-4a1c-9c2b-5f33115db413	7191f5eb-b538-4a2c-999f-334bb862e164	10	1k	\N
a289beee-3ac5-4019-82c1-60571ee73864	7191f5eb-b538-4a2c-999f-334bb862e164	11	3k	\N
8c035969-ebbb-4e09-907c-ed9d1c490674	083f5d5b-540c-4d87-99e9-b0f2f461ca73	12	2k	\N
1eab7bdf-d75b-448e-a3eb-0a7c242ddb49	083f5d5b-540c-4d87-99e9-b0f2f461ca73	13	2k	\N
aebf1400-2024-4c7a-bc23-47f5745cb06c	083f5d5b-540c-4d87-99e9-b0f2f461ca73	14	1k	\N
e588de77-b55a-4a4f-9923-4c41aaeef938	083f5d5b-540c-4d87-99e9-b0f2f461ca73	15	1k	\N
add867ea-e55c-48b0-a2c7-a920bfcffc57	083f5d5b-540c-4d87-99e9-b0f2f461ca73	16	2k	\N
6b968da7-3a84-44df-976e-fc2273886f93	083f5d5b-540c-4d87-99e9-b0f2f461ca73	17	1k	\N
84eef80e-94a3-4ed8-b886-3603a6c59e83	083f5d5b-540c-4d87-99e9-b0f2f461ca73	18	2k	\N
7be61d77-2213-4f6f-add3-cf96100ce5db	083f5d5b-540c-4d87-99e9-b0f2f461ca73	19	1k	\N
fbcaceb4-26e0-42d5-970a-3b055f06ad21	083f5d5b-540c-4d87-99e9-b0f2f461ca73	20	1k	\N
290f94ff-7ccb-4c41-8b81-5ff63ac98046	083f5d5b-540c-4d87-99e9-b0f2f461ca73	21	1k	\N
be21a305-08fb-4260-bf03-dafef3706c19	083f5d5b-540c-4d87-99e9-b0f2f461ca73	22	3k	\N
d3792ff4-a9d0-4018-8eb2-87fb2683a8d2	9abc717a-ffb0-44ff-b947-bad6494bad68	23	2k	\N
c204c346-34c3-405e-b9ae-119ee0941f5d	9abc717a-ffb0-44ff-b947-bad6494bad68	24	2k	\N
8d821506-48a3-4c9c-b9a3-1412a2c1e8b5	9abc717a-ffb0-44ff-b947-bad6494bad68	25	1k	\N
5f36811a-c553-4cfa-9bfc-788429ab938a	9abc717a-ffb0-44ff-b947-bad6494bad68	26	1k	\N
ab2f7408-b35a-4e64-bb5c-464a1b5393e6	9abc717a-ffb0-44ff-b947-bad6494bad68	27	2k	\N
608b3685-10db-46d7-b890-dd44f5794c95	9abc717a-ffb0-44ff-b947-bad6494bad68	28	1k	\N
b6e5fa7e-ca8a-4d01-8f2f-3ac9add12866	9abc717a-ffb0-44ff-b947-bad6494bad68	29	2k	\N
10a110bf-8199-434f-bc7d-3313c2e48b05	9abc717a-ffb0-44ff-b947-bad6494bad68	30	1k	\N
8efc6987-e096-4ed8-88d8-3b52422b0f61	9abc717a-ffb0-44ff-b947-bad6494bad68	31	1k	\N
1e451256-3794-44d0-af1e-cc64389df7ee	9abc717a-ffb0-44ff-b947-bad6494bad68	32	1k	\N
21850c50-6e4f-4211-8485-09e1e00bc916	9abc717a-ffb0-44ff-b947-bad6494bad68	33	3k	\N
54a41126-54b5-4d4d-810a-fab6e961296d	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	34	2k	\N
50a4d59a-092c-4d50-8ea9-1fb65ce08c86	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	35	2k	\N
8ba2d05d-f79e-44a2-9acf-1bc11c373916	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	36	1k	\N
34ea1a3b-3b94-491c-891f-6fdf13093668	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	37	1k	\N
ff0e24cd-fd7e-492d-ac63-d36d5d19cb33	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	38	2k	\N
f3c4f171-f0d6-4222-8663-efb861425691	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	39	1k	\N
9081c7aa-3efa-4f7e-8f7d-d4f6a5fa8dff	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	40	2k	\N
2bbc08ee-0f3e-40e4-8a34-ec55a734764b	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	41	1k	\N
8cd40b61-3e32-4bac-89dc-0070d801fc06	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	42	1k	\N
5e64d4bf-566f-4b30-bfef-e4c8f4212f86	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	43	1k	\N
9225eb36-476c-40aa-b6b9-1df86c04817b	6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	44	3k	\N
bb20340c-7ed6-4599-9e82-70d9d650ef05	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	45	2k	\N
36d7b513-5640-4b2a-b088-1339e8d970d1	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	46	2k	\N
a60e0652-b86c-4173-bc1d-a2ed09507019	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	47	1k	\N
fc7a5592-7a3c-4828-a6d3-63cb6d388be1	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	48	1k	\N
119daac8-77b8-4226-8d70-a7e3da69922a	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	49	2k	\N
8ec67835-26a3-4219-b4d9-62be1fcbf9bf	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	50	1k	\N
c558a452-1aa8-4ba2-bbfd-2e64b3186787	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	51	2k	\N
c75d6c96-9038-4368-84b0-c6d2782979f6	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	52	1k	\N
159eedd5-391d-4851-ba04-ebda1fbb2ba1	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	53	1k	\N
58e75414-a459-4911-bba7-8b48b352f652	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	54	1k	\N
e24357da-3b47-4df2-a74a-5d9e2960b7fc	0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	55	3k	\N
e9619fd4-f158-41e5-b5e0-085de7f45403	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	56	2k	\N
23d667ef-33f4-4179-b5cb-fe1542f54dcc	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	57	2k	\N
f54e4712-079c-427c-a192-723ffecc8a5a	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	58	1k	\N
552bdde3-36ad-4e40-86f6-892ad37ea5e5	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	59	1k	\N
5600762d-3cdd-46f8-9851-1c0cb1192175	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	60	2k	\N
e0148a64-78ec-495a-a871-7494c25f218b	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	61	1k	\N
be5ecf85-c0ae-4c0d-b596-7dc369e52920	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	62	2k	\N
cb371342-ef44-4bc9-b0bd-f98a850a4039	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	63	1k	\N
64b3cb10-f12c-44bf-b434-2378068aa8d5	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	64	1k	\N
c07bc071-16db-4aa1-8a00-12d19f7f4537	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	65	1k	\N
b7a6fa56-1c72-42c2-af71-0b9cde2d2c8e	3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	66	3k	\N
ba63744f-e944-402a-9f38-968c798e4278	bb6822c6-3162-427c-8909-4c1715121aee	67	2k	\N
8d059d1d-19aa-4bc3-9cd4-3ba4e9eef406	bb6822c6-3162-427c-8909-4c1715121aee	68	2k	\N
c747308b-6638-4824-93cd-a3e298cca40a	bb6822c6-3162-427c-8909-4c1715121aee	69	1k	\N
927c6f96-d715-4380-b9b8-508e082dc9bd	bb6822c6-3162-427c-8909-4c1715121aee	70	1k	\N
7c4794ee-7015-494a-802d-a0b737f8224d	bb6822c6-3162-427c-8909-4c1715121aee	71	2k	\N
4ecc2bca-0f80-48e9-bae2-32a3159c8f9f	bb6822c6-3162-427c-8909-4c1715121aee	72	1k	\N
28e69d1a-6405-40d3-aa14-c304f704e6ce	bb6822c6-3162-427c-8909-4c1715121aee	73	2k	\N
a61462f0-3e37-43a2-9473-47e0da599915	bb6822c6-3162-427c-8909-4c1715121aee	74	1k	\N
7f84d00a-2484-4309-bbf0-c14da8178f9b	bb6822c6-3162-427c-8909-4c1715121aee	75	1k	\N
b6c6aa9f-2e3a-48a2-8fad-397fb5b3f8a2	bb6822c6-3162-427c-8909-4c1715121aee	76	1k	\N
84e2dd18-a05d-4500-9739-3f5895a15395	bb6822c6-3162-427c-8909-4c1715121aee	77	3k	\N
ee33120b-8baa-441e-b4eb-c596637eb687	e9f32e36-3894-4a96-9f4a-9012ba87b197	78	2k	\N
e73ba7c4-6e3a-4c13-b31b-1745ac058205	e9f32e36-3894-4a96-9f4a-9012ba87b197	79	2k	\N
9444a29c-a599-4660-a50b-fae50e3f9556	e9f32e36-3894-4a96-9f4a-9012ba87b197	80	1k	\N
d3d71c5c-afd8-43f2-9416-c127d1d35bc4	e9f32e36-3894-4a96-9f4a-9012ba87b197	81	1k	\N
2d992da1-77c8-427e-8c83-d8ac88f9f8dc	e9f32e36-3894-4a96-9f4a-9012ba87b197	82	2k	\N
a957fb34-da65-4e36-9438-afb4e8827905	e9f32e36-3894-4a96-9f4a-9012ba87b197	83	1k	\N
b21727d8-126f-49b2-9071-c0d87513f1d2	e9f32e36-3894-4a96-9f4a-9012ba87b197	84	2k	\N
9abb5b7c-cf2d-4eef-948f-decd6dce828b	e9f32e36-3894-4a96-9f4a-9012ba87b197	85	1k	\N
6667fca5-67db-4aec-be26-bef1b9bd8659	e9f32e36-3894-4a96-9f4a-9012ba87b197	86	1k	\N
5af7b687-543e-4d88-9470-cd4c895ae3e9	e9f32e36-3894-4a96-9f4a-9012ba87b197	87	1k	\N
5308ba5f-6b95-4e90-8919-7e9712b94bde	e9f32e36-3894-4a96-9f4a-9012ba87b197	88	3k	\N
cbf15107-4cb1-4faa-bc99-07f803c4bdbe	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	89	2k	\N
1af496af-bdb7-4e0a-87c8-b90f201e18be	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	90	2k	\N
f997b5e2-bf45-4d4f-a73a-23cb4df7a7fe	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	91	1k	\N
6e37a6f6-702f-4935-9a87-5752b2fcb414	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	92	1k	\N
34d184c1-1e2b-4f43-90ba-34cc23165eb0	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	93	2k	\N
060f3991-cfb0-4dc7-a9f1-b2342fb78738	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	94	1k	\N
65746bea-6004-4417-b915-6bee16a3cdc8	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	95	2k	\N
8de698ba-9c7b-431c-9cdc-ba13f9e8c8e7	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	96	1k	\N
c79d6b89-12ac-4777-b678-d63b35c32d81	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	97	1k	\N
d9a8927e-f3ac-482b-974e-eee1b0d59d30	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	98	1k	\N
6fe03b53-d8ac-44cf-a7fa-30a75abf489f	e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	99	3k	\N
345a96f0-e476-4a0e-9b11-5e144894eab8	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	100	2k	\N
8c1d5080-b383-4b70-9ffe-9a06f671b2f4	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	101	2k	\N
6c306a58-865b-4a6f-8f2e-25a8481a2c07	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	102	1k	\N
285150f9-d942-4e97-a641-841f0084cd49	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	103	1k	\N
243a57e6-1bb1-4a4c-b5ae-22c63209e480	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	104	2k	\N
01429baf-c00a-40eb-97e1-61e324878c12	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	105	1k	\N
a274a832-860e-49a7-a366-f7c33c531fd5	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	106	2k	\N
4ffc9514-7512-4b5a-a368-799bb64a24e5	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	107	1k	\N
5a27c599-1db3-4294-be0c-b9152c27c422	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	108	1k	\N
406a585c-fc62-40cf-b35b-da5285baf7cd	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	109	1k	\N
b45d3fc8-a8f5-4b46-8575-803450f50293	0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	110	3k	\N
80c5dedc-ebf0-4d7e-b95d-93d7a6ed0dd0	a820cf75-dc4d-45cb-a627-dd48208f4885	111	2k	\N
002180f3-3d98-46ff-baa8-dd9661170e40	a820cf75-dc4d-45cb-a627-dd48208f4885	112	2k	\N
ce824f12-bce7-490a-83a5-251a9c15c631	a820cf75-dc4d-45cb-a627-dd48208f4885	113	1k	\N
ae307ec5-20b1-411f-afa2-466f58ec34c8	a820cf75-dc4d-45cb-a627-dd48208f4885	114	1k	\N
60da5435-4ae8-4b78-bcff-36e57bb621f1	a820cf75-dc4d-45cb-a627-dd48208f4885	115	2k	\N
59617b82-64fd-4d66-9ffc-fde6b9830e0b	a820cf75-dc4d-45cb-a627-dd48208f4885	116	1k	\N
819ae3b0-580d-4c16-b908-ef09f9448cbc	a820cf75-dc4d-45cb-a627-dd48208f4885	117	2k	\N
334c783b-27e3-4cd1-b434-f909741a2873	a820cf75-dc4d-45cb-a627-dd48208f4885	118	1k	\N
da4ae11a-02c3-4131-ad3c-dd395a892005	a820cf75-dc4d-45cb-a627-dd48208f4885	119	1k	\N
296ab08e-09e8-4dff-ab60-99c38ccc2a73	a820cf75-dc4d-45cb-a627-dd48208f4885	120	1k	\N
6a36f54d-de90-45b6-acce-a1a1cd6dee74	a820cf75-dc4d-45cb-a627-dd48208f4885	121	3k	\N
ed394c3c-4cc2-400e-a145-0f343dcc41e8	460af867-956f-4f2a-90db-34c87cb247cd	122	2k	\N
3dc1cd55-7beb-485a-8098-21e9e1d465e9	460af867-956f-4f2a-90db-34c87cb247cd	123	2k	\N
f083a691-65e7-4d7c-8616-33c72828ff8c	460af867-956f-4f2a-90db-34c87cb247cd	124	1k	\N
3ffc66f6-3a1f-458a-8281-31f87a15a9f0	460af867-956f-4f2a-90db-34c87cb247cd	125	1k	\N
015ea27d-b1a8-4a91-b16c-8298f3ab38e3	460af867-956f-4f2a-90db-34c87cb247cd	126	2k	\N
3c955e14-1caa-4d95-a5e4-a0fda209b66e	460af867-956f-4f2a-90db-34c87cb247cd	127	1k	\N
42ce8cb9-edd7-43db-9576-967f571c1ae1	460af867-956f-4f2a-90db-34c87cb247cd	128	2k	\N
33cbf4fa-c4df-4401-bcda-c475220295de	460af867-956f-4f2a-90db-34c87cb247cd	129	1k	\N
8c76e288-9b4e-43ff-87ec-c02917f005c8	460af867-956f-4f2a-90db-34c87cb247cd	130	1k	\N
4bcb3b47-8af7-4464-ad46-ea857b6ca3f6	460af867-956f-4f2a-90db-34c87cb247cd	131	1k	\N
ff2039a8-42fd-4f21-ac07-afb491422a02	460af867-956f-4f2a-90db-34c87cb247cd	132	3k	\N
731de7aa-9bc1-4d03-9663-bea9a0ba47b6	3857b17b-8877-48d9-ba5c-8051cea0dffb	133	2k	\N
ce5d07da-edc5-4755-80cf-6078ddbe7847	3857b17b-8877-48d9-ba5c-8051cea0dffb	134	2k	\N
654b6f44-2ee7-4dd0-86e4-bc30609ff9d1	3857b17b-8877-48d9-ba5c-8051cea0dffb	135	1k	\N
fec7de41-c4ad-470c-b6c0-f266b9b4b691	3857b17b-8877-48d9-ba5c-8051cea0dffb	136	1k	\N
2a50a658-f6a8-4a1e-85fb-0fec014c63ef	3857b17b-8877-48d9-ba5c-8051cea0dffb	137	2k	\N
d7ad5d44-1332-4991-9f17-38ee444ca999	3857b17b-8877-48d9-ba5c-8051cea0dffb	138	1k	\N
762c5090-424e-4f72-b8b8-7498dd07e414	3857b17b-8877-48d9-ba5c-8051cea0dffb	139	2k	\N
682fd891-7d17-4560-aec4-3b2b4536cbcf	3857b17b-8877-48d9-ba5c-8051cea0dffb	140	1k	\N
c2b461be-f4ce-4159-b168-4e8f4c7128ac	3857b17b-8877-48d9-ba5c-8051cea0dffb	141	1k	\N
7e4a74ca-502c-44be-a264-effc833936af	3857b17b-8877-48d9-ba5c-8051cea0dffb	142	1k	\N
16ffb3b2-dc78-40bd-91c2-34700f811c5d	3857b17b-8877-48d9-ba5c-8051cea0dffb	143	3k	\N
0033f500-2664-42cc-82b5-d185a7be99b4	9e0e480c-9347-42b5-ba0e-11ed9577d532	144	2k	\N
c4564cf4-c89a-400f-a171-9278652f6fd3	9e0e480c-9347-42b5-ba0e-11ed9577d532	145	2k	\N
69e8184b-aaa7-4fdb-bbd7-e87f0238926d	9e0e480c-9347-42b5-ba0e-11ed9577d532	146	1k	\N
9f274424-cf1b-4f93-8656-da96800907de	9e0e480c-9347-42b5-ba0e-11ed9577d532	147	1k	\N
02fc4fb0-9076-4ee1-b669-0fe6c99de0a1	9e0e480c-9347-42b5-ba0e-11ed9577d532	148	2k	\N
4ef10052-c0c0-4e59-ae2c-f8327d557339	9e0e480c-9347-42b5-ba0e-11ed9577d532	149	1k	\N
49ad1b09-2e1e-4deb-a4e0-3cbc2ea520bc	9e0e480c-9347-42b5-ba0e-11ed9577d532	150	2k	\N
3b56dc82-a751-418a-ab2a-6fdb4dbc1196	9e0e480c-9347-42b5-ba0e-11ed9577d532	151	1k	\N
a8e7c0ff-607f-4dcb-9cb6-ac46f79d92fb	9e0e480c-9347-42b5-ba0e-11ed9577d532	152	1k	\N
ba46611a-0523-49bc-bf9b-be3db5551094	9e0e480c-9347-42b5-ba0e-11ed9577d532	153	1k	\N
884c8cfc-1921-45c8-935a-50ffbf0b6a56	9e0e480c-9347-42b5-ba0e-11ed9577d532	154	3k	\N
f14e567d-8939-4a2a-a154-6fa84bb43959	b610bfb5-32dc-4502-8234-9c4f6162effe	155	2k	\N
92aaf81e-36ce-4518-9719-2c7056334b1e	b610bfb5-32dc-4502-8234-9c4f6162effe	156	2k	\N
010d5df8-e5b3-4ffb-91dd-16063f676adc	b610bfb5-32dc-4502-8234-9c4f6162effe	157	1k	\N
4e3ba699-bfde-4f7e-afc9-7f02f2b58d5e	b610bfb5-32dc-4502-8234-9c4f6162effe	158	1k	\N
d012eacc-b2bb-45bd-a9e6-5ae25a1987a5	b610bfb5-32dc-4502-8234-9c4f6162effe	159	2k	\N
ce847904-fcf6-4478-961b-f89b5c398d3a	b610bfb5-32dc-4502-8234-9c4f6162effe	160	1k	\N
5a08ecc4-6cd3-4c7f-bc29-e842863cf0d8	b610bfb5-32dc-4502-8234-9c4f6162effe	161	2k	\N
6d847694-17ff-43ae-b2df-6f19b8211e23	b610bfb5-32dc-4502-8234-9c4f6162effe	162	1k	\N
7602b33d-67b1-4559-9008-e0c3cc86da07	b610bfb5-32dc-4502-8234-9c4f6162effe	163	1k	\N
7509440a-d9ca-4be3-8603-60194c368a52	b610bfb5-32dc-4502-8234-9c4f6162effe	164	1k	\N
e8401c0a-da20-4a6a-a45a-f6daecd67d71	b610bfb5-32dc-4502-8234-9c4f6162effe	165	3k	\N
e9a26f66-daf7-4622-bb28-7cb532b6a6ce	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	166	2k	\N
cf68ec5e-4feb-428d-8281-41e835b3d961	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	167	2k	\N
dd946b93-866b-462e-aa7b-7dffa7d3a0c2	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	168	1k	\N
b25bb4fd-fad6-4a3c-9173-f716ca0c18a5	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	169	1k	\N
95e3d9e0-6187-456b-91c4-eea9f61fc6a3	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	170	2k	\N
e51d4dee-4b14-48a4-8c5a-f0aa6a8e41b3	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	171	1k	\N
01f5e3fb-f9b7-4414-a12a-d7a610d2a458	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	172	2k	\N
07e0acd7-c631-4ffd-80a4-4341926d5e9a	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	173	1k	\N
ae65e491-3a29-444b-998f-d259684ef0b2	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	174	1k	\N
0834e97a-260f-4388-b8f0-4e6ada7f6a5d	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	175	1k	\N
b9309bc3-883f-48ef-a43f-e5811d489faf	a8af5a65-8b06-4f4d-b960-a438bbe6aa75	176	3k	\N
3c7dd419-42fa-4db4-bc53-68f4d2df968e	4c9d0526-d9af-49c0-93d0-3bf75177f180	177	2k	\N
4856929e-b84b-42e2-8712-b19f57bb7be6	4c9d0526-d9af-49c0-93d0-3bf75177f180	178	2k	\N
43c06a93-5c81-4e5a-9c5b-167419039b05	4c9d0526-d9af-49c0-93d0-3bf75177f180	179	1k	\N
69afd378-46a3-406a-b113-ad09163f2b5f	4c9d0526-d9af-49c0-93d0-3bf75177f180	180	1k	\N
949c9c36-2088-4ad7-a834-f614f4af69ad	4c9d0526-d9af-49c0-93d0-3bf75177f180	181	2k	\N
4284fa1d-ce43-4703-94da-7b289e93da68	4c9d0526-d9af-49c0-93d0-3bf75177f180	182	1k	\N
674e0ea3-8956-4792-9f2b-fb7538999fed	4c9d0526-d9af-49c0-93d0-3bf75177f180	183	2k	\N
1ee89b53-5c18-4fde-80b8-596640c998c8	4c9d0526-d9af-49c0-93d0-3bf75177f180	184	1k	\N
7408a42c-f7c0-4f29-a7a3-fb31607d30b9	4c9d0526-d9af-49c0-93d0-3bf75177f180	185	1k	\N
1749540d-c91e-4790-8c1b-2a0021d9179b	4c9d0526-d9af-49c0-93d0-3bf75177f180	186	1k	\N
4d7f6932-28bf-4e9a-9b78-48dcc27ca664	4c9d0526-d9af-49c0-93d0-3bf75177f180	187	3k	\N
d9612d84-0a84-4651-9e8d-732f47bd5bb6	fc389d9b-eb01-4733-9c39-23fbb1962110	188	2k	\N
706fa3ef-529c-453c-a7b9-15c9b0b5ef09	fc389d9b-eb01-4733-9c39-23fbb1962110	189	2k	\N
42a8341e-4a24-4ad3-8ed3-3b93d53a4956	fc389d9b-eb01-4733-9c39-23fbb1962110	190	1k	\N
54c04929-368c-4370-8920-abb6ff28124c	fc389d9b-eb01-4733-9c39-23fbb1962110	191	1k	\N
9f6081c2-1db6-45d6-ac0b-0b37b9aeedad	fc389d9b-eb01-4733-9c39-23fbb1962110	192	2k	\N
65f54fd7-df9e-4587-a4af-a074c91cee32	fc389d9b-eb01-4733-9c39-23fbb1962110	193	1k	\N
a4e9a83a-409e-4d7e-8bf1-edd1aa69c6a5	fc389d9b-eb01-4733-9c39-23fbb1962110	194	2k	\N
f8d67c23-ce00-4214-b0b3-ce64fc3cf397	fc389d9b-eb01-4733-9c39-23fbb1962110	195	1k	\N
5fbd5345-2ce1-41a0-94ff-9062cba8de27	fc389d9b-eb01-4733-9c39-23fbb1962110	196	1k	\N
b8c48ade-8292-4942-8e63-3339ea356a21	fc389d9b-eb01-4733-9c39-23fbb1962110	197	1k	\N
d6cf67f5-8d68-4bb6-ab6d-df597c2db812	fc389d9b-eb01-4733-9c39-23fbb1962110	198	3k	\N
d14b1c89-a798-4b6e-ae5a-1929d95f544c	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	199	2k	\N
3ad2cffb-b8f7-4f0d-b45d-4a3dcc6069b0	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	200	2k	\N
584e3c54-b40c-4132-8cf6-93c428b957ee	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	201	1k	\N
e4964d87-f927-4633-957a-7c8cff2a0d8e	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	202	1k	\N
0d40e39d-d37e-424b-bf73-9b8f771cb802	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	203	2k	\N
dac5b029-df14-4b8f-8ad4-f2032b7a4add	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	204	1k	\N
e5b69915-68e3-4987-96e5-ad608cf15c19	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	205	2k	\N
19a80db6-506d-4eb4-bdcd-5f0896c7b698	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	206	1k	\N
ded5bdbc-d0ab-4ba3-9f21-24287d2f307c	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	207	1k	\N
a5ca16c4-eb38-446b-b4a6-4abe9f84f1e4	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	208	1k	\N
e652d429-3ebc-49c1-8515-95b725c8a0d7	f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	209	3k	\N
2fdacd78-ee6f-4f93-abb9-d4f18452e950	c0390b07-a251-486d-ad67-c6517bad6a3e	210	2k	\N
46eaf40d-98e1-4156-a609-839fbdaf8a42	c0390b07-a251-486d-ad67-c6517bad6a3e	211	2k	\N
fc2e84c3-6b2c-4301-b718-4d2d184cc86c	c0390b07-a251-486d-ad67-c6517bad6a3e	212	1k	\N
20661330-4071-4e58-85b7-d98d5385996e	c0390b07-a251-486d-ad67-c6517bad6a3e	213	1k	\N
5cb406b8-6874-4a28-854b-3bd2f90c7686	c0390b07-a251-486d-ad67-c6517bad6a3e	214	2k	\N
1096d53d-12e8-4bdf-b442-9eb2e1a143e8	c0390b07-a251-486d-ad67-c6517bad6a3e	215	1k	\N
2b84d2b7-5d23-4ed0-866c-c803e3828395	c0390b07-a251-486d-ad67-c6517bad6a3e	216	2k	\N
f2043c63-5851-4207-afb5-0b8122c8d6d2	c0390b07-a251-486d-ad67-c6517bad6a3e	217	1k	\N
5c4f7c21-b8bd-4791-bfd3-f53728dad71c	c0390b07-a251-486d-ad67-c6517bad6a3e	218	1k	\N
ca5c2304-cd22-4e6c-ae81-faf8b4db708d	c0390b07-a251-486d-ad67-c6517bad6a3e	219	1k	\N
adbb6d4b-0a09-4cd0-8277-2b4e15e1ebb7	c0390b07-a251-486d-ad67-c6517bad6a3e	220	3k	\N
b765f224-91e1-48d6-8456-fdc72edea1c2	d9da2dec-12c0-4cbb-b549-9b4adb20762d	221	2k	\N
92cca64d-8fbe-41c7-89f2-4fcfe5b1b448	d9da2dec-12c0-4cbb-b549-9b4adb20762d	222	2k	\N
c6dc1617-d3be-4b49-8727-0a582bac102a	d9da2dec-12c0-4cbb-b549-9b4adb20762d	223	1k	\N
ea881930-96b9-405f-be5f-75bd6908b021	d9da2dec-12c0-4cbb-b549-9b4adb20762d	224	1k	\N
7813e9c3-6f31-46df-820b-408ff816e48f	d9da2dec-12c0-4cbb-b549-9b4adb20762d	225	2k	\N
997b558c-e70f-41d9-aa08-8e40b147b548	d9da2dec-12c0-4cbb-b549-9b4adb20762d	226	1k	\N
699e77db-8078-4e72-b667-5e03b933034d	d9da2dec-12c0-4cbb-b549-9b4adb20762d	227	2k	\N
3ec39495-81ae-4352-9276-f3014b9dba3c	d9da2dec-12c0-4cbb-b549-9b4adb20762d	228	1k	\N
55b89c82-6b5c-43fa-a3fb-8473e1c2b12f	d9da2dec-12c0-4cbb-b549-9b4adb20762d	229	1k	\N
9f697ef9-f108-47b4-b0d5-4b3542f98320	d9da2dec-12c0-4cbb-b549-9b4adb20762d	230	1k	\N
91b7db5d-3701-435d-bf2c-cd269b7b65a5	d9da2dec-12c0-4cbb-b549-9b4adb20762d	231	3k	\N
7b34de7d-b423-4c37-9447-2694e159c9ce	94872e0c-5294-4956-978d-c560986ca3a6	232	2k	\N
e082d8e2-0345-4652-812a-8af1a3518206	94872e0c-5294-4956-978d-c560986ca3a6	233	2k	\N
4e52fff5-0c44-48d2-8d18-c02437702179	94872e0c-5294-4956-978d-c560986ca3a6	234	1k	\N
a7b5a1d8-57ed-40e5-ac37-e27763bc754a	94872e0c-5294-4956-978d-c560986ca3a6	235	1k	\N
efe13267-7fa4-412a-8f23-00fed5136e5d	94872e0c-5294-4956-978d-c560986ca3a6	236	2k	\N
301dce6a-eaba-4afb-bef8-482f8cd22e46	94872e0c-5294-4956-978d-c560986ca3a6	237	1k	\N
04d0ab4b-ce39-4040-baa3-2dc66f808bbc	94872e0c-5294-4956-978d-c560986ca3a6	238	2k	\N
d7e2561b-9e6b-4bb3-8558-d9537fa19038	94872e0c-5294-4956-978d-c560986ca3a6	239	1k	\N
48d1e266-0cb6-45f8-89a3-b0387904fbff	94872e0c-5294-4956-978d-c560986ca3a6	240	1k	\N
24b72dc0-e0e8-43b4-bef2-345859df1b75	94872e0c-5294-4956-978d-c560986ca3a6	241	1k	\N
18034667-bf12-4a61-9c64-a0e5dcb4cf10	94872e0c-5294-4956-978d-c560986ca3a6	242	3k	\N
99f18e6d-b180-405a-a0cb-f10d6a2dad61	6391b00d-9e57-4b74-a12f-885ead2c58d7	243	2k	\N
cba28df8-a887-49eb-98ab-bbe69fb0532b	6391b00d-9e57-4b74-a12f-885ead2c58d7	244	2k	\N
8927f9d0-287b-4093-bb02-3d21512cac6a	6391b00d-9e57-4b74-a12f-885ead2c58d7	245	1k	\N
09528f61-0a21-4b2f-a09a-3d00f2527167	6391b00d-9e57-4b74-a12f-885ead2c58d7	246	1k	\N
ae482aca-cacb-4d79-b95b-a6cf1fbca16f	6391b00d-9e57-4b74-a12f-885ead2c58d7	247	2k	\N
5292246a-3ea2-4a7f-8ee1-68364d114a89	6391b00d-9e57-4b74-a12f-885ead2c58d7	248	1k	\N
a4ccacdc-cf68-4405-96e1-5ff727cc28a2	6391b00d-9e57-4b74-a12f-885ead2c58d7	249	2k	\N
5f6ffbec-d8c8-4107-8782-233af0fdcb85	6391b00d-9e57-4b74-a12f-885ead2c58d7	250	1k	\N
03d88cde-e50d-4e9e-a555-5202a1d5973f	6391b00d-9e57-4b74-a12f-885ead2c58d7	251	1k	\N
3c84bedf-a029-43a7-a3da-96920b3df01e	6391b00d-9e57-4b74-a12f-885ead2c58d7	252	1k	\N
525b69b1-c601-488c-95e7-913f006f831c	6391b00d-9e57-4b74-a12f-885ead2c58d7	253	3k	\N
8045a5f5-8dc2-496c-87c4-77d90589e8e6	6070b8e9-6f67-4245-a6e0-25f49156db3e	254	2k	\N
f845097e-3634-4a69-ae8e-7a768f1a01c4	6070b8e9-6f67-4245-a6e0-25f49156db3e	255	2k	\N
5d64cf8c-4d1c-4ef6-95be-0cebddb867bb	6070b8e9-6f67-4245-a6e0-25f49156db3e	256	1k	\N
816664c8-ae4f-424b-b5f7-5858d3521cf3	6070b8e9-6f67-4245-a6e0-25f49156db3e	257	1k	\N
27a7db45-ae68-48be-8c8e-c122e0440025	6070b8e9-6f67-4245-a6e0-25f49156db3e	258	2k	\N
81b71dea-183d-4e3d-8d48-c74ef3b29458	6070b8e9-6f67-4245-a6e0-25f49156db3e	259	1k	\N
831e98b7-351f-48e8-820e-27d3a1145617	6070b8e9-6f67-4245-a6e0-25f49156db3e	260	2k	\N
92b2bb7e-db9d-4a27-bcda-24f7de245c6b	6070b8e9-6f67-4245-a6e0-25f49156db3e	261	1k	\N
4e990684-d8ee-4c7d-91a7-8c4afe228616	6070b8e9-6f67-4245-a6e0-25f49156db3e	262	1k	\N
1613c2a8-cb12-4a05-95c8-2d31b1f7eb3f	6070b8e9-6f67-4245-a6e0-25f49156db3e	263	1k	\N
e5aefa83-1e3b-47df-b427-4beb8906153f	6070b8e9-6f67-4245-a6e0-25f49156db3e	264	3k	\N
adc58df8-de78-49e3-9a76-cebd54a9e2e6	6d163ced-6c92-4170-8e65-a9afa9553c3e	265	2k	\N
c6093411-0c75-412d-8770-20fc19844ad8	6d163ced-6c92-4170-8e65-a9afa9553c3e	266	2k	\N
f63b5de2-5323-46eb-9c37-6aa197349b8b	6d163ced-6c92-4170-8e65-a9afa9553c3e	267	1k	\N
2b10310f-25cf-4246-826b-d0ace4cc78f0	6d163ced-6c92-4170-8e65-a9afa9553c3e	268	1k	\N
2343d99b-420b-4c95-acda-405a2a43b0ca	6d163ced-6c92-4170-8e65-a9afa9553c3e	269	2k	\N
513c9468-5519-4e74-9ff7-944b106c0ccf	6d163ced-6c92-4170-8e65-a9afa9553c3e	270	1k	\N
26f558b1-d1b0-42e0-9462-f7f93569851b	6d163ced-6c92-4170-8e65-a9afa9553c3e	271	2k	\N
0ca11d94-a34f-43c0-ab09-c5ad02177e5f	6d163ced-6c92-4170-8e65-a9afa9553c3e	272	1k	\N
04f56f37-e1e2-435d-96c4-66edbbc6d511	6d163ced-6c92-4170-8e65-a9afa9553c3e	273	1k	\N
5aae56b7-a3f8-4b6b-ad1d-fcaaaecfdb52	6d163ced-6c92-4170-8e65-a9afa9553c3e	274	1k	\N
7da44fe6-e07b-4b8b-a9b2-7c006fc9f29c	6d163ced-6c92-4170-8e65-a9afa9553c3e	275	3k	\N
48bcc582-e217-4900-adfc-5ef4024182e6	42555f8a-abcc-4dd8-8425-2b2e2d764483	276	2k	\N
9001e983-913d-4619-81e7-3fad921b99a8	42555f8a-abcc-4dd8-8425-2b2e2d764483	277	2k	\N
18561553-e276-42b0-a790-70e02f952dd6	42555f8a-abcc-4dd8-8425-2b2e2d764483	278	1k	\N
cdab17e0-78dc-4ced-a810-9aab4c4e421c	42555f8a-abcc-4dd8-8425-2b2e2d764483	279	1k	\N
2f1eeb56-91a6-4c0b-ab11-bd554615a6a8	42555f8a-abcc-4dd8-8425-2b2e2d764483	280	2k	\N
4b1d4169-fe6e-4b2a-89c6-a4aa2329b100	42555f8a-abcc-4dd8-8425-2b2e2d764483	281	1k	\N
a7abdb56-38f6-4ba9-8136-8ed167a8bf61	42555f8a-abcc-4dd8-8425-2b2e2d764483	282	2k	\N
61616800-d7e8-4139-91ea-7b284efa093d	42555f8a-abcc-4dd8-8425-2b2e2d764483	283	1k	\N
41d89178-faec-47f6-af55-da3cef79fdde	42555f8a-abcc-4dd8-8425-2b2e2d764483	284	1k	\N
8dd558ed-9c8f-4888-bd6a-a7ff05abbdb5	42555f8a-abcc-4dd8-8425-2b2e2d764483	285	1k	\N
c70d5b89-b4b4-4d41-bf2a-d57dd1eb181e	42555f8a-abcc-4dd8-8425-2b2e2d764483	286	3k	\N
61fb57ea-330a-4cee-af95-233606ff8279	3027d56a-c764-4259-bfd1-82899e1a9f27	287	2k	\N
587df5ec-3dd9-4d68-9df0-27814d4ef0b7	3027d56a-c764-4259-bfd1-82899e1a9f27	288	2k	\N
41b11f2d-9d29-4420-afbb-813e49429e3f	3027d56a-c764-4259-bfd1-82899e1a9f27	289	1k	\N
cb3cda1c-f824-4bda-bc48-e690d9dda832	3027d56a-c764-4259-bfd1-82899e1a9f27	290	1k	\N
729ac27e-92b3-4f0a-a6d3-51e22669737c	3027d56a-c764-4259-bfd1-82899e1a9f27	291	2k	\N
e6fbc9ab-3851-4247-a02b-0e05d66d9619	3027d56a-c764-4259-bfd1-82899e1a9f27	292	1k	\N
3b0ef1fb-79ea-47b1-869d-5393261def0e	3027d56a-c764-4259-bfd1-82899e1a9f27	293	2k	\N
a709c5e1-370c-45cc-b577-08d61f89ab93	3027d56a-c764-4259-bfd1-82899e1a9f27	294	1k	\N
b3ab53be-1a61-4f94-80f9-78b02023fb4f	3027d56a-c764-4259-bfd1-82899e1a9f27	295	1k	\N
4625d4cd-8e94-4168-85dd-0ff1e9a22636	3027d56a-c764-4259-bfd1-82899e1a9f27	296	1k	\N
55c47331-180e-40c2-890e-aabfcbb356d0	3027d56a-c764-4259-bfd1-82899e1a9f27	297	3k	\N
c9f51666-e418-4ef7-b5da-29a91027a2cf	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	298	2k	\N
97e99302-2415-41e4-8972-a5ad7faa799d	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	299	2k	\N
c28822f7-4507-4cab-8e60-cdc099a0e753	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	300	1k	\N
575cd703-c8ef-4f30-8c0e-4c1d2618b8e3	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	301	1k	\N
40ed23bf-c18e-42ab-9737-96c7114a9735	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	302	2k	\N
c12f2316-b867-4ac2-aad5-7bad4649d971	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	303	1k	\N
2d1bef2d-4637-4092-b559-3e4a6add92b6	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	304	2k	\N
fd560625-9bf6-46b3-817f-a382064e6def	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	305	1k	\N
f95443c8-418a-4162-a0b0-68091a5e9b7f	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	306	1k	\N
7511fde2-849e-4120-98d1-82dce955cded	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	307	1k	\N
7dc01ecb-ce6b-433b-a873-ede223c341a1	fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	308	3k	\N
fa1e14a7-a395-4ba4-bf3d-73fc5e663c51	48dc880e-0dcf-412e-b2bf-ac590eb773bf	309	2k	\N
8fc625bb-0e6d-4855-a321-2d1ce086ed2b	48dc880e-0dcf-412e-b2bf-ac590eb773bf	310	2k	\N
7e8f3ad2-e6e5-40fe-9ef5-5096d3856ff3	48dc880e-0dcf-412e-b2bf-ac590eb773bf	311	1k	\N
2811acf8-ceae-4eab-ab97-5d01cac66b9e	48dc880e-0dcf-412e-b2bf-ac590eb773bf	312	1k	\N
95e51618-5ee4-4d14-92d7-e3735aeb45bb	48dc880e-0dcf-412e-b2bf-ac590eb773bf	313	2k	\N
a17eb1ff-096f-4a6b-83c3-f5c5add64fd0	48dc880e-0dcf-412e-b2bf-ac590eb773bf	314	1k	\N
a89caa9e-c331-4bbc-bdb4-6abf60fc63fc	48dc880e-0dcf-412e-b2bf-ac590eb773bf	315	2k	\N
b542d787-2bcd-45db-8004-51c4cd80eeba	48dc880e-0dcf-412e-b2bf-ac590eb773bf	316	1k	\N
a6db7706-35cb-45e7-bafe-c79043428eb3	48dc880e-0dcf-412e-b2bf-ac590eb773bf	317	1k	\N
08c60293-92f0-446c-b67a-0ede96c6a4b3	48dc880e-0dcf-412e-b2bf-ac590eb773bf	318	1k	\N
c112ffd7-1c80-4a3f-8b06-1401c14c4acc	48dc880e-0dcf-412e-b2bf-ac590eb773bf	319	3k	\N
26c85520-f992-4d98-8505-d100f6e4e202	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	320	2k	\N
4c13064f-ff87-4825-a819-cf4cff7ba2ac	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	321	2k	\N
59beefcc-9895-40c3-a4db-eb44118d57e2	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	322	1k	\N
8bcefba5-a785-49e5-b927-531597d15303	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	323	1k	\N
88d70c40-6206-428a-a6ce-f83a1812eeae	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	324	2k	\N
64cbe2a5-e4ba-4b08-a023-0843ae617359	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	325	1k	\N
79b7c91b-15e5-4838-bec2-fb840b4e22a8	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	326	2k	\N
dbd58951-03a1-43f4-9379-1eda2977f460	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	327	1k	\N
f14261d7-794c-4357-a292-7b5c13fc68ee	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	328	1k	\N
8151a019-7d0d-4438-a0b0-8d552f7cda57	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	329	1k	\N
e6f12fa8-04d3-443f-936a-ff888422773a	eb9bcb44-4134-4699-a27d-d1b6b73e34a3	330	3k	\N
0d9aceb9-4aed-486a-8f14-86625b77d701	eba60600-32c0-4c49-b9d4-931812e7bdfc	331	2k	\N
712c89ce-3890-416a-a59e-1b9f9cd260d5	eba60600-32c0-4c49-b9d4-931812e7bdfc	332	2k	\N
ae649b13-b780-4251-ad8b-a2e07ae04e67	eba60600-32c0-4c49-b9d4-931812e7bdfc	333	1k	\N
d6d8d58c-3c0e-4949-9620-a4b3e47d3929	eba60600-32c0-4c49-b9d4-931812e7bdfc	334	1k	\N
4d8bc57a-fc6f-4827-94ea-f92e89f3b5f2	eba60600-32c0-4c49-b9d4-931812e7bdfc	335	2k	\N
2bd673f9-af3b-4f79-8621-01fce28d1aa6	eba60600-32c0-4c49-b9d4-931812e7bdfc	336	1k	\N
3818ec0a-cbfa-499c-93ad-2390ab11b103	eba60600-32c0-4c49-b9d4-931812e7bdfc	337	2k	\N
d586cd30-5822-4a10-a479-1ccff48f2334	eba60600-32c0-4c49-b9d4-931812e7bdfc	338	1k	\N
71d5df98-7978-4a79-88c3-c5587736c751	eba60600-32c0-4c49-b9d4-931812e7bdfc	339	1k	\N
70899aa3-9911-4eb4-b45f-1e9b5b2455d7	eba60600-32c0-4c49-b9d4-931812e7bdfc	340	1k	\N
6346dbb8-9de1-4e36-93b0-4a463c1e0241	eba60600-32c0-4c49-b9d4-931812e7bdfc	341	3k	\N
603b03e1-effc-4982-815c-67bdbba0c11f	1502a0aa-a15f-4e33-b19a-d61fee6a4433	342	2k	\N
ecac906c-3337-48b9-ae6c-07d0e090f492	1502a0aa-a15f-4e33-b19a-d61fee6a4433	343	2k	\N
704c39ba-2e8b-4993-9b7b-9d9192c9e728	1502a0aa-a15f-4e33-b19a-d61fee6a4433	344	1k	\N
cf58cdfc-d70f-4379-a5d4-c748d45bf2d5	1502a0aa-a15f-4e33-b19a-d61fee6a4433	345	1k	\N
eb908f17-3d54-4929-be4e-6ac5dc6d9497	1502a0aa-a15f-4e33-b19a-d61fee6a4433	346	2k	\N
23b6acb2-dcc1-4f3e-aeb4-9ead88226c5a	1502a0aa-a15f-4e33-b19a-d61fee6a4433	347	1k	\N
cf12f2b5-6b81-42a6-b1bf-134a7a6db01e	1502a0aa-a15f-4e33-b19a-d61fee6a4433	348	2k	\N
d802d0ea-9fed-4b16-b29d-57f12d696e75	1502a0aa-a15f-4e33-b19a-d61fee6a4433	349	1k	\N
9365e986-f940-426d-a9a2-2ff26cb52b3a	1502a0aa-a15f-4e33-b19a-d61fee6a4433	350	1k	\N
1fb90c54-cede-4ed9-ad68-f58939e6d669	1502a0aa-a15f-4e33-b19a-d61fee6a4433	351	1k	\N
79786c06-b991-4407-acca-641306caa8e6	1502a0aa-a15f-4e33-b19a-d61fee6a4433	352	3k	\N
1167a59e-d97b-4c2f-8f93-63b2eab2a5f6	f97e087a-3b47-4a9e-8b25-16fdc7749f3f	1	2k	\N
a2220104-a1d9-4142-bd3f-9c60484faff6	f97e087a-3b47-4a9e-8b25-16fdc7749f3f	2	1k	\N
45ceb601-272d-4fb5-b085-fbb994075326	79191dbe-fa65-47c9-83d6-e0fa81532ca3	3	2k	\N
87c7b08b-a65b-4952-b216-914e2622da1a	79191dbe-fa65-47c9-83d6-e0fa81532ca3	4	1k	\N
a53c199d-ba22-4c08-b577-148989b309cc	79191dbe-fa65-47c9-83d6-e0fa81532ca3	5	1k	\N
690f47a6-eb0b-4897-b68f-3e101b1484e5	79191dbe-fa65-47c9-83d6-e0fa81532ca3	6	2k	\N
a1e37348-ff65-4ef8-a4a3-ac5bd945dfdc	79191dbe-fa65-47c9-83d6-e0fa81532ca3	7	1k	\N
da64f57e-6aad-4c86-9b3b-d8bfb67db655	79191dbe-fa65-47c9-83d6-e0fa81532ca3	8	1k	\N
245b43d8-bf0e-42b5-825f-cfc02f4e83cc	79191dbe-fa65-47c9-83d6-e0fa81532ca3	9	2k	\N
0d6ea399-6876-46d1-9106-b66cf9700538	c6335fa6-b152-4517-aa9f-26707a6f3777	10	2k	\N
2c6ce36f-2b2f-4568-b45b-459a4f3006af	c6335fa6-b152-4517-aa9f-26707a6f3777	11	1k	\N
de61acb4-d9a8-4146-8e45-2974708601b7	c6335fa6-b152-4517-aa9f-26707a6f3777	12	1k	\N
ea1a460e-f516-4da1-8fff-25885c09d2e6	c6335fa6-b152-4517-aa9f-26707a6f3777	13	2k	\N
21c66ae6-ad42-47ec-9254-5c4015367f95	c6335fa6-b152-4517-aa9f-26707a6f3777	14	1k	\N
d3c47773-eca3-44e5-b207-dcef2dffff31	c6335fa6-b152-4517-aa9f-26707a6f3777	15	1k	\N
cb544001-4085-4b64-b3a0-60e5ba9ec715	c6335fa6-b152-4517-aa9f-26707a6f3777	16	2k	\N
27d1127c-6b9e-446f-99c6-fd8d2210ff00	7e93a98f-c602-48ea-8420-1e22ac2a8cb0	17	2k	\N
b1229db9-441b-4887-8472-100572b2b86c	7e93a98f-c602-48ea-8420-1e22ac2a8cb0	18	1k	\N
3bb0110e-c6a1-42ce-952b-ee2ea1e80b5c	7e93a98f-c602-48ea-8420-1e22ac2a8cb0	19	1k	\N
3f39f8b6-021d-462f-9b71-9242f2a9c3ff	7e93a98f-c602-48ea-8420-1e22ac2a8cb0	20	2k	\N
d3c48f55-fc8d-4541-8810-e9b954fb2f48	7e93a98f-c602-48ea-8420-1e22ac2a8cb0	21	1k	\N
cb165df2-5785-43ff-b010-30bcff5531f2	7e93a98f-c602-48ea-8420-1e22ac2a8cb0	22	1k	\N
5a269968-3e9f-4b84-b713-33e2e306fecd	7e93a98f-c602-48ea-8420-1e22ac2a8cb0	23	2k	\N
135419f1-0d42-456b-909e-f7d9c0711964	55508843-294d-459d-9ce7-2906acb13ebb	24	2k	\N
f48b2d90-94cb-43c7-be96-2bfd76899b63	55508843-294d-459d-9ce7-2906acb13ebb	25	1k	\N
a003c8b0-ef6e-4a89-8d4f-79ab33a58fee	55508843-294d-459d-9ce7-2906acb13ebb	26	1k	\N
a9a25736-8ac8-4dbe-99dd-4bdc76af376b	55508843-294d-459d-9ce7-2906acb13ebb	27	2k	\N
23153b10-ff55-4653-a009-7ec47ad57891	55508843-294d-459d-9ce7-2906acb13ebb	28	1k	\N
c93b04db-75cc-48c5-acfb-7b4dc3471ff2	55508843-294d-459d-9ce7-2906acb13ebb	29	1k	\N
231e3ce2-d51d-4aaa-a9c5-08869268a3e4	55508843-294d-459d-9ce7-2906acb13ebb	30	2k	\N
b3681c26-1202-4476-be04-6e02c781714c	97a8e197-9dfb-44f1-bf11-6784e1996a74	31	2k	\N
9534e936-04f3-4bd7-9c34-655603e9997c	97a8e197-9dfb-44f1-bf11-6784e1996a74	32	1k	\N
08bc1ddd-eec3-45ef-b31e-037737aeeb33	97a8e197-9dfb-44f1-bf11-6784e1996a74	33	1k	\N
8f7f8c20-67d8-41f5-b8fb-85f70dd08532	97a8e197-9dfb-44f1-bf11-6784e1996a74	34	2k	\N
401f0a79-d872-4868-aeb5-523ce1393295	97a8e197-9dfb-44f1-bf11-6784e1996a74	35	1k	\N
9552ccc0-31d2-43e1-bbc0-194ec9898e4c	97a8e197-9dfb-44f1-bf11-6784e1996a74	36	1k	\N
b8acc6c0-2cba-4e1e-bfdf-337691a89439	97a8e197-9dfb-44f1-bf11-6784e1996a74	37	2k	\N
f7d7613f-9da9-402b-a808-89879f460948	78cbc536-176e-4d20-b74b-ed1f1fc8a69c	38	2k	\N
cbc04834-4d1a-4a16-92b3-d0fef4358be2	78cbc536-176e-4d20-b74b-ed1f1fc8a69c	39	1k	\N
e08a70b3-d4c4-4967-9e7d-2c6e4be0d4f6	78cbc536-176e-4d20-b74b-ed1f1fc8a69c	40	1k	\N
1f130677-ab47-4985-aab4-05983fd09deb	78cbc536-176e-4d20-b74b-ed1f1fc8a69c	41	2k	\N
5152820f-fcdb-4b25-bc41-7375191a06f2	78cbc536-176e-4d20-b74b-ed1f1fc8a69c	42	1k	\N
acb1fdf1-2a5c-4524-9885-b7f371868e03	78cbc536-176e-4d20-b74b-ed1f1fc8a69c	43	1k	\N
41608663-8b55-4548-8cc9-b48dcd52be0a	78cbc536-176e-4d20-b74b-ed1f1fc8a69c	44	2k	\N
4d63115d-7efe-42cc-bd1b-8863cc76a253	637daa20-6d47-4ebe-9382-28f978f31b2a	45	2k	\N
a03ec03e-54f2-4a24-85d1-c9fe1b7decfb	637daa20-6d47-4ebe-9382-28f978f31b2a	46	1k	\N
d1940fa3-b3a8-45a6-8b90-0ed09dc084c5	637daa20-6d47-4ebe-9382-28f978f31b2a	47	1k	\N
991f3dfd-a25a-4567-97db-ad60317579ba	637daa20-6d47-4ebe-9382-28f978f31b2a	48	2k	\N
58a2f1dc-dd23-43d5-a350-e168dc193d7a	637daa20-6d47-4ebe-9382-28f978f31b2a	49	1k	\N
e1dc7c00-1c08-445d-b32d-cb8897dc93b8	637daa20-6d47-4ebe-9382-28f978f31b2a	50	1k	\N
7e42a40e-5e1a-4a28-afa7-be3a2e2ab6a4	637daa20-6d47-4ebe-9382-28f978f31b2a	51	2k	\N
328aecd2-c43e-412d-8238-1238afd904d1	bb3c6235-adea-489a-98d7-dc6dbbb9970e	52	2k	\N
cb3cf894-ba59-4aa4-8df6-15666d05798f	bb3c6235-adea-489a-98d7-dc6dbbb9970e	53	1k	\N
3e8c9854-215a-41d3-9349-8231b9eb35ab	bb3c6235-adea-489a-98d7-dc6dbbb9970e	54	1k	\N
028ed479-4fd9-47b2-904e-f82276dc3fe8	bb3c6235-adea-489a-98d7-dc6dbbb9970e	55	2k	\N
026144c7-cb58-485a-8fd4-d373d4ec9a45	bb3c6235-adea-489a-98d7-dc6dbbb9970e	56	1k	\N
2b96aa0a-8052-4423-9a98-5c46f2a4be7b	bb3c6235-adea-489a-98d7-dc6dbbb9970e	57	1k	\N
171aed79-214b-4f92-af0c-08e6345994db	bb3c6235-adea-489a-98d7-dc6dbbb9970e	58	2k	\N
f884a2fc-00c5-4b98-affa-85359f4fe94f	f807c669-83a6-42d2-8e36-2ac6f24a518b	59	2k	\N
b50fcd79-11e6-48bc-aeba-9542b23ea90e	f807c669-83a6-42d2-8e36-2ac6f24a518b	60	1k	\N
7cc1bc8c-9a0c-46f6-a641-9db4b3afdb30	f807c669-83a6-42d2-8e36-2ac6f24a518b	61	1k	\N
665b51a9-4ac8-4a94-af6e-4cc22bff7ecf	f807c669-83a6-42d2-8e36-2ac6f24a518b	62	2k	\N
f6190790-1394-47f0-97dd-f4ee12b276f5	f807c669-83a6-42d2-8e36-2ac6f24a518b	63	1k	\N
f150fd7b-80fb-4661-8b45-42f7d2226a35	f807c669-83a6-42d2-8e36-2ac6f24a518b	64	1k	\N
1789ad54-8ac8-4a1a-adad-31ab4f5a5575	f807c669-83a6-42d2-8e36-2ac6f24a518b	65	2k	\N
4b8a8605-8965-4e73-b43f-6d78d9d498e7	68263a22-b55a-404c-bff2-e07ff1a708fc	66	2k	\N
e182edb0-5cf5-48c1-9bf1-e8af37d12173	68263a22-b55a-404c-bff2-e07ff1a708fc	67	1k	\N
135be8b0-1379-4f9e-bf32-4b55408263ff	68263a22-b55a-404c-bff2-e07ff1a708fc	68	1k	\N
614e4316-8205-4ecf-970f-8ad50f4cfd61	68263a22-b55a-404c-bff2-e07ff1a708fc	69	2k	\N
8f8e50f9-48ed-4b87-a647-036a27aac615	68263a22-b55a-404c-bff2-e07ff1a708fc	70	1k	\N
96f9c827-3ae8-4eee-a0b9-e650b61a97b1	68263a22-b55a-404c-bff2-e07ff1a708fc	71	1k	\N
c75b3baa-87d7-4bf6-8783-12e1a1e77eea	68263a22-b55a-404c-bff2-e07ff1a708fc	72	2k	\N
773f6203-f40d-435e-9e58-b5ad74c82d9a	51174869-d8d6-4c26-81f6-36ac65f23581	73	2k	\N
b5d13511-78fa-4517-bd94-bb9cb4a206f8	51174869-d8d6-4c26-81f6-36ac65f23581	74	1k	\N
9895dc95-afcb-40e2-8828-bf59daa6a686	51174869-d8d6-4c26-81f6-36ac65f23581	75	2k	\N
3ce87961-2dc3-44ad-8df5-9d06aabfbf44	51174869-d8d6-4c26-81f6-36ac65f23581	76	1k	\N
50d27673-a3ec-40a6-8bf8-0d4df09efba9	51174869-d8d6-4c26-81f6-36ac65f23581	77	1k	\N
784530e7-1451-428e-97aa-ab8ab2632085	1c1a043b-6a63-4d98-822b-dc0fc668f3c0	78	2k	\N
549c5589-b23a-4d87-a81d-9266db185a25	1c1a043b-6a63-4d98-822b-dc0fc668f3c0	79	1k	\N
34979fd5-983a-4981-b4e7-c47d9eae4ee5	1c1a043b-6a63-4d98-822b-dc0fc668f3c0	80	2k	\N
ea0fe2a9-9efa-4eb3-9194-88f4ba685f3b	1c1a043b-6a63-4d98-822b-dc0fc668f3c0	81	1k	\N
3492686c-a8c3-4d44-9408-9b949c58bcca	1c1a043b-6a63-4d98-822b-dc0fc668f3c0	82	1k	\N
4e59d3e2-5010-4b74-b2be-ade7b235a486	6fc597a4-c5f7-4f97-9195-197352a38f4f	83	2k	\N
57d370e7-20a4-441a-9056-338c59538f60	6fc597a4-c5f7-4f97-9195-197352a38f4f	84	1k	\N
67551ae2-0346-44ff-8cc5-e713b4b68640	6fc597a4-c5f7-4f97-9195-197352a38f4f	85	2k	\N
e0cc180d-363c-461e-88a6-a5ebc75e183a	6fc597a4-c5f7-4f97-9195-197352a38f4f	86	1k	\N
1cd91edb-901b-4ba2-8b04-e809c9650719	6fc597a4-c5f7-4f97-9195-197352a38f4f	87	1k	\N
f503db4b-f6e9-4556-9480-e2ab5f72b28f	fec00687-02ab-4087-a0f8-40adf669ae9f	88	2k	\N
be2d0baa-61a2-4b97-ac70-3d651709ef80	fec00687-02ab-4087-a0f8-40adf669ae9f	89	1k	\N
5755a8d5-f7ec-4e0b-b72b-558fe908c126	fec00687-02ab-4087-a0f8-40adf669ae9f	90	2k	\N
2d851f20-aa86-4c18-b27c-89b320f19cd2	fec00687-02ab-4087-a0f8-40adf669ae9f	91	1k	\N
93761b8f-811e-42dc-8a3a-072c831580c2	fec00687-02ab-4087-a0f8-40adf669ae9f	92	1k	\N
dae71edd-a01b-4e58-b5c7-31138067c0bf	3698496a-8e8e-4cb1-af20-b117ec91bb20	93	2k	\N
2322b271-2cfa-4d48-bf8b-451287494c82	3698496a-8e8e-4cb1-af20-b117ec91bb20	94	1k	\N
fae13837-ad7f-4f45-a6d7-0c423d29958d	3698496a-8e8e-4cb1-af20-b117ec91bb20	95	2k	\N
179a1b85-df41-4395-bbea-3cfb2819502f	3698496a-8e8e-4cb1-af20-b117ec91bb20	96	1k	\N
dd759b79-396a-404f-8188-8a3d57ca3ecd	3698496a-8e8e-4cb1-af20-b117ec91bb20	97	1k	\N
aaa2f7a8-23f3-4d19-a7e3-ff05dca507cc	3373dc4d-c0c1-4289-887b-703ba0b9fbf5	98	2k	\N
b4cb7d3d-d932-4003-af77-743276dcb157	3373dc4d-c0c1-4289-887b-703ba0b9fbf5	99	1k	\N
c1002207-448d-44cd-9963-45ae333a2f5a	3373dc4d-c0c1-4289-887b-703ba0b9fbf5	100	2k	\N
a2b67a95-02ad-4f41-a84a-fe87d34e7ff4	3373dc4d-c0c1-4289-887b-703ba0b9fbf5	101	1k	\N
28199c63-7b95-4285-9555-a0694b702438	3373dc4d-c0c1-4289-887b-703ba0b9fbf5	102	1k	\N
47fb40cd-1c37-40f4-ba63-fc0b15da7e67	d29cdab3-c17c-49d1-af1d-3d3f9302d2a5	103	2k	\N
970b4b3a-be26-4c5f-8f24-e9cb7ad71821	d29cdab3-c17c-49d1-af1d-3d3f9302d2a5	104	1k	\N
9fd4eb4f-6c45-4488-8968-712102956b1e	d29cdab3-c17c-49d1-af1d-3d3f9302d2a5	105	2k	\N
7fb789c1-eb2b-46bd-bc8e-7e8f176888b1	d29cdab3-c17c-49d1-af1d-3d3f9302d2a5	106	1k	\N
d3c984a1-809b-4b55-9d1c-acb235a085bf	d29cdab3-c17c-49d1-af1d-3d3f9302d2a5	107	1k	\N
4ffd3dee-fe13-4c7b-b341-c19212c11381	4653fb0e-24e2-4c46-a778-a982090e6b15	108	2k	\N
14aba634-86f2-4012-98d4-880b1254d015	4653fb0e-24e2-4c46-a778-a982090e6b15	109	1k	\N
8883c9a4-e75b-44cb-95ca-b9f42e50e78a	4653fb0e-24e2-4c46-a778-a982090e6b15	110	2k	\N
ef73ca31-be9a-4fb1-b4c7-b62ce388acc6	4653fb0e-24e2-4c46-a778-a982090e6b15	111	1k	\N
54c78f6b-bf16-496a-8ffd-194dcd99ac48	4653fb0e-24e2-4c46-a778-a982090e6b15	112	1k	\N
fbaaa7e1-d206-46df-8070-05b900d656ab	5edc1e31-e54d-4d61-a74e-d2a4c981731c	113	2k	\N
96f7747e-ff17-4c14-bc33-2d033dd1e845	5edc1e31-e54d-4d61-a74e-d2a4c981731c	114	1k	\N
5b3abd8c-270d-41a7-9d2b-21b7d323fdf5	5edc1e31-e54d-4d61-a74e-d2a4c981731c	115	2k	\N
759d6cad-1f42-4c19-bb32-abc47636f3de	5edc1e31-e54d-4d61-a74e-d2a4c981731c	116	1k	\N
65b4a1a9-c65f-471f-8041-51d67d2075bd	5edc1e31-e54d-4d61-a74e-d2a4c981731c	117	1k	\N
3ff1a39e-c5b9-4d93-8e46-c361ed763d36	dc3bdca2-1045-4967-b9c8-f56f09637e99	118	2k	\N
48380afa-cd75-429c-a614-167b6e681ec9	dc3bdca2-1045-4967-b9c8-f56f09637e99	119	1k	\N
45406a5b-7a8e-453b-9d7f-e1932c106c4f	dc3bdca2-1045-4967-b9c8-f56f09637e99	120	2k	\N
0673d28d-624c-4902-9546-8fbb0be8e8b5	dc3bdca2-1045-4967-b9c8-f56f09637e99	121	1k	\N
974d6661-a131-467f-89a9-f3a49a2be042	dc3bdca2-1045-4967-b9c8-f56f09637e99	122	1k	\N
12bd9c76-0ad3-4984-9055-4193fae633db	7301550c-1ae1-428b-ae5d-49a6283e81cb	123	2k	\N
5028fe0f-e16d-492e-98a3-3c47beee0b7f	7301550c-1ae1-428b-ae5d-49a6283e81cb	124	1k	\N
6f85cb63-a3d7-4643-82ec-08f91e9cc2fb	d9d2e93c-7fe4-4a89-b1af-11683084e1c8	125	2k	\N
cba572b0-208d-4d15-abb0-1b2711c007de	d9d2e93c-7fe4-4a89-b1af-11683084e1c8	126	1k	\N
983a7493-bd6a-447f-a3ce-b8c3d76a7e43	d9d2e93c-7fe4-4a89-b1af-11683084e1c8	127	1k	\N
07b000e6-2b3f-4913-95bd-08bf25a83b35	d9d2e93c-7fe4-4a89-b1af-11683084e1c8	128	2k	\N
e7888a3e-ebb4-4ce3-ba2a-c972a0713042	dfde7198-c7e9-427f-ad51-b8519536169b	129	2k	\N
96ad1e75-3751-4dff-bb3e-466768d85bd1	dfde7198-c7e9-427f-ad51-b8519536169b	130	1k	\N
32329301-2e51-4628-b710-5cf91f6813c0	dfde7198-c7e9-427f-ad51-b8519536169b	131	1k	\N
e48f64b2-eba7-4893-a839-a70a4f1ecb78	dfde7198-c7e9-427f-ad51-b8519536169b	132	2k	\N
e4fdb47b-8106-491d-b44b-4f2d170b21fb	2ad19a8b-ab2a-40c3-bd5f-a2fade2c6c0d	133	2k	\N
d5878be9-1089-4360-854b-9ac35a07a519	2ad19a8b-ab2a-40c3-bd5f-a2fade2c6c0d	134	1k	\N
0bffd89a-9de6-4641-9a89-68e65323ade8	2ad19a8b-ab2a-40c3-bd5f-a2fade2c6c0d	135	1k	\N
3f011651-ea3a-4e3e-b5bc-39eede8174d4	2ad19a8b-ab2a-40c3-bd5f-a2fade2c6c0d	136	2k	\N
29401e2b-e02e-456f-b217-815fd6bfb982	66668937-4cdf-46f8-b7ed-0c222b6b1793	137	2k	\N
a5596e10-392e-4846-8534-5b1add17797d	66668937-4cdf-46f8-b7ed-0c222b6b1793	138	1k	\N
f7d6d7df-2655-4ca9-8689-a3b4518cdae6	66668937-4cdf-46f8-b7ed-0c222b6b1793	139	1k	\N
c28b226e-b884-42dc-bb1f-bc3e02466455	66668937-4cdf-46f8-b7ed-0c222b6b1793	140	2k	\N
7ceef2ca-e33d-4b3f-bb0e-222235c46ff5	3d8695fc-21ac-4807-b314-c66153287ee7	141	2k	\N
b20dd1f8-768c-4d09-8733-d1343b26f657	3d8695fc-21ac-4807-b314-c66153287ee7	142	1k	\N
d5d94edb-d62e-47b6-b198-76084c1bb193	3d8695fc-21ac-4807-b314-c66153287ee7	143	1k	\N
792ccd72-07eb-48bf-b06e-33b88f3c1569	3d8695fc-21ac-4807-b314-c66153287ee7	144	2k	\N
1023edf3-de46-4c92-9738-70ad11472073	d2711b01-e6ce-42cf-901f-a4cd187c167e	145	2k	\N
fbcefe31-ee11-4f9a-9eb2-2177dbae726f	d2711b01-e6ce-42cf-901f-a4cd187c167e	146	1k	\N
c3e065b8-f115-488a-8c4d-8e496644832d	d2711b01-e6ce-42cf-901f-a4cd187c167e	147	1k	\N
e9a98094-7568-4f39-a19a-06a1c1ebfeb5	d2711b01-e6ce-42cf-901f-a4cd187c167e	148	2k	\N
00cdd60e-c007-42f7-bd68-5161556290cf	9c5a32bc-c395-4352-9b72-bf3fee7c021d	149	2k	\N
9ccd1464-50df-4377-83f4-f7702d07c575	9c5a32bc-c395-4352-9b72-bf3fee7c021d	150	1k	\N
2fb277e2-9585-474e-a30f-075554493814	9c5a32bc-c395-4352-9b72-bf3fee7c021d	151	1k	\N
bb3f0138-85f9-4b36-972c-eca341e1c5e6	9c5a32bc-c395-4352-9b72-bf3fee7c021d	152	2k	\N
703e6357-69b8-4a42-a7ba-875013f0a0fc	f8cedb3f-3bc9-4220-ba81-a5f36792e3af	153	2k	\N
f060991f-e716-43a9-9f97-ccbc9fc03335	f8cedb3f-3bc9-4220-ba81-a5f36792e3af	154	1k	\N
40723f18-7a18-4e01-a58b-76013aa86d22	f8cedb3f-3bc9-4220-ba81-a5f36792e3af	155	1k	\N
7663cf67-9e45-43b4-aebc-945d2ad8df2f	f8cedb3f-3bc9-4220-ba81-a5f36792e3af	156	2k	\N
54e13e34-f9fa-46af-b113-c85d46157e04	73a094ef-c96b-44e0-a43f-3fda09fe2c81	157	2k	\N
aae06817-5fa1-4b4f-9836-cd3e0f1a9cfd	73a094ef-c96b-44e0-a43f-3fda09fe2c81	158	1k	\N
0bebebd2-a7bb-4af1-9c0b-00a0ba1e5ba1	73a094ef-c96b-44e0-a43f-3fda09fe2c81	159	1k	\N
0d65755b-5759-411d-82f4-53ce66615c10	73a094ef-c96b-44e0-a43f-3fda09fe2c81	160	2k	\N
cdf4273b-9e5b-41f6-a890-21e48da05e58	3b11baa6-aebe-4445-8cab-3032ad206a50	161	2k	\N
86bbd205-a10a-4ef2-af53-888ea8c1d34d	3b11baa6-aebe-4445-8cab-3032ad206a50	162	1k	\N
7e94a07b-e56c-4dd8-8b92-184d9ed21c27	3b11baa6-aebe-4445-8cab-3032ad206a50	163	1k	\N
789dc208-7e74-4c68-abd9-7ce0640ce2d2	3b11baa6-aebe-4445-8cab-3032ad206a50	164	2k	\N
04b78c0e-1f85-49bd-845d-13ac244bf3e7	77f98814-2382-45b5-99b1-a3d68cd90f3d	165	2k	\N
ea291cfb-9473-46de-81b0-273023f13722	77f98814-2382-45b5-99b1-a3d68cd90f3d	166	1k	\N
ba46a533-8a1e-4ebc-b37f-6214d59a5d17	3dcf5af6-5e4d-4870-8562-9dde9b925749	167	2k	\N
97d97f8b-2360-4ab2-aac9-1d63d6891d88	3dcf5af6-5e4d-4870-8562-9dde9b925749	168	1k	\N
37943b4b-ec77-4e86-8da2-7d55d4092fef	3dcf5af6-5e4d-4870-8562-9dde9b925749	169	2k	\N
076b01bc-54e3-4302-a579-925688750f34	3dcf5af6-5e4d-4870-8562-9dde9b925749	170	1k	\N
0aa06221-8247-4148-abb4-3d0b43ba99c9	3dcf5af6-5e4d-4870-8562-9dde9b925749	171	1k	\N
0fa31285-65fc-4be6-ade5-98a556e27a24	753917c6-faf1-42bd-a6b4-c64f4b7a869d	172	2k	\N
dadeb3ef-0f11-454e-a6d6-dbd5d5b82188	753917c6-faf1-42bd-a6b4-c64f4b7a869d	173	1k	\N
88ed8de7-fb17-4277-b58f-203c3807f227	753917c6-faf1-42bd-a6b4-c64f4b7a869d	174	2k	\N
040b46dc-8c57-47b1-a922-38fb5f15a5cd	753917c6-faf1-42bd-a6b4-c64f4b7a869d	175	1k	\N
6a618f86-1c94-4b16-a87a-0ccb8db84519	753917c6-faf1-42bd-a6b4-c64f4b7a869d	176	1k	\N
3570a994-a04d-4d50-80f0-7a5383b972cc	a633f626-2a2c-473c-909d-718f7a5f9d3c	177	2k	\N
c2d9268b-0db6-4410-a13a-a3b5eb21bf96	a633f626-2a2c-473c-909d-718f7a5f9d3c	178	1k	\N
e8105627-af1b-4cc3-b607-b59bf63c0397	a633f626-2a2c-473c-909d-718f7a5f9d3c	179	2k	\N
ed45b252-5f29-4584-8cca-76d2438daa9f	a633f626-2a2c-473c-909d-718f7a5f9d3c	180	1k	\N
c11cb672-ede2-4d64-99ce-e28675598e8f	a633f626-2a2c-473c-909d-718f7a5f9d3c	181	1k	\N
0d7c1068-a878-4989-8072-e66d7328fbb6	0ccb3dcf-8594-4d7d-9016-342d78b65439	182	2k	\N
eb7b523f-cab6-421b-a320-8231c8857631	0ccb3dcf-8594-4d7d-9016-342d78b65439	183	1k	\N
93c4494e-6d57-461d-90ba-bf31050d6687	0ccb3dcf-8594-4d7d-9016-342d78b65439	184	2k	\N
61f6ad72-42e3-4f76-adbc-afe887a5756b	0ccb3dcf-8594-4d7d-9016-342d78b65439	185	1k	\N
00ecf6e8-17e2-40bc-a324-fd72504f0bf3	0ccb3dcf-8594-4d7d-9016-342d78b65439	186	1k	\N
31ff31ad-f691-4e74-b258-adf963d71006	73d50ca4-83af-4d61-9436-ba4839fd243d	187	2k	\N
5885ce97-d458-40f1-a065-01d44de889de	73d50ca4-83af-4d61-9436-ba4839fd243d	188	1k	\N
02c6a65c-1a00-4c34-a7ee-abbf03686c32	73d50ca4-83af-4d61-9436-ba4839fd243d	189	2k	\N
fe31942f-d53e-4ba1-bc6f-72ed1056b0de	73d50ca4-83af-4d61-9436-ba4839fd243d	190	1k	\N
154dacd6-3e4b-4df8-9744-1849535a46cd	73d50ca4-83af-4d61-9436-ba4839fd243d	191	1k	\N
45df8a6a-1cbc-4487-a579-38157e2a1891	3b402e6b-bb8f-4902-a94b-a6e2bf4d0508	192	2k	\N
ee39fb54-ca3c-43a3-a4f6-cb8387a4b9b4	3b402e6b-bb8f-4902-a94b-a6e2bf4d0508	193	1k	\N
7d4a1b8e-a48e-4d81-99db-2e9968a84edf	3b402e6b-bb8f-4902-a94b-a6e2bf4d0508	194	2k	\N
cdf60715-f438-4fe2-a87d-9b554c4e90db	3b402e6b-bb8f-4902-a94b-a6e2bf4d0508	195	1k	\N
49c433af-2858-4711-91da-a0872851e648	3b402e6b-bb8f-4902-a94b-a6e2bf4d0508	196	1k	\N
e5a9d329-fac6-413b-8277-e2ab4fb98a5f	7747d4a4-3850-43fe-add9-8f0e9bf5a60b	197	2k	\N
7d0c6100-6a71-4131-80b9-29df77f518e7	7747d4a4-3850-43fe-add9-8f0e9bf5a60b	198	1k	\N
c85903db-4c40-4dde-85a2-2d23a632ef97	7747d4a4-3850-43fe-add9-8f0e9bf5a60b	199	2k	\N
1ad17f1c-efcd-4fbb-ba50-4b550f007b25	7747d4a4-3850-43fe-add9-8f0e9bf5a60b	200	1k	\N
a34bde64-08aa-46c8-a70c-2518d377dedf	7747d4a4-3850-43fe-add9-8f0e9bf5a60b	201	1k	\N
2d6292a2-b9ab-4cdb-a829-ca13ef79e193	25e2ebd6-6254-492e-9259-a9aef01b418c	202	2k	\N
c983aaec-b222-4d7d-b6a9-c00b7a29e3c7	25e2ebd6-6254-492e-9259-a9aef01b418c	203	1k	\N
709c4848-3b8e-49ba-87fd-3a3dac8c2354	25e2ebd6-6254-492e-9259-a9aef01b418c	204	2k	\N
bf1a17d3-4dc9-4b4f-a713-17beb88c4411	25e2ebd6-6254-492e-9259-a9aef01b418c	205	1k	\N
a056e2a5-97bc-4e6e-8757-5a208fc5bd9b	25e2ebd6-6254-492e-9259-a9aef01b418c	206	1k	\N
56b63a95-1dc6-42db-a15a-5762a408dcd0	5e94c964-41f9-4e59-949f-ab0c854a7216	207	2k	\N
e918b9dd-4c9c-4499-9e31-b9f056813a69	5e94c964-41f9-4e59-949f-ab0c854a7216	208	1k	\N
299a5294-458f-4bb9-b61f-826bb1e94020	5e94c964-41f9-4e59-949f-ab0c854a7216	209	2k	\N
a56f76a3-8296-4bf7-8dfa-d85c99999525	5e94c964-41f9-4e59-949f-ab0c854a7216	210	1k	\N
974547ee-dd46-40f3-8c5a-8b2e59ac43e4	5e94c964-41f9-4e59-949f-ab0c854a7216	211	1k	\N
5d7de4fd-e628-4094-ab88-b5fe0a30b411	07ae9ad9-e03d-4ad9-a9d9-98d6d9b9487a	212	2k	\N
110e8744-95ef-443a-9829-8b34ec8ea445	07ae9ad9-e03d-4ad9-a9d9-98d6d9b9487a	213	1k	\N
ee94b028-4952-4f23-a6f6-54bcc791c390	07ae9ad9-e03d-4ad9-a9d9-98d6d9b9487a	214	2k	\N
18f14b76-b08b-4b8c-880d-89facce46cfa	07ae9ad9-e03d-4ad9-a9d9-98d6d9b9487a	215	1k	\N
f86e4d92-7ff8-421f-83e1-d14a54193fb5	07ae9ad9-e03d-4ad9-a9d9-98d6d9b9487a	216	1k	\N
392edb0a-d8ae-499b-b67f-a36b49e9ee5c	09dae4c8-ceda-4446-8177-a42e4b32b040	217	2k	\N
840de46f-c45c-41b9-9b53-5769ceefcdc8	09dae4c8-ceda-4446-8177-a42e4b32b040	218	1k	\N
a23231dd-f066-4c14-9e15-7bd400c14428	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	1	3k	\N
d071b365-eb94-46c9-b71b-472147d1d8ce	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	2	studio	\N
43a26e99-6cbc-433b-a4eb-27c12038ed15	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	3	1k	\N
e0983e4b-c5b2-450c-9660-d89908427bab	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	4	1k	\N
8411d4b2-5122-45ec-9f5a-c8dd584a4b88	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	5	2k	\N
49368ee6-1743-4be8-a851-a60143859670	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	6	1k	\N
4e945585-ef52-442e-83eb-9da402496d90	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	7	2k	\N
45ba47d3-16b4-40f1-9697-0dabbd32b0a6	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	8	1k	\N
115072ab-ec87-4e03-ba21-321fed9607fb	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	9	1k	\N
dedf20d6-b5d1-4c9f-8e43-63f05e3f4272	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	10	1k	\N
09139b3a-2d75-4a51-b5dc-274da0b3248a	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	11	studio	\N
5511163f-5b01-4ee2-a6f8-2b9693959cb1	f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	12	1k	\N
2d907659-0831-4063-a909-8920dd570974	004ec6fe-d272-4a79-8d7b-7685529b0353	1	3k	\N
919b437b-a4b9-4f0c-b1c7-409dc019aee5	004ec6fe-d272-4a79-8d7b-7685529b0353	2	studio	\N
25234b7d-346f-4c5c-864f-2f9682ea26bf	004ec6fe-d272-4a79-8d7b-7685529b0353	3	1k	\N
3ba84c9f-4e85-4313-ada5-fd28fde4999c	004ec6fe-d272-4a79-8d7b-7685529b0353	4	1k	\N
b10acd42-d2a8-43de-ad80-1bab385b22b5	004ec6fe-d272-4a79-8d7b-7685529b0353	5	2k	\N
7098370c-7809-401d-9212-32acb6a5adf8	004ec6fe-d272-4a79-8d7b-7685529b0353	6	1k	\N
795f0ee6-7ec0-4df9-bc66-f63ae28578ba	004ec6fe-d272-4a79-8d7b-7685529b0353	7	2k	\N
6093cffe-99df-4e8d-8e3d-07b00b478c7c	004ec6fe-d272-4a79-8d7b-7685529b0353	8	1k	\N
bc9f3b7f-2997-485f-93e3-e18ea01e7309	004ec6fe-d272-4a79-8d7b-7685529b0353	9	1k	\N
bd8df84a-0a78-4f26-8d19-76b09723030d	004ec6fe-d272-4a79-8d7b-7685529b0353	10	1k	\N
55fe2d50-26bc-4742-80ea-ab77c50150df	004ec6fe-d272-4a79-8d7b-7685529b0353	11	studio	\N
3f5062f1-cb7b-4571-8597-d9352e3afdce	004ec6fe-d272-4a79-8d7b-7685529b0353	12	1k	\N
b063436d-0c4a-4686-bcdd-edab4fb75f40	406cc531-1481-4c9b-8b31-268de593b6ad	401	1k	\N
33c68c31-694b-4c84-b73e-6ede8884f400	406cc531-1481-4c9b-8b31-268de593b6ad	402	studio	\N
ad77aaa6-a5fe-4f2d-934d-885fa89e41d4	406cc531-1481-4c9b-8b31-268de593b6ad	403	1k	\N
dfb8a586-830f-46df-a4f8-544da239a44e	406cc531-1481-4c9b-8b31-268de593b6ad	404	1k	\N
0e735395-15c1-4b66-b484-5218a55c918f	406cc531-1481-4c9b-8b31-268de593b6ad	405	1k	\N
7d5f3a64-441d-4821-9a45-3030070f7617	406cc531-1481-4c9b-8b31-268de593b6ad	406	3k	\N
48c80860-7da5-408f-ba93-61e00a917df2	406cc531-1481-4c9b-8b31-268de593b6ad	407	3k	\N
f98ccb21-7a99-442c-a1c4-6a4bece6850b	406cc531-1481-4c9b-8b31-268de593b6ad	408	2k	\N
de4ec8d6-7735-46eb-8e6f-ceae397c075a	406cc531-1481-4c9b-8b31-268de593b6ad	409	studio	\N
b5ab3eef-bef2-4ccc-b3f4-a2681cb7b26f	406cc531-1481-4c9b-8b31-268de593b6ad	410	2k	\N
5c90b53e-0c2d-412b-8151-416f2abaa033	406cc531-1481-4c9b-8b31-268de593b6ad	411	1k	\N
0445aff8-015f-4704-9ce9-fbe3484d435a	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	401	1k	\N
b06186a7-21c1-4fb2-b0c7-8323ca254208	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	402	studio	\N
6b96530e-663a-4a70-80d4-00e2fed78dab	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	403	1k	\N
65369d0a-3de1-4759-8051-66324d60297f	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	404	1k	\N
34c7c54d-0f57-409a-ac26-c01d0da64650	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	405	1k	\N
ba3a8d1b-90d7-43c9-99a0-86037db3767f	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	406	3k	\N
d8d84269-d4cc-4ccf-a316-1a52f8a1abe9	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	407	3k	\N
cf3a8611-2309-489a-a18c-d7016ba6fa9f	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	408	2k	\N
db9a8eca-1d08-4bbe-84f3-4c930978dea6	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	409	studio	\N
565568cd-1411-4765-bfdf-6df9271c162d	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	410	2k	\N
89a0dfd8-b99d-44d6-878e-6b843ececaea	9fc37440-b7d1-4cd5-910a-9cf33fb01a28	411	1k	\N
bee3fccf-5d60-4cd1-ae1b-6663510d6167	abf95c2d-6e93-4550-ad13-5bd89c30080f	13	3k	\N
6a0c4763-d329-4011-8518-5afa3d808f89	abf95c2d-6e93-4550-ad13-5bd89c30080f	14	studio	\N
0aa7a82c-3b0c-4e2b-8afa-47734d170728	abf95c2d-6e93-4550-ad13-5bd89c30080f	15	1k	\N
b4aa7d91-46a4-4ed5-9c59-2511b8e7711a	abf95c2d-6e93-4550-ad13-5bd89c30080f	16	1k	\N
a9450b3d-9840-4259-9bb5-809eecab2f06	abf95c2d-6e93-4550-ad13-5bd89c30080f	17	2k	\N
e4c7e4aa-4bfc-44df-85e6-42d8aead7632	abf95c2d-6e93-4550-ad13-5bd89c30080f	18	1k	\N
8d58a9c6-be72-42df-b033-93113023419a	abf95c2d-6e93-4550-ad13-5bd89c30080f	19	2k	\N
33f87279-602f-4893-98fb-86b45c05aa82	abf95c2d-6e93-4550-ad13-5bd89c30080f	20	1k	\N
9c342f49-c382-4791-a4cc-997a647205b7	abf95c2d-6e93-4550-ad13-5bd89c30080f	21	1k	\N
2b10e30d-014e-4c39-8a99-ccb798cba93d	abf95c2d-6e93-4550-ad13-5bd89c30080f	22	1k	\N
bc2f6504-680e-4548-8ff4-0e9b3077d2ae	abf95c2d-6e93-4550-ad13-5bd89c30080f	23	studio	\N
4c7789d5-da31-41f8-a805-df89a851efc8	abf95c2d-6e93-4550-ad13-5bd89c30080f	24	1k	\N
7ef13fd0-3f2e-46c8-8d4a-530302b889ac	cdcc7264-e6f5-467c-8839-a31bb18b40ba	13	3k	\N
6148a5b1-2117-4640-b708-042e0ad51937	cdcc7264-e6f5-467c-8839-a31bb18b40ba	14	studio	\N
970f7d13-a4fc-4687-ab48-dbb0a47a2965	cdcc7264-e6f5-467c-8839-a31bb18b40ba	15	1k	\N
9f0343f6-6c44-47c7-aa7c-7443b801ab27	cdcc7264-e6f5-467c-8839-a31bb18b40ba	16	1k	\N
a8a515e3-31f1-4744-8754-94da6397ded8	cdcc7264-e6f5-467c-8839-a31bb18b40ba	17	2k	\N
da049fd2-7e97-4058-8ddc-58496704dc90	cdcc7264-e6f5-467c-8839-a31bb18b40ba	18	1k	\N
73792bd3-8287-44f8-8e99-f5e2b857100e	cdcc7264-e6f5-467c-8839-a31bb18b40ba	19	2k	\N
11cd9a1a-4c3c-4159-88dc-7f831123c341	cdcc7264-e6f5-467c-8839-a31bb18b40ba	20	1k	\N
3b3c171e-6b1c-42d9-a1c5-33aad19e2a34	cdcc7264-e6f5-467c-8839-a31bb18b40ba	21	1k	\N
6b17af69-4ea1-4a72-b476-3b90ea62f5ab	cdcc7264-e6f5-467c-8839-a31bb18b40ba	22	1k	\N
24c67cf9-d143-45f3-a93c-dad82248c1c3	cdcc7264-e6f5-467c-8839-a31bb18b40ba	23	studio	\N
b3177f6f-aa59-4383-aa0d-931fc7c887b4	cdcc7264-e6f5-467c-8839-a31bb18b40ba	24	1k	\N
c5471201-6cf7-4c86-b99e-af02efff6e88	049669d2-cbab-4627-ac21-f981e1979c2a	413	1k	\N
21006787-6aef-40dc-98cd-5d755b891fd5	049669d2-cbab-4627-ac21-f981e1979c2a	414	studio	\N
620b9c1b-93b1-4e88-901a-bc90aa07648b	049669d2-cbab-4627-ac21-f981e1979c2a	415	1k	\N
0e6e83a7-c6ed-401f-8fc7-e61e681217c5	049669d2-cbab-4627-ac21-f981e1979c2a	416	1k	\N
892539b0-8b32-4022-8bc2-6225c00b5eb2	049669d2-cbab-4627-ac21-f981e1979c2a	417	1k	\N
11834178-d215-4983-b827-2e0c78c8452d	049669d2-cbab-4627-ac21-f981e1979c2a	418	3k	\N
8c42d18c-3d1e-4772-8a3f-2e04157ae619	049669d2-cbab-4627-ac21-f981e1979c2a	419	3k	\N
26c17eb6-dce8-4b4d-a4ad-7cd9c63cd261	049669d2-cbab-4627-ac21-f981e1979c2a	420	2k	\N
e535296d-a729-45c7-a5df-f7941c9c75ea	049669d2-cbab-4627-ac21-f981e1979c2a	421	studio	\N
e801f2e3-7e3a-47cc-be90-0e26d80ae854	049669d2-cbab-4627-ac21-f981e1979c2a	422	2k	\N
a1421ebf-522e-4af8-a9ba-5b5cd25f64a3	049669d2-cbab-4627-ac21-f981e1979c2a	423	1k	\N
036aa963-b744-4cf8-a90b-1ca0cdaf7e87	11c4ab5e-d373-42be-b023-fa8e02ba9f29	413	1k	\N
22a4b668-ec8d-4eb1-ad77-e6356a4fb77f	11c4ab5e-d373-42be-b023-fa8e02ba9f29	414	studio	\N
162b162f-65f1-44b8-a554-cb72595e52b1	11c4ab5e-d373-42be-b023-fa8e02ba9f29	415	1k	\N
6b3d6d1d-fc86-4c66-b284-99893d3219ee	11c4ab5e-d373-42be-b023-fa8e02ba9f29	416	1k	\N
6cf33c90-a63b-456b-aace-1c13a51d0f1c	11c4ab5e-d373-42be-b023-fa8e02ba9f29	417	1k	\N
50b61b4d-a418-4c2b-b3a5-4d972b40535a	11c4ab5e-d373-42be-b023-fa8e02ba9f29	418	3k	\N
36c47590-b76c-49c8-a910-888c9a8417ac	11c4ab5e-d373-42be-b023-fa8e02ba9f29	419	3k	\N
5a9732cf-91ca-482c-a1f5-4ff0faa7af86	11c4ab5e-d373-42be-b023-fa8e02ba9f29	420	2k	\N
de27042d-627b-46b9-8acd-fd93668c354a	11c4ab5e-d373-42be-b023-fa8e02ba9f29	421	studio	\N
0bb78cbe-ab14-46d8-8169-d9c8dcfee857	11c4ab5e-d373-42be-b023-fa8e02ba9f29	422	2k	\N
b523d33d-6505-4b0c-b85b-9998fa8e880e	11c4ab5e-d373-42be-b023-fa8e02ba9f29	423	1k	\N
dacbfabe-7bf0-4897-b74c-1d08b48d54e6	3b6f8bae-bd81-4435-9cac-07df3742fe24	25	3k	\N
d9480688-abc7-4fa4-afe7-3f999a8a3abb	3b6f8bae-bd81-4435-9cac-07df3742fe24	26	studio	\N
dfa8a750-aa56-435a-b0c3-deec517e3a4f	3b6f8bae-bd81-4435-9cac-07df3742fe24	27	1k	\N
f6f11551-4216-4759-9b18-f335f34c3132	3b6f8bae-bd81-4435-9cac-07df3742fe24	28	1k	\N
5c064a7e-073c-42d8-9510-64a6b0c01676	3b6f8bae-bd81-4435-9cac-07df3742fe24	29	2k	\N
4a7afbc0-ae9e-4994-a9bd-c40b9c42a4af	3b6f8bae-bd81-4435-9cac-07df3742fe24	30	1k	\N
b21c0a21-e0be-4ca0-9d3a-42294a48e003	3b6f8bae-bd81-4435-9cac-07df3742fe24	31	2k	\N
c802fc97-9cae-4080-9a2e-cd8bcbf3dde4	3b6f8bae-bd81-4435-9cac-07df3742fe24	32	1k	\N
7d560b19-d2fe-4bf4-8b68-e1ae31585a4e	3b6f8bae-bd81-4435-9cac-07df3742fe24	33	1k	\N
48675455-3449-42b6-afcc-3885eb1afa8e	3b6f8bae-bd81-4435-9cac-07df3742fe24	34	1k	\N
e800e1f1-e40c-4d0b-8c3e-1bc4818b0a76	3b6f8bae-bd81-4435-9cac-07df3742fe24	35	studio	\N
470c8d69-2ff4-4a22-b7cf-9cf97b7a1209	3b6f8bae-bd81-4435-9cac-07df3742fe24	36	1k	\N
a75e35c4-51e7-4aa8-a536-6d606c7660e0	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	25	3k	\N
d338187b-fc84-4c6a-ae8f-b0c2e57ef42c	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	26	studio	\N
abfe1842-df9e-4d3c-9be4-d98dd04aeadb	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	27	1k	\N
56cef493-4ac4-471f-8ea4-61ae6c43cb66	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	28	1k	\N
21c4e07b-21e5-49c8-9c74-2dd63e72e625	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	29	2k	\N
748f11c3-1284-4f16-b7ab-02f6a45c6a18	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	30	1k	\N
69934da0-b2c4-4edb-9d40-764ea030a6ef	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	31	2k	\N
a1ba168d-5952-402f-8c0f-840eb4314e55	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	32	1k	\N
ddeb5673-7ed6-4d73-ae58-7b68d857df59	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	33	1k	\N
d60fcead-d6c8-4d82-8a00-318a024dafaf	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	34	1k	\N
bbd0dab6-4cfb-4ced-ab6c-d4dcd48faa3d	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	35	studio	\N
d5e4e589-5b34-4eee-95b0-844ba6e2afb0	d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	36	1k	\N
4ae9b7c7-0cd0-459d-a09f-d278f28cf9f5	8152e09c-2b84-451c-89e4-d297a90b3528	425	1k	\N
71572452-527d-4525-87b8-1cee7fa1f9c7	8152e09c-2b84-451c-89e4-d297a90b3528	426	studio	\N
90e96eb9-1d4e-4419-bb6d-ddda2904c11c	8152e09c-2b84-451c-89e4-d297a90b3528	427	1k	\N
77fc6af9-3fd5-4cad-a134-79fb872579e7	8152e09c-2b84-451c-89e4-d297a90b3528	428	1k	\N
df82c394-1def-4dee-98b0-a1b665e34318	8152e09c-2b84-451c-89e4-d297a90b3528	429	1k	\N
1f923bd8-5967-4b4f-8995-d3678ec274e2	8152e09c-2b84-451c-89e4-d297a90b3528	430	3k	\N
9085e6c9-daaf-45ae-939c-02033b4a714b	8152e09c-2b84-451c-89e4-d297a90b3528	431	3k	\N
ea6b05ff-0c3a-426a-b5d5-d2f3e7086ab9	8152e09c-2b84-451c-89e4-d297a90b3528	432	2k	\N
1efb452d-fad3-45c2-98b3-3177b4624699	8152e09c-2b84-451c-89e4-d297a90b3528	433	studio	\N
4a4d645c-5ceb-4ad7-93d4-bc26a5a56393	8152e09c-2b84-451c-89e4-d297a90b3528	434	2k	\N
98d36cbe-ca92-4d8a-a3b0-02ce12b1aaea	8152e09c-2b84-451c-89e4-d297a90b3528	435	1k	\N
149ccb7a-2db7-4efd-93f9-15183a3a7db7	1b621413-ba5a-40aa-81ab-4bb944be3b17	425	1k	\N
e6d88f12-0f5d-4145-ac9a-c247b88644c6	1b621413-ba5a-40aa-81ab-4bb944be3b17	426	studio	\N
b14af35d-4d7a-49b1-818a-143b5857c472	1b621413-ba5a-40aa-81ab-4bb944be3b17	427	1k	\N
31d176a8-3d30-4295-99bb-ea43dcec0e10	1b621413-ba5a-40aa-81ab-4bb944be3b17	428	1k	\N
92df7d46-5812-4b08-bdf6-20fa81c11716	1b621413-ba5a-40aa-81ab-4bb944be3b17	429	1k	\N
54cbc214-f79e-4d0f-b928-ec0f12ab0d66	1b621413-ba5a-40aa-81ab-4bb944be3b17	430	3k	\N
b132a92c-ea82-44f3-9ed1-faa51aed28e8	1b621413-ba5a-40aa-81ab-4bb944be3b17	431	3k	\N
adf7c75b-1f3f-49f5-9f00-8751368da2cf	1b621413-ba5a-40aa-81ab-4bb944be3b17	432	2k	\N
28ee091d-4c09-4188-9ded-40f0ae3ad2f0	1b621413-ba5a-40aa-81ab-4bb944be3b17	433	studio	\N
f860e0e5-75bf-4306-b401-e21d35da095b	1b621413-ba5a-40aa-81ab-4bb944be3b17	434	2k	\N
953bdacf-aba6-4f07-ba86-fd091aef0660	1b621413-ba5a-40aa-81ab-4bb944be3b17	435	1k	\N
759d2531-9b49-4f69-8fe3-5479d136dc86	317e0684-c7c7-4d03-acbd-52ee8531030f	37	3k	\N
318febd3-8df7-427a-b468-cd5bdcfa0277	317e0684-c7c7-4d03-acbd-52ee8531030f	38	studio	\N
8ce4d10c-8cc3-4107-9913-6dea005014c9	317e0684-c7c7-4d03-acbd-52ee8531030f	39	1k	\N
cada42ca-ca1f-47f6-ad90-faf20f563ef9	317e0684-c7c7-4d03-acbd-52ee8531030f	40	1k	\N
376b4b7b-5973-4831-bb51-dafa5692ff83	317e0684-c7c7-4d03-acbd-52ee8531030f	41	2k	\N
c723d970-2745-44db-beeb-95a637f19d4b	317e0684-c7c7-4d03-acbd-52ee8531030f	42	1k	\N
cbf202bf-cc99-48e4-ae4d-62b1550432e4	317e0684-c7c7-4d03-acbd-52ee8531030f	43	2k	\N
ce5974b0-eebe-49b3-b324-3b2326a85100	317e0684-c7c7-4d03-acbd-52ee8531030f	44	1k	\N
dabcb994-b174-417b-94f5-d660f3721dd0	317e0684-c7c7-4d03-acbd-52ee8531030f	45	1k	\N
8fbda58c-015f-4774-b595-d8a1c081d7ff	317e0684-c7c7-4d03-acbd-52ee8531030f	46	1k	\N
363b7e08-d270-4a19-85e3-7fa4e31dc1fa	317e0684-c7c7-4d03-acbd-52ee8531030f	47	studio	\N
28baecba-9678-44d9-9b55-8c8e04e2c6e8	317e0684-c7c7-4d03-acbd-52ee8531030f	48	1k	\N
340f0ffd-017c-43f0-b00d-c94db0690f5b	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	37	3k	\N
598b9014-5de4-47c2-ac8e-0b7237dccdb9	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	38	studio	\N
6d6e5515-52ad-41fb-9be4-c6f001f3d48c	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	39	1k	\N
c58b3eb1-0322-4a0a-8c2f-5936d56be7a4	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	40	1k	\N
b62d9686-1708-415c-96a5-d4ff866678b6	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	41	2k	\N
0e5532a9-ccef-47f2-b6cf-353e75420fca	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	42	1k	\N
d3324ac7-7816-4de3-be79-6967336d382c	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	43	2k	\N
03bbc08c-1e9a-49b1-b6bb-6f7d3c2455a9	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	44	1k	\N
cb416849-dc62-419f-b78f-26bec2d718f5	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	45	1k	\N
e9d85f76-1599-4eb1-99b0-d76ec8c87f5e	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	46	1k	\N
12e24d8b-79fc-4295-bc3e-927580e87016	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	47	studio	\N
88c96304-055d-4118-b3e0-a05467aa4089	bf9a51f5-6a7b-400d-be1c-2011d72ecad0	48	1k	\N
2909c40b-74af-4ad9-997a-12ac90b1d5b8	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	437	1k	\N
59b778fc-32a3-4782-9d4e-db5383f8b8a4	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	438	studio	\N
d3c109da-1973-4d7d-abed-4c5508267a75	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	439	1k	\N
8ecebda1-4086-4cd8-be0a-f90b18445129	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	440	1k	\N
a48c20f8-258f-40b9-9e33-1cf5a6d5fc46	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	441	1k	\N
cafaec89-c8be-4a54-b8ab-04f33c3848a2	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	442	3k	\N
74c962c3-7a0f-40a5-8116-57150d6a1a23	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	443	3k	\N
98588308-17fa-43c4-84a8-2fc9a9d9fce1	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	444	2k	\N
a0b58a22-631b-4ab5-8f20-b4c450462913	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	445	studio	\N
0d0f50a9-6252-4354-ac2a-db5b71c4603e	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	446	2k	\N
cc75f577-a7be-4f58-bff9-75e4b6a255c7	78d9c7b6-18cf-40ae-89c8-c5a4a472175c	447	1k	\N
5d0669e3-b4d4-45e3-894f-6fe0b38f4189	21ccae0a-e6e7-4a17-a4db-b6c314743134	437	1k	\N
2aca30ab-392b-4733-a4a0-1ecf0f9cf087	21ccae0a-e6e7-4a17-a4db-b6c314743134	438	studio	\N
17c0745c-fc00-462d-bfaa-4291006bf466	21ccae0a-e6e7-4a17-a4db-b6c314743134	439	1k	\N
740bd5ac-7cab-4d64-a014-b3558344dd07	21ccae0a-e6e7-4a17-a4db-b6c314743134	440	1k	\N
6ff1daea-5c03-42c6-abfb-3ef70416587d	21ccae0a-e6e7-4a17-a4db-b6c314743134	441	1k	\N
5d2d63ed-443c-425e-8a60-9f788941ccde	21ccae0a-e6e7-4a17-a4db-b6c314743134	442	3k	\N
6b6e7039-a4f0-4434-9aa6-88ff022386d3	21ccae0a-e6e7-4a17-a4db-b6c314743134	443	3k	\N
b462c089-98b2-4721-800c-0e0732a0e585	21ccae0a-e6e7-4a17-a4db-b6c314743134	444	2k	\N
50fcdbc3-840b-42c5-891a-4310d9414360	21ccae0a-e6e7-4a17-a4db-b6c314743134	445	studio	\N
245cb9e8-1ded-4d02-a6ea-7a6c3b154976	21ccae0a-e6e7-4a17-a4db-b6c314743134	446	2k	\N
7e7662f3-3b99-4974-841d-c59117374e63	21ccae0a-e6e7-4a17-a4db-b6c314743134	447	1k	\N
a74c05a4-7422-4dc4-ae40-e670c4b4f401	d9f62fff-7ef5-4790-96ec-87bc1147544e	49	3k	\N
aa61128a-d974-4f1c-a197-2b70a50b7362	d9f62fff-7ef5-4790-96ec-87bc1147544e	50	studio	\N
0df8a319-0868-4037-b357-f4d43d857cfa	d9f62fff-7ef5-4790-96ec-87bc1147544e	51	1k	\N
22766217-f32c-4f05-b1de-23be2e396a76	d9f62fff-7ef5-4790-96ec-87bc1147544e	52	1k	\N
a645dd63-935c-4221-92f9-d2032a275d23	d9f62fff-7ef5-4790-96ec-87bc1147544e	53	2k	\N
986f9ea4-29ba-4e5c-b682-248e99d4ad2a	d9f62fff-7ef5-4790-96ec-87bc1147544e	54	1k	\N
e065a27a-b242-486f-a636-fbcda4a8c2ac	d9f62fff-7ef5-4790-96ec-87bc1147544e	55	2k	\N
26f2271f-dcf8-4d98-a778-defd3c5ffe36	d9f62fff-7ef5-4790-96ec-87bc1147544e	56	1k	\N
7bfcc3cb-bf1c-48e6-8402-4da89645ccd8	d9f62fff-7ef5-4790-96ec-87bc1147544e	57	1k	\N
efb3c957-68c3-436a-8de3-c9c72292bf47	d9f62fff-7ef5-4790-96ec-87bc1147544e	58	1k	\N
5c61460c-6f28-4bf8-be10-6ab7c3645c5e	d9f62fff-7ef5-4790-96ec-87bc1147544e	59	studio	\N
c0b02f32-9d80-4be6-bb3a-c6ed90bf2e8a	d9f62fff-7ef5-4790-96ec-87bc1147544e	60	1k	\N
f410a7d6-c9e1-4c23-a6b5-c871f10aae4c	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	49	3k	\N
f7a7feb5-8215-42af-850c-13e70c63363b	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	50	studio	\N
940636e3-4afd-4017-8841-dcb423aa2033	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	51	1k	\N
564dc3bf-1e5d-4be8-a22f-499d28679874	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	52	1k	\N
b1c5b884-2826-4a3f-a1d4-c09b2011c8a6	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	53	2k	\N
448a8abf-174c-4ceb-aa26-3346418a350e	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	54	1k	\N
84a82f97-70c8-4dec-ae89-f4fefed11514	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	55	2k	\N
95cd6831-21bc-41a7-b3e7-ce7cc82772e7	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	56	1k	\N
37125bf2-27c6-4d60-b7a7-02502f985203	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	57	1k	\N
1c2420cb-d873-4af4-a520-3801b1e90e72	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	58	1k	\N
79475a58-d7e2-47a1-8492-7aa3175647c4	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	59	studio	\N
da3964aa-adc5-41ff-beeb-2e3fca5d6d51	ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	60	1k	\N
1192adf0-66b7-4ff6-9370-da47837af6dd	16e1dc24-c253-4ffc-a069-d54390248b01	449	1k	\N
1335c9e4-b9a8-4374-a7db-de4bdaf3c701	16e1dc24-c253-4ffc-a069-d54390248b01	450	studio	\N
543bd3a6-fb9d-4e24-8a0f-8fcdc665796e	16e1dc24-c253-4ffc-a069-d54390248b01	451	1k	\N
c2f07c8b-955e-4aff-9349-1f29730f084b	16e1dc24-c253-4ffc-a069-d54390248b01	452	1k	\N
9526644a-0aa6-40e0-869f-b87c5e11e4bf	16e1dc24-c253-4ffc-a069-d54390248b01	453	1k	\N
fd580513-7353-4ce7-a98d-4f5398be47a3	16e1dc24-c253-4ffc-a069-d54390248b01	454	3k	\N
5599589a-0894-4550-a088-01c278d86ee8	16e1dc24-c253-4ffc-a069-d54390248b01	455	3k	\N
933c8bc3-be20-4a7b-b007-523ddc40abd9	16e1dc24-c253-4ffc-a069-d54390248b01	456	2k	\N
70620322-df30-4af9-a396-29ba74180783	16e1dc24-c253-4ffc-a069-d54390248b01	457	studio	\N
6a8b4f90-ae66-4044-bcbc-17389b7dab93	16e1dc24-c253-4ffc-a069-d54390248b01	458	2k	\N
b7168c79-7854-403e-99b2-33a6f739bc54	16e1dc24-c253-4ffc-a069-d54390248b01	459	1k	\N
22566a6d-082f-4852-8af9-265cd173a3f3	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	449	1k	\N
fb912e14-af04-426e-be9e-ea40b5de1275	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	450	studio	\N
5ecb277f-0ce3-49eb-8125-9923e0d14f14	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	451	1k	\N
07b4038c-a985-4ef5-b982-78c64492fa07	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	452	1k	\N
9f9b1235-b2fd-4ac6-81a7-784167983e89	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	453	1k	\N
a65da75c-8c45-46b0-9188-8c40627926e8	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	454	3k	\N
e3b7e26e-59c3-4db7-bf4b-e8e765baac0a	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	455	3k	\N
8ca957e9-5eb8-42a9-8b10-4be5ee9aeeb2	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	456	2k	\N
f9b42e7a-5e20-423f-817e-affece9df03e	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	457	studio	\N
878b7b04-463f-49fe-ba0c-b6ff98a36323	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	458	2k	\N
d2b8f6e1-6f4d-4b2e-95b4-1e9ef0d1b9a6	27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	459	1k	\N
84c72c4d-62d4-44f0-bb95-e7c742d45ae4	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	61	3k	\N
f45c0be0-0b2e-446f-86bb-aca03e4de36b	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	62	studio	\N
72e9f186-3850-4203-b961-79274d40f44a	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	63	1k	\N
b4732816-31ad-432c-93d3-ff226008fc28	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	64	1k	\N
6645043c-6dec-4d45-bb12-fa5fa11c3bc6	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	65	2k	\N
811a66ad-ab87-467d-9c44-a4f39efe5f55	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	66	1k	\N
1832d1d1-7f21-4a1e-b5cb-6c64f7732016	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	67	2k	\N
4a153de3-67f2-46aa-ba66-440ef76510e3	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	68	1k	\N
81a41098-06b4-4ba2-9b59-ed32608b86ae	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	69	1k	\N
f633204d-3b81-483d-b4f4-0fa72f9e53cf	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	70	1k	\N
88c2772f-160b-481d-a217-6c013d629e9a	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	71	studio	\N
905a1149-f459-4a8a-83d9-43b56098a2b0	dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	72	1k	\N
3670d856-f7c2-47ba-9fd8-1eee4381af08	caad87ca-4fc1-4a15-8241-5429d28e9edb	61	3k	\N
93bee616-d463-4be3-8a3b-4c5ab53ce0e8	caad87ca-4fc1-4a15-8241-5429d28e9edb	62	studio	\N
435b4180-5970-4105-8c55-10c6a6e35571	caad87ca-4fc1-4a15-8241-5429d28e9edb	63	1k	\N
eff571ce-004d-4537-87fd-d716fd2f12b9	caad87ca-4fc1-4a15-8241-5429d28e9edb	64	1k	\N
a0c3820b-2569-48fe-80ef-387262384181	caad87ca-4fc1-4a15-8241-5429d28e9edb	65	2k	\N
7afa13e9-6e0f-4805-94c8-43507135c9e8	caad87ca-4fc1-4a15-8241-5429d28e9edb	66	1k	\N
cf3a4756-7441-41ff-9004-284adbb18cbf	caad87ca-4fc1-4a15-8241-5429d28e9edb	67	2k	\N
51a314e8-5614-4516-b20b-7fa75dd39f23	caad87ca-4fc1-4a15-8241-5429d28e9edb	68	1k	\N
f2621aaf-e364-4ab8-9a61-e87c4c434a5f	caad87ca-4fc1-4a15-8241-5429d28e9edb	69	1k	\N
cf1461d3-a621-4f33-bcf9-21984c26dc6b	caad87ca-4fc1-4a15-8241-5429d28e9edb	70	1k	\N
1d4de826-f647-4366-b8b8-8210ef6f3f66	caad87ca-4fc1-4a15-8241-5429d28e9edb	71	studio	\N
0c4354bd-8b37-4c9b-bab8-27e3568eb5d1	caad87ca-4fc1-4a15-8241-5429d28e9edb	72	1k	\N
45b86a7b-12d8-44c8-9b4c-a45eb820ae04	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	461	1k	\N
5d82c492-bd1f-49b6-a491-b6f8c7d45724	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	462	studio	\N
eac326b6-6219-484d-9053-cd2870f65892	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	463	1k	\N
c8f1b0bd-0f0a-4962-92d2-607b27868e2a	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	464	1k	\N
f71ef8c0-e310-4f15-b7fe-c11c838b5cd7	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	465	1k	\N
4f3e12a4-89ab-48a7-b2e3-9bd518f37265	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	466	3k	\N
3224278d-2489-47a9-806b-4625afc7c5c2	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	467	3k	\N
170f7e2f-d6a9-4586-86e7-014e85fa010b	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	468	2k	\N
c5fa248c-5a90-425c-8825-d9216b663a1b	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	469	studio	\N
3f1a3a36-a0f6-4132-a8e1-259590e89c32	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	470	2k	\N
194dd12a-f9ca-4517-a302-5ea83c4f546c	5685ecfc-d55c-47ae-ae0b-e6e26d009d40	471	1k	\N
19fdf826-b374-453d-b5d9-4b21249605f8	2006b800-2a80-4f63-b945-23e25e74d166	461	1k	\N
c5be9cb1-c17a-41f8-8fbc-bb7010985cd2	2006b800-2a80-4f63-b945-23e25e74d166	462	studio	\N
bcf1539c-b309-4f34-ad71-26c6c8492943	2006b800-2a80-4f63-b945-23e25e74d166	463	1k	\N
9aa46463-f904-4e55-8353-3bc9ec1bb0aa	2006b800-2a80-4f63-b945-23e25e74d166	464	1k	\N
4274184d-ac36-461b-a22b-b3ee655368e0	2006b800-2a80-4f63-b945-23e25e74d166	465	1k	\N
3e91e87b-96d9-4e2e-8ed3-46e8362b02f4	2006b800-2a80-4f63-b945-23e25e74d166	466	3k	\N
78385f67-3e4f-4f38-af51-3e600114baf2	2006b800-2a80-4f63-b945-23e25e74d166	467	3k	\N
b1e299da-4e1b-4579-a82b-6db5419d638a	2006b800-2a80-4f63-b945-23e25e74d166	468	2k	\N
565de2e0-2ffe-40ee-bc56-ce8feedd528b	2006b800-2a80-4f63-b945-23e25e74d166	469	studio	\N
cd97e1f2-eb3e-4a32-b06f-f24bb6d14748	2006b800-2a80-4f63-b945-23e25e74d166	470	2k	\N
c83418ac-11dc-444f-89a7-288ba4d1f321	2006b800-2a80-4f63-b945-23e25e74d166	471	1k	\N
0206650f-9ea6-4b98-8fdd-85d634616fa0	c8091e4c-b049-4cac-a837-61fae03b800b	73	3k	\N
cc0fac38-2eff-4933-a1df-929ca91d2643	c8091e4c-b049-4cac-a837-61fae03b800b	74	studio	\N
f56e496f-0b95-47d3-a84f-a45e236a1e4f	c8091e4c-b049-4cac-a837-61fae03b800b	75	1k	\N
65ff95fc-d515-4b3f-86b6-0bf02be22d72	c8091e4c-b049-4cac-a837-61fae03b800b	76	1k	\N
95bda31d-b5d3-41d4-b2c7-0a12925a804f	c8091e4c-b049-4cac-a837-61fae03b800b	77	2k	\N
85551d50-e5c3-41ea-b4ea-0ff79babd437	c8091e4c-b049-4cac-a837-61fae03b800b	78	1k	\N
72af6658-2c40-45b5-9dbe-e4603032d139	c8091e4c-b049-4cac-a837-61fae03b800b	79	2k	\N
cea2ec6d-eaae-4f3f-a456-afd19575a8cc	c8091e4c-b049-4cac-a837-61fae03b800b	80	1k	\N
ee404716-4c23-4d25-ac86-b85b6a5c6c59	c8091e4c-b049-4cac-a837-61fae03b800b	81	1k	\N
a2429353-98fb-4684-925e-e26e013f2d20	c8091e4c-b049-4cac-a837-61fae03b800b	82	1k	\N
5a1326d9-d8bf-4569-bd40-d995a9500b3c	c8091e4c-b049-4cac-a837-61fae03b800b	83	studio	\N
72ce5c0b-b43e-4d8d-bbe1-3bb1e1cf07a0	c8091e4c-b049-4cac-a837-61fae03b800b	84	1k	\N
c2b8c924-d04a-4a5b-b138-e286b10719ab	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	73	3k	\N
f1eb9c7a-cdc4-47f6-b11d-0e557a7d16a6	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	74	studio	\N
91d6cd1a-4e5c-4584-8a9b-4a9aa94f906c	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	75	1k	\N
ccef3e1e-0736-4039-b6f4-50269ea080e0	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	76	1k	\N
82bb617d-58c0-4ca6-a7a4-b9f3120f0a76	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	77	2k	\N
f62d6f67-c702-409b-90fa-9811060f2314	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	78	1k	\N
2f556ce8-c926-41bf-a2e6-1e75b0ac7b0a	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	79	2k	\N
01e43cb1-7546-48f5-ab8a-b1c2db615061	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	80	1k	\N
dde689cd-653d-4f89-8982-bff37a290626	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	81	1k	\N
cae4b08b-a927-45b0-96f8-5a4c1073f3e4	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	82	1k	\N
81435567-51eb-468b-ab37-20982f0dace8	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	83	studio	\N
f10657bc-60e4-4744-8118-07cb15b54336	a5d3c9cc-0eeb-45c6-99de-ccaca2015312	84	1k	\N
a85aaab8-b145-4251-b212-05173acf2edc	d643a7cb-4f8c-4cea-bbc8-cb6334803067	473	1k	\N
23d72364-765a-48ab-97d7-eea773bf389d	d643a7cb-4f8c-4cea-bbc8-cb6334803067	474	studio	\N
38a3941b-c12c-4a32-a236-dfb5d57ce368	d643a7cb-4f8c-4cea-bbc8-cb6334803067	475	1k	\N
54944562-c449-4dff-b309-47cfe24182ed	d643a7cb-4f8c-4cea-bbc8-cb6334803067	476	1k	\N
7f90e74e-8421-4f69-abcd-8550069b1cbe	d643a7cb-4f8c-4cea-bbc8-cb6334803067	477	1k	\N
3bc0321d-bea8-45e3-a74a-4566a1fb3c1c	d643a7cb-4f8c-4cea-bbc8-cb6334803067	478	3k	\N
4d48ee9f-72f8-4c01-a525-cca69410987e	d643a7cb-4f8c-4cea-bbc8-cb6334803067	479	3k	\N
7fa78803-a13e-4e4b-8084-79ff1cc48bae	d643a7cb-4f8c-4cea-bbc8-cb6334803067	480	2k	\N
60273472-1b31-428b-b286-d68c84132bcf	d643a7cb-4f8c-4cea-bbc8-cb6334803067	481	studio	\N
bc1ec987-d225-463d-b5d4-621846629793	d643a7cb-4f8c-4cea-bbc8-cb6334803067	482	2k	\N
ce4583c7-77d7-44da-a617-c807103a24c9	d643a7cb-4f8c-4cea-bbc8-cb6334803067	483	1k	\N
fd70a2f8-1e14-4e51-9c88-030d1d3a5aaa	85e21cfa-d2df-4451-a148-97d7a5f55c4c	473	1k	\N
f177431b-d32a-44f4-8b4f-be3ff1fbc620	85e21cfa-d2df-4451-a148-97d7a5f55c4c	474	studio	\N
f3ddb2af-c748-4dae-b901-82565648b0d8	85e21cfa-d2df-4451-a148-97d7a5f55c4c	475	1k	\N
abf632d8-0b61-4825-8c28-b0601494c2e3	85e21cfa-d2df-4451-a148-97d7a5f55c4c	476	1k	\N
2166b5fa-041c-4a08-8d6e-733610fd45ee	85e21cfa-d2df-4451-a148-97d7a5f55c4c	477	1k	\N
8608bad2-ead4-4877-afe1-4ab8e7f55f34	85e21cfa-d2df-4451-a148-97d7a5f55c4c	478	3k	\N
96fa0710-27e0-47de-87d1-ce459c1e168e	85e21cfa-d2df-4451-a148-97d7a5f55c4c	479	3k	\N
0c4cb162-b1a2-4974-8e50-dbf031b6f166	85e21cfa-d2df-4451-a148-97d7a5f55c4c	480	2k	\N
86749d25-154c-4880-bf41-8501999fd9ff	85e21cfa-d2df-4451-a148-97d7a5f55c4c	481	studio	\N
8f313def-1bbf-4325-88e3-f053301af980	85e21cfa-d2df-4451-a148-97d7a5f55c4c	482	2k	\N
83300a1e-2ea9-4c4e-8c55-fd8354441d80	85e21cfa-d2df-4451-a148-97d7a5f55c4c	483	1k	\N
8a4e2da6-8de1-4563-b5b7-0ef89cf5e29d	6f367606-cedd-4a7b-8dcf-76b49e5cd030	85	3k	\N
123140dd-12f2-437f-96ab-4b5c98afd1be	6f367606-cedd-4a7b-8dcf-76b49e5cd030	86	studio	\N
2518647d-f19d-4ae6-bb4e-4ea4777c3895	6f367606-cedd-4a7b-8dcf-76b49e5cd030	87	1k	\N
5e67baf3-4e76-4afd-a68b-33ab161a46c2	6f367606-cedd-4a7b-8dcf-76b49e5cd030	88	1k	\N
29709247-bd66-4fac-b9f8-d850bbba79d5	6f367606-cedd-4a7b-8dcf-76b49e5cd030	89	2k	\N
0bcc207a-cbaf-4720-be6c-7650039da7a5	6f367606-cedd-4a7b-8dcf-76b49e5cd030	90	1k	\N
2b5c65ee-c5f0-4b82-b444-884b327f92e6	6f367606-cedd-4a7b-8dcf-76b49e5cd030	91	2k	\N
73ad7865-d115-40fc-b9ea-638814667114	6f367606-cedd-4a7b-8dcf-76b49e5cd030	92	1k	\N
5b94dbed-d41e-461e-abad-76e592fb8fe4	6f367606-cedd-4a7b-8dcf-76b49e5cd030	93	1k	\N
63881827-62fb-4ef7-8d17-55ac7d100a64	6f367606-cedd-4a7b-8dcf-76b49e5cd030	94	1k	\N
1e5b1b7c-9671-4b4e-94fa-3adba4cc9d5d	6f367606-cedd-4a7b-8dcf-76b49e5cd030	95	studio	\N
2d8fb422-b3c5-450b-9db3-b808e5a613a2	6f367606-cedd-4a7b-8dcf-76b49e5cd030	96	1k	\N
c03b0ece-b51b-434b-88dd-87c9810040d9	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	85	3k	\N
2f3941e4-8346-421c-bf12-c76585743a7d	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	86	studio	\N
84dd733d-11da-43f0-9a39-7e12d2434157	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	87	1k	\N
db01c715-dd60-45fd-9388-5b6514aaeb05	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	88	1k	\N
39c1bf59-c179-4683-9220-2f30d661a169	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	89	2k	\N
d0f73766-f3ac-4531-9107-0e5645152150	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	90	1k	\N
cf401c16-aa9d-43af-8a02-8ac3a32410eb	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	91	2k	\N
1f01200b-7578-43e9-a8ec-62c2dd634180	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	92	1k	\N
6a51b03e-e3c3-4905-8e1b-0f3f88f97080	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	93	1k	\N
2b8dbbb0-2cfd-43bb-8841-23e87b1101d1	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	94	1k	\N
96cd222d-fd2e-496a-ad08-a997073042c4	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	95	studio	\N
039d3495-0f36-4cc6-a07b-d1706836d251	d6fda91a-6a00-4c8b-b459-ebde0af1bcab	96	1k	\N
9b2c894b-a131-444d-b834-77bb957ab8a3	c976413b-c4f8-4c84-8b20-9a39baf72de7	485	1k	\N
9b146869-b902-4fb9-bcd9-f023075eb015	c976413b-c4f8-4c84-8b20-9a39baf72de7	486	studio	\N
d4620f98-55d5-4216-8cec-9569df074e9a	c976413b-c4f8-4c84-8b20-9a39baf72de7	487	1k	\N
8c0ac9c5-aade-4079-bde3-83b8853e4434	c976413b-c4f8-4c84-8b20-9a39baf72de7	488	1k	\N
c19470cf-02b6-4545-957e-d343729dceb2	c976413b-c4f8-4c84-8b20-9a39baf72de7	489	1k	\N
03e6955f-cbdb-4987-9e6d-7e510c126bdf	c976413b-c4f8-4c84-8b20-9a39baf72de7	490	3k	\N
083a37a5-60fd-4ad7-9af7-97a75b3b7136	c976413b-c4f8-4c84-8b20-9a39baf72de7	491	3k	\N
c0b879ce-9a64-4233-b2a2-00059185c0d7	c976413b-c4f8-4c84-8b20-9a39baf72de7	492	2k	\N
8ef7b623-968f-4b48-be4d-8880831dfb77	c976413b-c4f8-4c84-8b20-9a39baf72de7	493	studio	\N
428b2e3f-cc7f-45b7-be06-be1f4602d230	c976413b-c4f8-4c84-8b20-9a39baf72de7	494	2k	\N
c60a74ce-dc15-45ca-ba37-177802cc0cc2	c976413b-c4f8-4c84-8b20-9a39baf72de7	495	1k	\N
fd986824-b333-489f-988d-ddad131d3515	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	485	1k	\N
5ae13ede-a029-4a24-8db3-9ce1fd5cd540	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	486	studio	\N
08197159-81b5-4a08-9f04-d6c4e58b40b9	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	487	1k	\N
c711d6b5-8dc8-466c-9394-3630d6283ff8	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	488	1k	\N
db63a7ca-ccfb-444d-9835-378d4f1c2936	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	489	1k	\N
401412f6-2fc5-4fe7-acc4-03b00ca56ac4	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	490	3k	\N
651a2229-d450-4ef2-8e39-a5e3f4a090fe	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	491	3k	\N
fc6451b9-8dc7-4230-89d0-edebc4e3ded0	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	492	2k	\N
ceb4de86-d3c2-44df-9c6e-9f8fd693e186	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	493	studio	\N
89f20bbd-7853-4aaa-8e91-b86b55787c99	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	494	2k	\N
8eab3966-b87b-4490-ab95-2ab7899f2620	a830c28c-f3a5-4665-ba65-d8a16ed4cf86	495	1k	\N
c6480705-f69b-476c-b5dd-a9e817e73929	3412a28a-5c67-4f0e-990c-b156449ce150	97	3k	\N
0b9e1627-2292-4d3d-b5ec-1baf765ed63b	3412a28a-5c67-4f0e-990c-b156449ce150	98	studio	\N
5bf1462e-5927-4b2c-b78e-8ec6557ae23d	3412a28a-5c67-4f0e-990c-b156449ce150	99	1k	\N
ba0e4d10-faf4-40db-9ccb-2806a5c274bc	3412a28a-5c67-4f0e-990c-b156449ce150	100	1k	\N
3d9718f3-33c4-4e3e-849b-0bb597a58e5d	3412a28a-5c67-4f0e-990c-b156449ce150	101	2k	\N
576100de-4505-4381-862f-c639f6cdea2a	3412a28a-5c67-4f0e-990c-b156449ce150	102	1k	\N
f55acc47-9a31-4ac8-836c-8687e0898dc3	3412a28a-5c67-4f0e-990c-b156449ce150	103	2k	\N
08710f23-2341-4760-be8f-716ee3ba21d6	3412a28a-5c67-4f0e-990c-b156449ce150	104	1k	\N
5f0cc378-90fd-4543-9d90-bce5137b7fdb	3412a28a-5c67-4f0e-990c-b156449ce150	105	1k	\N
3b0a15cb-3d49-4e05-8529-5375a96dcf21	3412a28a-5c67-4f0e-990c-b156449ce150	106	1k	\N
4eb27f4c-a75f-405c-bb78-f1c90da3b547	3412a28a-5c67-4f0e-990c-b156449ce150	107	studio	\N
1482c50e-1a43-47ea-97fa-66551ee7cd70	3412a28a-5c67-4f0e-990c-b156449ce150	108	1k	\N
79c400da-9287-4188-ba9f-f45a197e3440	dc0c184a-8309-4f9b-b801-ef34df7b1d95	97	3k	\N
e8a7b643-07c0-4c51-922a-aeed6fd47712	dc0c184a-8309-4f9b-b801-ef34df7b1d95	98	studio	\N
f93759e7-d467-4108-929e-df4496b9f777	dc0c184a-8309-4f9b-b801-ef34df7b1d95	99	1k	\N
839859a5-69ff-4cb3-80d2-c96380da6166	dc0c184a-8309-4f9b-b801-ef34df7b1d95	100	1k	\N
b88410dc-22bf-448a-ae0c-ca38fb444353	dc0c184a-8309-4f9b-b801-ef34df7b1d95	101	2k	\N
5cabf3bf-3aaa-479c-8eda-990368281ad2	dc0c184a-8309-4f9b-b801-ef34df7b1d95	102	1k	\N
83fdb894-cb20-4bd3-8c14-63a32a15851a	dc0c184a-8309-4f9b-b801-ef34df7b1d95	103	2k	\N
f3310657-1026-44a8-bd61-0a4e7ae03efe	dc0c184a-8309-4f9b-b801-ef34df7b1d95	104	1k	\N
8ee5fd2b-6db2-4db4-b353-9928be3b9544	dc0c184a-8309-4f9b-b801-ef34df7b1d95	105	1k	\N
d96be98c-a945-4509-83b9-317d2be36b53	dc0c184a-8309-4f9b-b801-ef34df7b1d95	106	1k	\N
23eead86-6c17-4d95-8d5a-8c3dd94088ec	dc0c184a-8309-4f9b-b801-ef34df7b1d95	107	studio	\N
8e51a523-5d9b-40cd-b97e-1e1bbc344cef	dc0c184a-8309-4f9b-b801-ef34df7b1d95	108	1k	\N
569b1091-b032-4cb0-b646-59e521067c6c	225a7b94-ba82-485f-ac76-33e0f0f13533	497	1k	\N
aad4bc3e-86dc-4938-a6bb-1571391019cd	225a7b94-ba82-485f-ac76-33e0f0f13533	498	studio	\N
035c397c-4585-45e2-ba19-591160154260	225a7b94-ba82-485f-ac76-33e0f0f13533	499	1k	\N
0d897d73-2134-4a77-a2ca-130b3ce030ed	225a7b94-ba82-485f-ac76-33e0f0f13533	500	1k	\N
506fd312-72f5-4824-a943-8ccc03164c4c	225a7b94-ba82-485f-ac76-33e0f0f13533	501	1k	\N
90952139-2ae0-4027-97eb-ab745cc9f8c6	225a7b94-ba82-485f-ac76-33e0f0f13533	502	3k	\N
74fb5366-1bdb-4a5d-8cf5-3d7f5a5ea87d	225a7b94-ba82-485f-ac76-33e0f0f13533	503	3k	\N
37bf9482-2662-4520-8940-ab2eb977e3ba	225a7b94-ba82-485f-ac76-33e0f0f13533	504	2k	\N
203e7288-0757-4bb6-93df-cecd7e7c4500	225a7b94-ba82-485f-ac76-33e0f0f13533	505	studio	\N
b52bc418-20f5-416c-ad8a-0446384fe317	225a7b94-ba82-485f-ac76-33e0f0f13533	506	2k	\N
e983d017-e730-4f87-adcf-7ac51bb93630	225a7b94-ba82-485f-ac76-33e0f0f13533	507	1k	\N
95c4e17e-323d-481d-a55f-7f688d290ad0	333cadfe-57cc-44da-8830-4a01004a1bec	497	1k	\N
1d48234c-a3b9-49be-907f-f392e3950f0e	333cadfe-57cc-44da-8830-4a01004a1bec	498	studio	\N
e82547f0-6439-477a-bd07-df9dd4650dce	333cadfe-57cc-44da-8830-4a01004a1bec	499	1k	\N
49e77c5a-9c24-4640-acd1-5e9bd798bd3f	333cadfe-57cc-44da-8830-4a01004a1bec	500	1k	\N
54a88766-53e2-4a32-b217-8de629e2d6ae	333cadfe-57cc-44da-8830-4a01004a1bec	501	1k	\N
f7742fa8-831d-4ee7-adcf-00ab783de3a7	333cadfe-57cc-44da-8830-4a01004a1bec	502	3k	\N
a05e62e0-6048-4992-9af6-db48b80d9d0d	333cadfe-57cc-44da-8830-4a01004a1bec	503	3k	\N
dc3ca8fc-34c6-4e4e-be8a-245742a79772	333cadfe-57cc-44da-8830-4a01004a1bec	504	2k	\N
5cb6a4df-54f6-4d51-b43c-395609529443	333cadfe-57cc-44da-8830-4a01004a1bec	505	studio	\N
1a44f503-b23b-4c0b-9fc8-ad201cfd27bf	333cadfe-57cc-44da-8830-4a01004a1bec	506	2k	\N
b085f596-46b7-483a-9454-72c335b2cabf	333cadfe-57cc-44da-8830-4a01004a1bec	507	1k	\N
a970b791-e266-4909-b4c4-82ea018a6904	707d5ff3-a2eb-439f-a05c-017deacb0fdc	109	3k	\N
ffa82290-4577-4517-9421-3898b3a1ff4c	707d5ff3-a2eb-439f-a05c-017deacb0fdc	110	studio	\N
a459bfaa-8b49-4154-8f6d-6f96a2fe3190	707d5ff3-a2eb-439f-a05c-017deacb0fdc	111	1k	\N
2fcb6ed1-777c-481f-a5ff-e8bda8a6bd19	707d5ff3-a2eb-439f-a05c-017deacb0fdc	112	1k	\N
494e1be3-0cc6-4268-a22e-40cb38af05bd	707d5ff3-a2eb-439f-a05c-017deacb0fdc	113	2k	\N
6b799f94-4f5a-4b7e-814e-973d566f1033	707d5ff3-a2eb-439f-a05c-017deacb0fdc	114	1k	\N
e7ad836f-885e-4737-bb70-db04197766d9	707d5ff3-a2eb-439f-a05c-017deacb0fdc	115	2k	\N
690e1282-f209-440e-a257-10a7cc594326	707d5ff3-a2eb-439f-a05c-017deacb0fdc	116	1k	\N
48474b26-f875-41b3-8969-91362cb33d7d	707d5ff3-a2eb-439f-a05c-017deacb0fdc	117	1k	\N
ba73ec92-a6a3-4f8c-acec-968d4d59a3db	707d5ff3-a2eb-439f-a05c-017deacb0fdc	118	1k	\N
47310ba0-2286-4ce8-b0fa-75e580ab9094	707d5ff3-a2eb-439f-a05c-017deacb0fdc	119	studio	\N
287bdd7b-406b-4b1f-aa40-91442f9deb8f	707d5ff3-a2eb-439f-a05c-017deacb0fdc	120	1k	\N
d6cd7f29-8bce-4ec6-a4a8-005d3d3b4f64	b1221565-8f30-4310-a692-5b2bf8499cc6	109	3k	\N
414d36d0-47c4-4e9f-a95d-95e553cd96dd	b1221565-8f30-4310-a692-5b2bf8499cc6	110	studio	\N
61001ff0-9dba-45b3-9607-1bb367c474c9	b1221565-8f30-4310-a692-5b2bf8499cc6	111	1k	\N
ffc24ab1-ee8b-4785-b28f-fe1f9320f30b	b1221565-8f30-4310-a692-5b2bf8499cc6	112	1k	\N
e3f53973-5be8-4e96-a8d5-4ccee4d5ad02	b1221565-8f30-4310-a692-5b2bf8499cc6	113	2k	\N
e224de46-f8ad-4e0b-a285-871e780dd527	b1221565-8f30-4310-a692-5b2bf8499cc6	114	1k	\N
04055360-6c70-4670-9dd0-b587903fab59	b1221565-8f30-4310-a692-5b2bf8499cc6	115	2k	\N
6fb83236-7cd1-49ce-a3ec-f1222c283117	b1221565-8f30-4310-a692-5b2bf8499cc6	116	1k	\N
19ffc391-17f6-4e06-9d4e-a6d2857044ae	b1221565-8f30-4310-a692-5b2bf8499cc6	117	1k	\N
55cafc1b-4114-46e0-86ff-c156c3763af1	b1221565-8f30-4310-a692-5b2bf8499cc6	118	1k	\N
3def0c8a-9eea-4356-a454-c9b9a8d09853	b1221565-8f30-4310-a692-5b2bf8499cc6	119	studio	\N
aff26f2a-fd54-487e-8302-fd9641d0f08c	b1221565-8f30-4310-a692-5b2bf8499cc6	120	1k	\N
52c65acb-8289-4439-b5d6-9de7ab1d4bf1	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	509	1k	\N
8c11e476-7cbd-443e-a98c-871c6aaf5076	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	510	studio	\N
0068d83e-6147-451f-82a7-405a8143a98e	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	511	1k	\N
a27b81fe-f253-40ee-a362-25a03083da31	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	512	1k	\N
f3666745-d969-4ca4-8aaa-a805a9f8d41b	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	513	1k	\N
10f4c969-d35d-49bd-8eea-4d26662f5b8f	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	514	3k	\N
6df239d6-5b23-4854-9232-cf1214525dbc	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	515	3k	\N
72aeaf54-83eb-4a90-bf5c-bef19a480a7f	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	516	2k	\N
39b0c9ca-fcfc-4a8b-9c1c-bf4bf4fc22fe	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	517	studio	\N
bdb32306-e33e-4035-9563-4dcc8e697ebe	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	518	2k	\N
d649e567-cc9a-46b7-b607-64ba943c4415	4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	519	1k	\N
901c3ad4-94a6-4644-b2b0-173246de3766	99faa853-9e08-483e-a785-9c5f66f8ea18	509	1k	\N
f569a14e-ba01-4c87-91ab-49f3e528d8f1	99faa853-9e08-483e-a785-9c5f66f8ea18	510	studio	\N
0dce786d-6a4a-433e-87ec-e730ded486ee	99faa853-9e08-483e-a785-9c5f66f8ea18	511	1k	\N
01c25ef0-80bb-470b-a3c8-1ed33f6cb638	99faa853-9e08-483e-a785-9c5f66f8ea18	512	1k	\N
866db2b9-5249-4f2a-9822-3257fa11c30d	99faa853-9e08-483e-a785-9c5f66f8ea18	513	1k	\N
14a2d3c9-98c4-4736-86b0-68220b739cca	99faa853-9e08-483e-a785-9c5f66f8ea18	514	3k	\N
c4494a49-f59e-4706-8330-e84c4c4cceb0	99faa853-9e08-483e-a785-9c5f66f8ea18	515	3k	\N
147a15d7-9bd6-4831-84cc-0825db3ac018	99faa853-9e08-483e-a785-9c5f66f8ea18	516	2k	\N
3a75fef4-3dab-4f8d-ac4a-9bf93fabcdfa	99faa853-9e08-483e-a785-9c5f66f8ea18	517	studio	\N
0d90091a-d54e-4fec-844f-a8c8fe09a179	99faa853-9e08-483e-a785-9c5f66f8ea18	518	2k	\N
36d73c7d-3fbc-4822-b0be-b2298cba9794	99faa853-9e08-483e-a785-9c5f66f8ea18	519	1k	\N
f138e32d-23d1-496e-8e6c-70f948941828	531f863f-3a64-4da6-8513-e5ec4ad83e08	121	3k	\N
bffacca5-181e-4e3a-baf9-26692ebf308d	531f863f-3a64-4da6-8513-e5ec4ad83e08	122	studio	\N
f542d6bd-8270-4931-bcb2-b2138d9db19a	531f863f-3a64-4da6-8513-e5ec4ad83e08	123	1k	\N
3bce004d-309f-4eb4-b4a7-e6e3b8be0aa2	531f863f-3a64-4da6-8513-e5ec4ad83e08	124	1k	\N
68a46fd7-1477-46ff-bda3-f52bcea3a21f	531f863f-3a64-4da6-8513-e5ec4ad83e08	125	2k	\N
15aafb47-203a-459f-8ef1-ac61a98acef7	531f863f-3a64-4da6-8513-e5ec4ad83e08	126	1k	\N
4e2eeaa8-dc64-4724-8cdd-3e06a681db46	531f863f-3a64-4da6-8513-e5ec4ad83e08	127	2k	\N
0b0b1979-a1dd-4268-b0bb-221f5eb057b3	531f863f-3a64-4da6-8513-e5ec4ad83e08	128	1k	\N
a773eb7e-5599-4bfc-8999-09c770eb3740	531f863f-3a64-4da6-8513-e5ec4ad83e08	129	1k	\N
d6f89d6f-815e-4731-8fb5-2d8687cdf708	531f863f-3a64-4da6-8513-e5ec4ad83e08	130	1k	\N
1176620e-368c-4bd0-a62a-b3da412e13dd	531f863f-3a64-4da6-8513-e5ec4ad83e08	131	studio	\N
4c07400b-ad8d-4670-bf9c-b331467d2b24	531f863f-3a64-4da6-8513-e5ec4ad83e08	132	1k	\N
7759974f-2ec6-48b3-bc54-a15776270199	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	121	3k	\N
c0f917e8-07d1-40a2-b7df-6c9071b1c6a2	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	122	studio	\N
5b2d3dec-bcf7-4049-9d5f-de7c2fef4d72	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	123	1k	\N
cce91fb0-721f-4c59-a432-79355e8a4494	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	124	1k	\N
b175636a-c62c-4355-ba3d-c472327fc066	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	125	2k	\N
ba1ae3c9-fa96-4a84-9466-2ecbb93aa42d	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	126	1k	\N
ee88f440-78be-406b-9a42-b0be5342b398	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	127	2k	\N
4dd6282c-8c92-4bd1-8c94-aa2bb5288c31	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	128	1k	\N
9a0e9e7c-ab32-43c0-8589-b30c192aeea5	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	129	1k	\N
4ddede5b-c16a-45e1-89cd-9e4e19942ce8	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	130	1k	\N
c0a39111-2e2c-44ec-8c26-dd6bd2fa8603	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	131	studio	\N
d0fda2af-f3f3-48d2-b8f5-d312e2233a0b	057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	132	1k	\N
282b506f-bde1-4e2e-b9ac-a931a708d3ca	07cb28d4-45ed-43ee-a308-4f6ce18744b7	521	1k	\N
dd3f6c32-7705-4702-98ec-4a4eaa011506	07cb28d4-45ed-43ee-a308-4f6ce18744b7	522	studio	\N
0eec5781-fe52-492c-8eb4-e0c069f71d69	07cb28d4-45ed-43ee-a308-4f6ce18744b7	523	1k	\N
a9c01a47-96fd-4311-86b5-582ab2345afd	07cb28d4-45ed-43ee-a308-4f6ce18744b7	524	1k	\N
5e80bd07-8fb1-4c25-afcd-0195428651d8	07cb28d4-45ed-43ee-a308-4f6ce18744b7	525	1k	\N
aeae0f99-ce72-4527-80f7-05644fd10455	07cb28d4-45ed-43ee-a308-4f6ce18744b7	526	3k	\N
6a8baf7c-5d63-4e88-87b6-d6b82eadc187	07cb28d4-45ed-43ee-a308-4f6ce18744b7	527	3k	\N
6ab312ad-ef0e-4f72-8ff3-603a96829e55	07cb28d4-45ed-43ee-a308-4f6ce18744b7	528	2k	\N
c3419cc3-2b38-4558-b621-abddd8d49aa3	07cb28d4-45ed-43ee-a308-4f6ce18744b7	529	studio	\N
173f6036-7997-4e98-b38e-084dbc8ab671	07cb28d4-45ed-43ee-a308-4f6ce18744b7	530	2k	\N
3576fb3c-86c2-48a2-85cd-47d7a7642b04	07cb28d4-45ed-43ee-a308-4f6ce18744b7	531	1k	\N
d8c971ac-f2a2-4269-b9ec-210df6550a07	c2ff77b6-0731-493c-98bf-826cf71fa6ec	521	1k	\N
4887d904-4561-4566-b5ef-beeb34c2a198	c2ff77b6-0731-493c-98bf-826cf71fa6ec	522	studio	\N
d75ba337-644c-465d-91ce-708fbfa832c6	c2ff77b6-0731-493c-98bf-826cf71fa6ec	523	1k	\N
3849ec1b-3a63-4726-85cb-18bb41d5b75a	c2ff77b6-0731-493c-98bf-826cf71fa6ec	524	1k	\N
6d04d13e-f0cd-44b8-9fb3-4100a3c68610	c2ff77b6-0731-493c-98bf-826cf71fa6ec	525	1k	\N
a7901a9d-5953-472a-a737-faafc788f5b4	c2ff77b6-0731-493c-98bf-826cf71fa6ec	526	3k	\N
6876161f-81f2-44b9-9344-d2fe94e5f769	c2ff77b6-0731-493c-98bf-826cf71fa6ec	527	3k	\N
f307a402-9d08-47ed-94c6-9a1a569728e7	c2ff77b6-0731-493c-98bf-826cf71fa6ec	528	2k	\N
cc536c6f-9fde-4012-92bf-73bf65731c3f	c2ff77b6-0731-493c-98bf-826cf71fa6ec	529	studio	\N
695aa03f-d532-4401-8665-12fbe66d3595	c2ff77b6-0731-493c-98bf-826cf71fa6ec	530	2k	\N
c15df614-88f6-4f3e-b44d-fd38022a4bd2	c2ff77b6-0731-493c-98bf-826cf71fa6ec	531	1k	\N
66155103-fde1-4c31-9bd3-1534547e9fdc	83408d6e-3948-4dce-8895-23eb185f6082	133	3k	\N
98065494-139b-4022-a60d-c2a9b7ad93c6	83408d6e-3948-4dce-8895-23eb185f6082	134	studio	\N
807c0c96-2724-49f0-b963-75e052f8c502	83408d6e-3948-4dce-8895-23eb185f6082	135	1k	\N
28f2a621-4432-456e-8c89-d3cfddde5797	83408d6e-3948-4dce-8895-23eb185f6082	136	1k	\N
d19040d3-566c-4a14-8590-a2bfa26408f9	83408d6e-3948-4dce-8895-23eb185f6082	137	2k	\N
7a46c3dc-ab4b-4190-984c-d107a1bde0ef	83408d6e-3948-4dce-8895-23eb185f6082	138	1k	\N
f871ae41-60c4-4f92-ae67-f20d97820afa	83408d6e-3948-4dce-8895-23eb185f6082	139	2k	\N
bd7a6b3b-afd3-45b1-9878-e3ab8f9fdbb8	83408d6e-3948-4dce-8895-23eb185f6082	140	1k	\N
06ea7e10-d48a-4cf0-921c-ae8be9f6ffc4	83408d6e-3948-4dce-8895-23eb185f6082	141	1k	\N
52a6e173-8c24-4c6e-8678-97ae0a78347f	83408d6e-3948-4dce-8895-23eb185f6082	142	1k	\N
7db2aefa-64ae-4af1-8aa7-c11cd080e23c	83408d6e-3948-4dce-8895-23eb185f6082	143	studio	\N
b319a3a8-92ce-438d-a2a6-84b6d4b27466	83408d6e-3948-4dce-8895-23eb185f6082	144	1k	\N
80ca8947-898c-4812-9713-7dd4dcb4011f	695bdc76-41c9-4739-81a6-f1c407121a49	133	3k	\N
5283faed-8484-402e-91f2-2832bb76acf2	695bdc76-41c9-4739-81a6-f1c407121a49	134	studio	\N
d67d9c08-5662-430e-b6f2-461749154509	695bdc76-41c9-4739-81a6-f1c407121a49	135	1k	\N
89bbcf0f-806e-4083-a436-4de0826ef780	695bdc76-41c9-4739-81a6-f1c407121a49	136	1k	\N
4150e35c-b795-45b6-b821-34251dc72f1a	695bdc76-41c9-4739-81a6-f1c407121a49	137	2k	\N
b2e6da2a-3e5a-4632-847f-4d4bd201df9e	695bdc76-41c9-4739-81a6-f1c407121a49	138	1k	\N
40f99731-e71b-4e35-9da1-623c0743b3ee	695bdc76-41c9-4739-81a6-f1c407121a49	139	2k	\N
24fc2bcc-c6a6-428d-ab06-b2d739e3e462	695bdc76-41c9-4739-81a6-f1c407121a49	140	1k	\N
a8a2da12-cb4e-4749-94eb-584dfc667ef1	695bdc76-41c9-4739-81a6-f1c407121a49	141	1k	\N
b7b2fda7-8139-4041-86c7-855367d97652	695bdc76-41c9-4739-81a6-f1c407121a49	142	1k	\N
9492cae1-db3e-4949-84bf-fb451141a97c	695bdc76-41c9-4739-81a6-f1c407121a49	143	studio	\N
02f33fb3-7fb3-43ee-9652-28428fab874a	695bdc76-41c9-4739-81a6-f1c407121a49	144	1k	\N
665e07ef-5e71-44e3-9a34-72711267e71e	76975803-e9df-4cbb-a884-a3da1885def8	533	1k	\N
b6e41155-86c6-41d6-8ed4-241e4e61be67	76975803-e9df-4cbb-a884-a3da1885def8	534	studio	\N
6088f574-5286-4539-91f8-011f6e9224d8	76975803-e9df-4cbb-a884-a3da1885def8	535	1k	\N
a32e872a-f1a2-4645-8d1c-253fbdf173f3	76975803-e9df-4cbb-a884-a3da1885def8	536	1k	\N
0b0f6402-52fc-454e-a992-3058b8cf7753	76975803-e9df-4cbb-a884-a3da1885def8	537	1k	\N
61e56fae-325a-47d1-b5c4-8f584f6e4ac7	76975803-e9df-4cbb-a884-a3da1885def8	538	3k	\N
2ef999dd-1b40-4c3a-ac27-ac1b5a770558	76975803-e9df-4cbb-a884-a3da1885def8	539	3k	\N
3f812333-362f-4245-b862-f42f9b705b0b	76975803-e9df-4cbb-a884-a3da1885def8	540	2k	\N
1319680f-9bb0-4b77-bc6f-d4bc23654d5e	76975803-e9df-4cbb-a884-a3da1885def8	541	studio	\N
e64baab0-2c2c-4ac5-88ee-19e100ea8e7c	76975803-e9df-4cbb-a884-a3da1885def8	542	2k	\N
cde14946-2311-427c-9646-581a6729b0d6	76975803-e9df-4cbb-a884-a3da1885def8	543	1k	\N
314487b6-3ecd-40cb-bd7f-93c12e184d1c	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	533	1k	\N
cf213737-5de8-4372-b329-a621766e6f41	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	534	studio	\N
a8e33300-7841-454a-94cb-0603ee277672	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	535	1k	\N
01dd9b1b-0867-46ba-acc0-829206070ada	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	536	1k	\N
26ff207a-3897-4ce0-8727-762bd1d6cff4	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	537	1k	\N
e8c26101-1b32-4d13-b3dc-34ae5daefb24	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	538	3k	\N
77304b86-13cb-4d5f-8d5f-ed8bd0788ec6	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	539	3k	\N
55b3b0c5-5ac6-4c6b-9507-57c575fa2338	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	540	2k	\N
257bf338-faff-46b1-b687-19b487e02fbe	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	541	studio	\N
acc0f941-ed73-45ee-bf89-6284245db2b4	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	542	2k	\N
f8e401d8-a8b6-47d2-9ceb-ed7f7d612580	73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	543	1k	\N
6fa87923-2e9d-4caf-8917-3e37655a178b	4d88f3f2-82bc-4115-be5e-dd7d651041db	145	3k	\N
4162cef9-48b1-489e-9f76-58f8da9489b0	4d88f3f2-82bc-4115-be5e-dd7d651041db	146	studio	\N
d96b2138-869a-4730-bcae-bc1c39bcc49b	4d88f3f2-82bc-4115-be5e-dd7d651041db	147	1k	\N
0abba172-89ab-413d-ace9-13b4c6160aa5	4d88f3f2-82bc-4115-be5e-dd7d651041db	148	1k	\N
ee5a7494-d2e7-44f8-b0a7-b3c9d0b9bff3	4d88f3f2-82bc-4115-be5e-dd7d651041db	149	2k	\N
61da9abb-30c8-43de-ab27-cac4f873515a	4d88f3f2-82bc-4115-be5e-dd7d651041db	150	1k	\N
75459538-d6f3-4694-ab04-656171456118	4d88f3f2-82bc-4115-be5e-dd7d651041db	151	2k	\N
4052b236-cef2-48a2-ad67-c92b2b224bec	4d88f3f2-82bc-4115-be5e-dd7d651041db	152	1k	\N
a3c8c5e6-ac35-4a63-a23c-0ca3193d67d4	4d88f3f2-82bc-4115-be5e-dd7d651041db	153	1k	\N
235fe16d-2e2e-4080-9b7e-87d8117f23aa	4d88f3f2-82bc-4115-be5e-dd7d651041db	154	1k	\N
72bf145d-ebfa-466a-a9dc-821ed5245e8f	4d88f3f2-82bc-4115-be5e-dd7d651041db	155	studio	\N
c9b1b140-af06-4c18-8e90-de18f20453bc	4d88f3f2-82bc-4115-be5e-dd7d651041db	156	1k	\N
218977af-665a-4e9e-986b-9fd8e29404a4	201c66fb-2789-4ee8-9a19-505e217a5ba6	145	3k	\N
b64ed2f2-4fc7-4f7d-8e57-d0db4b8dc8ea	201c66fb-2789-4ee8-9a19-505e217a5ba6	146	studio	\N
7c0de4a8-f502-4c33-a75e-81c2303d2def	201c66fb-2789-4ee8-9a19-505e217a5ba6	147	1k	\N
81ca5b95-c064-4f5f-b4a4-45e38dd5e359	201c66fb-2789-4ee8-9a19-505e217a5ba6	148	1k	\N
1effe1ba-d9e3-4f18-a626-deb63a7fdc3c	201c66fb-2789-4ee8-9a19-505e217a5ba6	149	2k	\N
4f6c122b-0380-48f3-9157-4928e11c2928	201c66fb-2789-4ee8-9a19-505e217a5ba6	150	1k	\N
e7136790-44a0-40bd-b203-919509c50eac	201c66fb-2789-4ee8-9a19-505e217a5ba6	151	2k	\N
70eb7da4-90e1-464c-b261-6ef7a794f171	201c66fb-2789-4ee8-9a19-505e217a5ba6	152	1k	\N
0b7de984-deac-4fec-a334-4dc034bb2080	201c66fb-2789-4ee8-9a19-505e217a5ba6	153	1k	\N
2c923845-26a5-45d7-8736-8ab2d540694a	201c66fb-2789-4ee8-9a19-505e217a5ba6	154	1k	\N
12bb2e7e-cb2a-4429-add1-36fe690a16f6	201c66fb-2789-4ee8-9a19-505e217a5ba6	155	studio	\N
18789c64-8c62-440a-99f4-7e8818cde465	201c66fb-2789-4ee8-9a19-505e217a5ba6	156	1k	\N
5e9b55a9-f1a6-4770-ab03-0db0c24ad53f	76924116-ed73-4440-9560-9ec073214e35	545	1k	\N
c57ce63e-736f-4cba-920a-97f483812486	76924116-ed73-4440-9560-9ec073214e35	546	studio	\N
c285a0f9-a8c2-420d-86cd-3ad976b52711	76924116-ed73-4440-9560-9ec073214e35	547	1k	\N
2ede852c-9249-4bd9-8714-af2f606ea5d0	76924116-ed73-4440-9560-9ec073214e35	548	1k	\N
f7d69d20-f451-47a7-baae-becaaa138f13	76924116-ed73-4440-9560-9ec073214e35	549	1k	\N
6cc58e46-fbf1-4272-8680-1aa875500b8f	76924116-ed73-4440-9560-9ec073214e35	550	3k	\N
28aacc2d-67f5-4bbd-8b07-dc0e4fa05c9c	76924116-ed73-4440-9560-9ec073214e35	551	3k	\N
eeb96ee4-baa7-4b95-9d41-c6f1982bf7a5	76924116-ed73-4440-9560-9ec073214e35	552	2k	\N
891a67d5-542b-48ae-a370-abaa69855e3a	76924116-ed73-4440-9560-9ec073214e35	553	studio	\N
027a95dd-a020-44d4-84fa-561797243465	76924116-ed73-4440-9560-9ec073214e35	554	2k	\N
dd506b18-83ec-48b4-8c3a-6d4a885e932d	76924116-ed73-4440-9560-9ec073214e35	555	1k	\N
ba4ae328-5ed1-4663-82d7-2811bacb228f	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	545	1k	\N
f0cd66c1-6801-4200-acec-cf1cbd17994d	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	546	studio	\N
25fd07e9-62ba-41d9-b934-96cf5bf84303	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	547	1k	\N
edf5f44a-8c7c-43d6-bbb5-d03f40c5c6e2	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	548	1k	\N
bd6d4902-8f71-4f92-9999-80c59da23823	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	549	1k	\N
ce862d38-da6d-40c5-88cb-dd0858fc2fc3	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	550	3k	\N
e56e4131-f665-4e66-b92f-d413c07dc930	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	551	3k	\N
5d1dfc3b-7e1d-4e89-b70e-f10f1cbfb37f	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	552	2k	\N
ca6f3c9e-7d18-4266-8301-671ce6adda38	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	553	studio	\N
12d1d87f-6327-4aff-9ae1-1e8684dd18b2	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	554	2k	\N
50e3a9bd-0105-4265-b29a-28ebbaeebd4e	7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	555	1k	\N
e6e68b1e-8642-4538-8cad-edd7d6402802	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	157	3k	\N
0f4c0813-05db-44ce-b240-f51fb09af42e	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	158	studio	\N
611dc580-1c9d-49e2-b04d-3cb909b2eef9	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	159	1k	\N
1b932c60-0588-4890-a7c7-5b03be5d5d3d	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	160	1k	\N
6658e95c-16a8-479d-876c-43e46c38c446	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	161	2k	\N
38fffa34-ff13-4cf4-ab32-c6f97c2fddf3	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	162	1k	\N
539e282f-fbba-4c8a-84d2-8cc13eeb93cb	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	163	2k	\N
68da6926-9345-463f-9c1a-14a1381e0401	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	164	1k	\N
5910e995-5a16-4a9e-8d2e-816a84be381a	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	165	1k	\N
2fda626e-7957-4e34-86c0-6ac5eae8ac70	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	166	1k	\N
aff76b4e-71fe-4eb6-9d88-abc33292eb4d	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	167	studio	\N
26a5aef4-b077-43fc-b294-d6fcab053bbf	3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	168	1k	\N
37b781ea-88e5-4b0d-953b-69fcb059ba01	83a9aad4-ac60-4842-9f6a-392cd245c5c4	157	3k	\N
addbf985-062e-4df6-9050-51cf475a8125	83a9aad4-ac60-4842-9f6a-392cd245c5c4	158	studio	\N
d2b23a89-e9b8-42a2-ae6f-36a0959126c3	83a9aad4-ac60-4842-9f6a-392cd245c5c4	159	1k	\N
6d3bd2d0-02d5-43e9-9b10-b3601878d0cf	83a9aad4-ac60-4842-9f6a-392cd245c5c4	160	1k	\N
c85969f7-efc3-4a98-8604-79694770a66e	83a9aad4-ac60-4842-9f6a-392cd245c5c4	161	2k	\N
08cf51a2-64a9-4b15-8010-338434602770	83a9aad4-ac60-4842-9f6a-392cd245c5c4	162	1k	\N
6bf8f38a-2030-4638-ae34-0f0111a78326	83a9aad4-ac60-4842-9f6a-392cd245c5c4	163	2k	\N
10c55fd6-9171-48e0-ba5b-fee39b10e5ce	83a9aad4-ac60-4842-9f6a-392cd245c5c4	164	1k	\N
abec63c7-309e-490c-9b85-944ed7a56510	83a9aad4-ac60-4842-9f6a-392cd245c5c4	165	1k	\N
b4263b43-81fc-4657-9189-e34ab1ae7c6e	83a9aad4-ac60-4842-9f6a-392cd245c5c4	166	1k	\N
34af3bbe-51e9-4e80-a373-d8828dc35ec2	83a9aad4-ac60-4842-9f6a-392cd245c5c4	167	studio	\N
f54a28c4-a003-4842-9cf7-c7e1aa8c539d	83a9aad4-ac60-4842-9f6a-392cd245c5c4	168	1k	\N
2d59ec78-cf86-4a7b-a18f-8c438189eb5b	8ca97445-0207-46c1-9293-7b960ff278c8	557	1k	\N
6d173033-7ace-4392-9d9a-273aca1138b0	8ca97445-0207-46c1-9293-7b960ff278c8	558	studio	\N
a04e392e-0fa5-4174-a86f-77d4d5a3040c	8ca97445-0207-46c1-9293-7b960ff278c8	559	1k	\N
ecc69c09-8c7c-4ef0-9a90-40c561d86509	8ca97445-0207-46c1-9293-7b960ff278c8	560	1k	\N
fef33843-4b7e-490b-afeb-45e503ec6109	8ca97445-0207-46c1-9293-7b960ff278c8	561	1k	\N
d78d87e5-6c26-4a43-857e-f3db9f5576b4	8ca97445-0207-46c1-9293-7b960ff278c8	562	3k	\N
944aae1f-da4f-4ea6-a1bd-fca8359fbc77	8ca97445-0207-46c1-9293-7b960ff278c8	563	3k	\N
823cb7a6-1862-46f0-a618-a7774e47399c	8ca97445-0207-46c1-9293-7b960ff278c8	564	2k	\N
8ed5719d-69c3-4632-812d-d86605c9d603	8ca97445-0207-46c1-9293-7b960ff278c8	565	studio	\N
75ecb849-d7c8-44b9-8152-e8a5eecca156	8ca97445-0207-46c1-9293-7b960ff278c8	566	2k	\N
ee408a29-7311-4dbd-8875-24786b7cdd93	8ca97445-0207-46c1-9293-7b960ff278c8	567	1k	\N
bf0c1622-075c-49b0-9a56-2fd6a9a885a4	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	557	1k	\N
0fcc2471-e140-4f8a-b00e-d2e017dd3574	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	558	studio	\N
4b52d569-f542-428f-b7d6-8f93d90754be	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	559	1k	\N
d6a21190-7c3e-47b8-ae3a-eee5564bd3d1	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	560	1k	\N
6bf63312-7427-4ed7-9207-df8fca019580	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	561	1k	\N
ed15bbe8-55d4-482b-940c-67a3b41542e9	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	562	3k	\N
e4e115b7-a02d-493f-8261-580dd5d97920	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	563	3k	\N
d7dbc1cf-0f38-4221-9251-34c31579ce67	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	564	2k	\N
bb722514-a4f1-44c5-8dc2-369627ce9c6b	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	565	studio	\N
bdd00ed1-0023-4a55-811e-a2d23511882a	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	566	2k	\N
72a3d42b-cfeb-4e79-847b-ed044494fb8d	a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	567	1k	\N
ab30f85c-9dba-4eef-97f3-6fc64caf79f5	4b04bc78-5067-4467-8ed6-233392f99bed	169	3k	\N
14861110-edf6-413a-b144-28e269477234	4b04bc78-5067-4467-8ed6-233392f99bed	170	studio	\N
e400edb8-2712-4e08-b3fe-7d02f1155a00	4b04bc78-5067-4467-8ed6-233392f99bed	171	1k	\N
c62d14b1-bdc9-443c-ba86-cde80b4840d0	4b04bc78-5067-4467-8ed6-233392f99bed	172	1k	\N
2fe83f15-e3cf-4c6d-942e-7d6c396d878c	4b04bc78-5067-4467-8ed6-233392f99bed	173	2k	\N
66a7ffd8-62fa-4ab6-b792-2a73baee93b9	4b04bc78-5067-4467-8ed6-233392f99bed	174	1k	\N
4db9ec26-2214-4a00-8d05-96d0eeeda148	4b04bc78-5067-4467-8ed6-233392f99bed	175	2k	\N
52604543-aa1f-4abf-b024-ec8b72d03034	4b04bc78-5067-4467-8ed6-233392f99bed	176	1k	\N
ff010b25-bc77-457d-b646-c4c0dc4851b2	4b04bc78-5067-4467-8ed6-233392f99bed	177	1k	\N
03866fd4-6456-4c20-b074-b2bcec96c1d2	4b04bc78-5067-4467-8ed6-233392f99bed	178	1k	\N
47169bc5-d23b-4496-80b9-fb7ae4449a01	4b04bc78-5067-4467-8ed6-233392f99bed	179	studio	\N
a473f2af-0eb0-4504-ae81-710e3481e795	4b04bc78-5067-4467-8ed6-233392f99bed	180	1k	\N
fa01bd1e-8d4b-40fc-8e33-0dc78e997d05	0ab8ebb3-f9f3-45df-961e-07c0188400f0	169	3k	\N
28b00d5b-7935-42d1-a5e2-2a767cb54837	0ab8ebb3-f9f3-45df-961e-07c0188400f0	170	studio	\N
d87437ea-6fc3-462a-bea4-a56f06e1874c	0ab8ebb3-f9f3-45df-961e-07c0188400f0	171	1k	\N
775939a8-f84c-4d20-91dd-15c94c97a5ab	0ab8ebb3-f9f3-45df-961e-07c0188400f0	172	1k	\N
301da940-c0f8-4a92-be05-229f2a62f04c	0ab8ebb3-f9f3-45df-961e-07c0188400f0	173	2k	\N
da56668e-56ea-4a98-a3e8-b331eae5bec9	0ab8ebb3-f9f3-45df-961e-07c0188400f0	174	1k	\N
e3dc9e6e-c0d0-4a33-a036-96800df3f2bc	0ab8ebb3-f9f3-45df-961e-07c0188400f0	175	2k	\N
cbdddb9d-e019-44ba-aecd-70eb3845be96	0ab8ebb3-f9f3-45df-961e-07c0188400f0	176	1k	\N
e508a996-286b-47d9-a844-4890e1215de6	0ab8ebb3-f9f3-45df-961e-07c0188400f0	177	1k	\N
32254c1a-b8d2-4f0e-a8ce-b2f78c14081f	0ab8ebb3-f9f3-45df-961e-07c0188400f0	178	1k	\N
7ff4a564-c201-495f-b12b-170ba1621730	0ab8ebb3-f9f3-45df-961e-07c0188400f0	179	studio	\N
1a7a3caf-9ebb-49fc-8f28-74bcf4f85e00	0ab8ebb3-f9f3-45df-961e-07c0188400f0	180	1k	\N
f0312647-93be-472a-b23a-ddbc516627e8	fedb10c2-3ab7-440c-a6ef-3345b4943f04	569	1k	\N
b78845d1-0ee7-41a7-aa7b-dae1da361d47	fedb10c2-3ab7-440c-a6ef-3345b4943f04	570	studio	\N
c772b2a9-1c56-4199-9129-cde3f01c7eaf	fedb10c2-3ab7-440c-a6ef-3345b4943f04	571	1k	\N
8bd39551-f0ca-44d7-a00f-545979d52135	fedb10c2-3ab7-440c-a6ef-3345b4943f04	572	1k	\N
81b33677-379e-4f00-94e3-a8dd2a0832da	fedb10c2-3ab7-440c-a6ef-3345b4943f04	573	1k	\N
4a0cfac7-03c1-40b1-9bde-4a8e4e87c031	fedb10c2-3ab7-440c-a6ef-3345b4943f04	574	3k	\N
5b0e5441-7236-4c9a-8343-9faccaf9b787	fedb10c2-3ab7-440c-a6ef-3345b4943f04	575	3k	\N
53754c79-99bb-45c2-9fcc-31bd92a8bc2e	fedb10c2-3ab7-440c-a6ef-3345b4943f04	576	2k	\N
1f8c220e-70bf-4166-9362-467d0026c0ca	fedb10c2-3ab7-440c-a6ef-3345b4943f04	577	studio	\N
be6582bf-dfa6-4ee9-88ae-fc36b557d499	fedb10c2-3ab7-440c-a6ef-3345b4943f04	578	2k	\N
b497eb0d-7768-4619-aabf-6b6244b04307	fedb10c2-3ab7-440c-a6ef-3345b4943f04	579	1k	\N
bd019efd-ea7b-4f99-ba45-15ebea93d530	b51a9270-71d0-4503-ad70-32672e9b41eb	569	1k	\N
3de35383-040c-471f-bcd5-fe99fd034253	b51a9270-71d0-4503-ad70-32672e9b41eb	570	studio	\N
40837d9f-728a-4818-92c3-e318c0fa48bc	b51a9270-71d0-4503-ad70-32672e9b41eb	571	1k	\N
8b6083b7-e395-49bc-98d8-b1eafc27e92d	b51a9270-71d0-4503-ad70-32672e9b41eb	572	1k	\N
048592ca-6487-420b-9efe-669fc8b2ee2f	b51a9270-71d0-4503-ad70-32672e9b41eb	573	1k	\N
8d8018a5-bc83-4d10-a699-8ebb29465118	b51a9270-71d0-4503-ad70-32672e9b41eb	574	3k	\N
2abcfeab-e87a-4925-9af2-cbfea28b7445	b51a9270-71d0-4503-ad70-32672e9b41eb	575	3k	\N
c4615882-2842-42b8-9695-1353e31e2ae0	b51a9270-71d0-4503-ad70-32672e9b41eb	576	2k	\N
9190f601-4844-45c6-b503-9788ccd2c478	b51a9270-71d0-4503-ad70-32672e9b41eb	577	studio	\N
b0dd6ac3-302b-4c30-a5c4-6fe84381079b	b51a9270-71d0-4503-ad70-32672e9b41eb	578	2k	\N
89f4bcf7-4055-45c0-9cad-0791274fc718	b51a9270-71d0-4503-ad70-32672e9b41eb	579	1k	\N
2f266f1a-5450-419b-86bd-5291a7f10024	9ee20198-0975-43a5-bced-750ca81d86ea	181	3k	\N
dc729851-08ea-4a4a-9121-34812a7eef46	9ee20198-0975-43a5-bced-750ca81d86ea	182	studio	\N
f540d5e7-eca4-4e74-9c00-6b4ac9de84d1	9ee20198-0975-43a5-bced-750ca81d86ea	183	1k	\N
b533eeff-7ce4-4e74-ba00-017d5fdd317d	9ee20198-0975-43a5-bced-750ca81d86ea	184	1k	\N
d3110d39-ad89-4f49-a42d-57b71a38cbc6	9ee20198-0975-43a5-bced-750ca81d86ea	185	2k	\N
21153348-446b-43ff-978c-56827993a12e	9ee20198-0975-43a5-bced-750ca81d86ea	186	1k	\N
268b0bc8-d380-4b56-b53f-c1c246445f86	9ee20198-0975-43a5-bced-750ca81d86ea	187	2k	\N
bf8b82d3-c477-4d19-9ac5-58e26b33a66a	9ee20198-0975-43a5-bced-750ca81d86ea	188	1k	\N
a6451492-2267-46ed-bbdd-3b363bb5a644	9ee20198-0975-43a5-bced-750ca81d86ea	189	1k	\N
fbfb6a01-072c-4eee-b293-b6124e13bc7c	9ee20198-0975-43a5-bced-750ca81d86ea	190	1k	\N
1ed2b5c4-6aa9-4f00-a48d-c2f29bfb5bb4	9ee20198-0975-43a5-bced-750ca81d86ea	191	studio	\N
a42f0a5c-2b0b-49a8-b7f7-e457bc94f014	9ee20198-0975-43a5-bced-750ca81d86ea	192	1k	\N
419a5212-3639-4d67-a298-10779b701b57	200c3c4b-987b-426f-b23f-d5ae9cc4199e	181	3k	\N
82c4bf13-458c-46ef-a4a5-a8bfda350d5e	200c3c4b-987b-426f-b23f-d5ae9cc4199e	182	studio	\N
724dfbc2-9613-4321-8d7e-2ce2dc5a31ab	200c3c4b-987b-426f-b23f-d5ae9cc4199e	183	1k	\N
8a0e2ca4-4b81-49f5-a7c2-0b7131a837ea	200c3c4b-987b-426f-b23f-d5ae9cc4199e	184	1k	\N
8664b9fa-efde-48e6-989a-c542583b8977	200c3c4b-987b-426f-b23f-d5ae9cc4199e	185	2k	\N
ce08c031-04d3-4c56-b370-e9bf743ac17a	200c3c4b-987b-426f-b23f-d5ae9cc4199e	186	1k	\N
c94ac6f8-a57a-4fc6-9335-7327a9288007	200c3c4b-987b-426f-b23f-d5ae9cc4199e	187	2k	\N
13df593c-ddec-429a-a922-84586cd9d14b	200c3c4b-987b-426f-b23f-d5ae9cc4199e	188	1k	\N
75734301-0ff0-47fd-b794-28079bf8df17	200c3c4b-987b-426f-b23f-d5ae9cc4199e	189	1k	\N
4c704485-0772-402c-8a18-aa4890f930ea	200c3c4b-987b-426f-b23f-d5ae9cc4199e	190	1k	\N
657ec250-ab2e-4bf4-a4a3-e4ce2a5181e8	200c3c4b-987b-426f-b23f-d5ae9cc4199e	191	studio	\N
85a74141-958d-4364-befa-d00a4949025f	200c3c4b-987b-426f-b23f-d5ae9cc4199e	192	1k	\N
24a55b8f-1696-4bfa-a168-11106b5212b7	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	581	1k	\N
5358472d-8bf3-422d-896c-7b64074c9dad	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	582	studio	\N
70695866-6e0e-4a9b-b7b6-bc7b24b02a01	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	583	1k	\N
e8058723-55d8-4c65-8c53-22f10a6b8482	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	584	1k	\N
1f2dd528-aab2-4eae-a472-a21cdc049900	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	585	1k	\N
8954e768-d088-428d-a109-22395d1fe5ff	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	586	3k	\N
739a896e-895a-46fb-ad2f-6d8f808a2f4f	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	587	3k	\N
e10ea0cd-b2fd-4409-81ee-adb796b76119	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	588	2k	\N
bdeb6ce8-4285-49ce-adb8-02480cff0aeb	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	589	studio	\N
38a76f7e-de60-48d7-955e-5c651f872780	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	590	2k	\N
4b06c0fc-e62c-418e-8b5b-ff4855ecaa80	bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	591	1k	\N
b8108ca5-dbb1-445c-bee4-c70d3109b5cc	1b4458ef-a234-49bb-85e5-71d69b0b6af6	581	1k	\N
0572886a-3fc3-4156-a0a4-00a53e374ad8	1b4458ef-a234-49bb-85e5-71d69b0b6af6	582	studio	\N
21d4790e-62b7-4bb8-a8fb-f1c19ccc7410	1b4458ef-a234-49bb-85e5-71d69b0b6af6	583	1k	\N
62d73ad7-5eca-4e32-83bb-753f4fbe76b3	1b4458ef-a234-49bb-85e5-71d69b0b6af6	584	1k	\N
d20064d9-8e1e-47c4-9efd-3cadd58207ec	1b4458ef-a234-49bb-85e5-71d69b0b6af6	585	1k	\N
12395ab6-e631-47f1-81cb-4cde100881c1	1b4458ef-a234-49bb-85e5-71d69b0b6af6	586	3k	\N
1c0ea1aa-2eef-42c1-9df5-826bad4883cc	1b4458ef-a234-49bb-85e5-71d69b0b6af6	587	3k	\N
852473c3-0572-427f-9074-1ffbb82f1d69	1b4458ef-a234-49bb-85e5-71d69b0b6af6	588	2k	\N
1c1c315f-9bd0-4895-872f-905e634a5093	1b4458ef-a234-49bb-85e5-71d69b0b6af6	589	studio	\N
7eb5d951-1924-418e-bc7e-a9563e3c9233	1b4458ef-a234-49bb-85e5-71d69b0b6af6	590	2k	\N
24cdd0c0-9091-40f2-ae4b-6e05d624e491	1b4458ef-a234-49bb-85e5-71d69b0b6af6	591	1k	\N
7e9902a6-0e1f-4fe3-843c-cf596f7b86b8	59469ca1-708d-4be0-8307-d37074cba2e6	193	3k	\N
355b6c1d-68f4-4a0c-9422-64e7d91163c0	59469ca1-708d-4be0-8307-d37074cba2e6	194	studio	\N
e1409ce2-5d21-49f0-b26d-b182a9a40ba7	59469ca1-708d-4be0-8307-d37074cba2e6	195	1k	\N
622784d3-e94b-459f-9037-82d6ed89fec4	59469ca1-708d-4be0-8307-d37074cba2e6	196	1k	\N
b1f682d0-dd3f-4eb3-ba63-0ad7a3e16c5c	59469ca1-708d-4be0-8307-d37074cba2e6	197	2k	\N
76d187b8-67fc-48b5-945c-5e7eced9343c	59469ca1-708d-4be0-8307-d37074cba2e6	198	1k	\N
e995af51-2c6a-4845-8040-76b76b58597b	59469ca1-708d-4be0-8307-d37074cba2e6	199	2k	\N
d1f09a5c-b53e-43e6-b7bf-c717ec663f99	59469ca1-708d-4be0-8307-d37074cba2e6	200	1k	\N
624f2a21-1591-4523-8869-b2a139b45a15	59469ca1-708d-4be0-8307-d37074cba2e6	201	1k	\N
18028dc5-1ae5-443f-a154-024db1fcef89	59469ca1-708d-4be0-8307-d37074cba2e6	202	1k	\N
9677e921-750b-4144-a49b-0480a9778eb0	59469ca1-708d-4be0-8307-d37074cba2e6	203	studio	\N
07bf2973-0ccb-49f2-ae28-4a44bbba422a	59469ca1-708d-4be0-8307-d37074cba2e6	204	1k	\N
c79eee85-6136-42c9-8723-3cc44d94da56	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	193	3k	\N
d0a457bc-5ecf-4e9b-84fa-1492853e2cd3	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	194	studio	\N
45cd48e1-6b8e-4fe7-a380-8426fcba5141	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	195	1k	\N
be38f01c-aaa9-4cf3-a65e-ea0e6009629e	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	196	1k	\N
d39cf135-20a6-4f71-afcd-7f66f5cd64ed	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	197	2k	\N
b485fe82-7c80-471b-b664-23d6930aaf11	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	198	1k	\N
d88b95a0-42bd-4118-acd3-854b19f3e754	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	199	2k	\N
ba1bb719-06cc-4271-869f-178acf09f734	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	200	1k	\N
363e2e57-3e2e-4eb9-aa40-4660cff39c2b	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	201	1k	\N
dbe1808e-4881-4b9b-96db-f3837b59bb3f	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	202	1k	\N
e459db2f-42c8-4265-a046-def1ae2e71d5	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	203	studio	\N
a286acfe-80a4-428b-a7e1-ca0da9369e74	39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	204	1k	\N
1b5ae44a-f97a-421b-b838-2d92ebad49aa	ba13a590-920a-4e9d-a033-d97a14cdb5d3	593	1k	\N
ac4bcd6a-099f-41a1-bd34-e90df499d267	ba13a590-920a-4e9d-a033-d97a14cdb5d3	594	studio	\N
4d8c9f26-1a87-4730-a849-f27538ef99b5	ba13a590-920a-4e9d-a033-d97a14cdb5d3	595	1k	\N
54862a10-d878-404b-98fe-db5ed16c8969	ba13a590-920a-4e9d-a033-d97a14cdb5d3	596	1k	\N
9d35b55c-118d-4659-bd7b-d5b0772ff3eb	ba13a590-920a-4e9d-a033-d97a14cdb5d3	597	1k	\N
2821554a-b83c-4182-8b75-6e606739c793	ba13a590-920a-4e9d-a033-d97a14cdb5d3	598	3k	\N
b5ee73db-6e84-4de9-a29f-f233b74ce1ba	ba13a590-920a-4e9d-a033-d97a14cdb5d3	599	3k	\N
a51ff89c-2e7d-4b79-9ede-f9878924dbca	ba13a590-920a-4e9d-a033-d97a14cdb5d3	600	2k	\N
f52b7c60-ca09-496b-b117-67975b774a37	ba13a590-920a-4e9d-a033-d97a14cdb5d3	601	studio	\N
25b2617a-87c5-42a1-a6bc-cdb52ba7f599	ba13a590-920a-4e9d-a033-d97a14cdb5d3	602	2k	\N
3c665eb3-7d5a-4726-ac7b-f6e812317169	ba13a590-920a-4e9d-a033-d97a14cdb5d3	603	1k	\N
e3e8e5da-055d-4c77-9321-22e5f1b5b7c4	98631b40-cd57-49e2-a5ad-e0e18d4d587e	593	1k	\N
8992e2d4-08a4-4a86-89d3-8af9e8c6d312	98631b40-cd57-49e2-a5ad-e0e18d4d587e	594	studio	\N
c9e4bad7-40bd-4d74-81e4-1e77b6ff390d	98631b40-cd57-49e2-a5ad-e0e18d4d587e	595	1k	\N
85667928-c38a-4055-a595-6954bc7a9e4b	98631b40-cd57-49e2-a5ad-e0e18d4d587e	596	1k	\N
e8565df7-8f6d-45d0-9492-b79adac260f3	98631b40-cd57-49e2-a5ad-e0e18d4d587e	597	1k	\N
03980fc5-54d9-4c51-bcfc-8e75efd93c62	98631b40-cd57-49e2-a5ad-e0e18d4d587e	598	3k	\N
9aa2d5a7-42f3-4fc0-8d5f-dd54a3631be8	98631b40-cd57-49e2-a5ad-e0e18d4d587e	599	3k	\N
f1f32c62-2f1d-473c-9ddc-a8c92fde84b2	98631b40-cd57-49e2-a5ad-e0e18d4d587e	600	2k	\N
f69b5440-9083-4bc9-b5d2-3f3d77f654d8	98631b40-cd57-49e2-a5ad-e0e18d4d587e	601	studio	\N
564261a2-d268-405d-823c-c246723e564e	98631b40-cd57-49e2-a5ad-e0e18d4d587e	602	2k	\N
26a82290-5c3f-4b79-b964-106d34270dfe	98631b40-cd57-49e2-a5ad-e0e18d4d587e	603	1k	\N
05b49b51-f8e1-4530-9e3f-02cfb0b0f125	92e9a9ec-f422-485d-9667-4117f17820ba	205	3k	\N
94367ae3-b60c-43d8-bf5b-793f818e299a	92e9a9ec-f422-485d-9667-4117f17820ba	206	studio	\N
12540e30-88f4-480e-9916-9c1540a44bee	92e9a9ec-f422-485d-9667-4117f17820ba	207	1k	\N
efca592a-b39d-4a7a-98ab-c4601bf3cc52	92e9a9ec-f422-485d-9667-4117f17820ba	208	1k	\N
75ee8548-dde9-4334-a9f5-f0c8c23d9895	92e9a9ec-f422-485d-9667-4117f17820ba	209	2k	\N
2bdcc9b6-f395-4407-855b-ade6f512b1dc	92e9a9ec-f422-485d-9667-4117f17820ba	210	1k	\N
1119378e-b24c-47d9-9703-98775f07d0b0	92e9a9ec-f422-485d-9667-4117f17820ba	211	2k	\N
209a78b4-9344-44c7-83ea-64397561b2de	92e9a9ec-f422-485d-9667-4117f17820ba	212	1k	\N
8f495ac4-df66-419f-9430-3d3d64599157	92e9a9ec-f422-485d-9667-4117f17820ba	213	1k	\N
2a94fe69-eeed-4895-bf4a-03144fe080b5	92e9a9ec-f422-485d-9667-4117f17820ba	214	1k	\N
883c921a-fa66-4e60-b3dc-6700370b3c21	92e9a9ec-f422-485d-9667-4117f17820ba	215	studio	\N
23caebfc-ebdd-4b8f-bdac-5948a1ed8e12	92e9a9ec-f422-485d-9667-4117f17820ba	216	1k	\N
fc8f68ae-d20e-452a-9956-d4a4828ede5d	1adf3526-cf8c-4db0-818d-fc3b8604e929	205	3k	\N
47bc20fc-8c70-416f-b0c1-64f3af890249	1adf3526-cf8c-4db0-818d-fc3b8604e929	206	studio	\N
05f3cd6f-7a4b-4f26-a562-5bc2a11a69b3	1adf3526-cf8c-4db0-818d-fc3b8604e929	207	1k	\N
67cf024d-c3b6-478a-9c7a-8d0794593d6f	1adf3526-cf8c-4db0-818d-fc3b8604e929	208	1k	\N
de3e7537-e109-4bc5-bab6-6549f187464d	1adf3526-cf8c-4db0-818d-fc3b8604e929	209	2k	\N
b04b11c9-3587-4d41-97e8-e530d31e86d4	1adf3526-cf8c-4db0-818d-fc3b8604e929	210	1k	\N
d3f50326-f803-4d23-b3fb-8d9c65e304ea	1adf3526-cf8c-4db0-818d-fc3b8604e929	211	2k	\N
1f1a0c39-ca1e-41f7-aa97-02972c643066	1adf3526-cf8c-4db0-818d-fc3b8604e929	212	1k	\N
58875f38-dc8a-4872-93bf-8605a0cf2b37	1adf3526-cf8c-4db0-818d-fc3b8604e929	213	1k	\N
4e7d3969-abdd-4d05-b00a-83e2a574b9ea	1adf3526-cf8c-4db0-818d-fc3b8604e929	214	1k	\N
56859828-eb40-4f18-91bd-38d4e20a904f	1adf3526-cf8c-4db0-818d-fc3b8604e929	215	studio	\N
b9393650-b874-4927-bbb2-795ea8b55ee8	1adf3526-cf8c-4db0-818d-fc3b8604e929	216	1k	\N
41bb1700-072b-44dd-a72d-61ec338c2e9f	e3647c8f-a02f-4771-8e0a-08064adfba1d	605	1k	\N
6aaee809-b2ea-4717-97aa-26baf13ff538	e3647c8f-a02f-4771-8e0a-08064adfba1d	606	studio	\N
b18a0066-931c-4b6a-a519-848791db3c56	e3647c8f-a02f-4771-8e0a-08064adfba1d	607	1k	\N
e44622fd-c506-43c7-8254-6306b163b0ba	e3647c8f-a02f-4771-8e0a-08064adfba1d	608	1k	\N
ac7bb3ca-f930-478a-827d-810d7faef420	e3647c8f-a02f-4771-8e0a-08064adfba1d	609	1k	\N
c38bc26f-fd55-4d02-81dc-9202b3c0efba	e3647c8f-a02f-4771-8e0a-08064adfba1d	610	3k	\N
064d5328-977a-4335-bd08-6c4a4a260bab	e3647c8f-a02f-4771-8e0a-08064adfba1d	611	3k	\N
85fd759a-3225-4768-a54b-84c1397b087b	e3647c8f-a02f-4771-8e0a-08064adfba1d	612	2k	\N
89b14ac2-4067-4b25-88c8-710c41ab0861	e3647c8f-a02f-4771-8e0a-08064adfba1d	613	studio	\N
ef19d8bf-cb72-45fa-b4b8-03ef3bcbd332	e3647c8f-a02f-4771-8e0a-08064adfba1d	614	2k	\N
fe36aa77-d7f3-47db-88a6-8af51f982074	e3647c8f-a02f-4771-8e0a-08064adfba1d	615	1k	\N
7571b923-855e-4a42-b3fe-29b1df82b35b	144f8424-1dfb-4510-ad50-b5a8a26cc296	605	1k	\N
2ee3fe20-6fbd-4888-a2b8-0b854dcb06e5	144f8424-1dfb-4510-ad50-b5a8a26cc296	606	studio	\N
7f9883fd-cf8b-4ec7-811c-56d0727c87b2	144f8424-1dfb-4510-ad50-b5a8a26cc296	607	1k	\N
226b0f25-28df-44f6-b272-14685415eda5	144f8424-1dfb-4510-ad50-b5a8a26cc296	608	1k	\N
9ccfb4fa-456b-4fbe-9f66-68bcde4a5062	144f8424-1dfb-4510-ad50-b5a8a26cc296	609	1k	\N
0fa4be18-a1d9-4f70-a8f5-019005f8079b	144f8424-1dfb-4510-ad50-b5a8a26cc296	610	3k	\N
aae5f162-1a46-4fe3-ab2a-86f2cc6da78c	144f8424-1dfb-4510-ad50-b5a8a26cc296	611	3k	\N
8a7f477f-46d5-478e-aca5-199e6af168cd	144f8424-1dfb-4510-ad50-b5a8a26cc296	612	2k	\N
6ba684ca-9d70-4fe7-966b-05a0cbf87ed3	144f8424-1dfb-4510-ad50-b5a8a26cc296	613	studio	\N
6c1cea9a-cd4d-4714-a0a5-fa21db45b073	144f8424-1dfb-4510-ad50-b5a8a26cc296	614	2k	\N
3d101a86-3b22-4c0a-90a3-5cd75114c6f8	144f8424-1dfb-4510-ad50-b5a8a26cc296	615	1k	\N
f581a8dc-0d8d-4d39-aaa6-b6aa17ab6ae7	4c280d1e-c0eb-4343-b204-4c6488848a22	217	3k	\N
115f9def-9874-47fd-a6bc-696c42778b21	4c280d1e-c0eb-4343-b204-4c6488848a22	218	studio	\N
8d29aa5d-1125-4e42-8469-d71d4a537240	4c280d1e-c0eb-4343-b204-4c6488848a22	219	1k	\N
9ff1b899-6265-460f-adf6-9666c16a80c9	4c280d1e-c0eb-4343-b204-4c6488848a22	220	1k	\N
f631d6da-3cab-4e1f-aa7f-4ba910897405	4c280d1e-c0eb-4343-b204-4c6488848a22	221	2k	\N
24bfd20e-ed8d-4876-bdf1-2e2c36cc8333	4c280d1e-c0eb-4343-b204-4c6488848a22	222	1k	\N
df90c332-2813-49e9-971c-915590073430	4c280d1e-c0eb-4343-b204-4c6488848a22	223	2k	\N
aa51e972-e561-43fa-a339-5efc419b7ff0	4c280d1e-c0eb-4343-b204-4c6488848a22	224	1k	\N
21ceb8d7-1f14-4ed3-ad66-6fa6702417d4	4c280d1e-c0eb-4343-b204-4c6488848a22	225	1k	\N
fa7e4e7e-44da-4407-b6a7-1d716de17ee5	4c280d1e-c0eb-4343-b204-4c6488848a22	226	1k	\N
492806e1-beb1-47ad-b326-3dd809623eb1	4c280d1e-c0eb-4343-b204-4c6488848a22	227	studio	\N
d0d3eab4-36f3-48ff-b9e6-d6e03ab11250	4c280d1e-c0eb-4343-b204-4c6488848a22	228	1k	\N
cdc299a5-08df-43cf-af5f-09c1bde8048d	79cd5bf6-6027-4989-bf25-f26a00112d4c	217	3k	\N
f1140198-e33f-4779-a82a-b234f27b4c35	79cd5bf6-6027-4989-bf25-f26a00112d4c	218	studio	\N
cedd8449-e824-44b5-a095-68cf71e1ce2c	79cd5bf6-6027-4989-bf25-f26a00112d4c	219	1k	\N
eb913802-faa7-49c6-8404-a2b21bba0a34	79cd5bf6-6027-4989-bf25-f26a00112d4c	220	1k	\N
4904321c-a861-4996-b073-b961ee4fa7ea	79cd5bf6-6027-4989-bf25-f26a00112d4c	221	2k	\N
477bdf05-687a-44bf-9955-c27f63cd2165	79cd5bf6-6027-4989-bf25-f26a00112d4c	222	1k	\N
1e8a5c89-f21a-46d4-b204-4ca87d6a14fd	79cd5bf6-6027-4989-bf25-f26a00112d4c	223	2k	\N
7172fbb9-0ecc-4c8e-8964-ded4578fce8b	79cd5bf6-6027-4989-bf25-f26a00112d4c	224	1k	\N
601f9dcf-3e4b-4618-8002-5ee4557eff4d	79cd5bf6-6027-4989-bf25-f26a00112d4c	225	1k	\N
ebbb9571-f2eb-4913-971d-de48abcc777d	79cd5bf6-6027-4989-bf25-f26a00112d4c	226	1k	\N
1b763319-83e5-420f-a687-4ec114baa960	79cd5bf6-6027-4989-bf25-f26a00112d4c	227	studio	\N
3dec9d8f-6d9e-467f-9b9b-9419652bbfe5	79cd5bf6-6027-4989-bf25-f26a00112d4c	228	1k	\N
aaea1abb-1d24-4193-a30a-fd78c5bc5e7d	0ae96336-5e71-4d3c-95ff-f724181313c4	617	1k	\N
e3c94c2f-a249-457f-8295-deee1c5b0408	0ae96336-5e71-4d3c-95ff-f724181313c4	618	studio	\N
97eb5ce5-100e-4c07-9509-4f973e3e9edc	0ae96336-5e71-4d3c-95ff-f724181313c4	619	1k	\N
375d4817-8717-4fc2-b122-980fe7fd2cab	0ae96336-5e71-4d3c-95ff-f724181313c4	620	1k	\N
e41288ad-4f15-4641-b6e1-a296c5a560a7	0ae96336-5e71-4d3c-95ff-f724181313c4	621	1k	\N
e1c9d059-32aa-491e-b97d-324a09a3b49f	0ae96336-5e71-4d3c-95ff-f724181313c4	622	3k	\N
e7af8293-3de4-4164-93fc-d7280c34e7d8	0ae96336-5e71-4d3c-95ff-f724181313c4	623	3k	\N
a9db095c-4502-4a42-8eaf-3aed847ae899	0ae96336-5e71-4d3c-95ff-f724181313c4	624	2k	\N
6c9cec65-ed8c-4aff-9131-ff62bf32f62b	0ae96336-5e71-4d3c-95ff-f724181313c4	625	studio	\N
552272b9-b2f8-4426-a401-17ded28347a7	0ae96336-5e71-4d3c-95ff-f724181313c4	626	2k	\N
4e0c8614-7baa-48bf-9f92-0ad0b83d3dd4	0ae96336-5e71-4d3c-95ff-f724181313c4	627	1k	\N
030f46bb-023d-4097-a20e-d80b1fe14506	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	617	1k	\N
1acbd9fb-dc4b-4da0-91d6-3138afe160eb	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	618	studio	\N
37ee1870-45bf-4275-b6dd-d9bf27a4a8ad	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	619	1k	\N
477507f2-9438-4313-82b7-340c51e48759	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	620	1k	\N
714cce1c-f166-4d2d-8a52-c3145bdf312a	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	621	1k	\N
6e369d3b-12b0-4190-abc6-3cfde0379f7a	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	622	3k	\N
ad0a7bcf-11c1-411c-b845-ec700e2cd858	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	623	3k	\N
e3689be0-bd88-4972-b332-44541514c054	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	624	2k	\N
c6e870f5-e178-4533-a80f-89b7bb11280c	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	625	studio	\N
a6110c73-c731-4333-b9ac-5b1fb8990891	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	626	2k	\N
89d005f4-b115-480c-8ed0-52020f8c506d	03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	627	1k	\N
0267ff56-4e3d-4d63-87e1-000b12f5f83d	72fb3978-7e7c-421c-8383-619844054a01	229	3k	\N
7a3f1432-2b65-46bd-8239-44806d5f514e	72fb3978-7e7c-421c-8383-619844054a01	230	studio	\N
eae47fe6-13ca-4375-aff3-a1502bd0c5fd	72fb3978-7e7c-421c-8383-619844054a01	231	1k	\N
5b052cb0-2fcf-45ce-b908-c3bc9db5576b	72fb3978-7e7c-421c-8383-619844054a01	232	1k	\N
88afb510-6567-4c7e-8e26-b9a11b8540f4	72fb3978-7e7c-421c-8383-619844054a01	233	2k	\N
bfbd9f95-c2e5-4d36-8a95-627d756d8336	72fb3978-7e7c-421c-8383-619844054a01	234	1k	\N
3346556b-44ef-421c-8b5c-9c93a344eb1d	72fb3978-7e7c-421c-8383-619844054a01	235	2k	\N
16c6760f-355e-48cc-8580-78524677d2b9	72fb3978-7e7c-421c-8383-619844054a01	236	1k	\N
d44c670e-ec5b-4967-8ad8-3c5896805f56	72fb3978-7e7c-421c-8383-619844054a01	237	1k	\N
3194abd4-572b-4538-8bdc-4ad2f2ee6a07	72fb3978-7e7c-421c-8383-619844054a01	238	1k	\N
bf6e902a-2a9e-43ab-ad85-23e7aa20708a	72fb3978-7e7c-421c-8383-619844054a01	239	studio	\N
33d5873f-f247-410e-a11f-3a112d062667	72fb3978-7e7c-421c-8383-619844054a01	240	1k	\N
da4e7564-5f16-4660-8a1f-2835a34ec13c	334aab67-dd02-4e9e-919b-573b02a26ce2	229	3k	\N
bfc48963-6038-4317-a1dc-0450aa674a01	334aab67-dd02-4e9e-919b-573b02a26ce2	230	studio	\N
80b689c2-5061-4dad-b8db-619363da3a8d	334aab67-dd02-4e9e-919b-573b02a26ce2	231	1k	\N
d924bbf2-a290-4104-b25c-dee1472debcd	334aab67-dd02-4e9e-919b-573b02a26ce2	232	1k	\N
c89a365d-f718-4a0a-8de4-ac57984af4b2	334aab67-dd02-4e9e-919b-573b02a26ce2	233	2k	\N
ff9183c8-0d86-4b64-9652-35a6750156d5	334aab67-dd02-4e9e-919b-573b02a26ce2	234	1k	\N
15ca6eb5-8b72-4e6d-a428-03009b64cf3b	334aab67-dd02-4e9e-919b-573b02a26ce2	235	2k	\N
84ba3765-4b79-4ddc-b76a-d5fe1fcce79a	334aab67-dd02-4e9e-919b-573b02a26ce2	236	1k	\N
b31b3930-7d0d-4a9c-84ac-eeb40ef935be	334aab67-dd02-4e9e-919b-573b02a26ce2	237	1k	\N
ed67a403-d301-423d-b86c-8ddedc96bd7f	334aab67-dd02-4e9e-919b-573b02a26ce2	238	1k	\N
b721ab99-c07a-4d3b-9203-2f8b7f5e7518	334aab67-dd02-4e9e-919b-573b02a26ce2	239	studio	\N
b11f53db-f217-4cac-b5b4-18c6992912b5	334aab67-dd02-4e9e-919b-573b02a26ce2	240	1k	\N
3f53af81-56db-4a8c-84aa-07cb64460c58	6e016bbb-ca39-4264-85db-9d337887a89a	629	1k	\N
5c6eaf54-2c91-4a7e-b639-2d266a525570	6e016bbb-ca39-4264-85db-9d337887a89a	630	studio	\N
0bf6e6a9-3869-402b-8d05-974bec3abffc	6e016bbb-ca39-4264-85db-9d337887a89a	631	1k	\N
b8bf3635-595b-40f7-8a1a-49b9b1eac985	6e016bbb-ca39-4264-85db-9d337887a89a	632	1k	\N
e44150a3-f73b-4dcb-b4a6-1b697c1686de	6e016bbb-ca39-4264-85db-9d337887a89a	633	1k	\N
7c0083e2-7e9d-48bb-9e5e-e65134d8414d	6e016bbb-ca39-4264-85db-9d337887a89a	634	3k	\N
f561fb88-9247-4a03-9a1a-3830612e1a17	6e016bbb-ca39-4264-85db-9d337887a89a	635	3k	\N
d48fa7f8-18d5-4c68-b85d-2206604f8cd5	6e016bbb-ca39-4264-85db-9d337887a89a	636	2k	\N
d8a4934b-9f21-48b0-8a9e-d3fbe58c7dd0	6e016bbb-ca39-4264-85db-9d337887a89a	637	studio	\N
52d959d9-d4f8-4201-bbd8-de6e679c5c1a	6e016bbb-ca39-4264-85db-9d337887a89a	638	2k	\N
344ced5a-89a7-4e53-9894-a998045c0df2	6e016bbb-ca39-4264-85db-9d337887a89a	639	1k	\N
e752f457-1b0f-412e-85a2-5140661cae13	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	629	1k	\N
9f9c788a-8bcf-48cb-a88b-d08cdfcd08a2	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	630	studio	\N
f31b475a-2c67-43e4-bb17-288901a40035	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	631	1k	\N
01934980-0af8-47e2-822e-b47bb514583e	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	632	1k	\N
d529e1fc-abfd-4742-873d-6e876d5b5633	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	633	1k	\N
ac11645a-e501-4f77-a74b-66e9ddd67cbc	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	634	3k	\N
53f42923-5fa4-4332-8e61-c534c758e684	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	635	3k	\N
85babb9c-4257-41f8-a974-924122e1f9fc	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	636	2k	\N
8857ff72-bfed-4b8c-b9fa-34a441266f3f	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	637	studio	\N
61894fc5-e0cc-44a5-b74b-7138e5ef6607	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	638	2k	\N
1bf94293-78d4-4c49-91e3-4fca9d5a569c	a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	639	1k	\N
ef97f608-f976-49ab-a0bc-27ee29fa51f8	27d5fe51-2933-4b0b-80f9-10d3ed979109	241	3k	\N
7f20ef2b-fd43-4bfa-8e06-90243993f788	27d5fe51-2933-4b0b-80f9-10d3ed979109	242	studio	\N
f3799a68-4022-4ff4-8fdd-46335e21ee8b	27d5fe51-2933-4b0b-80f9-10d3ed979109	243	1k	\N
b7026f04-c0d3-4d3f-a416-af751b7870a3	27d5fe51-2933-4b0b-80f9-10d3ed979109	244	1k	\N
cfb154b8-b17a-4eca-a227-c0d829b21861	27d5fe51-2933-4b0b-80f9-10d3ed979109	245	2k	\N
e6cc8157-5440-4313-bb1b-1c5a49febfb8	27d5fe51-2933-4b0b-80f9-10d3ed979109	246	1k	\N
f718c53d-155c-433b-ab8f-2d777cb5f15e	27d5fe51-2933-4b0b-80f9-10d3ed979109	247	2k	\N
4a9ec155-a26a-41b4-a91b-88a3df50a324	27d5fe51-2933-4b0b-80f9-10d3ed979109	248	1k	\N
6a477215-8574-46fa-a0a7-50d135ad9ba4	27d5fe51-2933-4b0b-80f9-10d3ed979109	249	1k	\N
2cec9dd7-4db9-4908-b651-f2ac736337ec	27d5fe51-2933-4b0b-80f9-10d3ed979109	250	1k	\N
0696443f-92f7-4bd6-9d2f-f59e6ca56c27	27d5fe51-2933-4b0b-80f9-10d3ed979109	251	studio	\N
ceab5dcc-1bb4-4b27-b767-2feaf192df94	27d5fe51-2933-4b0b-80f9-10d3ed979109	252	1k	\N
f96d71f5-6213-485a-b234-f7e6efaec9a1	38546023-aa3e-4991-b165-55594b33a50f	241	3k	\N
bf0f7390-f106-4114-b996-76609f54341c	38546023-aa3e-4991-b165-55594b33a50f	242	studio	\N
d1ad6eaa-8c12-4f84-90ee-e88f2f76cb31	38546023-aa3e-4991-b165-55594b33a50f	243	1k	\N
94906466-def8-4c69-a80b-ddb7abf7f63d	38546023-aa3e-4991-b165-55594b33a50f	244	1k	\N
6cb3de24-8ac1-4493-ab3e-f74dd61c3102	38546023-aa3e-4991-b165-55594b33a50f	245	2k	\N
3b3a556a-95b4-4ab5-bba9-70e0a580b47d	38546023-aa3e-4991-b165-55594b33a50f	246	1k	\N
158c3a58-8102-495a-b656-4806622617c6	38546023-aa3e-4991-b165-55594b33a50f	247	2k	\N
4338f1b4-7e4b-4a31-87bd-0232a34bc9cb	38546023-aa3e-4991-b165-55594b33a50f	248	1k	\N
d51f36c2-86ed-435a-b0fd-70f7b2efa53d	38546023-aa3e-4991-b165-55594b33a50f	249	1k	\N
59779d7e-1322-479f-8ae5-f7abaa4c7898	38546023-aa3e-4991-b165-55594b33a50f	250	1k	\N
4ef4cbcb-467b-4a4b-81b8-a94ca5f0e000	38546023-aa3e-4991-b165-55594b33a50f	251	studio	\N
025f30e1-2b19-49a1-b7aa-9e38acb52e79	38546023-aa3e-4991-b165-55594b33a50f	252	1k	\N
95ab2688-19c9-4b87-a32c-d36e31e8658a	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	641	1k	\N
62d8e053-99ab-44bb-a004-8c882f2120ab	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	642	studio	\N
389c933f-ae81-484e-a3f3-0d230e03d5d1	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	643	1k	\N
aa7d4f8f-8e97-484f-9dc7-6d6ae1274521	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	644	1k	\N
5d34af55-474e-4f07-a75b-09b016f5712a	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	645	1k	\N
962bada3-388c-4868-9ffc-7adb5622dcac	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	646	3k	\N
52c9be95-95a2-43f4-925d-8da67f654d65	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	647	3k	\N
03f136be-4eaa-4b0e-bf7c-95345a99bb0c	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	648	2k	\N
53547ccf-cf25-412a-a60b-7ca4defaff82	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	649	studio	\N
2a35ca7a-82f7-4883-8740-bdee8c3ddb83	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	650	2k	\N
cf9f42b7-3022-4eab-bde5-22dad9286ccf	ee06e9e8-d625-4fd9-8d7f-5a1826df484a	651	1k	\N
b0f3fd70-8d26-4d98-9df0-e05ca7b5b3bb	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	641	1k	\N
0b2b3148-049a-4774-9b8b-4d4c3424f90a	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	642	studio	\N
cf17e7c7-100d-4c82-b5d1-35b7682c172f	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	643	1k	\N
c85ab6fd-a67c-45ae-8907-af173437b1f8	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	644	1k	\N
6d77b214-4b9c-4908-8f74-650bf4a416d5	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	645	1k	\N
8f3edf13-8cd6-4300-8460-5cf6ba1c048e	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	646	3k	\N
b226007c-88b1-444c-a94a-4603f2659c24	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	647	3k	\N
d4fa1c92-020d-4522-bbeb-7c8215dcd8d9	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	648	2k	\N
97964fbc-e194-4544-a27d-d1f35207fa5e	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	649	studio	\N
11f44444-07ff-46ab-b7b1-5efb5067056a	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	650	2k	\N
09a41db4-e690-4466-8501-b7e7840d1390	5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	651	1k	\N
2b6741c3-3089-457b-9973-28cdfc13899f	ccdc284b-ddce-440a-86ea-32b21f242cd5	253	3k	\N
ff980ab0-9f16-445a-a944-dbadeb11230a	ccdc284b-ddce-440a-86ea-32b21f242cd5	254	studio	\N
f16560d6-8e9a-4b47-a895-d5f1fadca3b2	ccdc284b-ddce-440a-86ea-32b21f242cd5	255	1k	\N
7ad4da0c-15e2-43be-94a2-59af41e80ad9	ccdc284b-ddce-440a-86ea-32b21f242cd5	256	1k	\N
156dd8ca-d974-4bb0-a16b-9efb45d366c2	ccdc284b-ddce-440a-86ea-32b21f242cd5	257	2k	\N
667eef2b-9278-4bf4-b366-ab5d9cd27e51	ccdc284b-ddce-440a-86ea-32b21f242cd5	258	1k	\N
7bf305f9-dcdc-4aec-ad29-7c94fc0e65fe	ccdc284b-ddce-440a-86ea-32b21f242cd5	259	2k	\N
cf7d04fc-e2e8-4cd6-b0fa-80422eafba3c	ccdc284b-ddce-440a-86ea-32b21f242cd5	260	1k	\N
dabc59df-edf3-45f8-85b9-0ce9492974f6	ccdc284b-ddce-440a-86ea-32b21f242cd5	261	1k	\N
ff8decc6-25c1-40d7-9a2e-83e5c67bc5f3	ccdc284b-ddce-440a-86ea-32b21f242cd5	262	1k	\N
adea88f7-d39f-4398-ab50-66ff8177f978	ccdc284b-ddce-440a-86ea-32b21f242cd5	263	studio	\N
6b1ab55d-b6cf-4fec-b025-4f7aa58e6d46	ccdc284b-ddce-440a-86ea-32b21f242cd5	264	1k	\N
35cfe1cb-8d9f-403b-a511-e78632668f9f	95f3da38-28a6-46c5-be00-0ab87cafc709	253	3k	\N
32c01541-769c-48b7-89d1-bb43e89feeb1	95f3da38-28a6-46c5-be00-0ab87cafc709	254	studio	\N
5d48e144-72f3-43ea-b0ab-3c95d0c85941	95f3da38-28a6-46c5-be00-0ab87cafc709	255	1k	\N
e2e66b50-d784-4cb6-8b8c-626a13d3ddce	95f3da38-28a6-46c5-be00-0ab87cafc709	256	1k	\N
653b1aa9-f351-4e63-af1d-73de20805d68	95f3da38-28a6-46c5-be00-0ab87cafc709	257	2k	\N
ffb95d29-7288-4186-b18c-f0b2b9dcc5c6	95f3da38-28a6-46c5-be00-0ab87cafc709	258	1k	\N
a7c14609-ac4b-49d3-8d93-96373eba5c21	95f3da38-28a6-46c5-be00-0ab87cafc709	259	2k	\N
7492c7e5-e939-4754-ad33-ab3d6fcf4a59	95f3da38-28a6-46c5-be00-0ab87cafc709	260	1k	\N
afdc6a57-d2e6-4746-8010-bb7ac15e98dd	95f3da38-28a6-46c5-be00-0ab87cafc709	261	1k	\N
9373ffbc-cd8a-4c3b-b3c6-dd2c14dd7903	95f3da38-28a6-46c5-be00-0ab87cafc709	262	1k	\N
80e1f654-1a0e-41a3-8407-75b51f56a080	95f3da38-28a6-46c5-be00-0ab87cafc709	263	studio	\N
fa1b990c-9273-4573-afe8-ea93597a1575	95f3da38-28a6-46c5-be00-0ab87cafc709	264	1k	\N
2dd3c44f-7a9e-4073-b530-b295832fc6e5	a40a2dbe-2a16-4782-80c8-3160132aec0e	653	1k	\N
13e26036-f20f-4bf6-9c28-c0850fd50df3	a40a2dbe-2a16-4782-80c8-3160132aec0e	654	studio	\N
4da38e87-e0d6-4c99-b808-2455b7c9ebc4	a40a2dbe-2a16-4782-80c8-3160132aec0e	655	1k	\N
7f6b313b-04fc-438c-b049-36d7e938c85b	a40a2dbe-2a16-4782-80c8-3160132aec0e	656	1k	\N
34fcf647-ed8f-48b1-b6be-24f2004ca7c5	a40a2dbe-2a16-4782-80c8-3160132aec0e	657	1k	\N
60712201-0843-443e-82ad-01076935e018	a40a2dbe-2a16-4782-80c8-3160132aec0e	658	3k	\N
9606e4df-f18d-4a46-808d-b6fcdfd21fdd	a40a2dbe-2a16-4782-80c8-3160132aec0e	659	3k	\N
117e0a01-b9d2-4d26-b939-01d39729ed14	a40a2dbe-2a16-4782-80c8-3160132aec0e	660	2k	\N
403c2a18-92d5-48fe-8e35-92d1ef06868b	a40a2dbe-2a16-4782-80c8-3160132aec0e	661	studio	\N
e4025e0b-a91b-4b7c-996c-e4164bd3be0f	a40a2dbe-2a16-4782-80c8-3160132aec0e	662	2k	\N
1c1f8433-e962-4ee9-bbfb-3df4e27e45f8	a40a2dbe-2a16-4782-80c8-3160132aec0e	663	1k	\N
a03d1efd-e68b-4377-9e6c-88f2c5f92bab	310061ff-bb97-4c4a-a405-b497fd1e6659	653	1k	\N
e629fa16-3d7d-4a84-ba8f-e72229762f9d	310061ff-bb97-4c4a-a405-b497fd1e6659	654	studio	\N
6678c9ca-cc44-4d5f-9ef4-5a37d643da29	310061ff-bb97-4c4a-a405-b497fd1e6659	655	1k	\N
b4fc812c-493c-4add-96a1-d38086cc028d	310061ff-bb97-4c4a-a405-b497fd1e6659	656	1k	\N
440eafcd-c78b-4849-be8f-2da7e3fe9d25	310061ff-bb97-4c4a-a405-b497fd1e6659	657	1k	\N
d8858901-cdcc-4ed1-98de-1a8dd8fb1763	310061ff-bb97-4c4a-a405-b497fd1e6659	658	3k	\N
430a382f-39bd-42be-8717-cfff4123d1d4	310061ff-bb97-4c4a-a405-b497fd1e6659	659	3k	\N
88078c8b-b299-42ca-b962-86e0dd7aa226	310061ff-bb97-4c4a-a405-b497fd1e6659	660	2k	\N
395fbe5d-1a94-4f30-bbc0-21f62e9a5bbd	310061ff-bb97-4c4a-a405-b497fd1e6659	661	studio	\N
17945b4a-8ec1-4681-b129-923e99e80e34	310061ff-bb97-4c4a-a405-b497fd1e6659	662	2k	\N
4fd8d579-1d06-48c4-8ce0-9b503b968f6e	310061ff-bb97-4c4a-a405-b497fd1e6659	663	1k	\N
bf8d9380-d51a-4c0c-913a-e817c63f6e68	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	265	3k	\N
9a16ca76-bae0-4674-adbe-09ca82432c98	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	266	studio	\N
98939039-a0af-40eb-ad81-2fa7b9e07f29	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	267	1k	\N
e62646a1-98ee-49d0-8ccf-f58a2992bbc1	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	268	1k	\N
9fee3f03-f755-441a-8fca-4211d02d3cb8	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	269	2k	\N
f03205fa-1495-46e0-9818-2b822813997e	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	270	1k	\N
f730346f-3357-40b4-b970-48fcf79c4ef5	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	271	2k	\N
680ba0fe-e842-4966-b918-50b0485736a9	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	272	1k	\N
d220216f-0e75-4c30-92e6-12a4c824395c	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	273	1k	\N
64205ebf-bc5f-421a-952c-5c8e40b32007	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	274	1k	\N
ee05f9b0-b9f7-4f7f-a613-6a16fe9e2ecf	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	275	studio	\N
81e64885-a216-4ab6-88b5-d4c547a7d45b	1f8c7c4c-486d-4d13-b7a5-35e3f604b003	276	1k	\N
f22df18a-f1cb-4625-9769-c6f41bb05e88	8ae1e1d2-39ef-45db-9178-72853f332b9b	265	3k	\N
b48f0706-bfcc-4ace-9e8a-37d2f463d603	8ae1e1d2-39ef-45db-9178-72853f332b9b	266	studio	\N
03b97116-ee59-4a64-8712-b88866080f55	8ae1e1d2-39ef-45db-9178-72853f332b9b	267	1k	\N
41b4f298-2fed-4870-b45e-2fdec5c4592f	8ae1e1d2-39ef-45db-9178-72853f332b9b	268	1k	\N
129b0c5a-745e-4f5e-acc2-ed8e8910647e	8ae1e1d2-39ef-45db-9178-72853f332b9b	269	2k	\N
fe37e7fa-38d8-492b-abb4-260dc0b36558	8ae1e1d2-39ef-45db-9178-72853f332b9b	270	1k	\N
a6e7d199-032d-4785-adb1-e7fae51e553c	8ae1e1d2-39ef-45db-9178-72853f332b9b	271	2k	\N
0dd48b95-6878-480c-b058-0de33f1cd473	8ae1e1d2-39ef-45db-9178-72853f332b9b	272	1k	\N
267c6601-2bb0-43fa-be50-084fafb6911f	8ae1e1d2-39ef-45db-9178-72853f332b9b	273	1k	\N
7cbfb8bd-4492-4a51-9aae-630bb8bb8d6c	8ae1e1d2-39ef-45db-9178-72853f332b9b	274	1k	\N
bff9546a-6485-4f85-be3f-4f892a3ee628	8ae1e1d2-39ef-45db-9178-72853f332b9b	275	studio	\N
93ea0f8c-37aa-41e7-a6a5-05c0c4401172	8ae1e1d2-39ef-45db-9178-72853f332b9b	276	1k	\N
54dadaa8-a0a3-41df-876c-e376fd2d7369	58f1ade3-e00f-429b-98d3-9ac54170190e	665	1k	\N
e67de9d1-5184-412e-ae3b-5e6bf38d8f1e	58f1ade3-e00f-429b-98d3-9ac54170190e	666	studio	\N
0e5cfc79-8c0f-4437-809e-6a7f3c7d8b62	58f1ade3-e00f-429b-98d3-9ac54170190e	667	1k	\N
6e396866-4df7-46ad-ae46-a8118fce4622	58f1ade3-e00f-429b-98d3-9ac54170190e	668	1k	\N
845be706-ca90-4bd9-9d11-93ab3a95c07c	58f1ade3-e00f-429b-98d3-9ac54170190e	669	1k	\N
a4e54a8f-5602-436d-9935-749f35d418fe	58f1ade3-e00f-429b-98d3-9ac54170190e	670	3k	\N
769c7472-bfa6-4038-99f6-3fe757e23d99	58f1ade3-e00f-429b-98d3-9ac54170190e	671	3k	\N
b6831423-fcad-4bae-9ca8-270d9ab979b7	58f1ade3-e00f-429b-98d3-9ac54170190e	672	2k	\N
b324cd02-eb5a-4bc5-9b8c-2a9195aa0a48	58f1ade3-e00f-429b-98d3-9ac54170190e	673	studio	\N
32d580a2-7774-4005-a833-4597bdc5912e	58f1ade3-e00f-429b-98d3-9ac54170190e	674	2k	\N
4bb039ea-6e96-4e5c-94e8-9b3eafa29bc1	58f1ade3-e00f-429b-98d3-9ac54170190e	675	1k	\N
deedf216-6d96-4449-9682-11cfaa24713c	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	665	1k	\N
f0f5c871-f171-4426-919d-b77617b60782	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	666	studio	\N
997f014b-ba4b-48c9-8865-07481ddd517e	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	667	1k	\N
6af1a71f-5f61-4d61-bb5b-94ba661c93c7	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	668	1k	\N
24bf5a0a-9c0e-47f3-8107-817dbdaaeb68	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	669	1k	\N
35c6cad8-1997-4047-918b-52bcec77555d	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	670	3k	\N
ae5f8e1a-cc3d-4165-84f5-837cc44e2384	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	671	3k	\N
04042c83-8e06-4fb5-8b55-d253745fc9e0	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	672	2k	\N
f236f48a-5064-4921-8d66-d0e6c9d106d6	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	673	studio	\N
45c8ec6a-f434-47f8-ade3-bb4762ae7655	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	674	2k	\N
fdd210ea-f59f-4878-a794-f5bb0aca5810	a81d87dd-06e3-4eb0-855f-36ca3b1452d2	675	1k	\N
\.


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_log (id, entity_type, entity_id, action, actor_id, previous_state, new_state, changed_fields, description, metadata, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: building; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.building (id, number, title, liter, active) FROM stdin;
6147fef4-6020-4938-95f8-75a557406e13	1	Строение 1	Литер 4, 5	t
fe24395b-c335-460d-a7c4-0c89e8f29b57	2	Строение 2	Литер 2, 3	t
703f0fd4-2665-43d5-aa89-08b80f36797f	3	Строение 3	Литер 9	t
c0d85fdf-8244-49a7-b4e1-f9c93cdc1a84	4	Строение 4	Литер 1	t
ed5a034e-e745-4e97-9f1c-588290a9df52	5	Строение 5	Литер 8	t
7e09eec5-5b83-4fbe-ba39-73fcc0364ec8	6	Строение 6	Литер 7	t
6a45ee31-561f-484f-a900-64d43b4f9316	7	Строение 7	Литер 6	t
\.


--
-- Data for Name: building_channel; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.building_channel (id, building_id, channel_type, channel_id, name, is_active, is_primary, created_at, updated_at) FROM stdin;
1c6b9669-0b20-462b-a705-f7ccb212877b	6147fef4-6020-4938-95f8-75a557406e13	telegram	https://t.me/sr2_s1	Telegram Строение 1	1	1	2025-12-06 14:54:07.029119	2025-12-06 14:54:07.029119
c8409937-c00f-4140-bee3-0b406a6ce5e3	fe24395b-c335-460d-a7c4-0c89e8f29b57	telegram	https://t.me/sr2_s2	Telegram Строение 2	1	1	2025-12-06 14:54:07.043447	2025-12-06 14:54:07.043447
69275615-948a-4b36-8542-b5c4034874fa	703f0fd4-2665-43d5-aa89-08b80f36797f	telegram	https://t.me/sr2_s3	Telegram Строение 3	1	1	2025-12-06 14:54:07.050316	2025-12-06 14:54:07.050316
23f62dd9-130b-450c-91f2-3a5b377fcbdf	c0d85fdf-8244-49a7-b4e1-f9c93cdc1a84	telegram	https://t.me/sr2_s4	Telegram Строение 4	1	1	2025-12-06 14:54:07.056437	2025-12-06 14:54:07.056437
79ee6b02-8dea-419e-992f-75768f6e64e8	ed5a034e-e745-4e97-9f1c-588290a9df52	telegram	https://t.me/sr2_s5	Telegram Строение 5	1	1	2025-12-06 14:54:07.063843	2025-12-06 14:54:07.063843
3ff136cc-b3c9-4997-9b24-cbf4466bb304	7e09eec5-5b83-4fbe-ba39-73fcc0364ec8	telegram	https://t.me/sr2_s6	Telegram Строение 6	1	1	2025-12-06 14:54:07.077011	2025-12-06 14:54:07.077011
f4197c45-bb6b-4003-bb60-6eb57ac7873a	6a45ee31-561f-484f-a900-64d43b4f9316	telegram	https://t.me/sr2_s7	Telegram Строение 7	1	1	2025-12-06 14:54:07.087265	2025-12-06 14:54:07.087265
af87cd0c-7b0f-4957-81c7-ef262042b25b	\N	telegram	http://go.sr2.today/telegram	Общий чат ЖК Сердце Ростова 2	1	1	2025-12-06 14:54:07.136465	2025-12-06 14:54:07.136465
\.


--
-- Data for Name: claim_document; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.claim_document (id, claim_id, document_type, file_url, file_name, file_size, mime_type, uploaded_at) FROM stdin;
\.


--
-- Data for Name: claim_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.claim_history (id, claim_id, from_status, to_status, resolution_template, resolution_text, changed_by, created_at) FROM stdin;
\.


--
-- Data for Name: contact_group_tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_group_tags (contact_group_id, tag_id) FROM stdin;
\.


--
-- Data for Name: contact_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contact_groups (id, title, description, type, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: deletion_request; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.deletion_request (id, user_id, status, reason, admin_notes, processed_by, created_at, processed_at) FROM stdin;
\.


--
-- Data for Name: directory_analytics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_analytics (id, event_type, search_query, tag_id, entry_id, contact_id, user_id, results_count, metadata, created_at) FROM stdin;
a9c6d635-77d7-44b9-8a2e-7a067363b379	search	корпус	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-04 17:20:04.905712
d869379d-1934-408c-b2ba-d88cc491e26e	search	комм	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	2	\N	2025-12-04 17:20:11.43097
f093a67b-ea3d-4b78-a358-82b7357d7dd4	search	жкх	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-04 17:30:47.211674
52e268a0-00d6-425c-b3cd-b856d5fed5ee	search	жк	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	3	\N	2025-12-04 17:30:48.304254
04c26772-64b4-4b69-af16-e74c8e2cae02	entry_call	\N	\N	\N	342a4f7d-04d1-43d6-ae9f-230434cf695d	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 14:55:10.458882
e990949f-7d33-4a25-b66a-7d797aea1588	entry_call	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:20:25.020236
51e09188-e9b5-4f65-a242-b7993b00f292	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:18:57.139933
7a1ffa0b-a877-4e6a-a4cb-c967e27a915d	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:18:22.216712
0f94b515-018e-475d-b62e-117fca4f919e	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:18:36.276912
7363c975-83be-4a25-a43e-fcb60190e623	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:19:52.686545
7155d11d-7ae1-45b8-adbf-2f55fd4a9289	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:30:18.56512
8e344641-8871-4847-9483-18287d2d9e43	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:30:26.771054
a232f423-612b-48c4-9cf0-1b65112c1abf	search	клгс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-04 17:54:06.549875
bf1b6924-1a9a-4a01-8674-e4124c831bf0	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-04 17:54:09.053791
13433ca9-f8b1-4490-9fe0-e7de128be705	search	консьерж	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-04 17:54:13.887268
6d7a2304-244d-406e-ad30-db5b0ddd164f	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:53:32.484249
5ff249f5-f8ef-43b4-8ed5-b85811889075	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-04 17:53:48.412108
d5dbc35b-768a-472e-9a79-3fe44a10b1c9	search	кон	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-06 14:27:06.803838
0aea5e2b-6a7d-4d71-a2a3-121d81e776a5	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-06 14:27:07.79575
b5446b7d-d72e-4163-9784-275e46d86287	search	консье	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-06 14:27:17.655577
d42daa23-a46e-4bf6-a8d9-e1ad24a347fe	search	консь	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-06 14:27:19.932652
8deca470-88c5-4b84-9150-7925c06499c1	search	консьер	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-06 14:27:21.481521
813583bf-7430-4060-a409-1c31f3ec3f65	search	консьерж	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-06 14:27:23.127434
f6aa3f0d-c554-47a6-9ea8-25744a579c88	search	ко	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	48	\N	2025-12-06 14:33:28.623562
8ee8324a-fcae-4b83-bc31-d801d362ede8	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-06 14:33:31.493687
82b74350-b8b4-4b84-85bf-4cdfa0243bf2	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-06 14:38:16.578788
01ea1bfd-e238-490a-b30e-629e26749a89	search	строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-06 14:38:39.443464
b413b9ab-46af-4e52-88c5-67d578142ed3	search	строение 2 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-06 14:38:42.236008
b7608fb5-3992-4b2a-9962-d393cd11e58d	search	строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-06 14:38:43.084118
9e087554-609a-45cf-b794-c5745a39a03a	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:39:03.66684
e1b216e9-0984-4257-8f31-7ac8a81a4c28	search	ко	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	48	\N	2025-12-06 14:47:45.622272
35ccd5f9-9500-4137-baf1-9d5ad577c0ec	search	кон	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:47:49.760759
22794aca-619f-451f-a97c-e5465383777f	search	консь	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:47:50.850918
174a96ed-a528-4fd3-a40a-8fa87edea24e	search	чат	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-06 14:48:01.739389
74b6a150-31b9-481e-8a53-b0ed5d8570a7	entry_call	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 14:33:50.54504
da7092f5-a2de-4cd3-94e4-8f59aa649cd4	entry_link	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 14:38:31.938434
b22ca338-9541-4f04-8134-d9fec776b3fe	entry_link	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 14:48:14.659313
72a733cd-1cbe-416d-beca-15a80da426ee	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 14:26:45.767231
99201675-4c1c-4974-a15c-3930ae44d0f7	tag_click	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 14:48:26.259568
2ab2d6c4-a599-4f3e-a8c0-d572777440f8	search	под	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	9	\N	2025-12-06 14:53:55.068092
bf368b25-6eac-4000-8f0c-e50ad9c427eb	search	подъезд 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:53:58.205101
5037401e-3548-4e16-ad5f-298594049ebc	search	ук	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	9	\N	2025-12-06 14:55:17.935229
627985c8-2f94-41ee-abcf-cf270aa5db8e	search	под	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	9	\N	2025-12-06 14:57:39.503677
8c417dae-bf3e-468f-9099-4c9bcb4a5be9	search	подъезд 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-06 14:57:43.401504
04ada56d-dd16-4836-8e54-afad9658dc5b	search	подъезд 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:57:45.71178
4cbe8c3f-f68c-45c5-86c5-6f504d7fa6dc	search	подъезд 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-06 14:57:47.577805
75dacda6-0296-469a-aefb-6b43641a0c79	search	подъезд 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:57:48.599126
5b2754f3-50d5-4a30-965e-ac0bbc12f740	search	подъезд 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-06 14:57:49.426616
1e54f9d3-1afd-4ee0-bc9d-049f43d11ab8	search	подъезд 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:57:50.391071
1107e2ce-7d84-473c-a95f-2f1f47348859	search	кон	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:57:52.610014
24ca882d-f348-4901-b047-57c52afd8459	search	консьерж под	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	9	\N	2025-12-06 14:57:59.810895
2bf33aa9-c439-4ea0-b8ac-cf9058621df0	search	консьерж подъезд 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 14:58:02.621064
7261974a-c6e6-4b74-8999-776fd6d14e86	entry_call	\N	\N	\N	45bef24b-8d2b-409f-8247-2fb42ef55ef6	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 14:58:29.233344
401a124a-0d4a-4a4a-a45e-e81fc5a0994b	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 15:04:03.303494
44fe2ef1-7e01-4cd6-87f2-59458ae6719b	search	ы\\	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-06 17:03:19.589233
611a10cb-387c-4a80-8c87-17688533266c	search	ко	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	50	\N	2025-12-06 17:03:25.733895
fa44192a-e70c-461b-a7a8-0b27ebc7b5af	search	кон	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 17:03:26.877167
38a6afb5-e692-430c-b628-f2d1882a5750	search	консь	\N	\N	\N	\N	8	\N	2025-12-06 18:03:29.238279
fd60c208-21bf-4fec-81c5-205af8938056	entry_call	\N	\N	\N	929bea4f-3fbc-47aa-94e0-8eafbb142d8e	\N	\N	\N	2025-12-06 18:03:34.950009
f7dfced7-aa8b-4ce7-98a1-a32979a957bd	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 18:21:06.236392
af80a94d-33a7-4574-b875-c02a6ef67fe6	search	сант	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	17	\N	2025-12-06 18:21:12.654468
62ad583f-67b1-4588-82a4-54a56a52f118	search	санте	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	17	\N	2025-12-06 18:21:14.359391
8c50f721-ffbf-4beb-b3cb-e76b4b87c05f	search	управ	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	9	\N	2025-12-06 18:21:24.287919
c8c26a6a-edba-4c71-9350-fcb9772b4f29	search	строи	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 18:21:33.4294
36a85ba2-6fa8-4ca7-9bbe-559de2e2fd67	search	чат	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-06 18:21:38.524943
c7467e02-0199-4fb5-9227-6c386f09bcec	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 19:13:43.406697
cbf5fcbd-0278-4823-8389-2926af43f7ef	search	чат строение 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	25	\N	2025-12-06 19:13:59.499651
210f1436-efda-45b7-bf91-165794faaf6b	search	кон	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-06 19:21:21.520079
36a41f7c-e30d-4d5a-9b96-59238d2196c7	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 19:21:35.143412
45555fa8-236d-4ed1-9a4d-af1e29ac70d8	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-06 19:21:45.812386
e6e1c4e4-c3af-49b0-9ddf-f431c443b2da	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-07 14:43:32.3024
9e6893ee-5f28-4f37-a318-14c01f0d1f34	search	чат строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	25	\N	2025-12-07 14:43:36.889382
a40b9c20-abbf-4f88-8cdc-ff845c098d9f	search	чат ст	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:57:52.435626
9df13312-9018-4a47-b84c-164f597d3f3e	search	чат строее	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-07 14:57:54.893675
b4668236-f38e-4105-ba45-1bbc1625bb56	search	чат строе	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:57:55.737422
d9850567-1f24-4c10-a986-f4b7106adb53	search	чат строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:57:57.531082
1971b07d-01b0-4525-8d50-c5be229a8bb8	search	строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-07 14:58:06.457284
061b6a5b-1b20-49f0-862d-6992ad5d9527	search	строение 2 чат 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:58:07.831849
5b177958-39d4-495c-800c-5e0357fe3ee4	search	строение 2 чат	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:58:08.738152
40c8c5e3-9c4c-4e4d-8f22-ec9c09abb5f7	search	строение 2 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:58:09.541119
b58b9ac3-b3ef-4418-acfd-b4d6b81eca82	search	строение 2 телеграм	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:58:12.104137
74340875-e176-44d2-a60c-ce5a690df9bd	search	чат строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:58:18.693548
0cbe1938-8019-467c-b1cc-58da5f187b67	search	чат строение 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:58:20.822875
654f3ffe-9237-49c3-a5c5-66cf5d309f0b	search	чат строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 14:58:22.187559
06010c84-f882-4cc4-8804-0e88f0dfb05f	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 14:59:20.944427
13cd51ee-323b-4c11-b367-a80e40bca840	tag_click	\N	tag-elektrik	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:05:53.348671
1796e527-7764-47c7-a939-2bfed4ca62a4	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:05:58.175783
1dba431e-d11e-453e-9d1f-4ef6cce6c1b9	search	интернет	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	9	\N	2025-12-07 15:06:04.143425
364e7693-211c-41db-8fee-252783ba96a6	search	чаты	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 15:07:42.68275
840ef82f-9488-40d9-adca-8bbe28b4721b	search	чат	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-07 15:07:43.427709
de5a9766-6a61-40eb-8314-f56b5b42ff26	search	чаты	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 15:07:47.976941
76344a9d-887b-4b18-a8b5-53da4ff20192	search	чат	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-07 15:07:48.95651
990da12b-6b63-4cc1-a0e9-f01e24a1759d	search	строение	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 15:07:51.952778
c03ccde1-169e-4dcc-947e-be072242043c	search	строение 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 15:08:08.603329
7fdecc7f-5c00-4d71-baea-4981194d33da	search	литер 4	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 15:13:44.746803
fa4162c3-3c83-4d0d-bf0d-9cb0942c8c67	search	строение 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-07 15:15:20.138308
9706a7c7-0b9c-4e2d-b330-660e6e219349	search	строение 2	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-07 15:15:22.000958
5b5c8bac-aaa0-46bd-9212-d1830cb52e20	search	строение 3	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	2	\N	2025-12-07 15:15:22.666227
621ba4be-9773-4fe0-8911-1a2a6c0bd468	search	строение 4	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	2	\N	2025-12-07 15:15:25.540672
eb5862e4-b2dd-4f50-b498-fc8ea37ed585	search	строение 5	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	2	\N	2025-12-07 15:15:26.488247
cb946d47-0c66-438b-98c0-c69c5b98a52e	search	строение 7	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-07 15:15:28.451752
68151100-7de3-4541-859d-d4eb2bc6632e	search	строение 8	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 15:15:29.145116
a1cc8d1a-81c2-4892-abd8-1de2862e1421	search	строение 9	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 15:15:30.164916
b17dd288-6a05-4c6e-bfd1-fa793ec14ddd	search	строение 6	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-07 15:15:32.909605
259602f9-19c6-4cc4-b08c-936f3d66deae	search	строение 7	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-07 15:15:33.949218
1ce35f73-641c-4243-b22a-32ec3d60df9a	search	строение 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-07 15:15:35.031358
55de36d0-2c2c-4442-95d9-718776df982e	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:15:38.546789
4ce8c85f-78e9-4814-98e1-ddff0de62e26	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:15:45.899684
a3e258bc-9bec-4e21-862e-f692d2f14c5b	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:15:48.243299
478d4c9d-2516-4646-a762-6cf22000fa3c	search	чат стьроение	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-07 15:21:28.786264
f9577e98-a1d4-430b-bdb8-453aa9563142	search	чат	\N	\N	\N	\N	10	\N	2025-12-11 23:23:13.495697
b730809f-75d5-4f8f-9564-ca8ad7dbec5b	entry_link	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:15:53.220211
b0b2d08a-dcb9-41da-9c7d-a8248faf33eb	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:21:40.992969
2f74fc06-64b1-4f9f-b953-df88b36bc478	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:43:30.89798
bfbcc201-2c58-4f22-b820-75fbe8cc517f	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:56:07.642235
f6eb8044-bc34-4382-b45c-81bc43d0f0a1	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:56:15.977743
1aa4ba58-f248-429f-9323-6f5609143311	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:56:19.773856
6764db2b-12a9-4fd5-9050-96871a427335	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:56:21.797537
5bc71709-d9da-4a3a-9373-f3a1153e3f63	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 15:57:56.381694
eb0639d2-4803-44ee-9d08-3806d67ef35d	entry_link	\N	\N	\N	0c11c98b-7143-4692-896c-ab5f19c5b305	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 16:08:25.272661
c744c49d-d8fd-40d8-830e-7505fbbc4b60	tag_click	\N	tag-santehnik	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 16:08:41.507727
e39463d4-b69c-4f97-bca9-c432631fac7f	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 16:09:00.979511
354af109-7270-4eb5-9b32-49fc267c1fc6	search	консьерж	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-07 16:09:07.733673
e9565d2c-a721-459b-9496-d0f8605c8c36	search	консьерж ст	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 16:09:11.585399
2da82dd1-ee9e-44d9-abe8-8e901caa1d5e	search	консьерж стр1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	2	\N	2025-12-07 16:09:14.300066
fb507303-c2a2-46d5-bc3b-9e70f9e51a7f	search	консьерж 	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-07 16:09:26.882745
ba4f1f21-9cb9-4150-9731-6555421ccb6a	entry_link	\N	\N	\N	4c904800-2046-43ad-a59f-c71124d7c116	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 16:09:32.268325
3faa8803-c9c0-45e4-9574-97db76e9b6b1	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 16:27:14.647182
be4098f5-8fcc-4b14-a65f-814e8249087a	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 16:36:59.091094
3d6b8512-3c11-435d-a485-0afb863055e4	search	sd	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	1	\N	2025-12-07 17:23:52.517481
5d0906c0-5cdc-4892-98cb-ed5f6b33397f	search	оплата	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	1	\N	2025-12-07 17:24:04.195887
ae63a5d2-b375-4941-88ac-0796f373ee1f	search	выв	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 17:26:42.067031
31b487c4-31ce-4fe4-a35f-702accfb924c	search	ыв	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-07 17:26:44.899344
b5d4fc24-9125-4395-afe8-0350ac5ec5a0	search	вв	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	1	\N	2025-12-07 17:26:48.132679
dac7a181-e62a-4ad0-a1ec-4629cf599f7a	entry_link	\N	\N	\N	068aeadc-5a69-4590-a738-713810970519	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 17:27:48.585423
28e943bc-4085-4c66-9d2f-828939e977b0	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 17:28:26.368249
1e0d8f0b-8be4-42d1-8473-ba00714cb1c1	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 18:34:07.894118
ec5c3072-c160-4ea0-bd5e-b125345cc932	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 18:55:20.367299
9136877e-a142-4273-8f68-48739615bdb5	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-07 21:33:27.186116
00078eb9-bb00-4bd1-88a4-2ec21526ede3	tag_click	\N	tag-chat	\N	\N	\N	\N	\N	2025-12-07 21:33:59.850563
346afb94-ef1f-47a6-a187-7e27e2f1cc87	tag_click	\N	tag-chat	\N	\N	\N	\N	\N	2025-12-08 18:01:32.23518
c3546332-ec89-43fd-b5ab-af0c8b45582a	tag_click	\N	tag-elektrik	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-09 23:14:10.673769
dad1dc0e-2319-4c3d-bd06-28f830105446	search	магазин	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-09 23:14:32.134688
87a965fc-48aa-41de-9e08-c6cccc6a44db	tag_click	\N	tag-konsierzh	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 20:11:53.714974
ecc08ebe-cc6c-47d7-8480-7d2e66939d2c	search	пенкен	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 20:18:42.356475
1ba358fe-c966-4132-8fe9-3655f16bc162	search	йцв	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 20:18:45.185028
ca9106b2-fabf-49f3-94af-a0358427cb1a	search	кон	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	8	\N	2025-12-10 20:18:47.746906
cc80ff38-a1ff-4d9f-a0b2-f2cef9c10219	entry_call	\N	\N	\N	506a6a03-4ca6-4be4-a796-107b37016c09	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 20:18:48.924598
8b68b713-8c98-444c-9bbc-02046bf34351	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 20:18:54.756774
38239c01-d6b5-4671-801b-3affce63bb0d	tag_click	\N	tag-konsierzh	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 20:25:33.691152
238df0b1-f19e-4ff6-bf76-a8bb807f5e34	tag_click	\N	tag-santehnik	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 20:26:51.513758
e5ddd1b1-4e46-4298-9a02-c00766b29fa8	tag_click	\N	tag-konsierzh	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 20:26:54.457545
f3c28e6b-d75f-4e59-bd5e-a33deb0751bb	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 20:27:16.567663
9550a88c-3334-4cc7-9713-9ebda49d3bf5	search	интернет	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	9	\N	2025-12-10 20:27:23.447172
81dfcec1-36b3-4e5e-bc55-a551f8a3800c	search	строение 1	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	4	\N	2025-12-10 20:32:22.967416
86c2bed5-c236-4d1d-93b8-43738658625c	search	интернет	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	9	\N	2025-12-10 20:37:26.278207
f377512c-5909-4986-ba5d-429a88bb251d	search	чат	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	10	\N	2025-12-10 20:37:34.116608
13a0a529-266f-4539-8bd0-3420b1441c2a	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:26.938882
0738479c-ccf9-40fb-9764-1f257a4a58b8	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:29.65269
0141b067-fbab-45a0-a8e5-843af7e718be	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:31.54042
8de14e73-c3b0-4851-a30a-5b63d79b400b	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:32.95107
31e5f9ed-3164-4b55-b3c5-a1baf1c4afc9	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:34.378902
f3b1607c-87e8-40c4-a150-694f7a93d773	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:36.141875
2fd548e0-bd17-40f4-bb89-5537d791229a	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:39.817583
aa369db2-9b0f-460a-a668-7612de921512	tag_click	\N	tag-chat	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:03:42.725888
5c09bd94-fdc4-42f1-bede-db5599324a22	search	домофон	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	5	\N	2025-12-10 21:03:51.682245
c9d59d43-c592-4c93-866d-2125cdc6dffd	search	диспетчер	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	3	\N	2025-12-10 21:03:57.272492
1cf46cb7-e3db-4856-bff9-409154e1544c	tag_click	\N	tag-dispetcher	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:09:55.137038
fa1dfead-8485-4823-ade0-2e479f54d53b	tag_click	\N	tag-konsierzh	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:10:00.483482
031ca182-0391-47f3-b4dd-cbdefb5ef5a5	tag_click	\N	tag-elektrik	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:11:04.215639
9bb0d2f9-78af-4f35-b807-4eae25eca084	tag_click	\N	tag-dispetcher	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:11:15.243715
7697a2c4-089a-4bb2-85c6-2340de40d557	search	дом	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 21:23:51.545368
bf9b7979-07bf-4a64-b828-71cd2f78b1a8	tag_click	\N	tag-konsierzh	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:11:43.771639
f958fbf2-da13-446b-8f41-915ec99b292d	search	ин	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 21:14:59.315714
0fbe01e1-b91c-4220-addc-dbd15e807d81	search	интернет	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	9	\N	2025-12-10 21:15:04.975033
56235913-76f6-4c11-9a70-e34108d233ea	search	орбита	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 21:23:44.832117
a60da487-24cc-4af1-9e51-8b204d512609	search	интер	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 21:15:00.561466
98730f61-d99a-4d30-9528-d9adfd427c04	search	интер	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 21:15:06.813552
4645fbd2-a2af-4a2d-940d-1983c5a6c871	tag_click	\N	tag-internet	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	\N	\N	2025-12-10 21:16:44.640782
7ffc7f3e-7f6a-4323-a4a3-18c7deb9004d	search	домру	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	0	\N	2025-12-10 21:23:52.38856
df97c929-a542-480d-ba20-8825651e1bce	search	интернет	\N	\N	\N	6030b9b3-3139-43a7-b4e4-c7ff77cc878e	9	\N	2025-12-10 21:24:06.556365
0c403fb9-9aac-4098-b742-344178072414	tag_click	\N	tag-dispetcher	\N	\N	\N	\N	\N	2025-12-10 21:37:17.852165
9a7e1637-9941-4501-bd81-747176dded8f	tag_click	\N	tag-domofon	\N	\N	\N	\N	\N	2025-12-10 21:37:22.013406
6efa90ac-3ac2-40ba-83b3-1826a6fe0993	tag_click	\N	tag-dispetcher	\N	\N	\N	\N	\N	2025-12-10 21:37:24.040078
932a2876-3096-452a-8e0b-bbe1d5ba5eb6	search	чат	\N	\N	\N	\N	10	\N	2025-12-10 21:37:49.823578
fc9e7803-e027-43f7-8ef4-a3f62d5d73e0	search	we	\N	\N	\N	\N	0	\N	2025-12-10 21:38:00.989752
70fdc3c4-ec02-440d-8ede-e3487c084f11	search	парко	\N	\N	\N	\N	0	\N	2025-12-10 21:38:47.207506
a7ae93f2-0f7c-419d-8ae9-3e6ab9fb8eca	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 21:53:40.765144
e92724d2-0ffb-456b-9a57-6fa836f54ec2	search	электрик	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	2	\N	2025-12-10 21:55:55.44269
d8419964-f354-4515-960b-08ce6af14408	tag_click	\N	tag-emergency	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 21:56:02.930048
649c947e-f4fe-4a99-8a50-174dd9af5e81	tag_click	\N	tag-emergency	\N	\N	\N	\N	\N	2025-12-10 21:37:25.310206
af5a7dba-9481-49c7-81cd-57a48aa028f1	search	сантехник	\N	\N	\N	\N	5	\N	2025-12-10 21:37:52.870439
bff3d293-2dfa-4f92-b852-663c121131a4	search	ук	\N	\N	\N	\N	9	\N	2025-12-10 21:38:04.27805
1e667d97-0fc9-428e-825a-064654e3b639	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 21:53:30.080066
5d3787df-bfe3-48f3-a063-5ff441c424a6	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 21:56:30.498022
f07d35ab-adb9-45c7-9a43-514b28dbef03	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 21:57:25.183776
5c891643-9018-4bd2-b2c3-5a42c4c06c72	search	чат	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-10 22:22:52.13058
fc92b10c-9719-4ecc-9c1e-3ba8609edcb4	search	telegram	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-10 22:22:58.873452
fec0d9cb-9f21-4200-95d0-3a658a916c65	search	ук	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	9	\N	2025-12-10 22:23:05.081264
cfb2bf79-060c-471a-881b-6b530928e3a8	tag_click	\N	tag-uk	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:23:11.89048
fc44ae47-000b-4274-abc3-c10590169df6	search	анже	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	1	\N	2025-12-10 22:23:29.457951
cc420f13-b1fd-4894-8418-763ee807d98d	search	анжела	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	1	\N	2025-12-10 22:23:31.512839
8d83ea0d-4a56-42c3-b343-ae741af910a7	search	саги	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	1	\N	2025-12-10 22:23:36.802216
94447e06-1a09-4772-8b4e-ebf0ec388182	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:23:40.99213
4c0a583e-443a-4397-bea0-44495b3bdff1	tag_click	\N	tag-utilities	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:23:53.454249
86fa3cdc-1cb8-4a3f-bb71-2dad13c46ba0	tag_click	\N	tag-utilities	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:24:23.872101
d6479c08-8036-4fd5-ab62-529dc7cbf97f	tag_click	\N	tag-elektrik	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:24:26.460646
e3bfe45e-175e-40d1-8a11-1246abe244e2	tag_click	\N	tag-elektrik	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:24:33.546391
e49f85be-7045-4b36-8e17-c09bd5623e0d	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:24:39.810306
08c3a169-6057-4991-ae62-e9d1b607b636	search	чат	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2025-12-10 22:24:43.851284
515e40e8-0624-4c0c-bc8b-9d9af8d11b62	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:25:51.541652
65b260b5-1fd7-4d3a-b0da-43024a68519a	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:25:55.667339
ef2c6164-4ce2-456e-8075-714971e0281d	search	кон	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-11 21:22:34.164312
0f48e5fc-a83b-4acb-a8c9-a81e6f754e27	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-11 21:22:35.315065
94cc8270-f13f-4c93-bbdc-9b01ed4d28d5	search	конс	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-11 21:22:38.247756
eae08a16-a915-4c6b-b47a-7ad57ce16d2d	search	стро	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-11 21:22:41.487901
bdbda9d2-3ed9-481a-b705-744843937805	search	строение	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-11 21:22:44.412877
e163b407-b573-485f-ba7c-8876ce09f743	search	строен	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-11 21:22:46.432676
a5eca416-2bc2-4948-88a4-45d44093c399	search	строе	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-11 21:22:47.966439
5d29f5ee-9117-407b-ab1e-be076799c239	search	стро	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-11 21:22:49.118628
c59fbd7e-66af-4c5d-9bda-18d976eb7152	search	строе	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-11 21:22:50.144642
3ed25d0f-657a-414d-8d9d-990584ffb451	search	стро	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-11 21:22:51.027043
c5f713d4-940b-4328-9341-16f89efa20cd	search	строй	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2025-12-11 21:22:53.291574
8868f3be-08ef-431d-88a0-ce874beab6e0	search	стро	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-11 21:22:54.818347
c8432571-0d3f-4a6c-b02e-d9b43fadbec2	search	электрик	\N	\N	\N	\N	2	\N	2025-12-11 23:14:50.993714
43b1cc22-e56e-4ac1-9764-5acfb39f6d1b	tag_click	\N	tag-emergency	\N	\N	\N	\N	\N	2025-12-11 23:14:56.278061
da4a0ab6-cabb-4f40-855f-a3842b1c8fa2	tag_click	\N	tag-konsierzh	\N	\N	\N	\N	\N	2025-12-11 23:18:34.085566
e92ffe2b-93a2-4806-961d-a5bad1dc799c	tag_click	\N	tag-dispetcher	\N	\N	\N	\N	\N	2025-12-11 23:18:38.750781
28c89af4-a183-43fa-9ceb-62d3aa879e9f	tag_click	\N	tag-elektrik	\N	\N	\N	\N	\N	2025-12-11 23:18:41.569595
dfa2b61c-1273-4809-8e4c-3c7a828e6a49	search	строение	\N	\N	\N	\N	22	\N	2025-12-11 23:18:45.827822
fd77c31b-5802-42c0-9879-632475b970e3	search	строение 1	\N	\N	\N	\N	4	\N	2025-12-11 23:18:47.436921
eed16027-3528-4ffd-b6f1-2650d1c79e31	tag_click	\N	tag-stroenie-1	\N	\N	\N	\N	\N	2025-12-11 23:18:50.021398
27dd6299-aced-4b83-88b4-44f10b16b41a	search	ук	\N	\N	\N	\N	9	\N	2025-12-11 23:18:59.259396
0caa42db-49f5-448c-a9f0-9b703f4d09aa	tag_click	\N	tag-uk	\N	\N	\N	\N	\N	2025-12-11 23:19:00.618029
c540ed5e-0455-4ceb-8fee-1e70f8079c62	tag_click	\N	tag-konsierzh	\N	\N	\N	\N	\N	2025-12-11 23:20:40.275316
329b5569-7d78-4a6f-b623-8c05f3e0dc8c	tag_click	\N	tag-konsierzh	\N	\N	\N	\N	\N	2025-12-11 23:20:44.601213
34b5b281-6c53-4862-aa53-8c715b8af805	tag_click	\N	tag-stroenie-1	\N	\N	\N	\N	\N	2025-12-11 23:20:45.290558
f5e4ea6d-792d-4b11-b674-574ea9340adf	tag_click	\N	tag-podezd-2	\N	\N	\N	\N	\N	2025-12-11 23:20:46.614317
3e38984e-6033-44a5-8b69-bade646235f5	search	строение 1 	\N	\N	\N	\N	4	\N	2025-12-11 23:20:52.467867
90000b83-984e-452c-9079-640721c7e5c2	search	строение 1 подъезд 1	\N	\N	\N	\N	1	\N	2025-12-11 23:20:55.893886
717831d4-2942-4d9b-81c3-df76f1e441e0	search	чат	\N	\N	\N	\N	10	\N	2025-12-11 23:20:59.66288
b8943d9d-c485-44f8-968c-7a7ddec11398	search	чат строение 1	\N	\N	\N	\N	1	\N	2025-12-11 23:21:03.388073
6d4e2a6c-d92c-472e-85ed-33446b445f14	search	чат строение 2	\N	\N	\N	\N	1	\N	2025-12-11 23:21:08.431923
d36f612d-e1db-4350-8936-6c126943b636	search	чат строение 4	\N	\N	\N	\N	1	\N	2025-12-11 23:21:09.986136
f3ba7233-e270-441f-a28c-6f42cc6642a9	search	чат строение 3	\N	\N	\N	\N	1	\N	2025-12-11 23:21:10.924129
b56b7690-e112-4011-81e2-98aa298d9054	search	интернет	\N	\N	\N	\N	8	\N	2025-12-11 23:21:14.510999
7fd1efb0-f0a3-4d8f-b1be-0556571448f2	search	ук	\N	\N	\N	\N	9	\N	2025-12-11 23:21:18.948255
7b21e862-4f1a-49ec-9751-6cc6f13f5a36	search	электрик	\N	\N	\N	\N	2	\N	2025-12-11 23:21:25.339587
d655422c-799f-4fe1-b9c8-892ae4da5377	search	сантех	\N	\N	\N	\N	5	\N	2025-12-11 23:21:29.569051
9c1711c7-03b8-4bf5-a49b-31e81a0196aa	tag_click	\N	tag-emergency	\N	\N	\N	\N	\N	2025-12-11 23:21:33.576647
847661bc-0e6d-4315-a4b5-822887c1db98	search	ук	\N	\N	\N	\N	9	\N	2025-12-11 23:23:01.984237
d7fa27cb-a92e-4f9a-8d9a-f6ba74f8532e	tag_click	\N	tag-uk	\N	\N	\N	\N	\N	2025-12-11 23:23:03.70011
4a7fada7-1bc4-4d77-a2f0-089d83ba18b1	tag_click	\N	tag-elektrik	\N	\N	\N	\N	\N	2025-12-11 23:23:09.006991
2de8e5a7-909b-4b5f-b393-4407310a26ee	search	чя	\N	\N	\N	\N	0	\N	2025-12-11 23:23:16.186803
c2b4dd18-d268-49bb-bb62-58ae1ca040d3	tag_click	\N	tag-stroenie-3	\N	\N	\N	\N	\N	2025-12-11 23:23:25.65386
3d92c397-58fa-455d-a739-bc7ca9c89064	tag_click	\N	tag-podezd-2	\N	\N	\N	\N	\N	2025-12-11 23:23:41.05658
413ccd4a-79e1-4d80-9d40-442b2145fd44	search	ук	\N	\N	\N	\N	9	\N	2025-12-11 23:53:01.041367
896c2e1b-4cd8-4dab-884c-54a97d1cf70e	search	чат строение 1	\N	\N	\N	\N	1	\N	2025-12-11 23:23:21.921574
086425d9-3c72-42f4-bc79-5417137a2bbe	search	строение 2	\N	\N	\N	\N	4	\N	2025-12-11 23:23:33.003723
eabc0c13-c6d9-4dd0-a88e-c226cefb1e38	tag_click	\N	tag-konsierzh	\N	\N	\N	\N	\N	2025-12-11 23:23:37.484314
821c6585-b012-4ae6-869f-9ea4eecdefb6	search	чат строение 3	\N	\N	\N	\N	1	\N	2025-12-11 23:23:24.803656
a3f33dd0-f008-45a1-869f-99da884c933c	tag_click	\N	tag-konsierzh	\N	\N	\N	\N	\N	2025-12-11 23:23:35.532985
38780b36-3114-4250-9319-b3e2c22de0a0	search	паркинг	\N	\N	\N	\N	0	\N	2025-12-13 16:22:37.630622
9c5cd705-3851-4fb9-878e-ab80af7e5273	tag_click	\N	tag-elektrik	\N	\N	\N	\N	\N	2025-12-13 16:22:42.358092
dff35cb1-aaa6-4fdf-aac1-de437a262d2d	tag_click	\N	tag-elektrik	\N	\N	\N	\N	\N	2025-12-13 16:22:45.571772
34254bda-9e67-4851-8426-48faf1698ab4	search	консьерж	\N	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	8	\N	2025-12-14 06:18:15.100582
8fbe316d-274d-400e-8fcc-8f3877f0693b	tag_click	\N	tag-konsierzh	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 07:21:42.152228
06811403-62bf-4962-963c-3a01abd3e27d	tag_click	\N	tag-stroenie-1	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 07:21:44.480038
812812e0-4282-484d-a30a-3c6892047fcc	search	лифт	\N	\N	\N	efb36e89-5a3a-427c-9046-67007a4bd461	1	\N	2025-12-14 09:34:17.452506
41305c31-5634-4601-b67d-06033c4d56cc	search	домо	\N	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	5	\N	2025-12-14 15:12:45.10704
78e2a44c-c9f6-4b1c-93b1-499db87f5883	tag_click	\N	tag-domofon	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 15:13:38.965797
e4ab054c-3b1e-4c7e-bc48-a55ebf242909	tag_click	\N	tag-domofon	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 15:13:50.845981
0fa3941c-3582-4faf-a852-bdf44d378c19	search	домо	\N	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	5	\N	2025-12-14 15:19:30.242094
d7ee09e6-57c3-4ae7-81cc-362cca19715d	tag_click	\N	tag-domofon	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 15:19:32.313701
023b2ef6-d652-4f7d-adb3-84f3bbddef35	search	кон	\N	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	8	\N	2025-12-14 15:43:56.578404
b2853b5b-c49e-43a2-b390-7893056aa779	tag_click	\N	tag-konsierzh	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 15:43:59.36273
e6a9398e-5ba2-48e7-80ad-61eda42129b2	tag_click	\N	tag-stroenie-1	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 15:44:01.414552
e2f0c7d2-549e-445f-b37e-e198afe709e4	search	чат стро	\N	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	0	\N	2025-12-14 15:44:05.629455
173a55ea-2ea5-48ba-972f-4651f2846fc6	search	чат строение 1	\N	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	1	\N	2025-12-14 15:44:08.594191
7fc9f535-40b1-439a-9840-bf3d3c865467	tag_click	\N	tag-chat	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 15:44:14.11686
d3898b0b-48c1-401a-a6c1-f2eb8a76f1cd	tag_click	\N	tag-elektrik	\N	\N	83cc117f-967b-441a-b5a9-506f5a12044d	\N	\N	2025-12-14 15:44:15.958854
1855ddbe-d464-47c7-b6d5-28dbd803b94f	search	цв	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-15 07:55:17.175579
82c4dc38-7535-464b-a46b-49e73e47d82c	search	фы	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	1	\N	2025-12-15 07:55:20.501555
8cabe60e-b070-4d33-9b23-cc1199ab2ca5	search	ст	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2025-12-15 07:55:35.745716
d59afb1f-052e-4482-a7de-131be8a18ad6	search	строение	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-15 07:55:39.476435
4a41ce83-b4da-4159-a738-e854d29437a3	tag_click	\N	tag-konsierzh	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-28 21:10:24.907757
4657ea84-f6cc-4ae4-886e-e470478e56f2	search	строение	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-28 21:10:59.442124
c60ef523-724e-43cd-8561-9b13208aaf6d	tag_click	\N	tag-chat	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-28 21:40:45.637002
f93ac43c-0ff7-4291-951e-b56036991f94	search	строение	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	22	\N	2025-12-28 21:40:53.310822
6ece3f6e-9cd0-4bd6-989a-3137d2741389	search	строение 1	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	4	\N	2025-12-28 21:40:54.964753
470b8dad-0cd5-435b-98cb-e494dd3bf660	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2026-01-01 20:44:35.348862
35bfb657-7cfe-4ae5-8981-be006c6faeb0	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2026-01-01 20:49:31.971171
4b905b99-94ee-4a3b-8ec6-763d92aa31c1	tag_click	\N	tag-dispetcher	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2026-01-01 20:49:38.108216
e8581086-7bf3-46db-97e5-86f6954fc788	search	теое	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2026-01-01 20:53:53.63884
3acbe52f-53ac-48d5-8f9d-d21ef23304b7	search	теле	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	10	\N	2026-01-01 20:53:55.544622
1b959056-d0a6-4228-922f-82e8fdc2c157	entry_link	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2026-01-01 20:54:06.504082
5394205d-c9e5-4841-9d13-fe450d35f24f	search	интернет	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2026-01-01 21:35:03.375629
2099700d-b098-46c8-92bc-84d4ae6ba4aa	search	интк	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2026-01-01 21:37:59.15368
751692bb-b5bd-461d-9343-cf7d4e02d221	search	инт	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	0	\N	2026-01-01 21:37:59.822672
fead8799-039f-4625-afcf-067faa5c4d77	tag_click	\N	tag-internet	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2026-01-01 21:38:00.728368
69d0cef0-40c1-4a9e-8032-0c4a98458ef5	search	консьерж	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	8	\N	2026-01-01 21:38:48.347374
8a3459b9-6d1b-4721-86c8-4b7ef42d372c	search	сантехник	\N	\N	\N	\N	5	\N	2026-01-03 10:11:20.296371
0ca4bd46-e191-4d98-84bf-6ee4283f855f	tag_click	\N	tag-santehnik	\N	\N	\N	\N	\N	2026-01-03 10:11:22.158517
1c51fb46-4945-4837-ac17-0ed780bc3d3f	search	уборка	\N	\N	\N	\N	0	\N	2026-01-03 10:11:59.387597
a825b625-4bea-4546-a727-b750c1f0fe60	search	консьерж	\N	\N	\N	\N	8	\N	2026-01-03 10:12:02.977571
7e408990-2cff-4590-850a-b76cfc178809	tag_click	\N	tag-dispetcher	\N	\N	\N	\N	\N	2026-01-10 13:40:52.24521
f766cafb-db06-48cc-b971-4c19edbe9e15	tag_click	\N	tag-konsierzh	\N	\N	\N	\N	\N	2026-01-10 13:40:57.356001
5be0faec-3a7a-414a-9201-d0cfc1ceaeab	tag_click	\N	tag-konsierzh	\N	\N	\N	\N	\N	2026-01-10 13:42:19.893055
f79ee2cc-52ec-4759-a6fc-5a9da682ad95	tag_click	\N	tag-santehnik	\N	\N	\N	\N	\N	2026-01-10 13:42:24.179378
04d09fa5-deed-438a-90d9-ddf6e3c3780c	entry_link	\N	\N	\N	3cf8d0b8-c985-4e33-8c5a-e1d19614c138	\N	\N	\N	2026-01-10 13:42:49.504943
4275d264-8f37-44e0-930f-5fa99fdf5feb	tag_click	\N	tag-chat	\N	\N	\N	\N	\N	2026-01-10 13:44:17.353163
73b828b0-9301-4921-8681-a787d6c77740	tag_click	\N	tag-dispetcher	\N	\N	\N	\N	\N	2026-01-10 13:47:30.754509
f47286e5-eed2-4c72-ab74-69a18ef76524	search	xfn	\N	\N	\N	\N	0	\N	2026-01-10 14:13:18.793218
380e3a19-9eb9-4b2e-8b76-c18a6b49e7fb	search	чат	\N	\N	\N	\N	10	\N	2026-01-10 14:13:20.658147
192dda60-b9ca-4da9-8d0b-777bd5c2e324	tag_click	\N	tag-elektrik	\N	\N	\N	\N	\N	2026-01-10 14:14:39.99647
14d0250b-81e4-450f-8867-bd9298f33c9d	tag_click	\N	tag-dispetcher	\N	\N	\N	\N	\N	2026-01-10 14:14:43.84245
8a7deb0e-2e85-42b7-aa31-01f0ee4ddb75	tag_click	\N	tag-chat	\N	\N	e87ff359-87d0-4fa2-85c2-68209a4cf6e5	\N	\N	2026-01-11 00:21:51.920386
41fd37d5-0d5c-43ea-9ba8-8c978c8556da	tag_click	\N	tag-elektrik	\N	\N	e87ff359-87d0-4fa2-85c2-68209a4cf6e5	\N	\N	2026-01-11 00:22:21.79763
706810fa-ac14-4718-847c-8f970451f294	tag_click	\N	tag-elektrik	\N	\N	e87ff359-87d0-4fa2-85c2-68209a4cf6e5	\N	\N	2026-01-11 00:22:25.261854
2b4f9789-e0da-405b-86af-56186c7d70a2	search	домо	\N	\N	\N	e87ff359-87d0-4fa2-85c2-68209a4cf6e5	5	\N	2026-01-11 00:22:44.305536
812fbcca-91d6-435f-bbcc-625715cd61e3	entry_call	\N	\N	\N	\N	\N	\N	\N	2025-12-11 23:53:05.4021
c708a140-c9b3-494b-bca2-c688ad42d3ec	tag_click	\N	tag-elektrik	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	\N	\N	2026-01-11 13:30:11.770543
ff7d4a20-57bc-4a69-8eba-56d844b1d2ae	search	лифт	\N	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	1	\N	2026-01-11 13:31:39.978383
1a8cd9c0-f8ac-4fb4-a73d-48a7058c1c6c	entry_call	\N	\N	\N	6f4a3610-10bd-48e0-9862-456ff2804c91	c8071a46-c3b5-408d-8607-e3f0fca56936	\N	\N	2026-01-11 13:31:40.585352
d9cb0c7d-de84-45a4-8968-b9a18b183ab1	tag_click	\N	tag-lift	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	\N	\N	2026-01-11 13:31:43.680389
b0e7eda3-5260-4f8b-b4c1-e737993e21f0	tag_click	\N	tag-dispetcher	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	\N	\N	2026-01-11 14:12:40.183591
f086e7bc-b85d-4e0b-adce-e1a7b2d00d08	search	чат	\N	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	10	\N	2026-01-11 14:14:55.662915
f51e2b58-4d94-4164-980b-51228ebddf38	tag_click	\N	tag-chat	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	\N	\N	2026-01-11 14:15:11.025103
3254c07e-64cd-4380-85e7-210c94700791	entry_call	\N	\N	\N	\N	e435b74c-f942-40f3-9e9e-45cc95e8c2a0	\N	\N	2025-12-10 22:23:13.549867
4b574d8a-40d7-4c96-a43d-e1fd5b2a779d	entry_link	\N	\N	\N	\N	\N	\N	\N	2025-12-11 23:19:18.767503
5f766e94-144b-426d-ba07-1e19d83721c9	search	консьерж	\N	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	8	\N	2026-01-11 15:42:44.790612
a8baf2b8-d987-4e15-8cb8-75a87f7e7505	tag_click	\N	tag-konsierzh	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	\N	\N	2026-01-11 15:59:21.001967
\.


--
-- Data for Name: directory_contact; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_contact (id, entry_id, type, value, label, is_primary, "order", subtitle, has_whatsapp, has_telegram, is_24h, schedule_note) FROM stdin;
35cc1dce-e36c-4bd7-8522-7def54cb754e	c11cd719-81bb-4e67-90ab-5371a392035f	website	https://dealers.dom.ru/request/widget?domain=rostov&referral_id=1000181217	Заявка на подключение	1	0	Онлайн-заявка	0	0	0	\N
29139072-baf4-4755-a59c-bf57bc0a27c2	c11cd719-81bb-4e67-90ab-5371a392035f	website	https://rostov.dom.ru/	Официальный сайт	0	1	\N	0	0	0	\N
5c0ec0e3-0fcf-4437-b69e-c2244d25fa0e	c11cd719-81bb-4e67-90ab-5371a392035f	phone	+7 (863) 307-50-01	Техническая поддержка	0	2	\N	0	0	0	\N
914cfb90-c397-4c82-a7be-bcc8033c0fbb	82871599-2bf6-4112-823b-2255f04fc52e	phone	+7 (938) 175-44-81	Гарантийный отдел	0	0	Елена Юкина	0	0	0	\N
fd0ca908-9c26-40b3-b67d-5c4b70749c0b	82871599-2bf6-4112-823b-2255f04fc52e	phone	+7 (928) 152-12-12	Дежурный прораб	0	1	Игорь Стрекалов	0	0	0	\N
258eaaac-e4a5-4aa1-9ee4-24ada889d83a	82871599-2bf6-4112-823b-2255f04fc52e	address	г. Ростов-на-Дону, пер. Доломановский, 70д, этаж 5	\N	0	2	\N	0	0	0	\N
4fd88ac5-2549-46ec-bb1c-167efc850a62	82871599-2bf6-4112-823b-2255f04fc52e	website	https://msk-development.ru/projects/flats/serdce-rostova2	Страница проекта Сердце Ростова 2	0	3	Официальный сайт застройщика	0	0	0	\N
7d5f0e5e-1122-4290-bb27-cc1f29edc95b	82871599-2bf6-4112-823b-2255f04fc52e	website	https://forms.gle/umA7WHfsSs1HD6CV6	Заявка на гарантийные работы	0	4	\N	0	0	0	\N
35fd8206-65fa-45e9-acf7-2aa75e7ef3f2	82871599-2bf6-4112-823b-2255f04fc52e	whatsapp	https://wa.me/+79188500955	Официальный WhatsApp чат	0	5	\N	0	0	0	\N
24f90cf9-cec9-4f86-887c-25bcb74ac0a7	82871599-2bf6-4112-823b-2255f04fc52e	telegram	https://t.me/msk_development	Официальный Telegram канал	0	6	\N	0	0	0	\N
7b453c47-196c-4f7f-a2a8-464b64d4dd0d	82871599-2bf6-4112-823b-2255f04fc52e	phone	+7 800 777-75-77	Горячая линия	1	7	\N	0	0	0	\N
78045953-4310-4948-92fb-548c91054c76	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	phone	+7 (906) 453-40-97	Начальник участка	0	0	Соболев Александр Сергеевич	0	0	0	\N
e72ae8e7-a7ac-40bf-9ff5-a1dc12577a6f	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	phone	+7 (905) 478-77-83	Мастер участка	0	1	Алина Гамзатхановна Гаджиева	0	0	0	\N
529d063c-e2cc-45d2-9cb4-81f95aa49c5b	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	phone	+7 (905) 429-09-92	Технический директор	0	2	Андрей Вадимович	0	0	0	\N
2576f0e5-48ef-4644-92af-e64befbf9700	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	phone	+7 (960) 461-44-60	Директор по работе с населением	0	3	Сергей Григорьевич Сагиров	0	0	0	\N
a523efa5-1ec5-422e-992e-e19e736b63cb	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	phone	+7 (960) 448-58-08	Директор	0	4	Анжела Анатольевна Башкирова	0	0	0	\N
41b9429c-a2c4-41c4-8b15-4d2da05d1532	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	phone	+7 (903) 403-09-30	Расчетный отдел	0	5	Бухгалтерия	0	0	0	\N
eb2d3a66-bf5f-4973-ac85-3b24173459d0	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	address	г. Ростов-на-Дону, пр. Михаила Нагибина, 33а/47, этаж 3, офис 306	\N	0	6	\N	0	0	0	\N
3ab71334-6d41-4037-b349-0318ac954e90	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	website	https://uk-sr.ru/	Официальный сайт	0	7	\N	0	0	0	\N
c25155cc-ffd8-4565-88fb-b20644a3f858	3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	phone	+7 (960) 448-08-18	Диспетчерcкая УК	1	8	\N	0	0	0	\N
d0a22705-7f2e-4637-851c-c21a58bed6c7	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (960) 448-00-98	Аварийно-диспетчерская служба	1	0	\N	0	0	1	\N
dc6a900a-1579-41c7-ad05-9d5dbf669d6c	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (961) 435-56-59	Электрик	0	1	Андрей Сергеевич	0	0	1	\N
9d5d505f-6e84-44b6-9b92-d719dac37dd1	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (908) 194-24-08	Электрик	0	2	Тагир	0	0	1	\N
9525f470-5ff6-4489-9993-a179d770a03d	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (938) 155-22-37	Сантехник	0	3	Андрей Юрьевич	0	0	1	\N
3e63c0ef-1715-4399-acd7-4ce4edf50cc5	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (961) 402-84-63	Сантехник	0	4	Михаил Евгеньевич	0	0	1	\N
cb31c86d-0a37-4d97-8b26-55666823b358	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (952) 415-21-95	Сантехник	0	5	Михаил	0	0	1	\N
7d05746e-4296-482d-b9d2-ec37bd555276	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (908) 506-57-16	Сантехник	0	6	Анатолий	0	0	1	\N
a9a44ff6-3faa-4074-835e-9742af811ea5	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (989) 518-97-37	Тепловой пункт	0	7	ИП Малов С.А.	0	0	1	\N
9134e83f-b3e1-4a68-a79d-46c7f273260a	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (928) 152-12-12	Застройщик - ООО МСК-СТРОЙ	0	8	Прораб Стрекалов Игорь	0	0	0	\N
07774c20-7c89-4995-bb4e-b04e8d85c33f	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (863) 297-56-01	Ворота	0	9	ООО ГостСервис	0	0	0	\N
7e036b58-4cac-430d-85d6-e7cc90821423	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (928) 296-31-49	Домофон	0	10	ООО ПрофДелоДон	0	0	0	\N
6f4a3610-10bd-48e0-9862-456ff2804c91	fa31a453-c6f8-4c24-8e70-86a6c159c57a	phone	+7 (928) 296-31-49	Лифтовая диспетчерская	0	11	ООО ЮгЛифтСервис	0	0	1	\N
4a45d21f-f34c-4799-b61a-88b9711becb2	fa31a453-c6f8-4c24-8e70-86a6c159c57a	telegram	http://go.sr2.today/telegram	Telegram - Общий чат	0	12	\N	0	0	0	\N
96255865-825f-40fc-bc32-954d57c784d5	fa31a453-c6f8-4c24-8e70-86a6c159c57a	address	г. Ростов-на-Дону, ул. Ларина, 45	\N	0	13	\N	0	0	0	\N
0f41ad9c-20ce-4962-9660-251fb623e118	94aabb5c-9443-4f71-9800-a12978c52876	phone	+7 (960) 461-44-24	Консьерж - подъезд 1	0	0	\N	0	0	0	\N
929bea4f-3fbc-47aa-94e0-8eafbb142d8e	94aabb5c-9443-4f71-9800-a12978c52876	phone	+7 (960) 461-44-25	Консьерж - подъезд 2	0	1	\N	0	0	0	\N
e33a634e-c810-489c-9cc6-ba913a034136	94aabb5c-9443-4f71-9800-a12978c52876	telegram	https://t.me/sr2_s1	Telegram - Строение 1	0	2	\N	0	0	0	\N
0c11c98b-7143-4692-896c-ab5f19c5b305	94aabb5c-9443-4f71-9800-a12978c52876	address	г. Ростов-на-Дону, ул. Ларина, д.45, строение 1	\N	0	3	\N	0	0	0	\N
45bef24b-8d2b-409f-8247-2fb42ef55ef6	e34ba12d-963f-4f89-9157-96f275f0df8f	phone	+7 (960) 461-44-21	Консьерж - подъезд 1	0	0	\N	0	0	0	\N
c6aeeee6-2865-4386-8124-99f26407ab4c	e34ba12d-963f-4f89-9157-96f275f0df8f	phone	+7 (960) 461-44-32	Консьерж - подъезд 2	0	1	\N	0	0	0	\N
de02a654-73c1-4a2d-b727-73d1a41008fe	e34ba12d-963f-4f89-9157-96f275f0df8f	telegram	https://t.me/sr2_s2	Telegram - Строение 2	0	2	\N	0	0	0	\N
068aeadc-5a69-4590-a738-713810970519	e34ba12d-963f-4f89-9157-96f275f0df8f	address	г. Ростов-на-Дону, ул. Ларина, д.45, строение 2	\N	0	3	\N	0	0	0	\N
9b7badee-1e2c-4cf7-b75b-b88a61604004	67a4b03f-492b-4aea-908d-80a40afb2723	telegram	https://t.me/sr2_s3	Telegram - Строение 3	0	0	\N	0	0	0	\N
64708093-054e-4584-a195-af0b1ed52f63	67a4b03f-492b-4aea-908d-80a40afb2723	address	г. Ростов-на-Дону, ул. Ларина, д.45, строение 3	\N	0	1	\N	0	0	0	\N
3cf8d0b8-c985-4e33-8c5a-e1d19614c138	a950b38b-130f-457d-83c2-66174d36d9b8	telegram	https://t.me/sr2_s4	Telegram - Строение 4	0	0	\N	0	0	0	\N
55b2d6cb-0b58-42ae-9cc1-9085669ce9fb	a950b38b-130f-457d-83c2-66174d36d9b8	address	г. Ростов-на-Дону, ул. Ларина, д.45, строение 4	\N	0	1	\N	0	0	0	\N
33927a1e-8392-4a1d-818c-3c5008b551c6	36bc8066-55ce-47b6-a995-5ab276c2570a	telegram	https://t.me/sr2_s5	Telegram - Строение 5	0	0	\N	0	0	0	\N
3d4fb2d2-01f3-4377-9a72-54ce519ceee1	36bc8066-55ce-47b6-a995-5ab276c2570a	address	г. Ростов-на-Дону, ул. Ларина, д.45, строение 5	\N	0	1	\N	0	0	0	\N
342a4f7d-04d1-43d6-ae9f-230434cf695d	2382127a-bbed-400e-91f2-5702bdc4b744	phone	+7 (906) 425-93-86	Консьерж - подъезд 1	0	0	\N	0	0	0	\N
f14eaa82-cb61-4ae6-9bbb-f1e590540d38	2382127a-bbed-400e-91f2-5702bdc4b744	phone	+7 (906) 425-94-39	Консьерж - подъезд 2	0	1	\N	0	0	0	\N
74878025-f27e-4acc-b061-aa3a1c4f1395	2382127a-bbed-400e-91f2-5702bdc4b744	telegram	https://t.me/sr2_s6	Telegram - Строение 6	0	2	\N	0	0	0	\N
9a2b39c2-30cd-4bb4-8278-4a56a717860c	2382127a-bbed-400e-91f2-5702bdc4b744	address	г. Ростов-на-Дону, ул. Ларина, д.45, строение 6	\N	0	3	\N	0	0	0	\N
506a6a03-4ca6-4be4-a796-107b37016c09	3c972fbf-8cc4-48c3-aded-f82a1ec3beb5	phone	+7 (905) 478-78-21	Консьерж - подъезд 1	0	0	\N	0	0	0	\N
12798073-aa23-4933-bcb9-057ab2eca6dc	3c972fbf-8cc4-48c3-aded-f82a1ec3beb5	phone	+7 (905) 478-78-27	Консьерж - подъезд 2	0	1	\N	0	0	0	\N
4c904800-2046-43ad-a59f-c71124d7c116	3c972fbf-8cc4-48c3-aded-f82a1ec3beb5	telegram	https://t.me/sr2_s7	Telegram - Строение 7	0	2	\N	0	0	0	\N
b84f3ff3-72ee-415d-8055-468d262bd941	3c972fbf-8cc4-48c3-aded-f82a1ec3beb5	address	г. Ростов-на-Дону, ул. Ларина, д.45, строение 7	\N	0	3	\N	0	0	0	\N
b4fbbb13-48ad-4193-9cfe-444614bd74a6	3b24e640-0fe8-4d4c-bf32-6300b535cb48	website	https://xn--80aaaf3bi1ahsd.xn--80asehdb/	Квартплата.Онлайн	0	0	Регистрации показаний и оплата	0	0	0	\N
cd498232-dfef-435f-ab56-e22a6258ee2e	3b24e640-0fe8-4d4c-bf32-6300b535cb48	website	https://play.google.com/store/apps/details?id=ru.sigma.gisgkh	Госуслуги.Дом - Android	0	1	\N	0	0	0	\N
4ca4350f-e0a7-40e3-9ad1-02ce7fcd7be7	3b24e640-0fe8-4d4c-bf32-6300b535cb48	website	https://apps.apple.com/ru/app/%D0%B3%D0%BE%D1%81%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8-%D0%B4%D0%BE%D0%BC/id1616550510	Госуслуги.Дом - iOS	0	2	\N	0	0	0	\N
29212417-464b-4c3f-90f9-189838dca465	21e42833-9b9c-43ff-83e4-abe86cc5725b	phone	+7 (863) 310-02-26	Диспетчерская	1	0	\N	0	0	0	\N
1aec092f-e472-4233-8d94-9eee4f02127b	21e42833-9b9c-43ff-83e4-abe86cc5725b	whatsapp	https://wa.me/+79963530117?text=инструкция	WhatsApp робот	0	1	Регистрация, инструкция	0	0	0	\N
1fe0ea22-ab72-44c1-8c3f-cbbe113a64b0	21e42833-9b9c-43ff-83e4-abe86cc5725b	website	https://play.google.com/store/apps/details?id=ru.mts.vdome.resident	Приложение для Android	0	2	\N	0	0	0	\N
13228b8e-8fa5-41cc-9270-c1addc32904e	21e42833-9b9c-43ff-83e4-abe86cc5725b	website	https://apps.apple.com/ru/app/vdome/id1491163759	Приложение для iOS	0	3	\N	0	0	0	\N
e883f5f7-1638-4ea2-b057-196447dd5bb4	56823b58-2e4d-40d9-8731-39e283a8a661	phone	+7 (863) 309-09-09	Передача показаний счетчиков	1	0	\N	0	0	0	\N
46a3b26e-05bf-44ac-a83d-fdbf6471d3c2	56823b58-2e4d-40d9-8731-39e283a8a661	website	https://lkfl.vodokanalrnd.ru/	Личный кабинет	0	1	\N	0	0	0	\N
ff99f119-a7cc-4715-9058-1e3e959cfbac	c2664314-22ed-40a9-99aa-d5987fb6f8af	website	https://lk.rostov.tns-e.ru/	Личный кабинет	1	0	\N	0	0	0	\N
9e51d072-283d-43aa-b680-51999e884566	c9eed834-3e65-47bd-ad6a-f7afb6eda238	phone	8-800-707-05-08	Горячая линия	1	0	\N	0	0	0	\N
376f7411-1769-4baf-b8b3-818bebbb64a9	c9eed834-3e65-47bd-ad6a-f7afb6eda238	address	просп. Михаила Нагибина, д.27	\N	0	1	\N	0	0	0	\N
57c589af-23d9-439a-adad-ef57b8a7d973	c9eed834-3e65-47bd-ad6a-f7afb6eda238	website	https://rostov.clean-rf.ru/	Официальный сайт	0	2	\N	0	0	0	\N
25706dfc-09e4-4f1c-a8ca-c38a8dbfac1c	1eee5f1c-e900-4853-a121-45b288ac0889	phone	+7 (928) 110-06-86	Аварийная служба	1	0	\N	0	0	1	\N
93a9c912-f3a1-4f6a-a229-c5bec8a41a64	1eee5f1c-e900-4853-a121-45b288ac0889	website	https://ts-ug.ru/	Официальный сайт	0	1	\N	0	0	0	\N
c3205295-3702-4851-b35e-cf122c49a96c	1eee5f1c-e900-4853-a121-45b288ac0889	whatsapp	https://wa.me/+79381009510	WhatsApp, подать показания	0	2	\N	0	0	0	\N
e055a0ff-60eb-41f8-94e3-c76613a1fec4	39b82e93-37e0-4dfa-af11-6faf358d0021	phone	8 (800) 700 8000	Горячая линия	1	0	\N	0	0	0	\N
9a0e5040-a21c-4791-aab8-08b1a4d3883e	39b82e93-37e0-4dfa-af11-6faf358d0021	website	https://forms.gle/oQhTbvd7WKMaKVub6	Заявка на подключение онлайн	0	1	\N	0	0	0	\N
66711be9-849f-4be2-91b3-1c67e8da020d	39b82e93-37e0-4dfa-af11-6faf358d0021	website	https://rostov-na-donu.beeline.ru/customers/products/home/internet/	Официальный сайт	0	2	\N	0	0	0	\N
17152725-33c7-4406-bef8-4df61516e3fc	9c7eba5e-fba7-44fb-be06-a0fe16ea0023	phone	+7 (863) 318-0-318	Техническая поддержка	1	0	\N	0	0	0	\N
2dd7c1a6-02ca-4563-ae41-043d0ea7d5b5	9c7eba5e-fba7-44fb-be06-a0fe16ea0023	website	https://orbitanov.ru/rostov/	Тарифы, подключение	0	1	\N	0	0	0	\N
bfd11718-5260-4487-82ca-8bb4cda6ef07	10c704c2-8472-454c-a6f7-3f1dba075cff	phone	+7 (961) 277-66-07	Неотложная помощь	1	0	\N	0	0	1	\N
41c6501b-6f93-424f-8808-37d1514ae716	10c704c2-8472-454c-a6f7-3f1dba075cff	phone	+7 (938) 181-76-06	Колл-центр	0	1	\N	0	0	0	\N
84fbcd06-0a53-4170-9712-201b69e26613	10c704c2-8472-454c-a6f7-3f1dba075cff	phone	+7 (863) 243-64-11	Регистратура	0	2	Взрослая поликлиника	0	0	0	\N
7c3f6946-45e4-4bf2-b576-5961ba9bbb39	10c704c2-8472-454c-a6f7-3f1dba075cff	phone	+7 (863) 243-65-77	Терапевтическое отделение №2	0	3	\N	0	0	0	\N
c47b91f3-51fc-473d-8dcc-e82a6a968e80	10c704c2-8472-454c-a6f7-3f1dba075cff	phone	+7 (928) 212-09-52	Женская консультация	0	4	\N	0	0	0	\N
66651122-1968-4958-92a3-35dac94cdb68	10c704c2-8472-454c-a6f7-3f1dba075cff	phone	+7 (863) 243-68-66	Регистратура	0	5	Детская поликлиника	0	0	0	\N
0093806c-3065-4867-be42-47b05538c0da	10c704c2-8472-454c-a6f7-3f1dba075cff	phone	+7 (906) 429-28-33	Педиатрическое отделение №2	0	6	\N	0	0	0	\N
c37c2a1f-515d-4110-8028-c5957381f7eb	10c704c2-8472-454c-a6f7-3f1dba075cff	address	Оренбургский переулок, 22/1	\N	0	7	\N	0	0	0	\N
530c9ffc-7f64-490e-9031-fd711971d155	10c704c2-8472-454c-a6f7-3f1dba075cff	website	https://www.policlinic5.ru	Официальный сайт	0	8	\N	0	0	0	\N
dca5cfae-d90b-496d-a9f4-93ae59c39fb9	416edd74-9b96-406d-bb76-b981a36161a2	phone	+7 (999) 471-07-53	Участковый	0	0	Возняк Александр Сергеевич	0	0	0	\N
3c3ef7cc-39d8-471e-8130-e26b70f99603	416edd74-9b96-406d-bb76-b981a36161a2	phone	+7 (863) 277-77-07	Дежурная часть ГАИ	0	1	\N	0	0	1	\N
131618a9-4740-40a5-aab5-2e8c10aebae7	416edd74-9b96-406d-bb76-b981a36161a2	phone	+7 (863) 249-42-77	Диспетчер ГАИ	0	2	\N	0	0	1	\N
\.


--
-- Data for Name: directory_contact_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_contact_tag (contact_id, tag_id) FROM stdin;
258eaaac-e4a5-4aa1-9ee4-24ada889d83a	tag-address
35fd8206-65fa-45e9-acf7-2aa75e7ef3f2	tag-chat
24f90cf9-cec9-4f86-887c-25bcb74ac0a7	tag-chat
eb2d3a66-bf5f-4973-ac85-3b24173459d0	tag-address
c25155cc-ffd8-4565-88fb-b20644a3f858	tag-dispetcher
d0a22705-7f2e-4637-851c-c21a58bed6c7	tag-dispetcher
dc6a900a-1579-41c7-ad05-9d5dbf669d6c	tag-elektrik
9d5d505f-6e84-44b6-9b92-d719dac37dd1	tag-elektrik
9525f470-5ff6-4489-9993-a179d770a03d	tag-santehnik
3e63c0ef-1715-4399-acd7-4ce4edf50cc5	tag-santehnik
cb31c86d-0a37-4d97-8b26-55666823b358	tag-santehnik
7d05746e-4296-482d-b9d2-ec37bd555276	tag-santehnik
a9a44ff6-3faa-4074-835e-9742af811ea5	tag-santehnik
07774c20-7c89-4995-bb4e-b04e8d85c33f	tag-vorota
7e036b58-4cac-430d-85d6-e7cc90821423	tag-domofon
6f4a3610-10bd-48e0-9862-456ff2804c91	tag-lift
4a45d21f-f34c-4799-b61a-88b9711becb2	tag-chat
96255865-825f-40fc-bc32-954d57c784d5	tag-address
0f41ad9c-20ce-4962-9660-251fb623e118	tag-konsierzh
0f41ad9c-20ce-4962-9660-251fb623e118	tag-stroenie-1
0f41ad9c-20ce-4962-9660-251fb623e118	tag-podezd-1
929bea4f-3fbc-47aa-94e0-8eafbb142d8e	tag-konsierzh
929bea4f-3fbc-47aa-94e0-8eafbb142d8e	tag-stroenie-1
929bea4f-3fbc-47aa-94e0-8eafbb142d8e	tag-podezd-2
e33a634e-c810-489c-9cc6-ba913a034136	tag-chat
e33a634e-c810-489c-9cc6-ba913a034136	tag-stroenie-1
0c11c98b-7143-4692-896c-ab5f19c5b305	tag-address
0c11c98b-7143-4692-896c-ab5f19c5b305	tag-stroenie-1
45bef24b-8d2b-409f-8247-2fb42ef55ef6	tag-konsierzh
45bef24b-8d2b-409f-8247-2fb42ef55ef6	tag-stroenie-2
45bef24b-8d2b-409f-8247-2fb42ef55ef6	tag-podezd-1
c6aeeee6-2865-4386-8124-99f26407ab4c	tag-konsierzh
c6aeeee6-2865-4386-8124-99f26407ab4c	tag-stroenie-2
c6aeeee6-2865-4386-8124-99f26407ab4c	tag-podezd-2
de02a654-73c1-4a2d-b727-73d1a41008fe	tag-chat
de02a654-73c1-4a2d-b727-73d1a41008fe	tag-stroenie-2
068aeadc-5a69-4590-a738-713810970519	tag-address
068aeadc-5a69-4590-a738-713810970519	tag-stroenie-2
9b7badee-1e2c-4cf7-b75b-b88a61604004	tag-chat
9b7badee-1e2c-4cf7-b75b-b88a61604004	tag-stroenie-3
64708093-054e-4584-a195-af0b1ed52f63	tag-address
64708093-054e-4584-a195-af0b1ed52f63	tag-stroenie-3
3cf8d0b8-c985-4e33-8c5a-e1d19614c138	tag-chat
3cf8d0b8-c985-4e33-8c5a-e1d19614c138	tag-stroenie-4
55b2d6cb-0b58-42ae-9cc1-9085669ce9fb	tag-address
55b2d6cb-0b58-42ae-9cc1-9085669ce9fb	tag-stroenie-4
33927a1e-8392-4a1d-818c-3c5008b551c6	tag-chat
33927a1e-8392-4a1d-818c-3c5008b551c6	tag-stroenie-5
3d4fb2d2-01f3-4377-9a72-54ce519ceee1	tag-address
3d4fb2d2-01f3-4377-9a72-54ce519ceee1	tag-stroenie-5
342a4f7d-04d1-43d6-ae9f-230434cf695d	tag-konsierzh
342a4f7d-04d1-43d6-ae9f-230434cf695d	tag-stroenie-6
342a4f7d-04d1-43d6-ae9f-230434cf695d	tag-podezd-1
f14eaa82-cb61-4ae6-9bbb-f1e590540d38	tag-konsierzh
f14eaa82-cb61-4ae6-9bbb-f1e590540d38	tag-stroenie-6
f14eaa82-cb61-4ae6-9bbb-f1e590540d38	tag-podezd-2
74878025-f27e-4acc-b061-aa3a1c4f1395	tag-chat
74878025-f27e-4acc-b061-aa3a1c4f1395	tag-stroenie-6
9a2b39c2-30cd-4bb4-8278-4a56a717860c	tag-address
9a2b39c2-30cd-4bb4-8278-4a56a717860c	tag-stroenie-6
506a6a03-4ca6-4be4-a796-107b37016c09	tag-konsierzh
506a6a03-4ca6-4be4-a796-107b37016c09	tag-stroenie-7
506a6a03-4ca6-4be4-a796-107b37016c09	tag-podezd-1
12798073-aa23-4933-bcb9-057ab2eca6dc	tag-konsierzh
12798073-aa23-4933-bcb9-057ab2eca6dc	tag-stroenie-7
12798073-aa23-4933-bcb9-057ab2eca6dc	tag-podezd-2
4c904800-2046-43ad-a59f-c71124d7c116	tag-chat
4c904800-2046-43ad-a59f-c71124d7c116	tag-stroenie-7
b84f3ff3-72ee-415d-8055-468d262bd941	tag-address
b84f3ff3-72ee-415d-8055-468d262bd941	tag-stroenie-7
29212417-464b-4c3f-90f9-189838dca465	tag-domofon
29212417-464b-4c3f-90f9-189838dca465	tag-dispetcher
1aec092f-e472-4233-8d94-9eee4f02127b	tag-domofon
1fe0ea22-ab72-44c1-8c3f-cbbe113a64b0	tag-domofon
13228b8e-8fa5-41cc-9270-c1addc32904e	tag-domofon
\.


--
-- Data for Name: directory_entry; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_entry (id, slug, type, title, description, content, building_id, floor_number, icon, "order", is_active, created_at, updated_at, subtitle) FROM stdin;
c11cd719-81bb-4e67-90ab-5371a392035f	domru	organization	Дом.ру	Интернет-провайдер	\N	\N	\N	Wifi	40	1	2025-12-06 14:54:07.116229	2025-12-10 21:34:38.657	Интернет-провайдер
82871599-2bf6-4112-823b-2255f04fc52e	msk-developer	organization	Застройщик МСК	Московская строительная компания	\N	\N	\N	HardHat	20	1	2025-12-06 14:54:07.087826	2026-01-01 20:56:19.191	\N
3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	uk-serdtse-rostova	organization	Сердце Ростова	УК ЖК Сердце Ростова 2	\N	\N	\N	Users	1	1	2025-12-06 14:54:06.963903	2026-01-11 14:32:39.555	Управляющая компания
fa31a453-c6f8-4c24-8e70-86a6c159c57a	avariynye-sluzhby	contact	Аварийные службы СР2	Круглосуточные аварийные службы ЖК	\N	\N	\N	AlertTriangle	2	1	2025-12-06 14:54:06.982894	2025-12-06 14:54:06.982894	\N
94aabb5c-9443-4f71-9800-a12978c52876	stroenie-1	location	Строение 1	Литеры 4, 5	\N	6147fef4-6020-4938-95f8-75a557406e13	\N	Building	10	1	2025-12-06 14:54:07.015283	2025-12-06 14:54:07.015283	\N
e34ba12d-963f-4f89-9157-96f275f0df8f	stroenie-2	location	Строение 2	Литеры 2, 3	\N	fe24395b-c335-460d-a7c4-0c89e8f29b57	\N	Building	11	1	2025-12-06 14:54:07.030702	2025-12-06 14:54:07.030702	\N
67a4b03f-492b-4aea-908d-80a40afb2723	stroenie-3	location	Строение 3	Литер 9	\N	703f0fd4-2665-43d5-aa89-08b80f36797f	\N	Building	12	1	2025-12-06 14:54:07.044191	2025-12-06 14:54:07.044191	\N
a950b38b-130f-457d-83c2-66174d36d9b8	stroenie-4	location	Строение 4	Литер 1	\N	c0d85fdf-8244-49a7-b4e1-f9c93cdc1a84	\N	Building	13	1	2025-12-06 14:54:07.05097	2025-12-06 14:54:07.05097	\N
36bc8066-55ce-47b6-a995-5ab276c2570a	stroenie-5	location	Строение 5	Литер 8	\N	ed5a034e-e745-4e97-9f1c-588290a9df52	\N	Building	14	1	2025-12-06 14:54:07.057295	2025-12-06 14:54:07.057295	\N
2382127a-bbed-400e-91f2-5702bdc4b744	stroenie-6	location	Строение 6	Литер 7	\N	7e09eec5-5b83-4fbe-ba39-73fcc0364ec8	\N	Building	15	1	2025-12-06 14:54:07.065643	2025-12-06 14:54:07.065643	\N
3c972fbf-8cc4-48c3-aded-f82a1ec3beb5	stroenie-7	location	Строение 7	Литер 6	\N	6a45ee31-561f-484f-a900-64d43b4f9316	\N	Building	16	1	2025-12-06 14:54:07.077596	2025-12-06 14:54:07.077596	\N
3b24e640-0fe8-4d4c-bf32-6300b535cb48	zhkh-services	contact	Службы ЖКХ	Ресурсы и службы ЖКХ	\N	\N	\N	Wrench	25	1	2025-12-06 14:54:07.095832	2025-12-06 14:54:07.095832	\N
21e42833-9b9c-43ff-83e4-abe86cc5725b	domofon-vdome	organization	Домофоны VDome	VDome	\N	\N	\N	Shield	30	1	2025-12-06 14:54:07.098786	2025-12-06 14:54:07.098786	\N
56823b58-2e4d-40d9-8731-39e283a8a661	vodokanal	organization	Водоканал	Водоснабжение	\N	\N	\N	Droplets	31	1	2025-12-06 14:54:07.105677	2025-12-06 14:54:07.105677	\N
c2664314-22ed-40a9-99aa-d5987fb6f8af	tns-energo	organization	ТНС-Энерго	Электричество	\N	\N	\N	Zap	32	1	2025-12-06 14:54:07.1079	2025-12-06 14:54:07.1079	\N
c9eed834-3e65-47bd-ad6a-f7afb6eda238	clean-city	organization	Чистый город	ТКО	\N	\N	\N	Trash2	33	1	2025-12-06 14:54:07.109816	2025-12-06 14:54:07.109816	\N
1eee5f1c-e900-4853-a121-45b288ac0889	teploservice-ug	organization	ТеплоСервис Юг	Отопление и горячая вода	\N	\N	\N	Flame	34	1	2025-12-06 14:54:07.112658	2025-12-06 14:54:07.112658	\N
39b82e93-37e0-4dfa-af11-6faf358d0021	beeline	organization	билайн	Интернет-провайдер	\N	\N	\N	Wifi	41	1	2025-12-06 14:54:07.120172	2025-12-06 14:54:07.120172	\N
9c7eba5e-fba7-44fb-be06-a0fe16ea0023	orbita	organization	Орбита	Интернет-провайдер	\N	\N	\N	Wifi	42	1	2025-12-06 14:54:07.123367	2025-12-06 14:54:07.123367	\N
10c704c2-8472-454c-a6f7-3f1dba075cff	poliklinika-5	organization	Поликлиника № 5	Медицинское учреждение	\N	\N	\N	Heart	50	1	2025-12-06 14:54:07.125688	2025-12-06 14:54:07.125688	\N
416edd74-9b96-406d-bb76-b981a36161a2	gorodskie-sluzhby	contact	Городские службы	Ростов-на-Дону	\N	\N	\N	Landmark	60	1	2025-12-06 14:54:07.13317	2025-12-06 14:54:07.13317	\N
\.


--
-- Data for Name: directory_entry_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_entry_stats (id, entry_id, view_count, call_count, link_count, last_viewed_at, updated_at) FROM stdin;
\.


--
-- Data for Name: directory_entry_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_entry_tag (entry_id, tag_id) FROM stdin;
fa31a453-c6f8-4c24-8e70-86a6c159c57a	tag-emergency
94aabb5c-9443-4f71-9800-a12978c52876	tag-buildings
94aabb5c-9443-4f71-9800-a12978c52876	tag-stroenie-1
e34ba12d-963f-4f89-9157-96f275f0df8f	tag-buildings
e34ba12d-963f-4f89-9157-96f275f0df8f	tag-stroenie-2
67a4b03f-492b-4aea-908d-80a40afb2723	tag-buildings
67a4b03f-492b-4aea-908d-80a40afb2723	tag-stroenie-3
a950b38b-130f-457d-83c2-66174d36d9b8	tag-buildings
a950b38b-130f-457d-83c2-66174d36d9b8	tag-stroenie-4
36bc8066-55ce-47b6-a995-5ab276c2570a	tag-buildings
36bc8066-55ce-47b6-a995-5ab276c2570a	tag-stroenie-5
2382127a-bbed-400e-91f2-5702bdc4b744	tag-buildings
2382127a-bbed-400e-91f2-5702bdc4b744	tag-stroenie-6
3c972fbf-8cc4-48c3-aded-f82a1ec3beb5	tag-buildings
3c972fbf-8cc4-48c3-aded-f82a1ec3beb5	tag-stroenie-7
3b24e640-0fe8-4d4c-bf32-6300b535cb48	tag-utilities
21e42833-9b9c-43ff-83e4-abe86cc5725b	tag-utilities
21e42833-9b9c-43ff-83e4-abe86cc5725b	tag-domofon
56823b58-2e4d-40d9-8731-39e283a8a661	tag-utilities
c2664314-22ed-40a9-99aa-d5987fb6f8af	tag-utilities
c9eed834-3e65-47bd-ad6a-f7afb6eda238	tag-utilities
1eee5f1c-e900-4853-a121-45b288ac0889	tag-utilities
39b82e93-37e0-4dfa-af11-6faf358d0021	tag-internet
9c7eba5e-fba7-44fb-be06-a0fe16ea0023	tag-internet
10c704c2-8472-454c-a6f7-3f1dba075cff	tag-medical
416edd74-9b96-406d-bb76-b981a36161a2	tag-emergency
c11cd719-81bb-4e67-90ab-5371a392035f	tag-internet
82871599-2bf6-4112-823b-2255f04fc52e	tag-developer
3ebf5933-7df0-41e8-a2f1-ab4050eaf6cb	tag-uk
\.


--
-- Data for Name: directory_schedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_schedule (id, entry_id, day_of_week, open_time, close_time, note) FROM stdin;
\.


--
-- Data for Name: directory_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_tag (id, name, slug, parent_id, synonyms, icon, "order", description, scope) FROM stdin;
tag-uk	Управляющая компания	uk	\N	["УК","управление","управдом"]	Users	1	Управляющая компания и её службы	core
tag-utilities	Коммуналка	utilities	\N	["ЖКХ","коммуналка","ресурсы","счётчики","показания"]	Wrench	4	ЖКХ и ресурсоснабжающие организации	core
tag-internet	Интернет	internet	\N	["провайдер","WiFi","интернет"]	Wifi	5	Интернет-провайдеры	commerce
tag-medical	Медицина	medical	\N	["врач","поликлиника","больница","медицина"]	Heart	6	Поликлиники, больницы	city
tag-konsierzh	Консьерж	konsierzh	\N	["консьержка","охрана","вахта"]	UserCheck	100	Телефоны консьержей	core
tag-chat	Чат	chat	\N	["телеграм","telegram","чат","группа"]	MessageCircle	101	Telegram-чаты	core
tag-elektrik	Электрик	elektrik	\N	["электрика","свет","электричество"]	Zap	102	Электрики	core
tag-santehnik	Сантехник	santehnik	\N	["сантехника","вода","трубы","канализация"]	Droplet	103	Сантехники	core
tag-dispetcher	Диспетчерская	dispetcher	\N	["диспетчер","оператор"]	Headphones	104	Диспетчерские службы	core
tag-lift	Лифт	lift	\N	["лифт","подъемник"]	ArrowUpDown	105	Лифтовая служба	core
tag-domofon	Домофон	domofon	\N	["домофон","интерком","видеодомофон"]	DoorOpen	106	Домофонная служба	core
tag-vorota	Ворота	vorota	\N	["ворота","шлагбаум","въезд"]	DoorClosed	107	Ворота и шлагбаумы	core
tag-address	Адрес	address	\N	["адрес","местоположение"]	MapPin	108	Адреса	core
tag-stroenie-1	Строение 1	stroenie-1	tag-buildings	["строение 1","литер 4","литер 5"]	Building	110	Строение 1 (литеры 4, 5)	core
tag-stroenie-2	Строение 2	stroenie-2	tag-buildings	["строение 2","литер 2","литер 3"]	Building	111	Строение 2 (литеры 2, 3)	core
tag-stroenie-3	Строение 3	stroenie-3	tag-buildings	["строение 3","литер 9"]	Building	112	Строение 3 (литер 9)	core
tag-stroenie-4	Строение 4	stroenie-4	tag-buildings	["строение 4","литер 1"]	Building	113	Строение 4 (литер 1)	core
tag-stroenie-5	Строение 5	stroenie-5	tag-buildings	["строение 5","литер 6","литер 7"]	Building	114	Строение 5 (литеры 6, 7)	core
tag-stroenie-6	Строение 6	stroenie-6	tag-buildings	["строение 6","литер 10","литер 11"]	Building	115	Строение 6 (литеры 10, 11)	core
tag-stroenie-7	Строение 7	stroenie-7	tag-buildings	["строение 7","литер 8"]	Building	116	Строение 7 (литер 8)	core
tag-podezd-1	Подъезд 1	podezd-1	\N	["подъезд 1","п1","первый подъезд"]	DoorOpen	120	Первый подъезд	core
tag-podezd-2	Подъезд 2	podezd-2	\N	["подъезд 2","п2","второй подъезд"]	DoorOpen	121	Второй подъезд	core
tag-developer	Застройщик	developer	\N	["МСК","застройщик","гарантия","московская строительнрая компания"]	HardHat	7	МСК и гарантийные вопросы	core
tag-emergency	Аварийные службы	emergency	\N	["авария","экстренно","срочно","поломка","электрик","сантехник"]	AlertTriangle	2	Экстренные контакты и аварийные службы	core
tag-buildings	Строения	buildings	\N	["корпус","дом","строение","литер"]	Building	3	Строения ЖК	core
\.


--
-- Data for Name: directory_tag_stats; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.directory_tag_stats (id, tag_id, click_count, view_count, last_clicked_at, updated_at) FROM stdin;
e758a363-88a4-4a5d-941c-d05fc514899c	tag-utilities	2	0	2025-12-10 22:24:23.883	2025-12-10 22:24:23.883
8bb56832-55b6-4c48-aab1-9f91fd7a9ab2	tag-emergency	4	0	2025-12-11 23:21:33.587	2025-12-11 23:21:33.587
8d06be12-3d8e-44e3-91fd-a4e44ee76b3a	tag-uk	3	0	2025-12-11 23:23:03.704	2025-12-11 23:23:03.704
c4e17421-54d2-4105-b79f-5f8c074dcf05	tag-stroenie-3	1	0	2025-12-11 23:23:25.659	2025-12-11 23:23:25.658997
74760bb2-12c6-46f8-8e34-697eec5d4af7	tag-podezd-2	2	0	2025-12-11 23:23:41.063	2025-12-11 23:23:41.063
0714e6fb-288a-4eaa-8f27-29402533369b	tag-domofon	4	0	2025-12-14 15:19:32.321	2025-12-14 15:19:32.321
cf5a0d82-866b-4559-960d-b64c23f6a5a1	tag-stroenie-1	4	0	2025-12-14 15:44:01.427	2025-12-14 15:44:01.427
d4ba42bd-cabe-4621-93da-724b902ea62f	tag-internet	2	0	2026-01-01 21:38:00.741	2026-01-01 21:38:00.741
fd314e56-fb0b-446f-8408-8cae45ee8034	tag-santehnik	4	0	2026-01-10 13:42:24.193	2026-01-10 13:42:24.193
a0af3c33-bbcf-4235-9a96-ceb605af9cc6	tag-elektrik	14	0	2026-01-11 13:30:11.79	2026-01-11 13:30:11.79
bf93e4cc-4b3d-4910-805f-a8f72ac8a673	tag-lift	1	0	2026-01-11 13:31:43.687	2026-01-11 13:31:43.687842
2223a69b-5bbb-40ad-9b84-6b0f687a7cc9	tag-dispetcher	18	0	2026-01-11 14:12:40.191	2026-01-11 14:12:40.191
429bf9e6-9af7-468d-96f4-1102611b5771	tag-chat	24	0	2026-01-11 14:15:11.042	2026-01-11 14:15:11.042
90387fd9-c557-4075-91dd-108ed3cb0c34	tag-konsierzh	34	0	2026-01-11 15:59:21.017	2026-01-11 15:59:21.017
\.


--
-- Data for Name: email_verification_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_verification_token (id, user_id, token, expires, used_at, created_at) FROM stdin;
\.


--
-- Data for Name: entrance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.entrance (id, building_id, entrance_number) FROM stdin;
0befc8a3-b652-4cdd-b3f1-058fcaed2c51	6147fef4-6020-4938-95f8-75a557406e13	1
362f4582-cec7-4b06-a064-bf2f6566220e	6147fef4-6020-4938-95f8-75a557406e13	2
e88af069-1e73-44e6-a32e-11fe5e91c5ed	fe24395b-c335-460d-a7c4-0c89e8f29b57	1
a0b3bafe-3476-4f31-ba5d-d37a200067bf	fe24395b-c335-460d-a7c4-0c89e8f29b57	2
713c267f-4a91-414d-b268-5a0a3eb81052	7e09eec5-5b83-4fbe-ba39-73fcc0364ec8	1
d7171a85-985a-4a70-a3e4-3f569c012688	7e09eec5-5b83-4fbe-ba39-73fcc0364ec8	2
544e06e3-3291-42e2-a8a7-19bacc725a6b	6a45ee31-561f-484f-a900-64d43b4f9316	1
d1cb6d3c-020e-4dba-9127-e2b5e54538d5	6a45ee31-561f-484f-a900-64d43b4f9316	2
a5731314-3021-43e0-b923-7e4ad868dbc6	703f0fd4-2665-43d5-aa89-08b80f36797f	1
7db36bbb-191d-47e2-ab5d-b7e116e3011c	703f0fd4-2665-43d5-aa89-08b80f36797f	2
7340d57f-0a69-44ad-b3c7-fc7eada5de9f	703f0fd4-2665-43d5-aa89-08b80f36797f	3
a21cb03a-7d0b-4396-b808-54f13bfe450a	703f0fd4-2665-43d5-aa89-08b80f36797f	4
c8511f14-44bb-4790-8d35-3bfab5d054d3	c0d85fdf-8244-49a7-b4e1-f9c93cdc1a84	1
25336793-84e6-4626-a3e9-95b778543d47	ed5a034e-e745-4e97-9f1c-588290a9df52	1
fa2f32bb-1c99-4600-9245-807dca8aab5e	ed5a034e-e745-4e97-9f1c-588290a9df52	2
39dd2c1e-cf1f-45a8-8490-a5d8514fe048	ed5a034e-e745-4e97-9f1c-588290a9df52	3
\.


--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.feedback (id, type, title, content, status, priority, contact_name, contact_email, contact_phone, attachments, photos, submitted_by_user_id, ip_address, user_agent, is_anonymous, assigned_to_id, forwarded_to, internal_note, response, responded_at, responded_by_id, is_deleted, deleted_at, deleted_by_id, delete_reason, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: feedback_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.feedback_history (id, feedback_id, action, from_status, to_status, from_priority, to_priority, assigned_to_id, forwarded_to, response, internal_note, changed_by_id, description, created_at) FROM stdin;
\.


--
-- Data for Name: floor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.floor (id, entrance_id, floor_number) FROM stdin;
9c111528-a0e0-46da-8143-43a8bbedf788	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	1
b0d0ce28-2abf-48e1-bf65-74330b974c07	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	2
6bcc61e9-baf3-48e1-a402-1da96c06f7da	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	3
af7cf218-62c2-4042-8db5-0555e9f17ada	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	4
4c56996b-ee15-455a-a9b4-9b2caad45d95	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	5
4880285f-f97e-4f97-ad3a-13cc391e4fba	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	6
1d4a30b3-0253-4839-a656-ea429be2865a	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	7
a4463fbc-2104-4769-8eff-3e07ca248673	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	8
ff2faa0c-a8bd-42d1-b675-2f1dc04794ed	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	9
06757690-b911-422a-b414-79d3659d3b93	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	10
2b5cf20b-ad0f-40a1-b3cd-0a4393879348	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	11
8fc8af07-bbe9-4ab9-b033-20eebc3f83e1	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	12
987e7fe0-816d-410e-9a3b-a0efb20cc621	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	13
1d107470-0807-4ef3-a187-463d6757cb47	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	14
6621008a-64f2-46dc-afce-f324f497d0ed	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	15
d1a9b2ee-a9c2-4258-ae85-8bc616737393	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	16
b908d372-161b-4a4e-a140-6581e81501cc	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	17
b3a07ec5-797f-4a73-91c6-fd3d34ed594d	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	18
24f5e234-a7cd-49e4-946a-1726f72f3602	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	19
96e7720d-4ab9-4096-8d12-4825385d711f	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	20
8e65f253-aab8-4564-a9d4-01f036e58515	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	21
e7d12919-a237-408e-81a1-c503ea5c849c	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	22
e20aaab9-67ac-4a4e-9a19-4e768c0d715f	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	23
1f372600-f0c4-45b0-a26b-c0cf9caee35f	0befc8a3-b652-4cdd-b3f1-058fcaed2c51	24
59bd741b-0aee-4831-b8c0-bf02ce0978a5	362f4582-cec7-4b06-a064-bf2f6566220e	1
1fd6f229-35f9-4a05-9317-710a26f0dd5f	362f4582-cec7-4b06-a064-bf2f6566220e	2
91a0607a-e00e-4b06-9a34-b93446a7f8c1	362f4582-cec7-4b06-a064-bf2f6566220e	3
202bd2bd-4b89-4c66-94a9-a9ffa3aac491	362f4582-cec7-4b06-a064-bf2f6566220e	4
ed6f9ec7-cf65-4844-9829-56a6366677b7	362f4582-cec7-4b06-a064-bf2f6566220e	5
bf4e9e30-5046-43b7-a9b2-e6e3d2c6960f	362f4582-cec7-4b06-a064-bf2f6566220e	6
d0f2c755-4acb-4d91-ae54-bf85315b6920	362f4582-cec7-4b06-a064-bf2f6566220e	7
8fa822a2-8b6c-4062-909f-74c8138c5dc9	362f4582-cec7-4b06-a064-bf2f6566220e	8
2891d9b1-dd4a-41b9-bb95-d7d2b917c302	362f4582-cec7-4b06-a064-bf2f6566220e	9
06f3c97d-ea82-4f12-92ca-7e260b87f370	362f4582-cec7-4b06-a064-bf2f6566220e	10
4b72bf4f-929b-4f6b-809c-13d879c6b61b	362f4582-cec7-4b06-a064-bf2f6566220e	11
5563f6dc-79ad-4fdb-af4b-b809058cc3e0	362f4582-cec7-4b06-a064-bf2f6566220e	12
ff2a6dba-f069-49a2-8f51-0b14027457b1	362f4582-cec7-4b06-a064-bf2f6566220e	13
3251fa94-66cd-4dde-a572-95a0c0733755	362f4582-cec7-4b06-a064-bf2f6566220e	14
0b17fef4-4a58-4092-b290-d7e8224f6c00	362f4582-cec7-4b06-a064-bf2f6566220e	15
8d73cf9a-1f1c-4bd6-bd16-34d97c052ae0	362f4582-cec7-4b06-a064-bf2f6566220e	16
084cef3d-f16f-4e1a-8a80-8390fae26d44	362f4582-cec7-4b06-a064-bf2f6566220e	17
26cdeebe-34b8-414b-b8c6-ff2dca1f9ece	362f4582-cec7-4b06-a064-bf2f6566220e	18
f7109bcc-1854-4bd0-8d1e-229656aa815c	362f4582-cec7-4b06-a064-bf2f6566220e	19
43ca345f-99e7-4144-8454-cadeb30016d2	362f4582-cec7-4b06-a064-bf2f6566220e	20
cddda1c3-72ad-43ee-8cc8-07b14a13f8aa	362f4582-cec7-4b06-a064-bf2f6566220e	21
ff41fb3c-647b-4f0d-8721-c65fc09b2e72	362f4582-cec7-4b06-a064-bf2f6566220e	22
c1fda077-6c21-4d46-9104-3d46324f2f10	362f4582-cec7-4b06-a064-bf2f6566220e	23
ae98ae9a-0593-46d4-90de-fc25ddf0d9e7	362f4582-cec7-4b06-a064-bf2f6566220e	24
2a0846d0-1d44-4f84-ade2-fc7e2b53cd9a	e88af069-1e73-44e6-a32e-11fe5e91c5ed	1
4193217a-7d48-45c4-a9ca-de4db9868ae0	e88af069-1e73-44e6-a32e-11fe5e91c5ed	2
7191f5eb-b538-4a2c-999f-334bb862e164	e88af069-1e73-44e6-a32e-11fe5e91c5ed	3
083f5d5b-540c-4d87-99e9-b0f2f461ca73	e88af069-1e73-44e6-a32e-11fe5e91c5ed	4
9abc717a-ffb0-44ff-b947-bad6494bad68	e88af069-1e73-44e6-a32e-11fe5e91c5ed	5
6926df79-2cb8-4e0d-9abc-b4d01eaa9af3	e88af069-1e73-44e6-a32e-11fe5e91c5ed	6
0a4a77cd-d7a0-42c0-884d-4c7ef7fafe97	e88af069-1e73-44e6-a32e-11fe5e91c5ed	7
3c0e3f53-a7ec-4636-bc73-8d6465ddc5b1	e88af069-1e73-44e6-a32e-11fe5e91c5ed	8
bb6822c6-3162-427c-8909-4c1715121aee	e88af069-1e73-44e6-a32e-11fe5e91c5ed	9
e9f32e36-3894-4a96-9f4a-9012ba87b197	e88af069-1e73-44e6-a32e-11fe5e91c5ed	10
e63dba28-0bf8-4f5f-9b77-63e28bc8bb38	e88af069-1e73-44e6-a32e-11fe5e91c5ed	11
0ccef1c8-34ff-4ed8-98b1-3af8ea343e02	e88af069-1e73-44e6-a32e-11fe5e91c5ed	12
a820cf75-dc4d-45cb-a627-dd48208f4885	e88af069-1e73-44e6-a32e-11fe5e91c5ed	13
460af867-956f-4f2a-90db-34c87cb247cd	e88af069-1e73-44e6-a32e-11fe5e91c5ed	14
3857b17b-8877-48d9-ba5c-8051cea0dffb	e88af069-1e73-44e6-a32e-11fe5e91c5ed	15
9e0e480c-9347-42b5-ba0e-11ed9577d532	e88af069-1e73-44e6-a32e-11fe5e91c5ed	16
b610bfb5-32dc-4502-8234-9c4f6162effe	e88af069-1e73-44e6-a32e-11fe5e91c5ed	17
a8af5a65-8b06-4f4d-b960-a438bbe6aa75	e88af069-1e73-44e6-a32e-11fe5e91c5ed	18
4c9d0526-d9af-49c0-93d0-3bf75177f180	e88af069-1e73-44e6-a32e-11fe5e91c5ed	19
fc389d9b-eb01-4733-9c39-23fbb1962110	e88af069-1e73-44e6-a32e-11fe5e91c5ed	20
f59489cd-a66b-4ae4-8f00-7b90e5e7ffa2	e88af069-1e73-44e6-a32e-11fe5e91c5ed	21
c0390b07-a251-486d-ad67-c6517bad6a3e	e88af069-1e73-44e6-a32e-11fe5e91c5ed	22
d9da2dec-12c0-4cbb-b549-9b4adb20762d	e88af069-1e73-44e6-a32e-11fe5e91c5ed	23
94872e0c-5294-4956-978d-c560986ca3a6	e88af069-1e73-44e6-a32e-11fe5e91c5ed	24
308c4c3b-1423-47b4-ab4d-b320ec100bfd	a0b3bafe-3476-4f31-ba5d-d37a200067bf	1
d2dc454d-829f-4910-97e0-01ae01637aa7	a0b3bafe-3476-4f31-ba5d-d37a200067bf	2
6391b00d-9e57-4b74-a12f-885ead2c58d7	a0b3bafe-3476-4f31-ba5d-d37a200067bf	3
6070b8e9-6f67-4245-a6e0-25f49156db3e	a0b3bafe-3476-4f31-ba5d-d37a200067bf	4
6d163ced-6c92-4170-8e65-a9afa9553c3e	a0b3bafe-3476-4f31-ba5d-d37a200067bf	5
42555f8a-abcc-4dd8-8425-2b2e2d764483	a0b3bafe-3476-4f31-ba5d-d37a200067bf	6
3027d56a-c764-4259-bfd1-82899e1a9f27	a0b3bafe-3476-4f31-ba5d-d37a200067bf	7
fb8383db-8a05-4886-aa2a-bc0a3e8b5ace	a0b3bafe-3476-4f31-ba5d-d37a200067bf	8
48dc880e-0dcf-412e-b2bf-ac590eb773bf	a0b3bafe-3476-4f31-ba5d-d37a200067bf	9
eb9bcb44-4134-4699-a27d-d1b6b73e34a3	a0b3bafe-3476-4f31-ba5d-d37a200067bf	10
eba60600-32c0-4c49-b9d4-931812e7bdfc	a0b3bafe-3476-4f31-ba5d-d37a200067bf	11
1502a0aa-a15f-4e33-b19a-d61fee6a4433	a0b3bafe-3476-4f31-ba5d-d37a200067bf	12
56de2f82-ddc9-45c0-a2e7-97d3b52ac1a6	713c267f-4a91-414d-b268-5a0a3eb81052	1
004ec6fe-d272-4a79-8d7b-7685529b0353	713c267f-4a91-414d-b268-5a0a3eb81052	2
cdcc7264-e6f5-467c-8839-a31bb18b40ba	713c267f-4a91-414d-b268-5a0a3eb81052	3
d4f6c24b-a2d7-44a5-b6b6-e1d78ce54654	713c267f-4a91-414d-b268-5a0a3eb81052	4
bf9a51f5-6a7b-400d-be1c-2011d72ecad0	713c267f-4a91-414d-b268-5a0a3eb81052	5
ea1b838e-bb13-4f08-bd40-b423bfe2fbfd	713c267f-4a91-414d-b268-5a0a3eb81052	6
caad87ca-4fc1-4a15-8241-5429d28e9edb	713c267f-4a91-414d-b268-5a0a3eb81052	7
a5d3c9cc-0eeb-45c6-99de-ccaca2015312	713c267f-4a91-414d-b268-5a0a3eb81052	8
d6fda91a-6a00-4c8b-b459-ebde0af1bcab	713c267f-4a91-414d-b268-5a0a3eb81052	9
dc0c184a-8309-4f9b-b801-ef34df7b1d95	713c267f-4a91-414d-b268-5a0a3eb81052	10
b1221565-8f30-4310-a692-5b2bf8499cc6	713c267f-4a91-414d-b268-5a0a3eb81052	11
057f9abb-eea3-4ad1-b1ca-d57cdb9d061a	713c267f-4a91-414d-b268-5a0a3eb81052	12
695bdc76-41c9-4739-81a6-f1c407121a49	713c267f-4a91-414d-b268-5a0a3eb81052	13
201c66fb-2789-4ee8-9a19-505e217a5ba6	713c267f-4a91-414d-b268-5a0a3eb81052	14
83a9aad4-ac60-4842-9f6a-392cd245c5c4	713c267f-4a91-414d-b268-5a0a3eb81052	15
0ab8ebb3-f9f3-45df-961e-07c0188400f0	713c267f-4a91-414d-b268-5a0a3eb81052	16
200c3c4b-987b-426f-b23f-d5ae9cc4199e	713c267f-4a91-414d-b268-5a0a3eb81052	17
39fe2ec1-5ff0-4823-9d7f-e09a62329e5a	713c267f-4a91-414d-b268-5a0a3eb81052	18
1adf3526-cf8c-4db0-818d-fc3b8604e929	713c267f-4a91-414d-b268-5a0a3eb81052	19
79cd5bf6-6027-4989-bf25-f26a00112d4c	713c267f-4a91-414d-b268-5a0a3eb81052	20
334aab67-dd02-4e9e-919b-573b02a26ce2	713c267f-4a91-414d-b268-5a0a3eb81052	21
38546023-aa3e-4991-b165-55594b33a50f	713c267f-4a91-414d-b268-5a0a3eb81052	22
95f3da38-28a6-46c5-be00-0ab87cafc709	713c267f-4a91-414d-b268-5a0a3eb81052	23
8ae1e1d2-39ef-45db-9178-72853f332b9b	713c267f-4a91-414d-b268-5a0a3eb81052	24
85b0304d-a6de-4136-a26c-b95d2f02f26d	d7171a85-985a-4a70-a3e4-3f569c012688	1
9fc37440-b7d1-4cd5-910a-9cf33fb01a28	d7171a85-985a-4a70-a3e4-3f569c012688	2
11c4ab5e-d373-42be-b023-fa8e02ba9f29	d7171a85-985a-4a70-a3e4-3f569c012688	3
1b621413-ba5a-40aa-81ab-4bb944be3b17	d7171a85-985a-4a70-a3e4-3f569c012688	4
21ccae0a-e6e7-4a17-a4db-b6c314743134	d7171a85-985a-4a70-a3e4-3f569c012688	5
27b01706-b9d5-4f81-8b4d-019ae8f4f5e6	d7171a85-985a-4a70-a3e4-3f569c012688	6
2006b800-2a80-4f63-b945-23e25e74d166	d7171a85-985a-4a70-a3e4-3f569c012688	7
85e21cfa-d2df-4451-a148-97d7a5f55c4c	d7171a85-985a-4a70-a3e4-3f569c012688	8
a830c28c-f3a5-4665-ba65-d8a16ed4cf86	d7171a85-985a-4a70-a3e4-3f569c012688	9
333cadfe-57cc-44da-8830-4a01004a1bec	d7171a85-985a-4a70-a3e4-3f569c012688	10
99faa853-9e08-483e-a785-9c5f66f8ea18	d7171a85-985a-4a70-a3e4-3f569c012688	11
c2ff77b6-0731-493c-98bf-826cf71fa6ec	d7171a85-985a-4a70-a3e4-3f569c012688	12
73049c9c-1ab1-4ed5-9abd-7e4c7010cf9f	d7171a85-985a-4a70-a3e4-3f569c012688	13
7205a9b0-f9e0-42cc-8a2e-a4f9c840b4b8	d7171a85-985a-4a70-a3e4-3f569c012688	14
a534d7a9-d18c-4fbb-88ff-c7f58ea13a80	d7171a85-985a-4a70-a3e4-3f569c012688	15
b51a9270-71d0-4503-ad70-32672e9b41eb	d7171a85-985a-4a70-a3e4-3f569c012688	16
1b4458ef-a234-49bb-85e5-71d69b0b6af6	d7171a85-985a-4a70-a3e4-3f569c012688	17
98631b40-cd57-49e2-a5ad-e0e18d4d587e	d7171a85-985a-4a70-a3e4-3f569c012688	18
144f8424-1dfb-4510-ad50-b5a8a26cc296	d7171a85-985a-4a70-a3e4-3f569c012688	19
03ebd8ac-892a-4078-9b0f-fb13e76b9c0f	d7171a85-985a-4a70-a3e4-3f569c012688	20
a6ac1ede-a380-4a78-b0c3-9da9cbcef9e6	d7171a85-985a-4a70-a3e4-3f569c012688	21
5ed4eb08-45e2-4fc3-8319-f5efcf2d7be7	d7171a85-985a-4a70-a3e4-3f569c012688	22
310061ff-bb97-4c4a-a405-b497fd1e6659	d7171a85-985a-4a70-a3e4-3f569c012688	23
a81d87dd-06e3-4eb0-855f-36ca3b1452d2	d7171a85-985a-4a70-a3e4-3f569c012688	24
c138a563-ee4b-4739-a1e2-a9a5dbc3022f	544e06e3-3291-42e2-a8a7-19bacc725a6b	1
f3b9cb82-5ef6-4f83-8453-eb90d5e593a9	544e06e3-3291-42e2-a8a7-19bacc725a6b	2
abf95c2d-6e93-4550-ad13-5bd89c30080f	544e06e3-3291-42e2-a8a7-19bacc725a6b	3
3b6f8bae-bd81-4435-9cac-07df3742fe24	544e06e3-3291-42e2-a8a7-19bacc725a6b	4
317e0684-c7c7-4d03-acbd-52ee8531030f	544e06e3-3291-42e2-a8a7-19bacc725a6b	5
d9f62fff-7ef5-4790-96ec-87bc1147544e	544e06e3-3291-42e2-a8a7-19bacc725a6b	6
dcf95ba9-79af-4a12-b0ed-5f05c94d5b0a	544e06e3-3291-42e2-a8a7-19bacc725a6b	7
c8091e4c-b049-4cac-a837-61fae03b800b	544e06e3-3291-42e2-a8a7-19bacc725a6b	8
6f367606-cedd-4a7b-8dcf-76b49e5cd030	544e06e3-3291-42e2-a8a7-19bacc725a6b	9
3412a28a-5c67-4f0e-990c-b156449ce150	544e06e3-3291-42e2-a8a7-19bacc725a6b	10
707d5ff3-a2eb-439f-a05c-017deacb0fdc	544e06e3-3291-42e2-a8a7-19bacc725a6b	11
531f863f-3a64-4da6-8513-e5ec4ad83e08	544e06e3-3291-42e2-a8a7-19bacc725a6b	12
83408d6e-3948-4dce-8895-23eb185f6082	544e06e3-3291-42e2-a8a7-19bacc725a6b	13
4d88f3f2-82bc-4115-be5e-dd7d651041db	544e06e3-3291-42e2-a8a7-19bacc725a6b	14
3b9fc110-b2d5-45d8-91ad-4f5dafbbb822	544e06e3-3291-42e2-a8a7-19bacc725a6b	15
4b04bc78-5067-4467-8ed6-233392f99bed	544e06e3-3291-42e2-a8a7-19bacc725a6b	16
9ee20198-0975-43a5-bced-750ca81d86ea	544e06e3-3291-42e2-a8a7-19bacc725a6b	17
59469ca1-708d-4be0-8307-d37074cba2e6	544e06e3-3291-42e2-a8a7-19bacc725a6b	18
92e9a9ec-f422-485d-9667-4117f17820ba	544e06e3-3291-42e2-a8a7-19bacc725a6b	19
4c280d1e-c0eb-4343-b204-4c6488848a22	544e06e3-3291-42e2-a8a7-19bacc725a6b	20
72fb3978-7e7c-421c-8383-619844054a01	544e06e3-3291-42e2-a8a7-19bacc725a6b	21
27d5fe51-2933-4b0b-80f9-10d3ed979109	544e06e3-3291-42e2-a8a7-19bacc725a6b	22
ccdc284b-ddce-440a-86ea-32b21f242cd5	544e06e3-3291-42e2-a8a7-19bacc725a6b	23
1f8c7c4c-486d-4d13-b7a5-35e3f604b003	544e06e3-3291-42e2-a8a7-19bacc725a6b	24
5dde933a-5b72-452c-8c98-40b44dcf4ea9	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	1
406cc531-1481-4c9b-8b31-268de593b6ad	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	2
049669d2-cbab-4627-ac21-f981e1979c2a	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	3
8152e09c-2b84-451c-89e4-d297a90b3528	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	4
78d9c7b6-18cf-40ae-89c8-c5a4a472175c	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	5
16e1dc24-c253-4ffc-a069-d54390248b01	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	6
5685ecfc-d55c-47ae-ae0b-e6e26d009d40	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	7
d643a7cb-4f8c-4cea-bbc8-cb6334803067	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	8
c976413b-c4f8-4c84-8b20-9a39baf72de7	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	9
225a7b94-ba82-485f-ac76-33e0f0f13533	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	10
4f363bc4-d5be-4afe-8e6f-3f3410c3ed5f	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	11
07cb28d4-45ed-43ee-a308-4f6ce18744b7	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	12
76975803-e9df-4cbb-a884-a3da1885def8	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	13
76924116-ed73-4440-9560-9ec073214e35	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	14
8ca97445-0207-46c1-9293-7b960ff278c8	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	15
fedb10c2-3ab7-440c-a6ef-3345b4943f04	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	16
bd8eaeb1-4b30-42cf-b313-fb7d92cf6c63	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	17
ba13a590-920a-4e9d-a033-d97a14cdb5d3	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	18
e3647c8f-a02f-4771-8e0a-08064adfba1d	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	19
0ae96336-5e71-4d3c-95ff-f724181313c4	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	20
6e016bbb-ca39-4264-85db-9d337887a89a	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	21
ee06e9e8-d625-4fd9-8d7f-5a1826df484a	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	22
a40a2dbe-2a16-4782-80c8-3160132aec0e	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	23
58f1ade3-e00f-429b-98d3-9ac54170190e	d1cb6d3c-020e-4dba-9127-e2b5e54538d5	24
19859d88-60f7-4683-84e2-ab88d3c26f00	a5731314-3021-43e0-b923-7e4ad868dbc6	1
f97e087a-3b47-4a9e-8b25-16fdc7749f3f	a5731314-3021-43e0-b923-7e4ad868dbc6	2
79191dbe-fa65-47c9-83d6-e0fa81532ca3	a5731314-3021-43e0-b923-7e4ad868dbc6	3
c6335fa6-b152-4517-aa9f-26707a6f3777	a5731314-3021-43e0-b923-7e4ad868dbc6	4
7e93a98f-c602-48ea-8420-1e22ac2a8cb0	a5731314-3021-43e0-b923-7e4ad868dbc6	5
55508843-294d-459d-9ce7-2906acb13ebb	a5731314-3021-43e0-b923-7e4ad868dbc6	6
97a8e197-9dfb-44f1-bf11-6784e1996a74	a5731314-3021-43e0-b923-7e4ad868dbc6	7
78cbc536-176e-4d20-b74b-ed1f1fc8a69c	a5731314-3021-43e0-b923-7e4ad868dbc6	8
637daa20-6d47-4ebe-9382-28f978f31b2a	a5731314-3021-43e0-b923-7e4ad868dbc6	9
bb3c6235-adea-489a-98d7-dc6dbbb9970e	a5731314-3021-43e0-b923-7e4ad868dbc6	10
f807c669-83a6-42d2-8e36-2ac6f24a518b	a5731314-3021-43e0-b923-7e4ad868dbc6	11
68263a22-b55a-404c-bff2-e07ff1a708fc	a5731314-3021-43e0-b923-7e4ad868dbc6	12
57b8add1-1a09-4eb0-9cba-89d29c80c4db	7db36bbb-191d-47e2-ab5d-b7e116e3011c	1
51174869-d8d6-4c26-81f6-36ac65f23581	7db36bbb-191d-47e2-ab5d-b7e116e3011c	2
1c1a043b-6a63-4d98-822b-dc0fc668f3c0	7db36bbb-191d-47e2-ab5d-b7e116e3011c	3
6fc597a4-c5f7-4f97-9195-197352a38f4f	7db36bbb-191d-47e2-ab5d-b7e116e3011c	4
fec00687-02ab-4087-a0f8-40adf669ae9f	7db36bbb-191d-47e2-ab5d-b7e116e3011c	5
3698496a-8e8e-4cb1-af20-b117ec91bb20	7db36bbb-191d-47e2-ab5d-b7e116e3011c	6
3373dc4d-c0c1-4289-887b-703ba0b9fbf5	7db36bbb-191d-47e2-ab5d-b7e116e3011c	7
d29cdab3-c17c-49d1-af1d-3d3f9302d2a5	7db36bbb-191d-47e2-ab5d-b7e116e3011c	8
4653fb0e-24e2-4c46-a778-a982090e6b15	7db36bbb-191d-47e2-ab5d-b7e116e3011c	9
5edc1e31-e54d-4d61-a74e-d2a4c981731c	7db36bbb-191d-47e2-ab5d-b7e116e3011c	10
dc3bdca2-1045-4967-b9c8-f56f09637e99	7db36bbb-191d-47e2-ab5d-b7e116e3011c	11
7301550c-1ae1-428b-ae5d-49a6283e81cb	7db36bbb-191d-47e2-ab5d-b7e116e3011c	12
224db26d-a203-4d23-9e3e-8fab992132e0	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	1
d9d2e93c-7fe4-4a89-b1af-11683084e1c8	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	2
dfde7198-c7e9-427f-ad51-b8519536169b	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	3
2ad19a8b-ab2a-40c3-bd5f-a2fade2c6c0d	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	4
66668937-4cdf-46f8-b7ed-0c222b6b1793	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	5
3d8695fc-21ac-4807-b314-c66153287ee7	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	6
d2711b01-e6ce-42cf-901f-a4cd187c167e	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	7
9c5a32bc-c395-4352-9b72-bf3fee7c021d	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	8
f8cedb3f-3bc9-4220-ba81-a5f36792e3af	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	9
73a094ef-c96b-44e0-a43f-3fda09fe2c81	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	10
3b11baa6-aebe-4445-8cab-3032ad206a50	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	11
77f98814-2382-45b5-99b1-a3d68cd90f3d	7340d57f-0a69-44ad-b3c7-fc7eada5de9f	12
cb233e17-31f4-4f38-9eff-578358292480	a21cb03a-7d0b-4396-b808-54f13bfe450a	1
3dcf5af6-5e4d-4870-8562-9dde9b925749	a21cb03a-7d0b-4396-b808-54f13bfe450a	2
753917c6-faf1-42bd-a6b4-c64f4b7a869d	a21cb03a-7d0b-4396-b808-54f13bfe450a	3
a633f626-2a2c-473c-909d-718f7a5f9d3c	a21cb03a-7d0b-4396-b808-54f13bfe450a	4
0ccb3dcf-8594-4d7d-9016-342d78b65439	a21cb03a-7d0b-4396-b808-54f13bfe450a	5
73d50ca4-83af-4d61-9436-ba4839fd243d	a21cb03a-7d0b-4396-b808-54f13bfe450a	6
3b402e6b-bb8f-4902-a94b-a6e2bf4d0508	a21cb03a-7d0b-4396-b808-54f13bfe450a	7
7747d4a4-3850-43fe-add9-8f0e9bf5a60b	a21cb03a-7d0b-4396-b808-54f13bfe450a	8
25e2ebd6-6254-492e-9259-a9aef01b418c	a21cb03a-7d0b-4396-b808-54f13bfe450a	9
5e94c964-41f9-4e59-949f-ab0c854a7216	a21cb03a-7d0b-4396-b808-54f13bfe450a	10
07ae9ad9-e03d-4ad9-a9d9-98d6d9b9487a	a21cb03a-7d0b-4396-b808-54f13bfe450a	11
09dae4c8-ceda-4446-8177-a42e4b32b040	a21cb03a-7d0b-4396-b808-54f13bfe450a	12
8003c216-f80e-4fc8-9c93-0d2d0fe327c8	c8511f14-44bb-4790-8d35-3bfab5d054d3	1
b56c0521-0cea-4f5e-a73e-8c0dcc0bb0c8	c8511f14-44bb-4790-8d35-3bfab5d054d3	2
aca9c512-418b-4174-9502-3f920474baf7	c8511f14-44bb-4790-8d35-3bfab5d054d3	3
a3899e49-312f-4959-b65e-e0773ad852c1	c8511f14-44bb-4790-8d35-3bfab5d054d3	4
588cce09-fd3f-42d2-b100-d35cd0ca09b3	c8511f14-44bb-4790-8d35-3bfab5d054d3	5
e7d5d844-535f-4031-8762-ec62a82c0c8e	c8511f14-44bb-4790-8d35-3bfab5d054d3	6
58151630-a1e2-4408-9df3-554b8027b279	c8511f14-44bb-4790-8d35-3bfab5d054d3	7
092f5aee-57b3-4981-8928-257df4d62862	c8511f14-44bb-4790-8d35-3bfab5d054d3	8
01c896a5-00c9-44ae-b901-877eab8174e5	c8511f14-44bb-4790-8d35-3bfab5d054d3	9
1350ef27-d999-42ae-8033-85816e00151b	c8511f14-44bb-4790-8d35-3bfab5d054d3	10
674f2157-db90-43b9-bfa2-3fb9f916fff0	c8511f14-44bb-4790-8d35-3bfab5d054d3	11
656f6858-82e6-414b-bc75-474c4799f963	c8511f14-44bb-4790-8d35-3bfab5d054d3	12
83ed6256-fa94-41c3-833b-e0ab077b1cb6	c8511f14-44bb-4790-8d35-3bfab5d054d3	13
9adfe33e-dcf1-4784-b9f8-002e447cddb2	c8511f14-44bb-4790-8d35-3bfab5d054d3	14
a914237f-7535-4713-9cb9-99bf1a758db1	c8511f14-44bb-4790-8d35-3bfab5d054d3	15
0c10172e-bdc9-4466-83c2-6ca168c659b8	c8511f14-44bb-4790-8d35-3bfab5d054d3	16
3aff8c4d-fa30-4f63-a988-bf2bbee7d938	c8511f14-44bb-4790-8d35-3bfab5d054d3	17
adf9b964-396c-4c21-a029-1fecd473338b	c8511f14-44bb-4790-8d35-3bfab5d054d3	18
1d783329-1ee7-4b15-bf23-327221eb1261	c8511f14-44bb-4790-8d35-3bfab5d054d3	19
b11587b8-41ac-4c1f-bc39-676e99ddde94	c8511f14-44bb-4790-8d35-3bfab5d054d3	20
831c1d56-1610-49bc-af6f-698d4801d133	c8511f14-44bb-4790-8d35-3bfab5d054d3	21
5b4ddff4-5f6d-4741-8109-27219919c4dc	c8511f14-44bb-4790-8d35-3bfab5d054d3	22
1c1febed-f562-4cc0-9b3e-661d2c4e808d	c8511f14-44bb-4790-8d35-3bfab5d054d3	23
2cdb390b-6c06-4f19-9b47-5fa6dc30bdaf	c8511f14-44bb-4790-8d35-3bfab5d054d3	24
ec843f16-dc90-4db6-b5a8-711b90925c52	25336793-84e6-4626-a3e9-95b778543d47	1
5a696b6b-c456-4baf-8363-fa4ffcf132e7	25336793-84e6-4626-a3e9-95b778543d47	2
75e1eb3f-69a8-4f47-a201-3ed36d263773	25336793-84e6-4626-a3e9-95b778543d47	3
503ad545-3607-486e-8d34-51c0b41b16b6	25336793-84e6-4626-a3e9-95b778543d47	4
cc4ac0a5-8bf2-47e8-9bb6-10d52ad3bba8	25336793-84e6-4626-a3e9-95b778543d47	5
212f6694-f246-4c3b-bbba-3c259dc82b5e	25336793-84e6-4626-a3e9-95b778543d47	6
1788ea59-e088-4116-8332-f8183acd05ef	25336793-84e6-4626-a3e9-95b778543d47	7
8f64feb3-437d-472b-86d1-6f35d6faf6fe	25336793-84e6-4626-a3e9-95b778543d47	8
95256132-3f27-4ce2-b772-3a2d19f9aa6e	25336793-84e6-4626-a3e9-95b778543d47	9
ebac719a-3de7-4062-b3a7-8c43c020ff33	25336793-84e6-4626-a3e9-95b778543d47	10
000a71a4-6004-45c8-9e2a-f3b409d987d3	25336793-84e6-4626-a3e9-95b778543d47	11
51ac75db-9d31-4761-bb48-34a566beacd5	25336793-84e6-4626-a3e9-95b778543d47	12
4dd4fc82-d8f1-4353-9ec0-1ee62e976586	25336793-84e6-4626-a3e9-95b778543d47	13
12e48350-4207-4401-8cdf-ea05adda24c6	25336793-84e6-4626-a3e9-95b778543d47	14
a4468967-279b-47af-a341-c85a8fd2a148	25336793-84e6-4626-a3e9-95b778543d47	15
b3239484-ab49-4b90-9193-211ed6c42b4b	25336793-84e6-4626-a3e9-95b778543d47	16
e9d82a49-46a8-4944-a234-9fdbdada7b99	25336793-84e6-4626-a3e9-95b778543d47	17
91c365e6-8fef-4964-bdbb-42ee2701f532	25336793-84e6-4626-a3e9-95b778543d47	18
5149ea91-d19d-437c-a250-1fd7bae59495	25336793-84e6-4626-a3e9-95b778543d47	19
44f7e184-ecc5-4547-b478-a2872f894262	25336793-84e6-4626-a3e9-95b778543d47	20
81ca644a-9d90-4792-aae1-cf0abead57b0	25336793-84e6-4626-a3e9-95b778543d47	21
868f6528-61d5-46fb-a23b-9b4433e72d3a	25336793-84e6-4626-a3e9-95b778543d47	22
db4a54e1-faf4-48b9-9750-1b42903c0862	25336793-84e6-4626-a3e9-95b778543d47	23
0952814a-6328-4205-9a45-3204c76fef16	25336793-84e6-4626-a3e9-95b778543d47	24
b9705e3d-39cc-4266-8162-feaa5fd587ca	fa2f32bb-1c99-4600-9245-807dca8aab5e	1
f0c63981-fbae-4846-96d5-f9518e3f087c	fa2f32bb-1c99-4600-9245-807dca8aab5e	2
702b7938-c2dc-495c-86ef-191d3108549c	fa2f32bb-1c99-4600-9245-807dca8aab5e	3
ae43f80c-fbb5-4ab9-8914-0e7119dda750	fa2f32bb-1c99-4600-9245-807dca8aab5e	4
6047f58a-7316-4452-ae8c-7f20337d2539	fa2f32bb-1c99-4600-9245-807dca8aab5e	5
6950f278-e524-4da4-9f46-2c74be128b61	fa2f32bb-1c99-4600-9245-807dca8aab5e	6
ff3a1ae6-dfad-4be0-9f9e-a88285b57fef	fa2f32bb-1c99-4600-9245-807dca8aab5e	7
c1b4d40f-412f-45eb-bae5-51cfad248c0c	fa2f32bb-1c99-4600-9245-807dca8aab5e	8
5f171188-aee2-424d-9b73-c07e816734e3	fa2f32bb-1c99-4600-9245-807dca8aab5e	9
f97b18f0-f5a8-4b97-a467-702787252b6d	fa2f32bb-1c99-4600-9245-807dca8aab5e	10
108d9894-271a-48e1-8f3f-9839fd9f2576	fa2f32bb-1c99-4600-9245-807dca8aab5e	11
197b6744-e25c-4217-86d2-39359bbf9c79	fa2f32bb-1c99-4600-9245-807dca8aab5e	12
1ca8ea66-da04-4387-94d9-aef0fac5b703	fa2f32bb-1c99-4600-9245-807dca8aab5e	13
ff8299bd-9fd0-4b53-9ed6-eff6f5f133cd	fa2f32bb-1c99-4600-9245-807dca8aab5e	14
06f004d5-1bfa-4051-9007-5d9d2177f1b4	fa2f32bb-1c99-4600-9245-807dca8aab5e	15
8201fc57-81c4-4218-8ab0-10de5cce37d1	fa2f32bb-1c99-4600-9245-807dca8aab5e	16
d83a5e11-0ab0-478d-ad1f-9342faad98f6	fa2f32bb-1c99-4600-9245-807dca8aab5e	17
760e85a4-9de4-468e-ba21-ca78ed1dfe05	fa2f32bb-1c99-4600-9245-807dca8aab5e	18
d0502bf6-2642-455a-8756-5b29e3529227	fa2f32bb-1c99-4600-9245-807dca8aab5e	19
f2806489-62ed-45fa-a32a-5c10b57903e3	fa2f32bb-1c99-4600-9245-807dca8aab5e	20
a19ab55f-a822-4465-a0bc-8fb10143e18d	fa2f32bb-1c99-4600-9245-807dca8aab5e	21
d35f2eb9-7007-46dd-b3bb-aa094d95b296	fa2f32bb-1c99-4600-9245-807dca8aab5e	22
1bda506a-7e9a-4a68-81a6-b6cf954c345f	fa2f32bb-1c99-4600-9245-807dca8aab5e	23
1196931d-702f-4a9b-8100-ddfc2ba2c07d	fa2f32bb-1c99-4600-9245-807dca8aab5e	24
f664feda-7c2a-4898-9306-6cc0998e96f2	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	1
a064f40e-304e-4a3e-841d-a132949a3fda	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	2
d2a48830-fe01-4bda-9d71-22ad7aa9f855	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	3
40f8bc80-3a5d-4bd6-85a3-e176fa434cb9	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	4
e7899c48-7550-495e-be52-d0650847039a	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	5
f2eb77dc-cc2e-4486-abd6-4f5fc430b42b	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	6
cd35c83a-028a-4439-9a18-ba5a3166f504	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	7
e7b5be30-b1fd-4e64-b98d-acd2bad864db	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	8
c61b39f6-4913-481f-8d1e-723010f7cf1a	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	9
e087169a-7d8b-41f7-b3c2-ab555f528ab7	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	10
f110ee5d-058a-4bdc-b0d1-62ec7f0485c7	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	11
e3582130-f2d1-45d6-b28d-70851a84472e	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	12
cd243fa4-b21e-4857-8117-17303740be1a	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	13
4589d72e-a88c-405d-917e-e4bbb47ef0b5	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	14
ec3c097f-12d0-4878-8221-510bc74575cc	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	15
4e150466-bbf7-4cdd-b9a6-1def42cb35db	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	16
2f448ac2-37ba-4817-b6a4-855d06fe9398	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	17
710e9bba-4b1c-4c6a-9618-564376de7da5	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	18
ec27024c-ba23-4d13-9808-0941a93eb05d	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	19
c5496be6-964b-4fd2-ad6f-54979a7da33d	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	20
01598716-43be-47ac-b371-f96801e9e31c	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	21
fd390090-d4fb-4c7b-9c4a-ce0ed308cb0b	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	22
992869d0-32b7-4475-93a6-c80e64ad90d9	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	23
3b06503c-844c-4641-9819-d2838313d163	39dd2c1e-cf1f-45a8-8490-a5d8514fe048	24
\.


--
-- Data for Name: knowledge_base_article; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.knowledge_base_article (id, slug, title, excerpt, content, status, building_id, icon, author_id, "order", view_count, helpful_count, not_helpful_count, created_at, updated_at, published_at) FROM stdin;
c6b558cc-dde8-4a0a-a4ec-9ee38d30218b	kak-podklyuchit-domofon	Как подключить домофон	Пошаговая инструкция по подключению домофона	{"type":"doc","content":[{"type":"heading","attrs":{"textAlign":null,"level":2},"content":[{"type":"text","text":"Общая информация"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Подключение и наладка "},{"type":"text","marks":[{"type":"bold"}],"text":"квартирного домофонного оборудования осуществляется бесплатно"},{"type":"text","text":"."}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"По умолчанию у большинства квартир уже "},{"type":"text","marks":[{"type":"bold"}],"text":"подключена домофонная трубка"},{"type":"text","text":"."}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Мобильное приложение используется "},{"type":"text","marks":[{"type":"bold"}],"text":"дополнительно"},{"type":"text","text":" и позволяет управлять домофоном со смартфона."}]}]}]},{"type":"heading","attrs":{"textAlign":null,"level":2},"content":[{"type":"text","text":"Что необходимо для подключения приложения"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Для подключения мобильного приложения требуется:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"смартфон на "},{"type":"text","marks":[{"type":"bold"}],"text":"Android"},{"type":"text","text":" или "},{"type":"text","marks":[{"type":"bold"}],"text":"iOS"},{"type":"text","text":";"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"номер телефона в формате "},{"type":"text","marks":[{"type":"bold"}],"text":"+7-XXX-XXX-XX-XX"},{"type":"text","text":";"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"доступ к "},{"type":"text","marks":[{"type":"bold"}],"text":"WhatsApp"},{"type":"text","text":" для регистрации."}]}]}]},{"type":"heading","attrs":{"textAlign":null,"level":2},"content":[{"type":"text","text":"Регистрация для подключения приложения"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Регистрация осуществляется "},{"type":"text","marks":[{"type":"bold"}],"text":"только через WhatsApp-бот"},{"type":"text","text":"."}]},{"type":"heading","attrs":{"textAlign":null,"level":3},"content":[{"type":"text","text":"Шаг 1. Перейдите в WhatsApp"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Откройте чат по ссылке:"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"https://wa.me/+79963530117?text=инструкция"}]},{"type":"horizontalRule"},{"type":"heading","attrs":{"textAlign":null,"level":3},"content":[{"type":"text","text":"Шаг 2. Отправьте данные для регистрации"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"В чат необходимо "},{"type":"text","marks":[{"type":"bold"}],"text":"один раз"},{"type":"text","text":" отправить следующие данные:"}]},{"type":"orderedList","attrs":{"start":1,"type":null},"content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Точный адрес"},{"type":"text","text":" (улица, дом, номер квартиры)"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Фамилия, имя, отчество"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"указывается "},{"type":"text","marks":[{"type":"bold"}],"text":"один человек от квартиры"},{"type":"text","text":";"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"этот человек в дальнейшем сможет добавлять других жильцов;"}]}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"Номер телефона"},{"type":"text","text":" в формате +7-XXX-XXX-XX-XX"}]}]}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Важно:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"подтверждение о приёме данных "},{"type":"text","marks":[{"type":"bold"}],"text":"не приходит"},{"type":"text","text":";"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"повторная отправка данных "},{"type":"text","marks":[{"type":"bold"}],"text":"не ускоряет регистрацию"},{"type":"text","text":"."}]}]}]},{"type":"heading","attrs":{"textAlign":null,"level":3},"content":[{"type":"text","text":"Шаг 3. Ожидайте завершения регистрации"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Регистрация в системе занимает "},{"type":"text","marks":[{"type":"bold"}],"text":"до 24 часов"},{"type":"text","text":"."}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"После завершения регистрации вы получите сообщение с этого же номера WhatsApp."}]}]}]},{"type":"horizontalRule"},{"type":"heading","attrs":{"textAlign":null,"level":2},"content":[{"type":"text","text":"Установка мобильного приложения"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"https://play.google.com/store/apps/details?id=ru.mts.vdome.resident","target":"_blank","rel":"noopener noreferrer nofollow","class":"text-primary underline underline-offset-2"}}],"text":"VDome для Android"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","marks":[{"type":"link","attrs":{"href":"https://apps.apple.com/ru/app/vdome/id1491163759","target":"_blank","rel":"noopener noreferrer nofollow","class":"text-primary underline underline-offset-2"}}],"text":"VDome для iOS"}]}]}]},{"type":"horizontalRule"},{"type":"heading","attrs":{"textAlign":null,"level":2},"content":[{"type":"text","text":"Вход и настройка приложения"}]},{"type":"orderedList","attrs":{"start":1,"type":null},"content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Откройте приложение "},{"type":"text","marks":[{"type":"bold"}],"text":"VDome"},{"type":"text","text":";"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Выполните вход "},{"type":"text","marks":[{"type":"bold"}],"text":"по номеру телефона"},{"type":"text","text":", указанному при регистрации;"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"После входа добавьте объект:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"укажите "},{"type":"text","marks":[{"type":"bold"}],"text":"адрес дома"},{"type":"text","text":";"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"укажите "},{"type":"text","marks":[{"type":"bold"}],"text":"номер квартиры"},{"type":"text","text":"."}]}]}]}]}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"После этого приложение готово к использованию."}]},{"type":"heading","attrs":{"textAlign":null,"level":2},"content":[{"type":"text","text":"Добавление других жильцов"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Добавлять других жильцов может "},{"type":"text","marks":[{"type":"bold"}],"text":"только человек"},{"type":"text","text":", указанный при регистрации;"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Добавление выполняется "},{"type":"text","marks":[{"type":"bold"}],"text":"через приложение"},{"type":"text","text":"."}]}]}]},{"type":"horizontalRule"},{"type":"heading","attrs":{"textAlign":null,"level":2},"content":[{"type":"text","text":"Если приложение не работает или возникли вопросы"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"По всем вопросам, связанным с домофоном:"}]},{"type":"bulletList","content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"отсутствует подключение;"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"не работает трубка;"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"проблемы с приложением;"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"смена владельца или номера телефона;"}]}]}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"необходимо обращаться в диспетчерскую."}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"type":"text","text":"Телефон: "},{"type":"text","marks":[{"type":"bold"}],"text":"+7 (863) 310-02-26"}]},{"type":"horizontalRule"},{"type":"paragraph","attrs":{"textAlign":null}}]}	published	\N	\N	\N	0	22	2	0	2025-12-14 15:09:07.43203	2025-12-14 15:10:38.486	2025-12-14 15:09:09.667
\.


--
-- Data for Name: knowledge_base_article_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.knowledge_base_article_tag (article_id, tag_id) FROM stdin;
c6b558cc-dde8-4a0a-a4ec-9ee38d30218b	tag-domofon
\.


--
-- Data for Name: listing; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listing (id, user_id, listing_type, property_type, apartment_id, parking_spot_id, title, description, price, utilities_included, status, moderated_by, moderated_at, rejection_reason, view_count, created_at, updated_at, published_at, archived_by, archived_at, is_stale, stale_at, archive_reason, archived_comment, renewed_at, show_phone, show_telegram, show_max, show_whatsapp) FROM stdin;
\.


--
-- Data for Name: listing_photo; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.listing_photo (id, listing_id, url, sort_order, is_main, alt_text, uploaded_at) FROM stdin;
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.media (id, filename, original_filename, mime_type, size, path, url, width, height, type, alt, title, description, uploaded_by, created_at) FROM stdin;
ffbf0e32-0508-41c7-a495-86355a774f43	bf4497d0-f4c9-4f33-940b-50d3febcf471.webp	sr2-gen.png	image/webp	67734	/uploads/2026/01/bf4497d0-f4c9-4f33-940b-50d3febcf471.webp	/uploads/2026/01/bf4497d0-f4c9-4f33-940b-50d3febcf471.webp	1200	800	image	\N	\N	\N	c8071a46-c3b5-408d-8607-e3f0fca56936	2026-01-11 16:25:32.856839+00
\.


--
-- Data for Name: message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message (id, thread_id, sender_id, content, is_rich_text, status, moderated_by, moderated_at, moderation_comment, reply_to_id, is_edited, is_deleted, created_at, updated_at, edited_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: message_attachment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message_attachment (id, message_id, file_type, file_name, file_url, file_size, mime_type, width, height, thumbnail_url, created_at) FROM stdin;
\.


--
-- Data for Name: message_complaint; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message_complaint (id, message_id, reporter_id, complaint_type, description, status, reviewed_by, reviewed_at, review_comment, action_taken, created_at) FROM stdin;
\.


--
-- Data for Name: message_quota; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message_quota (id, user_id, daily_limit, daily_used, daily_reset_at, weekly_limit, weekly_used, weekly_reset_at, is_blocked, blocked_reason, blocked_at, blocked_by, updated_at) FROM stdin;
\.


--
-- Data for Name: message_recipient; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message_recipient (id, message_id, recipient_id, is_read, read_at, is_archived, is_deleted) FROM stdin;
\.


--
-- Data for Name: message_thread; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.message_thread (id, subject, created_by, scope, building_id, entrance_id, floor_id, apartment_id, parking_id, parking_floor_id, parking_spot_id, recipient_id, is_archived, is_locked, last_message_at, created_at) FROM stdin;
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news (id, title, slug, excerpt, cover_image, content, type, status, publish_at, is_pinned, is_highlighted, author_id, created_at, updated_at, is_anonymous) FROM stdin;
121041f7-7c03-4f0f-810b-eda1e8f38076	Запуск информационной платформы SR2.ru	start	Рады представить вам обновлённую информационную платформу для жителей нашего комплекса!	/uploads/2026/01/bf4497d0-f4c9-4f33-940b-50d3febcf471.webp	{"type": "doc", "content": [{"type": "heading", "attrs": {"level": 3, "textAlign": null}, "content": [{"text": "Что уже работает", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Справочник", "type": "text", "marks": [{"type": "bold"}]}, {"text": " — все контакты служб, организаций и полезная информация о ЖК собраны в одном месте. Ищите по названию или выбирайте категорию — нужный контакт найдётся за секунды.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Объявления", "type": "text", "marks": [{"type": "bold"}]}, {"text": " — теперь вы можете размещать объявления о продаже или аренде квартир и машиномест в паркинге. Все объявления проходят проверку, а собственники подтверждают право на недвижимость документами.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Обратная связь", "type": "text", "marks": [{"type": "bold"}]}, {"text": " — жалобы, пожелания и заявки принимаются через удобную форму. Каждое обращение будет рассмотрено.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3, "textAlign": null}, "content": [{"text": "Стадия тестирования", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Сейчас платформа находится в стадии активного тестирования. Мы постоянно улучшаем сервис и будем рады вашим отзывам о том, что работает хорошо, а что можно сделать лучше.", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Если вы заметили ошибку или хотите предложить улучшение — напишите нам через форму обратной связи.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3, "textAlign": null}, "content": [{"text": "Нужна помощь", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Мы ищем активных соседей, которые хотели бы помочь развитию проекта:", "type": "text"}]}, {"type": "bulletList", "content": [{"type": "listItem", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Администраторы", "type": "text", "marks": [{"type": "bold"}]}, {"text": " — управление платформой и обработка обращений", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Модераторы", "type": "text", "marks": [{"type": "bold"}]}, {"text": " — проверка объявлений и заявок", "type": "text"}]}]}, {"type": "listItem", "content": [{"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Редакторы", "type": "text", "marks": [{"type": "bold"}]}, {"text": " — пополнение справочника и составление новостей", "type": "text"}]}]}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Если вы готовы помочь — оставьте заявку через обратную связь или напишите в чаты сообщества.", "type": "text"}]}, {"type": "heading", "attrs": {"level": 3, "textAlign": null}, "content": [{"text": "Как начать пользоваться", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Подробное руководство по работе с сервисом читайте в разделе «Сообщество» → «Руководство».", "type": "text"}]}, {"type": "paragraph", "attrs": {"textAlign": null}, "content": [{"text": "Спасибо, что вы с нами! Вместе мы делаем наш дом лучше.", "type": "text"}]}]}	announcement	draft	\N	t	t	c8071a46-c3b5-408d-8607-e3f0fca56936	2026-01-11 16:25:59.666641+00	2026-01-11 16:25:59.666641+00	t
\.


--
-- Data for Name: news_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.news_tag (news_id, tag_id) FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification (id, user_id, from_user_id, type, category, title, message, entity_type, entity_id, action_url, is_read, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organization (id, building_id, floor_number, name, description, logo, schedule, type) FROM stdin;
\.


--
-- Data for Name: organization_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organization_tag (id, name) FROM stdin;
\.


--
-- Data for Name: organization_to_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.organization_to_tag (organization_id, tag_id) FROM stdin;
\.


--
-- Data for Name: parking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.parking (id, building_id, name) FROM stdin;
67d2132b-7159-4ba5-a2de-752d4acfbe36	6147fef4-6020-4938-95f8-75a557406e13	Парковка (стр. 1)
9b13f8fc-6746-4e62-85b7-ad7883a64969	fe24395b-c335-460d-a7c4-0c89e8f29b57	Парковка (стр. 2)
d6755f98-0b09-40af-8d0f-f033c3e88d46	7e09eec5-5b83-4fbe-ba39-73fcc0364ec8	Парковка (стр. 6)
8b8e4dd6-519e-4e73-841b-158ab89e1e15	6a45ee31-561f-484f-a900-64d43b4f9316	Парковка (стр. 7)
\.


--
-- Data for Name: parking_floor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.parking_floor (id, parking_id, floor_number) FROM stdin;
71ac0f6f-4055-463e-aa34-16f64db39870	67d2132b-7159-4ba5-a2de-752d4acfbe36	-1
0a6ebe76-52ad-4f09-9d91-06dcb585d34c	67d2132b-7159-4ba5-a2de-752d4acfbe36	-2
29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	9b13f8fc-6746-4e62-85b7-ad7883a64969	-1
7394dec4-a512-4bec-8d28-f60ce87f2fc3	9b13f8fc-6746-4e62-85b7-ad7883a64969	-2
be67c07c-5e6c-464e-a3d0-044a957f5f20	d6755f98-0b09-40af-8d0f-f033c3e88d46	-1
880b4520-80da-4e91-91d4-d1a301206dcd	8b8e4dd6-519e-4e73-841b-158ab89e1e15	-1
\.


--
-- Data for Name: parking_spot; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.parking_spot (id, floor_id, number, type) FROM stdin;
b277ae0d-bf45-4d7d-b5da-dd1f3dc9e7d9	be67c07c-5e6c-464e-a3d0-044a957f5f20	1	standard
461baca0-902a-436c-a558-83d4ff170480	be67c07c-5e6c-464e-a3d0-044a957f5f20	2	standard
6a649974-340b-4f0c-8445-0a779c63e1e2	be67c07c-5e6c-464e-a3d0-044a957f5f20	3	standard
a1e97fec-4eab-430a-9b02-a85097f11663	be67c07c-5e6c-464e-a3d0-044a957f5f20	4	standard
bcb839c3-0fae-4fbf-a205-f8d00b1f4dd5	be67c07c-5e6c-464e-a3d0-044a957f5f20	5	standard
9d8689aa-daf3-4307-8516-c76f2b13534b	be67c07c-5e6c-464e-a3d0-044a957f5f20	6	standard
98dadf88-3c1f-4e15-90ea-ff2d52b69a01	be67c07c-5e6c-464e-a3d0-044a957f5f20	7	standard
4edfa1ea-1021-476e-bebc-3299e8d131cd	be67c07c-5e6c-464e-a3d0-044a957f5f20	8	standard
d9c6f4b2-e162-4b89-bd9f-4ea8c8c8c2c9	be67c07c-5e6c-464e-a3d0-044a957f5f20	9	standard
c2007fe9-7703-4174-b6ee-a21ccc72cdfe	be67c07c-5e6c-464e-a3d0-044a957f5f20	10	standard
187a4852-38e4-4656-99f2-5825f534612b	be67c07c-5e6c-464e-a3d0-044a957f5f20	11	standard
8050616c-cc2d-4755-a783-122a6e68d095	be67c07c-5e6c-464e-a3d0-044a957f5f20	12	standard
3e9a9bb1-c9ff-463e-afdd-aaff1513d4f5	be67c07c-5e6c-464e-a3d0-044a957f5f20	13	standard
3c46f51b-dabb-444b-85cb-e884a8556b9b	be67c07c-5e6c-464e-a3d0-044a957f5f20	14	standard
2479b4b1-8760-44ad-8fc0-7bdeac479182	be67c07c-5e6c-464e-a3d0-044a957f5f20	15	standard
14782d97-45c9-47c6-9ffd-f9e17879c898	be67c07c-5e6c-464e-a3d0-044a957f5f20	16	standard
12ad5802-5235-4e79-880c-aff8eef75356	be67c07c-5e6c-464e-a3d0-044a957f5f20	17	standard
1ad0ea2e-4adb-4d5f-9b10-0814e2e8b824	be67c07c-5e6c-464e-a3d0-044a957f5f20	18	standard
c457cd60-2da4-4ea3-9137-e251d5aaa23c	be67c07c-5e6c-464e-a3d0-044a957f5f20	19	standard
cd715522-8e6f-4ed6-884a-b1b02d77b961	be67c07c-5e6c-464e-a3d0-044a957f5f20	20	standard
dbd89c15-e56e-4e88-94fd-8df135d8805e	be67c07c-5e6c-464e-a3d0-044a957f5f20	21	standard
00492e2b-4d25-4a93-bf3a-ba2ab19f1431	be67c07c-5e6c-464e-a3d0-044a957f5f20	22	standard
886c67b5-9c6a-439f-b49d-8493aab67282	be67c07c-5e6c-464e-a3d0-044a957f5f20	23	standard
a3f7fb73-c84b-4125-adc0-ee94e213c144	be67c07c-5e6c-464e-a3d0-044a957f5f20	24	standard
06a704f1-d11e-4f9c-bd47-8e9f6757e694	be67c07c-5e6c-464e-a3d0-044a957f5f20	25	standard
3d368916-5e89-4a14-9039-2509bd73cd68	be67c07c-5e6c-464e-a3d0-044a957f5f20	26	standard
02294341-0ce7-4952-ba22-2e6d31ba6563	be67c07c-5e6c-464e-a3d0-044a957f5f20	27	standard
931007b7-c746-4561-9577-aca8a2050bca	be67c07c-5e6c-464e-a3d0-044a957f5f20	28	standard
98b96bf7-8deb-4174-b984-cab426cd67ca	be67c07c-5e6c-464e-a3d0-044a957f5f20	29	standard
ac59bc49-666a-4141-835b-2a0073331cf9	be67c07c-5e6c-464e-a3d0-044a957f5f20	30	standard
765b10ed-35cd-4534-b4cb-ffa5b79daac5	be67c07c-5e6c-464e-a3d0-044a957f5f20	31	standard
52ea76bd-e1c0-4f7c-bb4d-ace5e0b7f1f5	be67c07c-5e6c-464e-a3d0-044a957f5f20	32	standard
910a66d7-0d4d-4406-892f-4ba3684a33ea	be67c07c-5e6c-464e-a3d0-044a957f5f20	33	standard
39cf5ffc-f6fc-429b-b70c-f3eb16aac1fb	be67c07c-5e6c-464e-a3d0-044a957f5f20	34	standard
2bd7deb4-ebf2-4b3c-b206-f9dc7409eb6f	be67c07c-5e6c-464e-a3d0-044a957f5f20	35	standard
59a5e770-50ef-477e-8ffa-df02b824c988	be67c07c-5e6c-464e-a3d0-044a957f5f20	36	standard
c7eca8dd-b6ec-4893-8ce6-578f83b64028	be67c07c-5e6c-464e-a3d0-044a957f5f20	37	standard
a755bd64-1c23-4613-a444-11778d5c2d6d	be67c07c-5e6c-464e-a3d0-044a957f5f20	38	standard
4307dd14-75b1-47bc-aeb7-b189926617e1	be67c07c-5e6c-464e-a3d0-044a957f5f20	39	standard
d0e1a3ad-1d4a-4e04-8d40-d3a5512d60e9	be67c07c-5e6c-464e-a3d0-044a957f5f20	40	standard
e7b6aa9e-51b1-48c3-a5e7-e7300919f4a9	be67c07c-5e6c-464e-a3d0-044a957f5f20	41	standard
666c4d19-cc69-4fa9-8a35-5153d8e132ab	be67c07c-5e6c-464e-a3d0-044a957f5f20	42	standard
e152ceb2-472e-43d7-b910-46c0b8daa8f0	be67c07c-5e6c-464e-a3d0-044a957f5f20	43	standard
c840cbf0-3809-4ab2-9c6a-daa0b514de9c	be67c07c-5e6c-464e-a3d0-044a957f5f20	44	standard
62b11ea8-bdfb-4985-a7a8-36c315b9b123	be67c07c-5e6c-464e-a3d0-044a957f5f20	45	standard
7d78ad1b-55c5-44b8-9dad-e5aa1b7d1af3	be67c07c-5e6c-464e-a3d0-044a957f5f20	46	standard
1ac69773-a808-4298-83be-bae6542ac2d1	be67c07c-5e6c-464e-a3d0-044a957f5f20	47	standard
5125afe5-2008-4f7a-a279-25ebb28d3e09	be67c07c-5e6c-464e-a3d0-044a957f5f20	48	standard
2554f50b-1ab0-4b5f-bd94-e92d1303357d	be67c07c-5e6c-464e-a3d0-044a957f5f20	49	standard
b059333a-0b3c-4195-8268-797bf347bd04	be67c07c-5e6c-464e-a3d0-044a957f5f20	50	standard
c2ae7e97-4735-4a6d-9895-20efedf46093	be67c07c-5e6c-464e-a3d0-044a957f5f20	51	standard
c6309744-1947-46e9-a471-548e2e1ec4cd	be67c07c-5e6c-464e-a3d0-044a957f5f20	52	standard
b0b5646d-60c4-4937-a3f5-93f148007eeb	be67c07c-5e6c-464e-a3d0-044a957f5f20	53	standard
316dc0f4-22b0-4e1b-8796-f71328795a8e	be67c07c-5e6c-464e-a3d0-044a957f5f20	54	standard
5ad29597-8be1-4b9f-b4c8-4289453bbcc9	be67c07c-5e6c-464e-a3d0-044a957f5f20	55	standard
1bb7fd04-3468-405d-8995-50e49c169fc9	be67c07c-5e6c-464e-a3d0-044a957f5f20	56	standard
4b5c4710-d4a1-4700-afad-e3772da4c053	be67c07c-5e6c-464e-a3d0-044a957f5f20	57	standard
359399aa-0593-4928-aedb-bac3ac2e8bbf	be67c07c-5e6c-464e-a3d0-044a957f5f20	58	standard
a9247871-0c80-4ee9-8036-87fc4a24006c	be67c07c-5e6c-464e-a3d0-044a957f5f20	59	standard
97dc195e-5abf-44e2-898d-da25b1b2e362	be67c07c-5e6c-464e-a3d0-044a957f5f20	60	standard
31ee15c3-f4a4-463e-bff5-89081b22dddb	be67c07c-5e6c-464e-a3d0-044a957f5f20	61	standard
fb279219-ba29-4640-b666-a76b1b0cf894	be67c07c-5e6c-464e-a3d0-044a957f5f20	62	standard
370d0fde-5813-468c-8541-c10d88cbf985	be67c07c-5e6c-464e-a3d0-044a957f5f20	63	standard
003cdb66-e3f8-4809-8404-ff113edfcd59	be67c07c-5e6c-464e-a3d0-044a957f5f20	64	standard
d53aae01-765a-4140-a3d2-729244284784	be67c07c-5e6c-464e-a3d0-044a957f5f20	65	standard
a4ce4d83-5dc1-4554-97f5-f062c84d2091	be67c07c-5e6c-464e-a3d0-044a957f5f20	66	standard
7aaa487c-0526-4725-8a4c-ad83eec9e0d7	be67c07c-5e6c-464e-a3d0-044a957f5f20	67	standard
ce7921a4-c585-46bc-ae02-1b353ec55d4f	be67c07c-5e6c-464e-a3d0-044a957f5f20	68	standard
f6166078-0f93-4e55-8c2d-b4b2d946773b	be67c07c-5e6c-464e-a3d0-044a957f5f20	69	standard
d2c3780f-83e2-4a47-baa7-d493d501bd33	be67c07c-5e6c-464e-a3d0-044a957f5f20	70	standard
df6ee98a-5a0e-47f8-ad88-d52668635ef3	be67c07c-5e6c-464e-a3d0-044a957f5f20	71	standard
19ff8fb2-57ac-4f60-aee3-45f6e4dc67fa	be67c07c-5e6c-464e-a3d0-044a957f5f20	72	standard
6983432e-ba04-4f40-88a5-ea0d4412965f	be67c07c-5e6c-464e-a3d0-044a957f5f20	73	standard
c784d228-5a97-4366-81c5-d2239271080c	be67c07c-5e6c-464e-a3d0-044a957f5f20	74	standard
530784cc-1633-4f0f-a01e-3544b29d5b41	be67c07c-5e6c-464e-a3d0-044a957f5f20	75	standard
3389d3d0-0096-499f-9274-0626189ead8f	be67c07c-5e6c-464e-a3d0-044a957f5f20	76	standard
a56d55e4-13ea-4fcf-ae0c-0cd6f8dbc2a6	be67c07c-5e6c-464e-a3d0-044a957f5f20	77	standard
29d17be9-aadd-45f9-a798-0bef9c1ce57d	be67c07c-5e6c-464e-a3d0-044a957f5f20	78	standard
a88861fd-d682-4602-a809-36037a8d6183	be67c07c-5e6c-464e-a3d0-044a957f5f20	79	standard
22ccb0e0-e25b-4265-a9b1-3441b0a8a8c7	be67c07c-5e6c-464e-a3d0-044a957f5f20	80	standard
d63d466a-66b2-436b-b8a6-e65b86e6515a	be67c07c-5e6c-464e-a3d0-044a957f5f20	81	standard
37e94ae0-0520-4336-a5af-a8bc2b455293	be67c07c-5e6c-464e-a3d0-044a957f5f20	82	standard
8d0715bf-6eaf-4280-a672-3cc72f44d2e5	be67c07c-5e6c-464e-a3d0-044a957f5f20	83	standard
8ea57090-e8bb-4d05-9ace-dc0f06dde758	be67c07c-5e6c-464e-a3d0-044a957f5f20	84	standard
16fe93e3-cbf6-4d55-b686-d85e48b049d9	be67c07c-5e6c-464e-a3d0-044a957f5f20	85	standard
3119b803-a656-4c25-9d22-ae494a209712	be67c07c-5e6c-464e-a3d0-044a957f5f20	86	standard
af0df20f-442d-429c-957a-f3b3a4285e86	be67c07c-5e6c-464e-a3d0-044a957f5f20	87	standard
89700447-9e0d-4897-8933-ce80cfb00b41	be67c07c-5e6c-464e-a3d0-044a957f5f20	88	standard
2e1f2cd8-b933-4c6d-93e1-1e8c56312d1b	be67c07c-5e6c-464e-a3d0-044a957f5f20	89	standard
80cb74d0-4837-4f4e-a741-5b64f5220e75	be67c07c-5e6c-464e-a3d0-044a957f5f20	90	standard
b60a78ae-ad0f-45a0-8163-99b4c19971aa	be67c07c-5e6c-464e-a3d0-044a957f5f20	91	standard
00d93f15-d39e-4013-991a-c2d641043140	be67c07c-5e6c-464e-a3d0-044a957f5f20	92	standard
935f17e1-49d1-41d6-86fe-51f7cd3bae77	be67c07c-5e6c-464e-a3d0-044a957f5f20	93	standard
b962459c-4aab-4a16-ae3c-df5696624d4e	be67c07c-5e6c-464e-a3d0-044a957f5f20	94	standard
8338921b-4f68-48bf-8048-183b12a9281a	be67c07c-5e6c-464e-a3d0-044a957f5f20	95	standard
f94ca258-f4ca-46b2-880f-daa88cb749f1	be67c07c-5e6c-464e-a3d0-044a957f5f20	96	standard
54d1c06b-f6ad-4d0c-b18f-9efbf7930aec	be67c07c-5e6c-464e-a3d0-044a957f5f20	97	standard
5e7368bb-5e19-4c82-8578-638a0bf9c471	be67c07c-5e6c-464e-a3d0-044a957f5f20	98	standard
27a7591e-4049-4420-9903-f33bdbc1c0db	be67c07c-5e6c-464e-a3d0-044a957f5f20	99	standard
7a7fc5c3-3f3f-477d-93e2-6b3415455c57	880b4520-80da-4e91-91d4-d1a301206dcd	1	standard
45a09265-ab34-41f0-8ce6-63138fb6991f	880b4520-80da-4e91-91d4-d1a301206dcd	2	standard
9a8c9773-1151-440f-935b-235ac905bf19	880b4520-80da-4e91-91d4-d1a301206dcd	3	standard
b3df70ad-682e-4158-b0bf-44148a2dcdbd	880b4520-80da-4e91-91d4-d1a301206dcd	4	standard
90f3fd2a-8810-41d5-ac72-f9a2b0b16196	880b4520-80da-4e91-91d4-d1a301206dcd	5	standard
097fe414-244c-40ff-8316-bb80840aec93	880b4520-80da-4e91-91d4-d1a301206dcd	6	standard
c352be43-a402-4c48-9cd8-a30135f72813	880b4520-80da-4e91-91d4-d1a301206dcd	7	standard
7e3fdf2d-dc42-4492-ad15-33d628116961	880b4520-80da-4e91-91d4-d1a301206dcd	8	standard
24e3ecf9-6330-4de9-aaa5-7e2a896b6a98	880b4520-80da-4e91-91d4-d1a301206dcd	9	standard
cc2c0a66-dcae-431b-bae7-11dd7ad8008a	880b4520-80da-4e91-91d4-d1a301206dcd	10	standard
a4614b8b-f67f-4938-8bf5-a00e6deae1d6	880b4520-80da-4e91-91d4-d1a301206dcd	11	standard
a33c5506-d437-44f9-bb57-177b15bc46db	880b4520-80da-4e91-91d4-d1a301206dcd	12	standard
93dcaa64-84e0-4618-8671-48b1ad245227	880b4520-80da-4e91-91d4-d1a301206dcd	13	standard
73778a59-5e3c-4fa3-a3fc-dc161f0c5288	880b4520-80da-4e91-91d4-d1a301206dcd	14	standard
88ad2868-df5a-40cb-b9ad-4dad20ef305d	880b4520-80da-4e91-91d4-d1a301206dcd	15	standard
fa22bfaa-ace7-4bc7-ab50-404478336419	880b4520-80da-4e91-91d4-d1a301206dcd	16	standard
aeb81ad6-de50-4950-ba7c-cf0544c013b8	880b4520-80da-4e91-91d4-d1a301206dcd	17	standard
1f6ead55-f35d-4431-b91e-7592e9cc8c60	880b4520-80da-4e91-91d4-d1a301206dcd	18	standard
27f78dd2-cd00-4fa1-9f53-53fb5cef4acc	880b4520-80da-4e91-91d4-d1a301206dcd	19	standard
7c4000e7-258a-4bc0-ba14-ef2a7852f792	880b4520-80da-4e91-91d4-d1a301206dcd	20	standard
4af9e954-fea9-4b67-98dc-20958b08b01a	880b4520-80da-4e91-91d4-d1a301206dcd	21	standard
2659642e-d8d6-48f4-89db-a4b6dabc7f25	880b4520-80da-4e91-91d4-d1a301206dcd	22	standard
3380c8dc-d6ba-4df2-95fb-7fff35024488	880b4520-80da-4e91-91d4-d1a301206dcd	23	standard
441c49a9-4e72-4543-bcd7-6da16e94a622	880b4520-80da-4e91-91d4-d1a301206dcd	24	standard
791e92db-5066-4e90-a486-cee1f2e04209	880b4520-80da-4e91-91d4-d1a301206dcd	25	standard
07a6e883-9fd9-4c12-821b-c675804affb0	880b4520-80da-4e91-91d4-d1a301206dcd	26	standard
7626c40a-f7d2-4af1-a3c0-27a427d14245	880b4520-80da-4e91-91d4-d1a301206dcd	27	standard
ca143501-260f-4b6f-8110-456f82b1c19a	880b4520-80da-4e91-91d4-d1a301206dcd	28	standard
12964b2b-8892-4170-92e2-074100872e7f	880b4520-80da-4e91-91d4-d1a301206dcd	29	standard
e7ebedb2-5947-40b2-b6cd-c8d6c4bf0b80	880b4520-80da-4e91-91d4-d1a301206dcd	30	standard
cb61cfbf-9c4f-44ec-a9ee-a345942a6211	880b4520-80da-4e91-91d4-d1a301206dcd	31	standard
902be625-65d2-4e7d-81e8-6a392c587602	880b4520-80da-4e91-91d4-d1a301206dcd	32	standard
1cc0e18f-8fa0-4a9b-a98f-bb85df4b6efc	880b4520-80da-4e91-91d4-d1a301206dcd	33	standard
392303ec-31c0-49d1-ba90-bf4e1f8c7d99	880b4520-80da-4e91-91d4-d1a301206dcd	34	standard
d265017b-9021-40ad-9cd2-04501fda4e7e	880b4520-80da-4e91-91d4-d1a301206dcd	35	standard
d97ceecc-bb51-411f-a45f-cc96cd7a5194	880b4520-80da-4e91-91d4-d1a301206dcd	36	standard
e737716d-afe5-4d6d-a158-96c4e1dbc5fb	880b4520-80da-4e91-91d4-d1a301206dcd	37	standard
d9bcd7dd-5737-4527-b971-7b706ef6c405	880b4520-80da-4e91-91d4-d1a301206dcd	38	standard
efae0166-0b7d-4baa-aecc-35fa1ed5a8be	880b4520-80da-4e91-91d4-d1a301206dcd	39	standard
5f1142d4-dacb-44f6-8861-b67e92db2235	880b4520-80da-4e91-91d4-d1a301206dcd	40	standard
6c8971f7-0706-40b1-8c13-faf660acc5a0	880b4520-80da-4e91-91d4-d1a301206dcd	41	standard
fd7ade4d-f0e8-48f6-b6ee-992429e30ae1	880b4520-80da-4e91-91d4-d1a301206dcd	42	standard
4e3de69f-599f-4c03-86c7-6ef04b6538f9	880b4520-80da-4e91-91d4-d1a301206dcd	43	standard
8d562766-36de-4555-b05b-2cb284f5b99e	880b4520-80da-4e91-91d4-d1a301206dcd	44	standard
e540273d-c5ac-44cf-a642-74ea30410262	880b4520-80da-4e91-91d4-d1a301206dcd	45	standard
79dfcde3-45e8-4244-8c06-22cbd578a44d	880b4520-80da-4e91-91d4-d1a301206dcd	46	standard
d7fc79a0-ab33-45ce-998b-ebf72404b4fe	880b4520-80da-4e91-91d4-d1a301206dcd	47	standard
96723a4f-f2ef-49c0-a6db-cf274e26568a	880b4520-80da-4e91-91d4-d1a301206dcd	48	standard
7c323d89-de5d-46ed-be78-7877305178e4	880b4520-80da-4e91-91d4-d1a301206dcd	49	standard
a687135a-7793-4359-8bfb-13d90e3ab395	880b4520-80da-4e91-91d4-d1a301206dcd	50	standard
efe5f87a-502a-4b90-89b3-901e77babfa5	880b4520-80da-4e91-91d4-d1a301206dcd	51	standard
3a0930e5-0b74-4902-9174-844b48e91d8c	880b4520-80da-4e91-91d4-d1a301206dcd	52	standard
72dee164-4067-412a-adb2-7b5e55c1eaec	880b4520-80da-4e91-91d4-d1a301206dcd	53	standard
a708a95d-8f42-4cb7-a658-76091fe1dfaa	880b4520-80da-4e91-91d4-d1a301206dcd	54	standard
96ca2df2-8f2e-4628-bdd9-fed51012960a	880b4520-80da-4e91-91d4-d1a301206dcd	55	standard
f1d47df0-f57f-4c5b-a933-e13e32d3820b	880b4520-80da-4e91-91d4-d1a301206dcd	56	standard
0c4f6245-a8d1-4f18-8ad3-e557c636b0fe	880b4520-80da-4e91-91d4-d1a301206dcd	57	standard
c2d62d54-05d7-453b-938d-74f33b58ef04	880b4520-80da-4e91-91d4-d1a301206dcd	58	standard
8fe23571-5fa1-4233-bd72-7f7ed44b6948	880b4520-80da-4e91-91d4-d1a301206dcd	59	standard
660818ff-9227-4641-a35b-817ab57ca672	880b4520-80da-4e91-91d4-d1a301206dcd	60	standard
c19449fb-cabe-4f7a-ad76-01ec9dd0a59f	880b4520-80da-4e91-91d4-d1a301206dcd	61	standard
3bff80f9-dd69-4a53-8d1c-d42e09c78c9f	880b4520-80da-4e91-91d4-d1a301206dcd	62	standard
88e31651-eb7f-496b-94ba-37550788babb	880b4520-80da-4e91-91d4-d1a301206dcd	63	standard
21f8b60c-3687-4bf4-bd1e-f9de05fc1f50	880b4520-80da-4e91-91d4-d1a301206dcd	64	standard
f85b4b3f-22cd-47b4-ab03-46363ebcf0f8	880b4520-80da-4e91-91d4-d1a301206dcd	65	standard
cce93454-0a21-45c5-bc06-5a42fae46252	880b4520-80da-4e91-91d4-d1a301206dcd	66	standard
a5506eb8-42c3-4b6f-9de0-513f8c6ac6d7	880b4520-80da-4e91-91d4-d1a301206dcd	67	standard
3acdb463-a6fc-4bae-9f5b-84cb49fd5f46	880b4520-80da-4e91-91d4-d1a301206dcd	68	standard
aaa5e2bb-0e50-4e1d-91c1-563f6c232bc6	880b4520-80da-4e91-91d4-d1a301206dcd	69	standard
aa07c32e-3e23-4710-9898-81aedf676ae6	880b4520-80da-4e91-91d4-d1a301206dcd	70	standard
2d2a1d65-8fe6-42cc-8b69-414e32a4e828	880b4520-80da-4e91-91d4-d1a301206dcd	71	standard
ccb92eb3-d9ec-4d7c-9427-3eb4f0ce53a1	880b4520-80da-4e91-91d4-d1a301206dcd	72	standard
49c48cbf-8b79-4cb8-abd4-c91a1bcc91d4	880b4520-80da-4e91-91d4-d1a301206dcd	73	standard
d8561cd4-e16b-4239-bc8a-be1f82e75a35	880b4520-80da-4e91-91d4-d1a301206dcd	74	standard
2603b5c0-8d5a-4fab-9bf9-b979fd99738b	880b4520-80da-4e91-91d4-d1a301206dcd	75	standard
5c574074-21cd-4346-8b84-b2f7aef59421	880b4520-80da-4e91-91d4-d1a301206dcd	76	standard
15db8b5d-8476-4c72-8edf-86ce9bce1689	880b4520-80da-4e91-91d4-d1a301206dcd	77	standard
d31b06dd-80a2-4b10-a150-a10c03fec768	880b4520-80da-4e91-91d4-d1a301206dcd	78	standard
3cccac7e-ca12-48a2-be47-60238ea46fa1	880b4520-80da-4e91-91d4-d1a301206dcd	79	standard
d39ed52c-983b-42f2-ba9b-828dc73716c2	880b4520-80da-4e91-91d4-d1a301206dcd	80	standard
fc39f585-daf4-49ab-830e-467e05dac954	880b4520-80da-4e91-91d4-d1a301206dcd	81	standard
71a17a2c-37b9-40e4-bfb7-256e307010b1	880b4520-80da-4e91-91d4-d1a301206dcd	82	standard
9f170fc7-8638-4ce2-9260-a134f74a63b4	880b4520-80da-4e91-91d4-d1a301206dcd	83	standard
ecae27c3-0e40-40a6-ba73-5eeab4ab4c8a	880b4520-80da-4e91-91d4-d1a301206dcd	84	standard
dc9d1741-8574-482c-82e2-be4d2608c3ff	880b4520-80da-4e91-91d4-d1a301206dcd	85	standard
e8c2a6fe-caea-410f-83e8-0d54d4338d51	880b4520-80da-4e91-91d4-d1a301206dcd	86	standard
9b76e888-7b84-4bed-8bbd-c301fb9ad714	880b4520-80da-4e91-91d4-d1a301206dcd	87	standard
523ee2f3-0167-4a9d-8512-611d0a70c894	880b4520-80da-4e91-91d4-d1a301206dcd	88	standard
30dba328-6c10-49fe-84fc-2646104441e1	880b4520-80da-4e91-91d4-d1a301206dcd	89	standard
b3b63af2-df8c-4894-a771-e6f22a779264	880b4520-80da-4e91-91d4-d1a301206dcd	90	standard
1a04df5c-9231-49c9-b31b-5677dd3604ad	880b4520-80da-4e91-91d4-d1a301206dcd	91	standard
d934b674-8178-4408-bc10-c046ee03aa69	880b4520-80da-4e91-91d4-d1a301206dcd	92	standard
dd458702-4576-4c91-bb77-5e68b45e876c	880b4520-80da-4e91-91d4-d1a301206dcd	93	standard
5f4c958d-8330-4a95-90f8-80a07687c34c	880b4520-80da-4e91-91d4-d1a301206dcd	94	standard
40aec7ab-0643-4974-9acd-44543244744e	880b4520-80da-4e91-91d4-d1a301206dcd	95	standard
aa143daf-90ae-4397-8d6d-f1db96a1893f	880b4520-80da-4e91-91d4-d1a301206dcd	96	standard
7ed35b37-c0bf-42e3-97d6-408065822a84	880b4520-80da-4e91-91d4-d1a301206dcd	97	standard
e6a81754-8a55-49dd-a8d4-1efa45630ff8	880b4520-80da-4e91-91d4-d1a301206dcd	98	standard
7a429770-299b-4731-82e2-93e860110b8c	880b4520-80da-4e91-91d4-d1a301206dcd	99	standard
3ad255d7-adf0-457f-9014-23bf9c5adb1d	880b4520-80da-4e91-91d4-d1a301206dcd	100	standard
11a949ca-09db-47d9-96cc-4cc85e00b777	880b4520-80da-4e91-91d4-d1a301206dcd	101	standard
d36826b0-68f7-4fbd-a51c-b6abac4e2ae1	880b4520-80da-4e91-91d4-d1a301206dcd	102	standard
314ccd0b-d053-4a83-86e2-e627464725bf	880b4520-80da-4e91-91d4-d1a301206dcd	103	standard
02dd1387-6d3a-4243-bbb9-6aeb47976672	880b4520-80da-4e91-91d4-d1a301206dcd	104	standard
93301ac0-4244-491b-8c41-a852d5409706	880b4520-80da-4e91-91d4-d1a301206dcd	105	standard
17a9e0ae-e1a8-4603-8993-5974d7c77c13	880b4520-80da-4e91-91d4-d1a301206dcd	106	standard
ab985e54-c945-45ea-ba70-22f81b2f1ba9	880b4520-80da-4e91-91d4-d1a301206dcd	107	standard
77a6dd18-b65a-4aef-a949-e46607d1afa5	880b4520-80da-4e91-91d4-d1a301206dcd	108	standard
8c4cca7d-90ce-4ff7-9e55-a3974b67bc89	880b4520-80da-4e91-91d4-d1a301206dcd	109	standard
b083e27d-ef9d-452e-9428-fe454913c6fe	880b4520-80da-4e91-91d4-d1a301206dcd	110	standard
c3873b6c-3ff6-4212-8b33-606a4c116365	880b4520-80da-4e91-91d4-d1a301206dcd	111	standard
598ed809-74e3-4418-a50d-11a876606a7d	880b4520-80da-4e91-91d4-d1a301206dcd	112	standard
52108e97-9564-4fb4-8480-0973e2667ed5	880b4520-80da-4e91-91d4-d1a301206dcd	113	standard
8230d20c-a932-468c-9867-2621f4285ab0	880b4520-80da-4e91-91d4-d1a301206dcd	114	standard
5a27f06b-ae29-4e3a-a4c4-a30b2699f945	880b4520-80da-4e91-91d4-d1a301206dcd	115	standard
5ba802e4-9b20-4600-8712-234d480cd82a	880b4520-80da-4e91-91d4-d1a301206dcd	116	standard
c6d122d1-83a8-4aff-8a3d-1d9e904f7746	880b4520-80da-4e91-91d4-d1a301206dcd	117	standard
9d603627-dd61-4453-97a2-d339232082d2	880b4520-80da-4e91-91d4-d1a301206dcd	118	standard
03148c88-d243-4e5e-a3b9-e8bb6fe85eaf	880b4520-80da-4e91-91d4-d1a301206dcd	119	standard
1fc17fcb-791e-407f-9812-3c940e004aee	880b4520-80da-4e91-91d4-d1a301206dcd	120	standard
082a8a27-e378-42f6-92d1-76325b9a22ff	880b4520-80da-4e91-91d4-d1a301206dcd	121	standard
a7a52476-f8f4-4636-8f6c-f79e43855526	880b4520-80da-4e91-91d4-d1a301206dcd	122	standard
c3022fc1-6112-4065-a698-b94a846af8c3	880b4520-80da-4e91-91d4-d1a301206dcd	123	standard
302cb349-73a1-4033-bfa8-a9a618028e24	880b4520-80da-4e91-91d4-d1a301206dcd	124	standard
5086c4df-7574-4b66-a4d6-03fa0b946edd	880b4520-80da-4e91-91d4-d1a301206dcd	125	standard
f982c044-c7b4-4fcb-9a79-719e0ec8378d	880b4520-80da-4e91-91d4-d1a301206dcd	126	standard
c71deaa7-1e82-46aa-8449-a5c3c8c6a19e	880b4520-80da-4e91-91d4-d1a301206dcd	127	standard
24876526-3a46-4e71-94f3-f97eff34fdf5	880b4520-80da-4e91-91d4-d1a301206dcd	128	standard
7423716b-f412-443c-8dbc-3438b0f538a0	880b4520-80da-4e91-91d4-d1a301206dcd	129	standard
71e544fc-a101-4d4f-9684-14121fe68961	880b4520-80da-4e91-91d4-d1a301206dcd	130	standard
247f2f08-19c5-468b-8b23-4b3e690a574b	880b4520-80da-4e91-91d4-d1a301206dcd	131	standard
71d30f59-be18-4920-815d-bff9c5bc6872	880b4520-80da-4e91-91d4-d1a301206dcd	132	standard
5f00a93c-00bf-4409-a318-2f1abd6a7d4c	880b4520-80da-4e91-91d4-d1a301206dcd	133	standard
efdba381-fc9f-4bd3-b635-b9162b0f4ce4	880b4520-80da-4e91-91d4-d1a301206dcd	134	standard
3aae44b6-0fde-4b8f-91e1-a4ed1667166a	880b4520-80da-4e91-91d4-d1a301206dcd	135	standard
79986233-ddeb-4d6b-b016-4492648552f5	880b4520-80da-4e91-91d4-d1a301206dcd	136	standard
b8836849-3a18-402e-a0c5-25f6f12fde8f	880b4520-80da-4e91-91d4-d1a301206dcd	137	standard
19a7f6ba-5dac-49a3-826b-5bf86ef63b82	880b4520-80da-4e91-91d4-d1a301206dcd	138	standard
b9227305-4dbf-4575-b524-8e264e473b4f	880b4520-80da-4e91-91d4-d1a301206dcd	139	standard
6d2c4958-e9ef-495a-84d6-ef6ea54a21e4	880b4520-80da-4e91-91d4-d1a301206dcd	140	standard
89a4117b-a7c8-4cac-a302-3c1cb623b16a	880b4520-80da-4e91-91d4-d1a301206dcd	141	standard
cd79cab2-5d1e-4344-8d03-541af7cceb2b	880b4520-80da-4e91-91d4-d1a301206dcd	142	standard
1f209680-3d45-4397-badd-cef76aa60c56	880b4520-80da-4e91-91d4-d1a301206dcd	143	standard
719bf2d3-360c-4568-9df6-a4fcf24c9c8b	880b4520-80da-4e91-91d4-d1a301206dcd	144	standard
a7921f03-8992-4213-9725-b93da6d1bfd0	880b4520-80da-4e91-91d4-d1a301206dcd	145	standard
3d9016ca-0b47-44a7-8f06-d575f7c3ebbd	880b4520-80da-4e91-91d4-d1a301206dcd	146	standard
f00c16dc-7f68-40bc-9972-6d9d5bd08998	880b4520-80da-4e91-91d4-d1a301206dcd	147	standard
6e9557e3-d766-4ddb-8855-b48127028609	880b4520-80da-4e91-91d4-d1a301206dcd	148	standard
3313544e-4747-4c59-b3df-5e26311b02d2	880b4520-80da-4e91-91d4-d1a301206dcd	149	standard
ffdc516b-d206-4d77-b92d-7cd58825fae0	880b4520-80da-4e91-91d4-d1a301206dcd	150	standard
f15c84be-f97b-44dc-8216-b21dfbd53459	880b4520-80da-4e91-91d4-d1a301206dcd	151	standard
4249ada9-9391-46fc-9ca3-d2fdc229da3c	880b4520-80da-4e91-91d4-d1a301206dcd	152	standard
95bc578b-57b5-4533-b1d7-4c34fd244b7d	880b4520-80da-4e91-91d4-d1a301206dcd	153	standard
bd6398fa-2089-4611-94b3-181798027d35	880b4520-80da-4e91-91d4-d1a301206dcd	154	standard
ea07dd29-592b-4793-80d3-a971475c434e	880b4520-80da-4e91-91d4-d1a301206dcd	155	standard
91644abc-7710-475c-bdca-04b77f94f714	880b4520-80da-4e91-91d4-d1a301206dcd	156	standard
80b5f9ff-723d-407f-96ea-38b216f1edd5	880b4520-80da-4e91-91d4-d1a301206dcd	157	standard
b15ffa03-dd02-4f5b-80ad-6071dff4a4e1	880b4520-80da-4e91-91d4-d1a301206dcd	158	standard
a79e0c27-e16b-4107-9f16-2b712380e3a9	880b4520-80da-4e91-91d4-d1a301206dcd	159	standard
d37abae5-49f3-403c-9e2e-9a0b901d7e6f	880b4520-80da-4e91-91d4-d1a301206dcd	160	standard
776db19e-9739-467a-b561-4e3f8ddf067a	880b4520-80da-4e91-91d4-d1a301206dcd	161	standard
374eb846-e2c3-4fbc-8999-a4b5fe44293a	880b4520-80da-4e91-91d4-d1a301206dcd	162	standard
b3911c93-c019-4759-a058-8ac0f2894712	880b4520-80da-4e91-91d4-d1a301206dcd	163	standard
e8e29ca9-2378-4dc9-9e88-11e4291d4c23	880b4520-80da-4e91-91d4-d1a301206dcd	164	standard
5e3e1d42-c9d3-4370-bf9b-f0ab362167de	880b4520-80da-4e91-91d4-d1a301206dcd	165	standard
cbed7323-f3dd-4cb0-aad5-301d883b0aec	880b4520-80da-4e91-91d4-d1a301206dcd	166	standard
ede7db8c-a5d3-4152-8768-7886cae5b237	880b4520-80da-4e91-91d4-d1a301206dcd	167	standard
22a6df52-e7e9-47f1-9eac-23abe0cd0483	880b4520-80da-4e91-91d4-d1a301206dcd	168	standard
d4bf88e7-3ced-4dca-af51-1faa0b05c410	880b4520-80da-4e91-91d4-d1a301206dcd	169	standard
30f606ad-678e-449a-a6de-2213d8d74289	880b4520-80da-4e91-91d4-d1a301206dcd	170	standard
226a7c8e-bef1-4e13-be80-5a8f3fbf5de4	880b4520-80da-4e91-91d4-d1a301206dcd	171	standard
2fe577c6-82a2-4dc9-aa7a-abba715db3c5	880b4520-80da-4e91-91d4-d1a301206dcd	172	standard
475d5409-ae95-4e42-9c4e-81f7558dc810	880b4520-80da-4e91-91d4-d1a301206dcd	173	standard
dcf7858f-d004-4868-b69c-fb8a1e206f6b	880b4520-80da-4e91-91d4-d1a301206dcd	174	standard
79931e30-08aa-4fab-922f-23e408a640aa	880b4520-80da-4e91-91d4-d1a301206dcd	175	standard
11c7454b-d19f-4eb2-a30e-7cff0a778e8d	880b4520-80da-4e91-91d4-d1a301206dcd	176	standard
fea048f1-1883-42ef-a47b-c636a68195fd	880b4520-80da-4e91-91d4-d1a301206dcd	177	standard
71324d06-c9a4-4ca9-a81c-f75098c17959	880b4520-80da-4e91-91d4-d1a301206dcd	178	standard
0a7c58f9-5fdf-4e54-a2db-60e398c864f9	880b4520-80da-4e91-91d4-d1a301206dcd	179	standard
add1cf8f-333a-4ba4-8195-656fd8aa3d87	880b4520-80da-4e91-91d4-d1a301206dcd	180	standard
6556d858-bfb5-410f-8eeb-c04ec789138e	880b4520-80da-4e91-91d4-d1a301206dcd	181	standard
aa5f3c0a-6312-4434-9635-7a03c968d5a3	880b4520-80da-4e91-91d4-d1a301206dcd	182	standard
22af7936-541a-46da-a388-23c14faa278d	880b4520-80da-4e91-91d4-d1a301206dcd	183	standard
8a558aa2-e0c4-426f-990c-392de19874c5	880b4520-80da-4e91-91d4-d1a301206dcd	184	standard
2430b7b8-900c-4611-ad02-c7522b2422e1	880b4520-80da-4e91-91d4-d1a301206dcd	185	standard
6dd39448-e5f9-41b9-83b2-dbbe0e9c5396	880b4520-80da-4e91-91d4-d1a301206dcd	186	standard
4b248ff9-cb0d-45e4-b600-c7f76013c3d4	880b4520-80da-4e91-91d4-d1a301206dcd	187	standard
b9c38a80-df4a-4417-aaba-392da1b6f590	880b4520-80da-4e91-91d4-d1a301206dcd	188	standard
21f813b5-86c6-430c-9e39-ab6c191359d4	880b4520-80da-4e91-91d4-d1a301206dcd	189	standard
d60c9613-8239-4f8f-972a-e66b6ffea356	880b4520-80da-4e91-91d4-d1a301206dcd	190	standard
988e0efa-5dc7-4147-837f-583e17aec248	880b4520-80da-4e91-91d4-d1a301206dcd	191	standard
f96db635-70bc-4ea1-a3da-2945ba668799	880b4520-80da-4e91-91d4-d1a301206dcd	192	standard
c8a089fd-b78d-4186-8caa-953bde19f8aa	880b4520-80da-4e91-91d4-d1a301206dcd	193	standard
e46409d3-ce20-4734-b035-fd5662eeb71c	880b4520-80da-4e91-91d4-d1a301206dcd	194	standard
7c48aa58-b1dc-4281-93b9-66b4a6c6208b	880b4520-80da-4e91-91d4-d1a301206dcd	195	standard
6bbf87df-cabc-42f4-a0f4-08406ddc2537	880b4520-80da-4e91-91d4-d1a301206dcd	196	standard
779c475b-5429-4fe1-a3c3-282052c0ff77	880b4520-80da-4e91-91d4-d1a301206dcd	197	standard
47dd1b58-5a93-4539-8974-e05d2022435c	880b4520-80da-4e91-91d4-d1a301206dcd	198	standard
858e6404-6aed-47ad-bcfd-87d309000499	880b4520-80da-4e91-91d4-d1a301206dcd	199	standard
850895c0-ed8e-45df-a564-e1aa6ef86a6f	880b4520-80da-4e91-91d4-d1a301206dcd	200	standard
8d1e69c2-4145-48e4-8101-7a3d2e16e125	880b4520-80da-4e91-91d4-d1a301206dcd	201	standard
de63605f-3c96-42a8-bbe8-428d6f46cfe3	880b4520-80da-4e91-91d4-d1a301206dcd	202	standard
f53075ce-8bb1-4d58-a870-bca29b841fde	880b4520-80da-4e91-91d4-d1a301206dcd	203	standard
947e437c-745d-45ea-99fb-bff60f380012	880b4520-80da-4e91-91d4-d1a301206dcd	204	standard
9e5446f3-7d49-4cb5-99b2-e67343d46c1c	880b4520-80da-4e91-91d4-d1a301206dcd	205	standard
5a1db0ef-bd0c-4a11-b756-0284313380be	880b4520-80da-4e91-91d4-d1a301206dcd	206	standard
f9fc43c9-267a-48fa-806e-285df113b6d2	880b4520-80da-4e91-91d4-d1a301206dcd	207	standard
fa7c9d30-8de3-4a05-a33d-80bc57f95be8	880b4520-80da-4e91-91d4-d1a301206dcd	208	standard
8c30629d-0b50-4356-a66f-0304bedaeaa3	880b4520-80da-4e91-91d4-d1a301206dcd	209	standard
b48f03e0-a745-402e-a947-15e78ca371ae	880b4520-80da-4e91-91d4-d1a301206dcd	210	standard
826c6e8d-2c38-449b-9b6d-a6df3007177d	880b4520-80da-4e91-91d4-d1a301206dcd	211	standard
b74d5124-63ce-4188-aa09-75a8285fa9d3	880b4520-80da-4e91-91d4-d1a301206dcd	212	standard
07a52f27-916b-422b-8074-d1a61049b628	880b4520-80da-4e91-91d4-d1a301206dcd	213	standard
9729ddc6-7880-46cf-a2ba-06cad6356f2f	880b4520-80da-4e91-91d4-d1a301206dcd	214	standard
edec31e4-253a-4c5d-b4c7-113dbfee082e	880b4520-80da-4e91-91d4-d1a301206dcd	215	standard
b5b04df9-5098-4172-b67c-2a43b6bbcb38	880b4520-80da-4e91-91d4-d1a301206dcd	216	standard
dc227763-b228-422f-8959-57d4194a3471	880b4520-80da-4e91-91d4-d1a301206dcd	217	standard
8da901d4-3bc6-4f2d-ba64-188b80c2d51c	880b4520-80da-4e91-91d4-d1a301206dcd	218	standard
2cede224-93b3-4925-8065-1cf424abb2f0	880b4520-80da-4e91-91d4-d1a301206dcd	219	standard
583d6196-a444-40b5-a972-c980eca461d0	880b4520-80da-4e91-91d4-d1a301206dcd	220	standard
089050f9-8da2-4d11-89ab-6ce40162b8e5	880b4520-80da-4e91-91d4-d1a301206dcd	221	standard
8fd631cb-bc7d-47db-a930-19fd1beb0740	880b4520-80da-4e91-91d4-d1a301206dcd	222	standard
52ac9214-a282-4e50-9e10-071973b84f70	880b4520-80da-4e91-91d4-d1a301206dcd	223	standard
98364e51-1eda-423c-a1b1-68990b71c99c	880b4520-80da-4e91-91d4-d1a301206dcd	224	standard
2e87fa9a-dac4-4b5f-b9aa-0d1c3d137cc3	880b4520-80da-4e91-91d4-d1a301206dcd	225	standard
0255aeb5-0b1e-4834-985d-3ae2cc3d2a30	880b4520-80da-4e91-91d4-d1a301206dcd	226	standard
f31c44c2-f5a6-4410-b2c5-b7879cb55615	71ac0f6f-4055-463e-aa34-16f64db39870	1	standard
563aaff9-5abd-467d-9555-323cd25dde43	71ac0f6f-4055-463e-aa34-16f64db39870	2	standard
c09c0b0d-8cec-46b0-a403-d354cf47be14	71ac0f6f-4055-463e-aa34-16f64db39870	3	standard
209e2f21-b3e1-4129-8519-cbd22df53701	71ac0f6f-4055-463e-aa34-16f64db39870	4	standard
b01f59b5-a914-4cb9-b551-74223fc2bfdb	71ac0f6f-4055-463e-aa34-16f64db39870	5	standard
29d26197-909e-43d9-ad57-58295262d6b5	71ac0f6f-4055-463e-aa34-16f64db39870	6	standard
2b5a980a-5f8b-4670-b58a-53511e608cc7	71ac0f6f-4055-463e-aa34-16f64db39870	7	standard
1715d3b3-de30-49b4-811b-f5dec4ced4da	71ac0f6f-4055-463e-aa34-16f64db39870	8	standard
6ca94a85-1335-4cff-8337-092b2c8be00d	71ac0f6f-4055-463e-aa34-16f64db39870	9	standard
70dc35cc-1288-45da-9e95-f545a1a49fbd	71ac0f6f-4055-463e-aa34-16f64db39870	10	standard
f0d28516-3673-466e-b9ba-cd79de5cf980	71ac0f6f-4055-463e-aa34-16f64db39870	11	standard
1816dc65-1edc-4a7f-8746-52fe6122e695	71ac0f6f-4055-463e-aa34-16f64db39870	12	standard
3e84099d-669d-487a-b8a4-d3fcb4b94145	71ac0f6f-4055-463e-aa34-16f64db39870	13	standard
39189cb2-38e8-46d3-97ac-de0de5f1942f	71ac0f6f-4055-463e-aa34-16f64db39870	14	standard
03ef74e1-11a9-4b62-a672-2616d1073770	71ac0f6f-4055-463e-aa34-16f64db39870	15	standard
db8344a1-3242-434a-a3d0-c615a5ee242b	71ac0f6f-4055-463e-aa34-16f64db39870	16	standard
13423aa0-e505-412e-8ad4-f975dea3a056	71ac0f6f-4055-463e-aa34-16f64db39870	17	standard
8edafba8-5abe-401c-97fb-518671cad5d7	71ac0f6f-4055-463e-aa34-16f64db39870	18	standard
a6bcf1e7-f6e8-4060-9c44-533445085116	71ac0f6f-4055-463e-aa34-16f64db39870	19	standard
d666a205-ca27-4c0e-9d55-9068d895a733	71ac0f6f-4055-463e-aa34-16f64db39870	20	standard
5cc9a150-7267-484d-9806-77560788fe2e	71ac0f6f-4055-463e-aa34-16f64db39870	21	standard
416bb505-6c1e-46f4-af2d-7a9e177bca03	71ac0f6f-4055-463e-aa34-16f64db39870	22	standard
5a6c75b0-de18-435b-81d6-8a943ac45dbb	71ac0f6f-4055-463e-aa34-16f64db39870	23	standard
afefabdc-c377-42f7-9fdd-a94d0d0dd8f1	71ac0f6f-4055-463e-aa34-16f64db39870	24	standard
657457e3-caef-4032-820b-15fdeec52fc3	71ac0f6f-4055-463e-aa34-16f64db39870	25	standard
ea3fc4e7-a60e-4c1c-8a99-5cdffaf9eb89	71ac0f6f-4055-463e-aa34-16f64db39870	26	standard
c901319d-884a-4271-8aa6-f33bf643dfed	71ac0f6f-4055-463e-aa34-16f64db39870	27	standard
6752fc06-263d-4473-ac2d-3bc9a327acdf	71ac0f6f-4055-463e-aa34-16f64db39870	28	standard
220ba28c-0c53-49bf-974f-dde417d00ac6	71ac0f6f-4055-463e-aa34-16f64db39870	29	standard
6e88a4be-c23a-40d6-ac63-791de371688a	71ac0f6f-4055-463e-aa34-16f64db39870	30	standard
4e1ecb33-4b84-4685-9d98-961a75e404af	71ac0f6f-4055-463e-aa34-16f64db39870	31	standard
b2667ce1-3e4d-4c58-bd16-78a9a0c5d470	71ac0f6f-4055-463e-aa34-16f64db39870	32	standard
acb50e3a-2029-463a-a95d-9728319f18b4	71ac0f6f-4055-463e-aa34-16f64db39870	33	standard
d8660d35-3fb2-4bf2-bff6-710a01b05a16	71ac0f6f-4055-463e-aa34-16f64db39870	34	standard
0795fd52-8b51-4cd0-8e12-6e7364a19a73	71ac0f6f-4055-463e-aa34-16f64db39870	35	standard
ef583142-c7af-4d38-b071-7b9f634a3e86	71ac0f6f-4055-463e-aa34-16f64db39870	36	standard
9d8b584d-dd5a-478c-9afd-dcda069598bf	71ac0f6f-4055-463e-aa34-16f64db39870	37	standard
e4d0ba02-103c-4589-9f27-2f45848fffe8	71ac0f6f-4055-463e-aa34-16f64db39870	38	standard
731cff5c-03e4-41e3-a1be-d2baf2bd9bd3	71ac0f6f-4055-463e-aa34-16f64db39870	39	standard
5b062a4c-2016-4271-9792-da1b9eda581e	71ac0f6f-4055-463e-aa34-16f64db39870	40	standard
aca6cb17-592f-4ae0-b41e-a1ed79021a44	71ac0f6f-4055-463e-aa34-16f64db39870	41	standard
f8c508f1-4020-4953-a0c3-3b225cce4d16	71ac0f6f-4055-463e-aa34-16f64db39870	42	standard
02379408-d1f0-45aa-9d9e-c5972a40d967	71ac0f6f-4055-463e-aa34-16f64db39870	43	standard
c8e6753b-21d8-4b62-b2fc-8c795ba5d708	71ac0f6f-4055-463e-aa34-16f64db39870	44	standard
8f6307d0-d85a-4f02-8ad1-f80ddb1fd760	71ac0f6f-4055-463e-aa34-16f64db39870	45	standard
b2ad68a5-b04b-49b0-a0ad-ffd04c36bd7e	71ac0f6f-4055-463e-aa34-16f64db39870	46	standard
d3816027-f7aa-48f7-9096-5fd016cecb50	71ac0f6f-4055-463e-aa34-16f64db39870	47	standard
5b233f2a-1e3f-4c90-a25a-796f39ba0f8f	71ac0f6f-4055-463e-aa34-16f64db39870	48	standard
8524e7e7-9fa4-4372-9769-2a49208dc31f	71ac0f6f-4055-463e-aa34-16f64db39870	49	standard
d90587ea-5bf3-45f2-916b-f3203e21150e	71ac0f6f-4055-463e-aa34-16f64db39870	50	standard
bd872ace-a4de-4be9-a689-56df5ff2b432	71ac0f6f-4055-463e-aa34-16f64db39870	51	standard
22432df1-9cd5-43a0-a3af-7e343243b025	71ac0f6f-4055-463e-aa34-16f64db39870	52	standard
7597cdac-ecdb-419e-bfff-8816002c2a57	71ac0f6f-4055-463e-aa34-16f64db39870	53	standard
f9107ad3-30ae-4af8-a3d8-6704088ae308	71ac0f6f-4055-463e-aa34-16f64db39870	54	standard
a58345ee-ca67-43b7-bef3-9b6bd11f750b	71ac0f6f-4055-463e-aa34-16f64db39870	55	standard
33ef3ef3-145b-4b84-a814-946bf7c445e4	71ac0f6f-4055-463e-aa34-16f64db39870	56	standard
dc443f53-20d7-46ad-8ea0-6a16d3bef28b	71ac0f6f-4055-463e-aa34-16f64db39870	57	standard
1fa4f8fa-fb00-4853-8e2f-d2e92a81af13	71ac0f6f-4055-463e-aa34-16f64db39870	58	standard
6d523597-0030-40d6-87cf-65c120014b31	71ac0f6f-4055-463e-aa34-16f64db39870	59	standard
63a4742f-f641-451d-bead-9216689a83b6	71ac0f6f-4055-463e-aa34-16f64db39870	60	standard
a1990a20-9377-4d0a-9ad1-e7b2bf3b5d48	71ac0f6f-4055-463e-aa34-16f64db39870	61	standard
1d6bddbc-05c6-4639-be63-b7af0f0f2021	71ac0f6f-4055-463e-aa34-16f64db39870	62	standard
cfcd575d-6f42-4044-81a3-0fafafceddd2	71ac0f6f-4055-463e-aa34-16f64db39870	63	standard
b3abf7b6-0a07-4120-95e5-2b4ddd8276b4	71ac0f6f-4055-463e-aa34-16f64db39870	64	standard
88bd2171-219e-4596-b01b-e0fd367fd49f	71ac0f6f-4055-463e-aa34-16f64db39870	65	standard
abb764cf-060e-4c94-8b9c-ffe35e9b1100	71ac0f6f-4055-463e-aa34-16f64db39870	66	standard
fdd22ea0-b9e6-43a3-b968-f691c5b6c549	71ac0f6f-4055-463e-aa34-16f64db39870	67	standard
4068cd07-d944-45a3-beb9-03d1f1ab8f94	71ac0f6f-4055-463e-aa34-16f64db39870	68	standard
c28d9734-58b7-4f4f-9695-b3afb185d80f	71ac0f6f-4055-463e-aa34-16f64db39870	69	standard
9a17cafb-144e-471c-89cb-b93307d7ea53	71ac0f6f-4055-463e-aa34-16f64db39870	70	standard
3df8b67e-ded0-481e-b25f-7a1f157a83f7	71ac0f6f-4055-463e-aa34-16f64db39870	71	standard
2e75cdb0-39f2-4f4e-9553-600144c0662f	71ac0f6f-4055-463e-aa34-16f64db39870	72	standard
1aeecd31-973f-4e9e-9f65-b500228f4db6	71ac0f6f-4055-463e-aa34-16f64db39870	73	standard
38846108-1a63-4daf-ab34-a3d045817a45	71ac0f6f-4055-463e-aa34-16f64db39870	74	standard
78070d0b-aadc-40c7-9845-6f1d50b0692d	71ac0f6f-4055-463e-aa34-16f64db39870	75	standard
7d2361c0-feea-4cec-b7d6-d2163edaaa2e	71ac0f6f-4055-463e-aa34-16f64db39870	76	standard
6803fa3f-74d6-4248-b1ae-a382962d5e45	71ac0f6f-4055-463e-aa34-16f64db39870	77	standard
ec54ef3b-c6ef-4739-90af-0ba7f5709961	71ac0f6f-4055-463e-aa34-16f64db39870	78	standard
d2acb060-33ca-4f6a-a676-39c7e42ea64e	71ac0f6f-4055-463e-aa34-16f64db39870	79	standard
1ae762a4-923a-4abe-b065-d42c40605fc1	71ac0f6f-4055-463e-aa34-16f64db39870	80	standard
591d08e1-8f50-42fe-ae21-7cebd6ba63b4	71ac0f6f-4055-463e-aa34-16f64db39870	81	standard
134336d2-25a1-45ec-9bed-47001803241f	71ac0f6f-4055-463e-aa34-16f64db39870	82	standard
13455732-799c-40b5-bb7a-b17c39990890	71ac0f6f-4055-463e-aa34-16f64db39870	83	standard
900e6272-51a2-433d-a1cb-b6470e3dc06d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	84	standard
91eb67a6-e27b-4614-b5c9-9bc05e2b0cad	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	85	standard
ca94042a-2ec0-49bb-a3ff-87f76f8c54c0	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	86	standard
474be26c-3690-4f59-baad-d86fbf1451f1	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	87	standard
d132d6b9-9fda-41d3-8b24-5f9bc9a0d166	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	88	standard
21ccc442-109b-41b9-9589-44834e8f0a49	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	89	standard
a56982a1-3e5d-4362-9834-541cd71d6243	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	90	standard
238e26b0-7dde-4f19-adaa-9dbc2cbc298f	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	91	standard
5d465cc1-ec93-489a-911b-81f0e2bcb74a	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	92	standard
0d4b8fb5-967d-4705-83d0-31a1e650a1d4	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	93	standard
526b3c14-3637-481d-8654-b9bd49490b15	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	94	standard
5e16912e-7659-4c93-932b-a76f34518b11	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	95	standard
a8401ca9-dc12-491c-85f0-aae5b36cac0f	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	96	standard
631f4d8b-abd4-40c5-98a9-2c4157bf221c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	97	standard
db099b07-3dad-415c-b9bd-a3e57704af72	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	98	standard
77054c99-56aa-4fad-9e46-5f7997599ce9	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	99	standard
498d2779-4335-4898-a5ed-04bbe35c1150	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	100	standard
23c5d017-906f-4653-8d6c-809ed38b7a4c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	101	standard
294de3bb-ffe7-4232-982c-a1af75a56a62	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	102	standard
9a1ce211-e788-4a83-9283-dcc6aa02038d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	103	standard
ccfbfef0-46f7-4dd3-9f01-d9e68b0751e2	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	104	standard
34bd5428-22d9-4a74-84b4-939403a39919	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	105	standard
67617f87-c8eb-4bab-bd42-d5137a0dbb52	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	106	standard
94818973-fbae-4637-ba01-850ee097eb30	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	107	standard
78827677-f8d0-41a4-bc50-0a06a617641d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	108	standard
1a77bbcf-15ac-41f0-aa34-1b04bfa2ac5e	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	109	standard
0ae2b648-0384-4be5-bd71-af14a066192d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	110	standard
896e88cf-7037-4e1b-92e9-868091b90a5f	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	111	standard
8ba05c94-498d-49d5-bca2-c94a2e744019	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	112	standard
55908b11-b5a7-4e46-bc19-1d9e162e0aa9	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	113	standard
94283560-10d2-47f1-a89f-a21484434a32	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	114	standard
8c6fc65d-9225-4a0e-b7b8-15a568d8a3de	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	115	standard
358de34e-0fbc-4543-a8ee-3a497c2280a7	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	116	standard
3d842a85-63df-44bf-b14a-a6f1684b34bc	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	117	standard
b1fc0a0e-4d9a-4187-8559-2f75b6002a97	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	118	standard
80d2e54a-0832-41fc-ad3b-df209c69f543	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	119	standard
18369f52-7240-48c9-b9d8-4a3390accfd1	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	120	standard
8d14ad51-f08f-4b2f-ad76-fd3d3e886ff0	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	121	standard
74d2f1f6-77ab-4a01-b8fc-2ce6d825c365	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	122	standard
2dd92977-c80b-4663-88bf-32051a44659b	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	123	standard
95888e0e-e88f-4081-903c-06e659e1a585	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	124	standard
293df925-1096-4d8f-af34-04051f6a5c7e	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	125	standard
dfe6e5b6-322e-4a00-b54c-42a2d7f2a84e	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	126	standard
62a5a5a7-c125-4a10-b476-30fc40d2aa97	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	127	standard
d4fbe357-1937-4939-9a17-678b6494ccd7	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	128	standard
26c8f22a-a7b5-4659-9f86-e33e56560b00	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	129	standard
d78e8376-31ea-4c7a-a6ac-0096c5b24876	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	130	standard
5a84ff83-8595-42db-aff8-58956225f43c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	131	standard
0916bfcd-b3bb-48cf-ac5b-a55cf1938c99	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	132	standard
f360a2eb-5459-4d84-a285-5c649ee73cab	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	133	standard
36ed909d-ce1b-4e17-bdf8-0d6efcd2445b	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	134	standard
bf53ad4b-6eff-443e-bddc-e4b3e7c4e5c8	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	135	standard
b5a5bf35-8e62-4820-8a38-9edb0883c88a	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	136	standard
d35fdeae-216a-4a91-bf61-bbad670d015c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	137	standard
8f46d183-6d90-48ea-9ca5-6e6c3543d729	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	138	standard
7e27b2b9-d0ea-458c-af55-587368c33df9	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	139	standard
7a1f7c70-80e6-43bb-880b-30f1fcac2ed3	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	140	standard
e9c1724b-e051-4903-8541-124dbcb27139	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	141	standard
4ee52791-38bb-4c06-91bd-734a2fa3f3f4	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	142	standard
aa388ca6-4f40-4f0c-b8f9-99085067418c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	143	standard
e9e2f64a-3d55-4f5b-a3d7-fb2a70171d2d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	144	standard
fc03a2c4-3d95-4afd-a2c2-4d9e68e81515	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	145	standard
17ffe4c3-0a4a-437a-9904-b31ae2ebfb93	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	146	standard
250fe53f-a967-40bc-b2f8-bd79e7d29d1a	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	147	standard
a35a28c6-c82d-440f-af3f-a12912d61cd3	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	148	standard
ea2d00fc-a5f8-412b-8390-30843eccb6c5	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	149	standard
1594dd05-d012-496a-8f78-02d6f8f6c3a3	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	150	standard
ca522cb5-69ae-4624-8b73-ab01b06867e8	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	151	standard
b3844ee1-43d9-473d-84f0-95be5e81e6fb	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	152	standard
4ac1b31d-b29c-441f-9040-d286ea9e8b2b	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	153	standard
a2095916-d39c-4aca-a5da-2107e2f61473	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	154	standard
e3f99537-ad48-482a-8eb7-a93ff3fe184e	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	155	standard
e73588e6-efd2-45ad-b9ca-2c94b1cf3a96	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	156	standard
28fb2b55-55ba-4a69-92c4-86e89123d647	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	157	standard
5556b838-e13f-48e6-a67c-62b34226c580	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	158	standard
e33cc9ed-dff3-4548-8955-5edae562d6fe	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	159	standard
f535c847-75c5-4462-99cd-8e3865e4c5ae	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	160	standard
d8cae6d7-b505-41ae-8b57-74dd7b481a50	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	161	standard
b8458c4f-e5f4-4e61-8db6-1952077b9fa7	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	162	standard
9f643249-196e-4262-80ad-5e86ae1f026e	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	163	standard
9778e3d9-3b96-45b0-bf8b-17fe81b275e9	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	164	standard
374427e3-a91c-4cf9-a957-88495ade0038	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	165	standard
27beb0db-c1fd-4edd-98d4-2d00818667e6	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	166	standard
4326c0d7-79f8-4c86-9671-4318b55ac1dc	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	167	standard
db59d864-1173-4023-bb33-acc052bc7db7	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	168	standard
7b46d29a-4985-420a-b1dd-d5863463f082	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	169	standard
27d62430-3c2c-4cce-9bd6-657199ea7e81	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	170	standard
5e090c0f-42f0-4a15-97f8-071944b456a9	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	171	standard
570ef21b-e826-456a-975b-7709fe968322	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	172	standard
0cd02f19-0701-4417-991d-579cafefdd75	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	173	standard
1c07cb7a-8f80-4a69-bf50-331e027c791a	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	174	standard
b25c4970-4828-4b45-b8a6-03c450d47f46	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	175	standard
f1112842-9f7b-40ad-a659-dbddfb0797c6	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	176	standard
b40d0c7d-e5a1-421d-863e-4ffa2cfab162	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	177	standard
a2ccde3e-cd25-4813-8e08-22dd8fe73baf	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	178	standard
778ddf11-af1f-4d0e-bf70-84e505a7ec45	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	179	standard
a857f1b0-9994-4a5c-b73e-5db636786541	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	180	standard
198dbc47-3a5a-46b9-bcd7-b11549931c16	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	181	standard
de2287ce-0eb0-4822-b906-f1ec836ebc1c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	182	standard
1d2055a5-d866-4bd5-ad32-fbd45441516d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	183	standard
10f80287-4f22-47b9-9d74-7c49f0fbcdfa	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	184	standard
0dc7eda9-c71e-4877-bfda-301ed54272dc	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	185	standard
d5c65836-39e8-48c2-87cc-42abdc24598c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	186	standard
6625cf58-86ee-4144-944b-05894a13d7b6	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	187	standard
5f614069-8f25-41dd-b361-a5e3dd59e4a4	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	188	standard
41d7dc5e-95a0-40e8-a54e-1a83f7ad3ee8	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	189	standard
4faf8b67-c3da-4757-b6f5-304198cb794f	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	190	standard
b588e934-a1cc-4b2b-a01e-f7e554d1a7aa	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	191	standard
3f901970-f0cc-4a12-b993-2630ea05a43c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	192	standard
d8e7603e-c32c-4e77-89cc-640f2c71550e	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	193	standard
5ab370ef-e297-4df5-b0bb-7c4054854b1a	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	194	standard
e87243ea-0784-4f2e-8b83-688fd78c27a0	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	195	standard
234b7dca-0dec-4e63-ab5d-0fbb03e2af2f	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	196	standard
23e07764-f309-4470-9875-eec7c9e2b212	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	197	standard
81f6d790-e700-436b-accd-97f332ec1645	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	198	standard
56547404-80eb-439f-8ffa-9a94e6d9e93c	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	199	standard
0b3570e1-f97a-4711-9b2f-b2854f0573de	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	200	standard
6d8608fc-7baa-491e-9de7-55e15190abd0	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	201	standard
552f65ef-b5c9-4723-885d-b137891fe24d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	202	standard
1f7d9db1-6f94-4e1c-9e21-6dd523d39f85	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	203	standard
334e1981-c3cc-45c9-8a3f-f7d777868428	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	204	standard
8d70b63e-2ab4-4c1d-8dc2-5298b3aa917a	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	205	standard
94923038-7367-4a22-9f55-4c1daef8de62	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	206	standard
c9bc7632-7939-43b1-b26e-043c0fa32772	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	207	standard
f14ebb08-6c9c-441e-81ca-4ba299c1c9ed	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	208	standard
d90be934-8d9c-4bbf-8e9c-6a5bdcffb90d	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	209	standard
fb00dc07-f8f0-497a-8fe1-49f65c82bcd9	0a6ebe76-52ad-4f09-9d91-06dcb585d34c	210	standard
a42f689a-c835-4cf9-95d1-72af43978541	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	1	standard
dcea6a4c-bda3-4a31-87dc-0f002c54262d	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	2	standard
95273977-e7c8-46a3-bc98-69c69b9e3333	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	3	standard
1c4b0db9-f823-4048-9c69-c51ccfa3ea12	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	4	standard
c479056f-1412-4360-b276-665f44832dd0	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	5	standard
fecce28e-6d22-45f8-a7d7-759f27ab5dca	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	6	standard
1e43d149-69c3-430a-8cd2-192755e0b363	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	7	standard
d2a3b76e-2aec-4066-a0e0-11721fbb93fd	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	8	standard
73f6f379-20da-4edb-8dec-87bd2d152634	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	9	standard
c7553852-e28f-422e-bfb4-315c76a4d72e	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	10	standard
b567f486-e904-4ba7-9279-215d84010a92	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	11	standard
c2069c38-8f77-48ae-8b8f-ca92beeb7324	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	12	standard
7db6cc92-3424-483e-8b03-5143fa7500ea	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	13	standard
84da1944-e22f-4b7e-90e7-3eee14920068	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	14	standard
51b9fbfc-0a52-49ee-a805-78cf037a438f	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	15	standard
bfd62576-d890-4558-80e6-7f7285babd43	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	16	standard
bdef74f4-50fd-4692-9004-ae6dd2d67bd8	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	17	standard
5af86da9-1079-4a62-9a18-820eb5bc5446	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	18	standard
30b10e53-d9b0-4417-b1e8-d54c06f1b0e3	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	19	standard
2f15204b-dee6-4e03-946e-2917cd47255b	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	20	standard
944ce14b-2cbe-44b3-9bb9-5ecb981fcb02	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	21	standard
747c1679-971a-4c2d-bf33-798db0185e98	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	22	standard
e4277612-b335-4965-9dba-1ddfcfc5b5c3	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	23	standard
e4288bad-3ceb-4020-9128-ee061e207717	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	24	standard
51f531ce-0d3c-4308-972d-f2d75dceecb9	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	25	standard
62b41068-73bf-443e-898b-f4319396ae93	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	26	standard
ea908034-cbaa-4660-a799-ea389d9cbf78	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	27	standard
a875fcce-b064-43b8-a0d9-cd02577a9aa2	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	28	standard
aa01abcf-7858-4027-9b09-0d1503b5e38b	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	29	standard
9b4b0bfa-df1c-4258-b43c-1cc84298521d	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	30	standard
aa0cbe49-33d7-4d07-88d3-f255ef4b4977	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	31	standard
3886ac7e-60c7-4ced-93f9-cdb4ef842545	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	32	standard
f4d0128a-3482-47f3-9a5a-762171669ea8	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	33	standard
25dac86b-ba04-4d8b-a44d-ec850b2c97c6	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	34	standard
944fefcd-0a6c-4ff2-ad8f-ffe0a52b80c0	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	35	standard
6161beff-ffbe-4e6f-862a-c4f8bbbb3f95	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	36	standard
d4d6ec95-7030-42ed-a4f0-e50458618374	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	37	standard
bfa57a09-ddc7-4479-89f7-217734d3db5e	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	38	standard
a28f1baa-e942-4a58-a78e-14c140a6197c	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	39	standard
c243a3ed-ae30-46a7-80f3-deafb156640f	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	40	standard
992800ba-b502-47d2-93da-aca3f1735823	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	41	standard
c8ec24e6-4b5e-42df-a2e7-de1a8226efaa	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	42	standard
2fdfbe1c-f9a3-4c47-903a-1f49cb632554	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	43	standard
8dbfb8f8-a0fe-4a15-895c-91b4b4ac2aa4	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	44	standard
dc602aad-4309-4730-aeaf-27efb41e6a25	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	45	standard
83329b31-6a9e-4043-9a2b-b9387682f5c5	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	46	standard
a2e6d787-5dfc-49ad-a6c3-45385168b064	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	47	standard
f171620e-9aa9-4810-8ea6-82313994cc19	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	48	standard
aa7ce257-1441-4c96-83aa-29dea6ad4e39	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	49	standard
cf68c9a7-83b7-43d2-b235-2140f02f8bba	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	50	standard
46fa2cf7-663d-45bc-814e-43af2b391197	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	51	standard
51957782-bf22-423f-94b0-859adb51acd6	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	52	standard
ab28f8eb-ec4b-4afa-8b16-e4fa324dcfbc	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	53	standard
d7a4d0cb-8fca-4b54-ba28-9fa4e70a5bfb	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	54	standard
c66c3189-a9fe-44dc-a146-eadb12f629d6	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	55	standard
59685bc7-983b-4541-8765-70286c6fc0c2	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	56	standard
d419d016-9a00-4588-b703-65fd57bfd581	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	57	standard
84c9c6eb-7f58-4338-9ef5-eb44bd2ebf39	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	58	standard
7628814a-6223-4562-996b-7e6e3f5cc2f0	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	59	standard
3f4e7b71-e01b-41ba-b4b2-21361ba41d32	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	60	standard
146f3e6b-0183-44bc-a9b9-b0d191bdb438	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	61	standard
2ea2edd3-bf2f-4c93-93af-1eb2177741ea	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	62	standard
285185c8-cb25-45b2-b941-52ec7caaa2f2	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	63	standard
1498d648-855a-456c-87c6-c653b54aa97a	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	64	standard
f3b3c56e-ff20-4c3d-b3c0-bc3085012515	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	65	standard
652c20ba-9acb-49d0-a63b-3603c0dbd5b3	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	66	standard
012c8c6e-d9a5-4fb9-80c8-5929a2bc2074	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	67	standard
5876f83e-8179-4e74-b84e-a19f336d5657	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	68	standard
fa5813c8-05c7-409b-a381-79e491448caa	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	69	standard
97b40173-5513-4470-990f-a534abd5fdb1	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	70	standard
5192ca93-0b0f-4c47-bb52-7f2c0f74b505	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	71	standard
2345ee7a-b5b9-45af-9ba9-a66d784ab157	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	72	standard
e89d6b61-ff8a-450a-ad3a-973661491221	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	73	standard
d24338ae-0004-49b1-99a9-73759f0f4822	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	74	standard
64d31253-f335-40fa-8fdf-b599d4e741c3	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	75	standard
72eff924-1451-4984-9500-18c9e3a50ec7	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	76	standard
b86b607b-c576-4c97-ad90-186f5e57ca9a	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	77	standard
513a0705-320d-41df-9a0a-8f1e4d058923	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	78	standard
de30a0bd-5609-4ca9-a37c-8a868493c6bb	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	79	standard
e2100da8-b22e-4dfa-b7c6-fb200febe21f	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	80	standard
76d44dd0-e43d-4b44-b2b2-03c0a4bd5117	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	81	standard
d8225bba-a1bf-4ac2-ae88-9c8c5090df65	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	82	standard
b5b45e05-c260-49dc-9edc-cf392dd5f8c2	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	83	standard
84fb6b5d-bab8-4c85-bbb4-a8360928dad8	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	84	standard
b13f3748-bfdb-435c-a358-69490247b368	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	85	standard
9d8f95ba-7cf7-4fda-8312-53d076a10c9f	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	86	standard
318ad096-28b5-43d1-8199-46724385502b	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	87	standard
0435d289-e1fa-407f-8502-0ec3b85c49ef	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	88	standard
8d32c594-1cb4-421b-9f7d-15f03261a9fb	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	89	standard
c6f27c39-a62a-47e4-9385-d47012b4770d	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	90	standard
9c89d6a9-3b4b-463c-9a71-4040c624fe65	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	91	standard
4ab90f83-f6ce-4ab2-bf03-2f0a3946ce75	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	92	standard
3c17fb26-19fc-404f-bf91-4884ce7570f0	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	93	standard
1f9be61c-b619-44c3-bb97-5a5e4baf99c7	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	94	standard
2253f195-2323-43a9-8f01-58e6bce2a2be	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	95	standard
6f58c3a3-9f6d-48e7-a94b-1b532f4ba687	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	96	standard
f197281a-5d7a-48b8-8686-421fa303ffbd	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	97	standard
f0714706-e593-494d-beab-53df081b967e	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	98	standard
e4bb6a6a-1595-4b3e-ac1a-a09f9192b48b	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	99	standard
1808f9f1-0c78-4d74-ae73-00456b7dc9ad	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	100	standard
6787dc06-8fe3-4232-87b2-55b7c939a5c9	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	101	standard
eec447ad-a264-4f30-9eeb-d4b2d36b4d27	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	102	standard
c74b09fb-9316-4af4-82a7-320b3062a3e9	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	103	standard
29ed6d7b-259b-4a68-8f4e-0d16bc446777	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	104	standard
db4f724d-4a0c-4803-958a-037ee0ca2076	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	105	standard
a1275c01-5eca-4f32-86f9-14b2dbb797fb	29cd72ba-0eca-4dce-8ff4-bc7ff97e92ee	106	standard
c424fbf7-ae82-40aa-ade3-b8067b079b88	7394dec4-a512-4bec-8d28-f60ce87f2fc3	107	standard
5e143fd2-9018-490a-bb5e-99728b8d7062	7394dec4-a512-4bec-8d28-f60ce87f2fc3	108	standard
281588be-3a4d-4d83-8896-d1dc8f4df703	7394dec4-a512-4bec-8d28-f60ce87f2fc3	109	standard
bc624208-46ad-4512-a963-dca2479d57a9	7394dec4-a512-4bec-8d28-f60ce87f2fc3	110	standard
400ca1a9-df2d-4cb3-93bd-2a09a3a75326	7394dec4-a512-4bec-8d28-f60ce87f2fc3	111	standard
76776688-5c66-4fae-be4c-bff48dd51f42	7394dec4-a512-4bec-8d28-f60ce87f2fc3	112	standard
f3b7e2b4-4b98-4563-b7f5-00564dd2b8f8	7394dec4-a512-4bec-8d28-f60ce87f2fc3	113	standard
b87d63e5-35e3-4612-9f7e-07c715e79d15	7394dec4-a512-4bec-8d28-f60ce87f2fc3	114	standard
af189f1f-7a65-440f-a21a-bd70b73818b3	7394dec4-a512-4bec-8d28-f60ce87f2fc3	115	standard
6420da3e-ee2a-4991-83f5-56d3a3e88643	7394dec4-a512-4bec-8d28-f60ce87f2fc3	116	standard
99b057e3-72d5-4a85-8d5b-50de72af25a6	7394dec4-a512-4bec-8d28-f60ce87f2fc3	117	standard
f15a0240-629c-4eed-82db-e9d6305afdfc	7394dec4-a512-4bec-8d28-f60ce87f2fc3	118	standard
80fb6845-7340-4f3f-a8ca-287ad1e140c8	7394dec4-a512-4bec-8d28-f60ce87f2fc3	119	standard
d7ef4a46-3963-4323-b261-d2cec5ded442	7394dec4-a512-4bec-8d28-f60ce87f2fc3	120	standard
cccc31bd-2083-4561-9af7-ff373da90b41	7394dec4-a512-4bec-8d28-f60ce87f2fc3	121	standard
2c5fc85a-4472-4887-adad-40f51ec46ee2	7394dec4-a512-4bec-8d28-f60ce87f2fc3	122	standard
29cb2e77-4279-4e24-953c-23c440c2a9f1	7394dec4-a512-4bec-8d28-f60ce87f2fc3	123	standard
58a8a8da-ccd3-4bce-9c0a-99419b5fa0dc	7394dec4-a512-4bec-8d28-f60ce87f2fc3	124	standard
c74dbc97-b5f1-464c-94d5-f19da380384c	7394dec4-a512-4bec-8d28-f60ce87f2fc3	125	standard
ba9c3dd9-0893-477e-bb75-f6b265b5954f	7394dec4-a512-4bec-8d28-f60ce87f2fc3	126	standard
f3300489-5672-4c7c-a555-09ed45e86114	7394dec4-a512-4bec-8d28-f60ce87f2fc3	127	standard
9df2c792-cc1a-44e4-ae34-4578f95ed830	7394dec4-a512-4bec-8d28-f60ce87f2fc3	128	standard
d156b48c-f3b5-4531-b108-8df6e401f869	7394dec4-a512-4bec-8d28-f60ce87f2fc3	129	standard
316031ba-04e9-45f1-80b8-f83e13c6bb66	7394dec4-a512-4bec-8d28-f60ce87f2fc3	130	standard
52c08898-3c82-42ff-a903-318351a9dbce	7394dec4-a512-4bec-8d28-f60ce87f2fc3	131	standard
d095beca-ac07-4166-9d83-c757f83ef055	7394dec4-a512-4bec-8d28-f60ce87f2fc3	132	standard
544ddad2-04da-403d-b8ed-b8840a2202c5	7394dec4-a512-4bec-8d28-f60ce87f2fc3	133	standard
390064e3-3664-4b4e-83e5-48d4867f38d5	7394dec4-a512-4bec-8d28-f60ce87f2fc3	134	standard
f8149238-c5ea-413d-8fe8-d31678f85adc	7394dec4-a512-4bec-8d28-f60ce87f2fc3	135	standard
984c3e0f-d301-4147-9e61-dfce7a8d6768	7394dec4-a512-4bec-8d28-f60ce87f2fc3	136	standard
5699c56d-ea86-4446-90f7-c18894b7c4ea	7394dec4-a512-4bec-8d28-f60ce87f2fc3	137	standard
a294c0b0-4665-414d-90f6-5c2090fa9b7c	7394dec4-a512-4bec-8d28-f60ce87f2fc3	138	standard
9e21c5ac-0fcc-4ab2-a714-5090522e9b8b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	139	standard
668c9fc6-06d9-4251-8221-84fbab886960	7394dec4-a512-4bec-8d28-f60ce87f2fc3	140	standard
45c4b719-98a2-4823-9efd-b6a498104981	7394dec4-a512-4bec-8d28-f60ce87f2fc3	141	standard
aef79185-0826-4a46-a701-c3566afd5a29	7394dec4-a512-4bec-8d28-f60ce87f2fc3	142	standard
b24f9368-eb77-4756-8c4f-d4b4c585bc1d	7394dec4-a512-4bec-8d28-f60ce87f2fc3	143	standard
f1978abe-8741-49d1-b2d2-bdb95bf0ded8	7394dec4-a512-4bec-8d28-f60ce87f2fc3	144	standard
20f81339-63ec-46ce-b707-68b17ba2709e	7394dec4-a512-4bec-8d28-f60ce87f2fc3	145	standard
c28fa959-5de5-4f15-adc2-36af42c4ca8a	7394dec4-a512-4bec-8d28-f60ce87f2fc3	146	standard
c8cd0de1-dd47-406b-b6bc-e1a3fbb9ec3b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	147	standard
fc5507dc-b172-456e-90f6-cab52491e7b7	7394dec4-a512-4bec-8d28-f60ce87f2fc3	148	standard
00652979-93a5-4221-8da8-e73d6271f1cf	7394dec4-a512-4bec-8d28-f60ce87f2fc3	149	standard
de4ac56d-0d47-46de-8717-4e623d0a372d	7394dec4-a512-4bec-8d28-f60ce87f2fc3	150	standard
05c4ba1c-3856-487d-80f9-df923bf94cc8	7394dec4-a512-4bec-8d28-f60ce87f2fc3	151	standard
b1adeee7-bbbc-41b2-96d9-cc2fde2c1fbf	7394dec4-a512-4bec-8d28-f60ce87f2fc3	152	standard
2b5a4545-233c-44b1-a518-57a00ea8fb73	7394dec4-a512-4bec-8d28-f60ce87f2fc3	153	standard
aa77d941-f84f-4817-9ef1-497dba279c3b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	154	standard
a7ca48b3-0945-4b4d-b850-3f4a45716a26	7394dec4-a512-4bec-8d28-f60ce87f2fc3	155	standard
68826f0b-424f-4b70-aedc-676e84b72965	7394dec4-a512-4bec-8d28-f60ce87f2fc3	156	standard
d12c085e-3489-4c81-8a7b-dd103e858aa4	7394dec4-a512-4bec-8d28-f60ce87f2fc3	157	standard
d8e38fb7-ee98-4247-8470-cc1ea55823c4	7394dec4-a512-4bec-8d28-f60ce87f2fc3	158	standard
fceb63c7-e6c7-4c0d-9e14-f6dc20a47193	7394dec4-a512-4bec-8d28-f60ce87f2fc3	159	standard
09ac44f4-3234-46cf-a5a1-33f028d97b65	7394dec4-a512-4bec-8d28-f60ce87f2fc3	160	standard
2f772ca6-7c0f-47c4-814a-1935401d4560	7394dec4-a512-4bec-8d28-f60ce87f2fc3	161	standard
eac9be78-7384-48e9-9ab4-5c46d784e361	7394dec4-a512-4bec-8d28-f60ce87f2fc3	162	standard
90ae2ec0-cd3e-46ec-b6ff-02c54a39f597	7394dec4-a512-4bec-8d28-f60ce87f2fc3	163	standard
9ea14f49-1887-4268-8322-8c6b18628546	7394dec4-a512-4bec-8d28-f60ce87f2fc3	164	standard
2638b649-175c-4d33-bbfa-035cc7edab82	7394dec4-a512-4bec-8d28-f60ce87f2fc3	165	standard
1c50b03a-9a53-4f6b-ab0f-0c88e4dd5556	7394dec4-a512-4bec-8d28-f60ce87f2fc3	166	standard
d34c9136-001c-484f-862a-f41de8a22d5a	7394dec4-a512-4bec-8d28-f60ce87f2fc3	167	standard
a54306af-12db-4496-a1e4-f885084381f6	7394dec4-a512-4bec-8d28-f60ce87f2fc3	168	standard
1ab6d0d9-3b93-4b00-8b36-4f261c23bccb	7394dec4-a512-4bec-8d28-f60ce87f2fc3	169	standard
26fa531e-7d14-402c-b784-e96da75023d2	7394dec4-a512-4bec-8d28-f60ce87f2fc3	170	standard
7ac4d9d7-340b-40c5-9b57-22aef8c9d045	7394dec4-a512-4bec-8d28-f60ce87f2fc3	171	standard
5873a94c-04f4-4410-b2ee-dfd6bcb86468	7394dec4-a512-4bec-8d28-f60ce87f2fc3	172	standard
af6f9a04-4cba-40fa-8ce5-13fcc89baa73	7394dec4-a512-4bec-8d28-f60ce87f2fc3	173	standard
56d17570-79b7-454e-947e-322b3946beb6	7394dec4-a512-4bec-8d28-f60ce87f2fc3	174	standard
034db4ba-7e46-4b64-86e3-40006b60850f	7394dec4-a512-4bec-8d28-f60ce87f2fc3	175	standard
4de8e839-bc4e-4ff2-8f4e-fd20e3cb6efb	7394dec4-a512-4bec-8d28-f60ce87f2fc3	176	standard
da78b881-f241-4e88-8270-07c8f68a1bbb	7394dec4-a512-4bec-8d28-f60ce87f2fc3	177	standard
ea40c8b8-aab3-4733-bb32-4b0117351789	7394dec4-a512-4bec-8d28-f60ce87f2fc3	178	standard
2ea0dc2b-a41f-49d1-b6d2-27e09da71b38	7394dec4-a512-4bec-8d28-f60ce87f2fc3	179	standard
46508aba-4adf-431b-8a56-636c8d88d848	7394dec4-a512-4bec-8d28-f60ce87f2fc3	180	standard
5f589404-26fb-43d3-9992-9799d88dff37	7394dec4-a512-4bec-8d28-f60ce87f2fc3	181	standard
e6604962-9951-4bf5-8e29-015e980cf5d0	7394dec4-a512-4bec-8d28-f60ce87f2fc3	182	standard
e4ea9b70-5f74-4894-a85b-cca9fefd1abb	7394dec4-a512-4bec-8d28-f60ce87f2fc3	183	standard
2c10bd3d-5fe9-4b27-8ea1-d7e540dd6ff0	7394dec4-a512-4bec-8d28-f60ce87f2fc3	184	standard
d574a76f-f57c-4c64-81d2-690e16416080	7394dec4-a512-4bec-8d28-f60ce87f2fc3	185	standard
548327e5-4b86-40b9-84ab-6d7ba37be8b5	7394dec4-a512-4bec-8d28-f60ce87f2fc3	186	standard
73f6b9cb-94a9-47fa-89e3-4064121b3c41	7394dec4-a512-4bec-8d28-f60ce87f2fc3	187	standard
ab9636f7-ac4e-4647-b863-35fa4fd92ed1	7394dec4-a512-4bec-8d28-f60ce87f2fc3	188	standard
3f69807a-d880-4fc7-b49c-b77be09094fd	7394dec4-a512-4bec-8d28-f60ce87f2fc3	189	standard
51eb8695-1251-4348-af2b-55d4c8b6f357	7394dec4-a512-4bec-8d28-f60ce87f2fc3	190	standard
d3035cf2-8a9e-4862-921a-e4d3fa055bfc	7394dec4-a512-4bec-8d28-f60ce87f2fc3	191	standard
a825ccaa-82e2-46da-be75-c7ceaacec951	7394dec4-a512-4bec-8d28-f60ce87f2fc3	192	standard
3efb6111-5b51-4906-b396-2522f61b223e	7394dec4-a512-4bec-8d28-f60ce87f2fc3	193	standard
80dda61e-3a78-4194-bddb-4d4cc138420b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	194	standard
6c9d5ab8-b550-486c-b8d7-7f80f18c0b41	7394dec4-a512-4bec-8d28-f60ce87f2fc3	195	standard
fab9be4b-d4f4-4793-b7b4-f5c021697cf8	7394dec4-a512-4bec-8d28-f60ce87f2fc3	196	standard
20db5903-b37b-4819-b6d9-55d6c324f4be	7394dec4-a512-4bec-8d28-f60ce87f2fc3	197	standard
e95abee1-0a18-424b-99a4-58c1a8035282	7394dec4-a512-4bec-8d28-f60ce87f2fc3	198	standard
943c96c3-9358-4fa0-8f78-c303d45c2d2b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	199	standard
0bb15acd-1928-4329-a1e2-d801f4186b86	7394dec4-a512-4bec-8d28-f60ce87f2fc3	200	standard
37d489fc-20ae-487e-8fd6-595887ff041a	7394dec4-a512-4bec-8d28-f60ce87f2fc3	201	standard
3336cff4-0249-4223-860b-1183503cb109	7394dec4-a512-4bec-8d28-f60ce87f2fc3	202	standard
d23a8e21-ad69-45c9-b84a-4819f09ea615	7394dec4-a512-4bec-8d28-f60ce87f2fc3	203	standard
a03bfa0c-63e3-402c-b1b7-a1cc03513080	7394dec4-a512-4bec-8d28-f60ce87f2fc3	204	standard
f2069427-502e-40de-a75c-093616c1f810	7394dec4-a512-4bec-8d28-f60ce87f2fc3	205	standard
afa40c0c-fa9d-4a84-9efd-179b88e97a9b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	206	standard
9a54f3ae-d292-4918-97cc-afec1e06a1bf	7394dec4-a512-4bec-8d28-f60ce87f2fc3	207	standard
8712990c-5388-4508-bee1-c4dea3dce43b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	208	standard
b6673771-8c81-4bf0-8e96-7596927442f5	7394dec4-a512-4bec-8d28-f60ce87f2fc3	209	standard
939975ec-461c-4f98-a3b5-b0b546e8e4c3	7394dec4-a512-4bec-8d28-f60ce87f2fc3	210	standard
6bdc6238-9907-4d99-8766-da283246e2dc	7394dec4-a512-4bec-8d28-f60ce87f2fc3	211	standard
f79a2a18-f5b8-4d23-a4a1-aac233f35860	7394dec4-a512-4bec-8d28-f60ce87f2fc3	212	standard
c0bf5b65-4599-40d0-a62f-8df97afa514d	7394dec4-a512-4bec-8d28-f60ce87f2fc3	213	standard
0c4294a6-b9f8-4417-a274-d9a5e7353bd5	7394dec4-a512-4bec-8d28-f60ce87f2fc3	214	standard
e276357f-12af-4ce3-9ced-9ce65701ba44	7394dec4-a512-4bec-8d28-f60ce87f2fc3	215	standard
bbe898cc-56ad-4426-816b-7f5c50ab364b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	216	standard
39505b6a-d108-4e9e-a942-837a75f83ae1	7394dec4-a512-4bec-8d28-f60ce87f2fc3	217	standard
c855cb07-90bf-481e-8f40-ae8d09739005	7394dec4-a512-4bec-8d28-f60ce87f2fc3	218	standard
f0665c5c-124d-46c6-b95a-179b06eddca1	7394dec4-a512-4bec-8d28-f60ce87f2fc3	219	standard
a0d9f012-ae40-4b17-a9d3-9bcf5f282376	7394dec4-a512-4bec-8d28-f60ce87f2fc3	220	standard
115b7adf-65d7-4e72-a7ee-1d72b3b875e4	7394dec4-a512-4bec-8d28-f60ce87f2fc3	221	standard
a6d76122-b9d8-4709-9957-2c76207a0339	7394dec4-a512-4bec-8d28-f60ce87f2fc3	222	standard
2000654b-917f-441f-9a30-bba454b586fb	7394dec4-a512-4bec-8d28-f60ce87f2fc3	223	standard
713e991d-fc46-4c67-9d5b-6ccd2f26e08d	7394dec4-a512-4bec-8d28-f60ce87f2fc3	224	standard
a57fda09-c9a2-4068-b43c-00edea2f3ebe	7394dec4-a512-4bec-8d28-f60ce87f2fc3	225	standard
53578935-e4ec-43e5-83b9-7640f5097817	7394dec4-a512-4bec-8d28-f60ce87f2fc3	226	standard
c98ca940-25a1-45fd-987b-77a01a60cd32	7394dec4-a512-4bec-8d28-f60ce87f2fc3	227	standard
6d0cfb27-fe82-4f02-9a5e-49ca49bf68b3	7394dec4-a512-4bec-8d28-f60ce87f2fc3	228	standard
dfe02bd0-d39a-4588-abe3-8a648d344cd0	7394dec4-a512-4bec-8d28-f60ce87f2fc3	229	standard
09305123-d150-4ea0-a1c2-a802ae974fd3	7394dec4-a512-4bec-8d28-f60ce87f2fc3	230	standard
c49d2a86-ca69-4f9e-9d73-080a887a252f	7394dec4-a512-4bec-8d28-f60ce87f2fc3	231	standard
4cf5a8d4-b815-43fc-bead-2a8ddbb14a64	7394dec4-a512-4bec-8d28-f60ce87f2fc3	232	standard
5cc8eddd-bbde-4c04-b6c1-95857ea8560c	7394dec4-a512-4bec-8d28-f60ce87f2fc3	233	standard
e9606d72-019c-4358-b664-a9ae899173cc	7394dec4-a512-4bec-8d28-f60ce87f2fc3	234	standard
c76bb1db-e8a2-4612-a0a9-61f48885b302	7394dec4-a512-4bec-8d28-f60ce87f2fc3	235	standard
14757b52-7aba-4e90-be15-460a47ed5d3b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	236	standard
3e546314-0e81-4855-b390-4b29bddf955f	7394dec4-a512-4bec-8d28-f60ce87f2fc3	237	standard
cde8b5c3-055c-433c-a7d3-60d3c5ccef88	7394dec4-a512-4bec-8d28-f60ce87f2fc3	238	standard
323069d4-111a-4c6e-91e6-7003dc79ce05	7394dec4-a512-4bec-8d28-f60ce87f2fc3	239	standard
d8d5e387-cc0a-44ec-936e-dc5aea803b92	7394dec4-a512-4bec-8d28-f60ce87f2fc3	240	standard
1dbc40a4-b942-4b27-888e-be7397be158a	7394dec4-a512-4bec-8d28-f60ce87f2fc3	241	standard
ade70595-2c39-4e50-924b-680d71d3832e	7394dec4-a512-4bec-8d28-f60ce87f2fc3	242	standard
a2cf8b38-e198-4dcd-9dd5-7da4a90c5fc9	7394dec4-a512-4bec-8d28-f60ce87f2fc3	243	standard
89e11c15-c6f3-4f3c-be8e-3cf224fca5c6	7394dec4-a512-4bec-8d28-f60ce87f2fc3	244	standard
276b3eb3-2bf7-4c01-a674-e710053d70fc	7394dec4-a512-4bec-8d28-f60ce87f2fc3	245	standard
5c8d8436-07e6-4184-a3cd-fd653cffcfaf	7394dec4-a512-4bec-8d28-f60ce87f2fc3	246	standard
3c055d26-e9f5-4dd3-be83-b4f6a1039b02	7394dec4-a512-4bec-8d28-f60ce87f2fc3	247	standard
ebfdfa3d-1dfb-4943-be53-35882796828e	7394dec4-a512-4bec-8d28-f60ce87f2fc3	248	standard
299246ce-e3c0-44af-9c86-9d882745176b	7394dec4-a512-4bec-8d28-f60ce87f2fc3	249	standard
869d4e55-7ccb-4671-9047-56fb7a62351d	7394dec4-a512-4bec-8d28-f60ce87f2fc3	250	standard
b1a253e7-a622-4f2b-93dc-eeab04ad876f	7394dec4-a512-4bec-8d28-f60ce87f2fc3	251	standard
ad920a98-b5af-4491-b757-3b08c968039e	7394dec4-a512-4bec-8d28-f60ce87f2fc3	252	standard
a17bc3fb-1e41-4086-ac1b-681b2d4234b5	7394dec4-a512-4bec-8d28-f60ce87f2fc3	253	standard
53ceaa1f-2d1c-4281-a18f-d05040567190	7394dec4-a512-4bec-8d28-f60ce87f2fc3	254	standard
c780485b-d68a-4f24-a40e-a01648221072	7394dec4-a512-4bec-8d28-f60ce87f2fc3	255	standard
9960fda5-2935-468a-a571-af7122a78d7f	7394dec4-a512-4bec-8d28-f60ce87f2fc3	256	standard
5a0817ae-253c-4839-b072-b328e286fcf9	7394dec4-a512-4bec-8d28-f60ce87f2fc3	257	standard
cbc9334f-7706-408e-8eed-60512522791c	7394dec4-a512-4bec-8d28-f60ce87f2fc3	258	standard
4ab615f6-c676-450b-8097-ab4a66b00035	7394dec4-a512-4bec-8d28-f60ce87f2fc3	259	standard
\.


--
-- Data for Name: password_reset_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.password_reset_token (id, user_id, token, expires, used_at, created_at) FROM stdin;
\.


--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.post (id, name, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.properties (id, group_id, key, value, type, "order") FROM stdin;
\.


--
-- Data for Name: property_claim; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.property_claim (id, user_id, claim_type, claimed_role, apartment_id, parking_spot_id, organization_id, status, user_comment, admin_comment, reviewed_by, reviewed_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: property_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.property_groups (id, contact_group_id, name, "order") FROM stdin;
\.


--
-- Data for Name: publication; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication (id, title, content, cover_image, type, status, building_id, is_pinned, is_urgent, author_id, moderated_by, moderated_at, moderation_comment, created_at, updated_at, event_start_at, event_end_at, event_location, event_latitude, event_longitude, event_max_attendees, event_external_url, event_organizer, event_organizer_phone, is_anonymous, publish_at, publish_to_telegram, event_recurrence_type, event_recurrence_interval, event_recurrence_day_of_week, event_recurrence_start_day, event_recurrence_end_day, event_recurrence_until, linked_article_id) FROM stdin;
\.


--
-- Data for Name: publication_attachment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_attachment (id, publication_id, file_name, file_type, mime_type, file_size, url, description, sort_order, uploaded_by, created_at) FROM stdin;
\.


--
-- Data for Name: publication_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_history (id, publication_id, action, from_status, to_status, moderation_comment, changed_by_id, description, created_at) FROM stdin;
\.


--
-- Data for Name: publication_moderation_vote; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_moderation_vote (id, publication_id, moderator_id, vote, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: publication_tag; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_tag (publication_id, tag_id) FROM stdin;
\.


--
-- Data for Name: publication_target; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.publication_target (id, publication_id, target_type, target_id) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (session_token, user_id, expires) FROM stdin;
test-session-1768139709291-yn6ntr5p4bg	test-superadmin-inventory-2024	2026-01-12 13:55:09.291+00
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_settings (key, value, description, updated_at) FROM stdin;
maintenance_mode	{"enabled": false, "expectedEndTime": "2025-12-14T03:50:00.000Z"}	Maintenance mode configuration	2025-12-14 06:08:45.73+00
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tags (id, name) FROM stdin;
\.


--
-- Data for Name: telegram_auth_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.telegram_auth_token (id, code, telegram_id, telegram_username, telegram_first_name, telegram_last_name, verified, verified_at, expires, used_at, created_at) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, name, email, email_verified, image, is_deleted, deleted_at, password_hash, created_at) FROM stdin;
c8071a46-c3b5-408d-8607-e3f0fca56936	Andrew Rumm	andrew.rumm@yandex.ru	\N	https://avatars.yandex.net/get-yapic/30955/enc-72bb04b7ffeb65a7bb53fab5b9ec1eae02dcd4c74f2784c97795a8f19ef17a31/islands-200	f	\N	\N	2026-01-11 12:15:54.58406+00
test-superadmin-inventory-2024	Test SuperAdmin	test.admin@localhost.test	2026-01-11 13:55:09.256+00	\N	f	\N	$2b$10$YCXgiylb.AK.VHefKwqG.ufB4aFXqQrgjVMJYbWMwxLiULrh2ovb2	2026-01-11 13:55:09.257362+00
\.


--
-- Data for Name: user_apartment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_apartment (user_id, apartment_id, status, role, revoked_at, revoked_by, revocation_template, revocation_reason, created_at) FROM stdin;
\.


--
-- Data for Name: user_block; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_block (id, user_id, blocked_by, category, violated_rules, reason, is_active, created_at, unblocked_at, unblocked_by, unblock_reason) FROM stdin;
\.


--
-- Data for Name: user_interest_building; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_interest_building (user_id, building_id, auto_added, created_at) FROM stdin;
\.


--
-- Data for Name: user_parking_spot; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_parking_spot (user_id, parking_spot_id, status, role, revoked_at, revoked_by, revocation_template, revocation_reason, created_at) FROM stdin;
\.


--
-- Data for Name: user_profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_profile (id, user_id, first_name, last_name, middle_name, display_name, phone, hide_phone, hide_name, hide_gender, hide_birthday, avatar, date_of_birth, gender, telegram_username, telegram_id, telegram_verified, telegram_verified_at, max_username, whatsapp_phone, hide_messengers, map_provider, tagline, tagline_set_by_admin) FROM stdin;
2664fc7c-fbc4-47de-94c4-75ce246ec474	test-superadmin-inventory-2024	Test	SuperAdmin	\N	Test SuperAdmin (Inventory)	\N	f	f	f	f	\N	\N	\N	\N	\N	f	\N	\N	\N	f	yandex	Тестовый суперадминистратор	t
\.


--
-- Data for Name: user_role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_role (user_id, role) FROM stdin;
c8071a46-c3b5-408d-8607-e3f0fca56936	Root
test-superadmin-inventory-2024	Root
test-superadmin-inventory-2024	SuperAdmin
test-superadmin-inventory-2024	Admin
test-superadmin-inventory-2024	Moderator
test-superadmin-inventory-2024	Editor
\.


--
-- Data for Name: verification_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification_token (identifier, token, expires) FROM stdin;
\.


--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.post_id_seq', 1, false);


--
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- Name: account account_provider_provider_account_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_provider_provider_account_id_pk PRIMARY KEY (provider, provider_account_id);


--
-- Name: analytics_conversion analytics_conversion_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_conversion
    ADD CONSTRAINT analytics_conversion_name_unique UNIQUE (name);


--
-- Name: analytics_conversion analytics_conversion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_conversion
    ADD CONSTRAINT analytics_conversion_pkey PRIMARY KEY (id);


--
-- Name: analytics_event analytics_event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_event
    ADD CONSTRAINT analytics_event_pkey PRIMARY KEY (id);


--
-- Name: analytics_session analytics_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_session
    ADD CONSTRAINT analytics_session_pkey PRIMARY KEY (id);


--
-- Name: apartment apartment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartment
    ADD CONSTRAINT apartment_pkey PRIMARY KEY (id);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: building_channel building_channel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building_channel
    ADD CONSTRAINT building_channel_pkey PRIMARY KEY (id);


--
-- Name: entrance building_id_entrance_number_idx; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrance
    ADD CONSTRAINT building_id_entrance_number_idx UNIQUE (building_id, entrance_number);


--
-- Name: building building_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_number_unique UNIQUE (number);


--
-- Name: building building_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_pkey PRIMARY KEY (id);


--
-- Name: building building_title_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_title_unique UNIQUE (title);


--
-- Name: claim_document claim_document_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_document
    ADD CONSTRAINT claim_document_pkey PRIMARY KEY (id);


--
-- Name: claim_history claim_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_history
    ADD CONSTRAINT claim_history_pkey PRIMARY KEY (id);


--
-- Name: contact_group_tags contact_group_tags_contact_group_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_group_tags
    ADD CONSTRAINT contact_group_tags_contact_group_id_tag_id_pk PRIMARY KEY (contact_group_id, tag_id);


--
-- Name: contact_groups contact_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_groups
    ADD CONSTRAINT contact_groups_pkey PRIMARY KEY (id);


--
-- Name: deletion_request deletion_request_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deletion_request
    ADD CONSTRAINT deletion_request_pkey PRIMARY KEY (id);


--
-- Name: directory_analytics directory_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_analytics
    ADD CONSTRAINT directory_analytics_pkey PRIMARY KEY (id);


--
-- Name: directory_contact directory_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_contact
    ADD CONSTRAINT directory_contact_pkey PRIMARY KEY (id);


--
-- Name: directory_contact_tag directory_contact_tag_contact_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_contact_tag
    ADD CONSTRAINT directory_contact_tag_contact_id_tag_id_pk PRIMARY KEY (contact_id, tag_id);


--
-- Name: directory_entry directory_entry_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry
    ADD CONSTRAINT directory_entry_pkey PRIMARY KEY (id);


--
-- Name: directory_entry directory_entry_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry
    ADD CONSTRAINT directory_entry_slug_unique UNIQUE (slug);


--
-- Name: directory_entry_stats directory_entry_stats_entry_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry_stats
    ADD CONSTRAINT directory_entry_stats_entry_id_unique UNIQUE (entry_id);


--
-- Name: directory_entry_stats directory_entry_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry_stats
    ADD CONSTRAINT directory_entry_stats_pkey PRIMARY KEY (id);


--
-- Name: directory_entry_tag directory_entry_tag_entry_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry_tag
    ADD CONSTRAINT directory_entry_tag_entry_id_tag_id_pk PRIMARY KEY (entry_id, tag_id);


--
-- Name: directory_schedule directory_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_schedule
    ADD CONSTRAINT directory_schedule_pkey PRIMARY KEY (id);


--
-- Name: directory_tag directory_tag_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_tag
    ADD CONSTRAINT directory_tag_name_unique UNIQUE (name);


--
-- Name: directory_tag directory_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_tag
    ADD CONSTRAINT directory_tag_pkey PRIMARY KEY (id);


--
-- Name: directory_tag directory_tag_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_tag
    ADD CONSTRAINT directory_tag_slug_unique UNIQUE (slug);


--
-- Name: directory_tag_stats directory_tag_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_tag_stats
    ADD CONSTRAINT directory_tag_stats_pkey PRIMARY KEY (id);


--
-- Name: directory_tag_stats directory_tag_stats_tag_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_tag_stats
    ADD CONSTRAINT directory_tag_stats_tag_id_unique UNIQUE (tag_id);


--
-- Name: email_verification_token email_verification_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_token
    ADD CONSTRAINT email_verification_token_pkey PRIMARY KEY (id);


--
-- Name: floor endtance_id_floor_number_idx; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floor
    ADD CONSTRAINT endtance_id_floor_number_idx UNIQUE (floor_number, entrance_id);


--
-- Name: entrance entrance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrance
    ADD CONSTRAINT entrance_pkey PRIMARY KEY (id);


--
-- Name: feedback_history feedback_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_history
    ADD CONSTRAINT feedback_history_pkey PRIMARY KEY (id);


--
-- Name: feedback feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (id);


--
-- Name: floor floor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floor
    ADD CONSTRAINT floor_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_article knowledge_base_article_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base_article
    ADD CONSTRAINT knowledge_base_article_pkey PRIMARY KEY (id);


--
-- Name: knowledge_base_article knowledge_base_article_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base_article
    ADD CONSTRAINT knowledge_base_article_slug_unique UNIQUE (slug);


--
-- Name: knowledge_base_article_tag knowledge_base_article_tag_article_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base_article_tag
    ADD CONSTRAINT knowledge_base_article_tag_article_id_tag_id_pk PRIMARY KEY (article_id, tag_id);


--
-- Name: listing_photo listing_photo_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_photo
    ADD CONSTRAINT listing_photo_pkey PRIMARY KEY (id);


--
-- Name: listing listing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: message_attachment message_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_attachment
    ADD CONSTRAINT message_attachment_pkey PRIMARY KEY (id);


--
-- Name: message_complaint message_complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_complaint
    ADD CONSTRAINT message_complaint_pkey PRIMARY KEY (id);


--
-- Name: message message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_pkey PRIMARY KEY (id);


--
-- Name: message_quota message_quota_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_quota
    ADD CONSTRAINT message_quota_pkey PRIMARY KEY (id);


--
-- Name: message_quota message_quota_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_quota
    ADD CONSTRAINT message_quota_user_id_unique UNIQUE (user_id);


--
-- Name: message_recipient message_recipient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_recipient
    ADD CONSTRAINT message_recipient_pkey PRIMARY KEY (id);


--
-- Name: message_thread message_thread_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_pkey PRIMARY KEY (id);


--
-- Name: news news_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_pkey PRIMARY KEY (id);


--
-- Name: news news_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_slug_unique UNIQUE (slug);


--
-- Name: news_tag news_tag_news_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_tag
    ADD CONSTRAINT news_tag_news_id_tag_id_pk PRIMARY KEY (news_id, tag_id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (id);


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_pkey PRIMARY KEY (id);


--
-- Name: organization_tag organization_tag_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_tag
    ADD CONSTRAINT organization_tag_name_unique UNIQUE (name);


--
-- Name: organization_tag organization_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_tag
    ADD CONSTRAINT organization_tag_pkey PRIMARY KEY (id);


--
-- Name: organization_to_tag organization_to_tag_organization_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_to_tag
    ADD CONSTRAINT organization_to_tag_organization_id_tag_id_pk PRIMARY KEY (organization_id, tag_id);


--
-- Name: parking_floor parking_floor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_floor
    ADD CONSTRAINT parking_floor_pkey PRIMARY KEY (id);


--
-- Name: parking parking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking
    ADD CONSTRAINT parking_pkey PRIMARY KEY (id);


--
-- Name: parking_spot parking_spot_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_spot
    ADD CONSTRAINT parking_spot_pkey PRIMARY KEY (id);


--
-- Name: password_reset_token password_reset_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: property_claim property_claim_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_claim
    ADD CONSTRAINT property_claim_pkey PRIMARY KEY (id);


--
-- Name: property_groups property_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_groups
    ADD CONSTRAINT property_groups_pkey PRIMARY KEY (id);


--
-- Name: publication_attachment publication_attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_attachment
    ADD CONSTRAINT publication_attachment_pkey PRIMARY KEY (id);


--
-- Name: publication_history publication_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_history
    ADD CONSTRAINT publication_history_pkey PRIMARY KEY (id);


--
-- Name: publication_moderation_vote publication_moderation_vote_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_moderation_vote
    ADD CONSTRAINT publication_moderation_vote_pkey PRIMARY KEY (id);


--
-- Name: publication publication_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_pkey PRIMARY KEY (id);


--
-- Name: publication_tag publication_tag_publication_id_tag_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_tag
    ADD CONSTRAINT publication_tag_publication_id_tag_id_pk PRIMARY KEY (publication_id, tag_id);


--
-- Name: publication_target publication_target_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_target
    ADD CONSTRAINT publication_target_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (session_token);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: tags tags_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_unique UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: telegram_auth_token telegram_auth_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.telegram_auth_token
    ADD CONSTRAINT telegram_auth_token_pkey PRIMARY KEY (id);


--
-- Name: user_apartment user_apartment_user_id_apartment_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_apartment
    ADD CONSTRAINT user_apartment_user_id_apartment_id_pk PRIMARY KEY (user_id, apartment_id);


--
-- Name: user_block user_block_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_block
    ADD CONSTRAINT user_block_pkey PRIMARY KEY (id);


--
-- Name: user_interest_building user_interest_building_user_id_building_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interest_building
    ADD CONSTRAINT user_interest_building_user_id_building_id_pk PRIMARY KEY (user_id, building_id);


--
-- Name: user_parking_spot user_parking_spot_user_id_parking_spot_id_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_parking_spot
    ADD CONSTRAINT user_parking_spot_user_id_parking_spot_id_pk PRIMARY KEY (user_id, parking_spot_id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_profile user_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_pkey PRIMARY KEY (id);


--
-- Name: user_role user_role_user_id_role_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_role_pk PRIMARY KEY (user_id, role);


--
-- Name: verification_token verification_token_identifier_token_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.verification_token
    ADD CONSTRAINT verification_token_identifier_token_pk PRIMARY KEY (identifier, token);


--
-- Name: account_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX account_user_id_idx ON public.account USING btree (user_id);


--
-- Name: analytics_conversion_event_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_conversion_event_name_idx ON public.analytics_conversion USING btree (event_name);


--
-- Name: analytics_event_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_event_created_at_idx ON public.analytics_event USING btree (created_at);


--
-- Name: analytics_event_name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_event_name_idx ON public.analytics_event USING btree (event_name);


--
-- Name: analytics_event_page_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_event_page_path_idx ON public.analytics_event USING btree (page_path);


--
-- Name: analytics_event_session_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_event_session_id_idx ON public.analytics_event USING btree (session_id);


--
-- Name: analytics_event_type_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_event_type_created_at_idx ON public.analytics_event USING btree (event_type, created_at);


--
-- Name: analytics_event_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_event_type_idx ON public.analytics_event USING btree (event_type);


--
-- Name: analytics_event_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_event_user_id_idx ON public.analytics_event USING btree (user_id);


--
-- Name: analytics_session_device_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_session_device_type_idx ON public.analytics_session USING btree (device_type);


--
-- Name: analytics_session_started_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_session_started_at_idx ON public.analytics_session USING btree (started_at);


--
-- Name: analytics_session_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX analytics_session_user_id_idx ON public.analytics_session USING btree (user_id);


--
-- Name: audit_log_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_action_idx ON public.audit_log USING btree (action);


--
-- Name: audit_log_actor_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_actor_idx ON public.audit_log USING btree (actor_id);


--
-- Name: audit_log_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_created_at_idx ON public.audit_log USING btree (created_at);


--
-- Name: audit_log_entity_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_entity_created_idx ON public.audit_log USING btree (entity_type, entity_id, created_at);


--
-- Name: audit_log_entity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_log_entity_idx ON public.audit_log USING btree (entity_type, entity_id);


--
-- Name: building_channel_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX building_channel_active_idx ON public.building_channel USING btree (is_active);


--
-- Name: building_channel_building_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX building_channel_building_idx ON public.building_channel USING btree (building_id);


--
-- Name: building_channel_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX building_channel_type_idx ON public.building_channel USING btree (channel_type);


--
-- Name: claim_document_claim_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX claim_document_claim_idx ON public.claim_document USING btree (claim_id);


--
-- Name: claim_history_claim_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX claim_history_claim_idx ON public.claim_history USING btree (claim_id);


--
-- Name: claim_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX claim_status_idx ON public.property_claim USING btree (status);


--
-- Name: claim_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX claim_user_idx ON public.property_claim USING btree (user_id);


--
-- Name: created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX created_by_idx ON public.post USING btree (created_by);


--
-- Name: deletion_request_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deletion_request_status_idx ON public.deletion_request USING btree (status);


--
-- Name: deletion_request_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX deletion_request_user_id_idx ON public.deletion_request USING btree (user_id);


--
-- Name: directory_analytics_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_analytics_created_idx ON public.directory_analytics USING btree (created_at);


--
-- Name: directory_analytics_entry_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_analytics_entry_idx ON public.directory_analytics USING btree (entry_id);


--
-- Name: directory_analytics_event_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_analytics_event_type_idx ON public.directory_analytics USING btree (event_type);


--
-- Name: directory_analytics_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_analytics_tag_idx ON public.directory_analytics USING btree (tag_id);


--
-- Name: directory_analytics_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_analytics_user_idx ON public.directory_analytics USING btree (user_id);


--
-- Name: directory_contact_entry_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_contact_entry_idx ON public.directory_contact USING btree (entry_id);


--
-- Name: directory_contact_tag_contact_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_contact_tag_contact_idx ON public.directory_contact_tag USING btree (contact_id);


--
-- Name: directory_contact_tag_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_contact_tag_tag_idx ON public.directory_contact_tag USING btree (tag_id);


--
-- Name: directory_contact_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_contact_type_idx ON public.directory_contact USING btree (type);


--
-- Name: directory_entry_building_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_entry_building_idx ON public.directory_entry USING btree (building_id);


--
-- Name: directory_entry_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_entry_slug_idx ON public.directory_entry USING btree (slug);


--
-- Name: directory_entry_stats_calls_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_entry_stats_calls_idx ON public.directory_entry_stats USING btree (call_count);


--
-- Name: directory_entry_stats_views_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_entry_stats_views_idx ON public.directory_entry_stats USING btree (view_count);


--
-- Name: directory_entry_tag_entry_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_entry_tag_entry_idx ON public.directory_entry_tag USING btree (entry_id);


--
-- Name: directory_entry_tag_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_entry_tag_tag_idx ON public.directory_entry_tag USING btree (tag_id);


--
-- Name: directory_entry_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_entry_type_idx ON public.directory_entry USING btree (type);


--
-- Name: directory_schedule_entry_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_schedule_entry_idx ON public.directory_schedule USING btree (entry_id);


--
-- Name: directory_tag_parent_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_tag_parent_idx ON public.directory_tag USING btree (parent_id);


--
-- Name: directory_tag_scope_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_tag_scope_idx ON public.directory_tag USING btree (scope);


--
-- Name: directory_tag_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_tag_slug_idx ON public.directory_tag USING btree (slug);


--
-- Name: directory_tag_stats_clicks_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_tag_stats_clicks_idx ON public.directory_tag_stats USING btree (click_count);


--
-- Name: directory_tag_stats_views_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX directory_tag_stats_views_idx ON public.directory_tag_stats USING btree (view_count);


--
-- Name: email_verification_token_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX email_verification_token_idx ON public.email_verification_token USING btree (token);


--
-- Name: feedback_assigned_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_assigned_idx ON public.feedback USING btree (assigned_to_id);


--
-- Name: feedback_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_created_at_idx ON public.feedback USING btree (created_at);


--
-- Name: feedback_history_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_history_action_idx ON public.feedback_history USING btree (action);


--
-- Name: feedback_history_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_history_created_at_idx ON public.feedback_history USING btree (created_at);


--
-- Name: feedback_history_feedback_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_history_feedback_idx ON public.feedback_history USING btree (feedback_id);


--
-- Name: feedback_ip_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_ip_idx ON public.feedback USING btree (ip_address);


--
-- Name: feedback_is_deleted_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_is_deleted_idx ON public.feedback USING btree (is_deleted);


--
-- Name: feedback_priority_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_priority_idx ON public.feedback USING btree (priority);


--
-- Name: feedback_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_status_idx ON public.feedback USING btree (status);


--
-- Name: feedback_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX feedback_type_idx ON public.feedback USING btree (type);


--
-- Name: kb_article_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_article_author_idx ON public.knowledge_base_article USING btree (author_id);


--
-- Name: kb_article_building_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_article_building_idx ON public.knowledge_base_article USING btree (building_id);


--
-- Name: kb_article_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_article_slug_idx ON public.knowledge_base_article USING btree (slug);


--
-- Name: kb_article_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_article_status_idx ON public.knowledge_base_article USING btree (status);


--
-- Name: kb_article_tag_article_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_article_tag_article_idx ON public.knowledge_base_article_tag USING btree (article_id);


--
-- Name: kb_article_tag_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kb_article_tag_tag_idx ON public.knowledge_base_article_tag USING btree (tag_id);


--
-- Name: listing_photo_listing_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listing_photo_listing_idx ON public.listing_photo USING btree (listing_id);


--
-- Name: listing_property_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listing_property_type_idx ON public.listing USING btree (property_type);


--
-- Name: listing_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listing_status_idx ON public.listing USING btree (status);


--
-- Name: listing_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listing_type_idx ON public.listing USING btree (listing_type);


--
-- Name: listing_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX listing_user_idx ON public.listing USING btree (user_id);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_mime_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_mime_type_idx ON public.media USING btree (mime_type);


--
-- Name: media_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_type_idx ON public.media USING btree (type);


--
-- Name: media_uploaded_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX media_uploaded_by_idx ON public.media USING btree (uploaded_by);


--
-- Name: message_attachment_message_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_attachment_message_idx ON public.message_attachment USING btree (message_id);


--
-- Name: message_complaint_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_complaint_created_idx ON public.message_complaint USING btree (created_at);


--
-- Name: message_complaint_message_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_complaint_message_idx ON public.message_complaint USING btree (message_id);


--
-- Name: message_complaint_reporter_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_complaint_reporter_idx ON public.message_complaint USING btree (reporter_id);


--
-- Name: message_complaint_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_complaint_status_idx ON public.message_complaint USING btree (status);


--
-- Name: message_created_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_created_idx ON public.message USING btree (created_at);


--
-- Name: message_quota_blocked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_quota_blocked_idx ON public.message_quota USING btree (is_blocked);


--
-- Name: message_quota_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_quota_user_idx ON public.message_quota USING btree (user_id);


--
-- Name: message_recipient_message_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_recipient_message_idx ON public.message_recipient USING btree (message_id);


--
-- Name: message_recipient_read_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_recipient_read_idx ON public.message_recipient USING btree (is_read);


--
-- Name: message_recipient_recipient_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_recipient_recipient_idx ON public.message_recipient USING btree (recipient_id);


--
-- Name: message_reply_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_reply_idx ON public.message USING btree (reply_to_id);


--
-- Name: message_sender_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_sender_idx ON public.message USING btree (sender_id);


--
-- Name: message_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_status_idx ON public.message USING btree (status);


--
-- Name: message_thread_apartment_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_apartment_idx ON public.message_thread USING btree (apartment_id);


--
-- Name: message_thread_building_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_building_idx ON public.message_thread USING btree (building_id);


--
-- Name: message_thread_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_created_by_idx ON public.message_thread USING btree (created_by);


--
-- Name: message_thread_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_idx ON public.message USING btree (thread_id);


--
-- Name: message_thread_last_message_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_last_message_idx ON public.message_thread USING btree (last_message_at);


--
-- Name: message_thread_parking_spot_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_parking_spot_idx ON public.message_thread USING btree (parking_spot_id);


--
-- Name: message_thread_recipient_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_recipient_idx ON public.message_thread USING btree (recipient_id);


--
-- Name: message_thread_scope_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX message_thread_scope_idx ON public.message_thread USING btree (scope);


--
-- Name: name_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX name_idx ON public.post USING btree (name);


--
-- Name: news_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_author_idx ON public.news USING btree (author_id);


--
-- Name: news_publish_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_publish_at_idx ON public.news USING btree (publish_at);


--
-- Name: news_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_slug_idx ON public.news USING btree (slug);


--
-- Name: news_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_status_idx ON public.news USING btree (status);


--
-- Name: news_tag_news_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_tag_news_idx ON public.news_tag USING btree (news_id);


--
-- Name: news_tag_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_tag_tag_idx ON public.news_tag USING btree (tag_id);


--
-- Name: news_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX news_type_idx ON public.news USING btree (type);


--
-- Name: notification_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notification_created_at_idx ON public.notification USING btree (created_at);


--
-- Name: notification_entity_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notification_entity_idx ON public.notification USING btree (entity_type, entity_id);


--
-- Name: notification_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notification_user_id_idx ON public.notification USING btree (user_id);


--
-- Name: notification_user_unread_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX notification_user_unread_idx ON public.notification USING btree (user_id, is_read);


--
-- Name: password_reset_token_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX password_reset_token_idx ON public.password_reset_token USING btree (token);


--
-- Name: pub_mod_vote_mod_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pub_mod_vote_mod_idx ON public.publication_moderation_vote USING btree (moderator_id);


--
-- Name: pub_mod_vote_pub_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pub_mod_vote_pub_idx ON public.publication_moderation_vote USING btree (publication_id);


--
-- Name: pub_mod_vote_vote_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX pub_mod_vote_vote_idx ON public.publication_moderation_vote USING btree (vote);


--
-- Name: publication_attachment_pub_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_attachment_pub_idx ON public.publication_attachment USING btree (publication_id);


--
-- Name: publication_attachment_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_attachment_type_idx ON public.publication_attachment USING btree (file_type);


--
-- Name: publication_author_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_author_idx ON public.publication USING btree (author_id);


--
-- Name: publication_building_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_building_idx ON public.publication USING btree (building_id);


--
-- Name: publication_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_created_at_idx ON public.publication USING btree (created_at);


--
-- Name: publication_history_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_history_action_idx ON public.publication_history USING btree (action);


--
-- Name: publication_history_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_history_created_at_idx ON public.publication_history USING btree (created_at);


--
-- Name: publication_history_pub_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_history_pub_idx ON public.publication_history USING btree (publication_id);


--
-- Name: publication_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_status_idx ON public.publication USING btree (status);


--
-- Name: publication_tag_pub_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_tag_pub_idx ON public.publication_tag USING btree (publication_id);


--
-- Name: publication_tag_tag_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_tag_tag_idx ON public.publication_tag USING btree (tag_id);


--
-- Name: publication_target_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_target_id_idx ON public.publication_target USING btree (target_id);


--
-- Name: publication_target_pub_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_target_pub_idx ON public.publication_target USING btree (publication_id);


--
-- Name: publication_target_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_target_type_idx ON public.publication_target USING btree (target_type);


--
-- Name: publication_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX publication_type_idx ON public.publication USING btree (type);


--
-- Name: session_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX session_user_id_idx ON public.session USING btree (user_id);


--
-- Name: telegram_auth_token_code_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX telegram_auth_token_code_idx ON public.telegram_auth_token USING btree (code);


--
-- Name: telegram_auth_token_telegram_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX telegram_auth_token_telegram_id_idx ON public.telegram_auth_token USING btree (telegram_id);


--
-- Name: user_apartment_revoked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_apartment_revoked_idx ON public.user_apartment USING btree (revoked_at);


--
-- Name: user_block_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_block_is_active_idx ON public.user_block USING btree (is_active);


--
-- Name: user_block_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_block_user_id_idx ON public.user_block USING btree (user_id);


--
-- Name: user_interest_building_building_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_interest_building_building_idx ON public.user_interest_building USING btree (building_id);


--
-- Name: user_interest_building_user_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_interest_building_user_idx ON public.user_interest_building USING btree (user_id);


--
-- Name: user_parking_spot_revoked_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_parking_spot_revoked_idx ON public.user_parking_spot USING btree (revoked_at);


--
-- Name: account account_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: analytics_event analytics_event_session_id_analytics_session_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_event
    ADD CONSTRAINT analytics_event_session_id_analytics_session_id_fk FOREIGN KEY (session_id) REFERENCES public.analytics_session(id) ON DELETE CASCADE;


--
-- Name: analytics_event analytics_event_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_event
    ADD CONSTRAINT analytics_event_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: analytics_session analytics_session_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics_session
    ADD CONSTRAINT analytics_session_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: apartment apartment_floor_id_floor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.apartment
    ADD CONSTRAINT apartment_floor_id_floor_id_fk FOREIGN KEY (floor_id) REFERENCES public.floor(id) ON DELETE CASCADE;


--
-- Name: audit_log audit_log_actor_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_actor_id_user_id_fk FOREIGN KEY (actor_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: building_channel building_channel_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.building_channel
    ADD CONSTRAINT building_channel_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE CASCADE;


--
-- Name: claim_document claim_document_claim_id_property_claim_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_document
    ADD CONSTRAINT claim_document_claim_id_property_claim_id_fk FOREIGN KEY (claim_id) REFERENCES public.property_claim(id) ON DELETE CASCADE;


--
-- Name: claim_history claim_history_changed_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_history
    ADD CONSTRAINT claim_history_changed_by_user_id_fk FOREIGN KEY (changed_by) REFERENCES public."user"(id);


--
-- Name: claim_history claim_history_claim_id_property_claim_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.claim_history
    ADD CONSTRAINT claim_history_claim_id_property_claim_id_fk FOREIGN KEY (claim_id) REFERENCES public.property_claim(id) ON DELETE CASCADE;


--
-- Name: contact_group_tags contact_group_tags_contact_group_id_contact_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_group_tags
    ADD CONSTRAINT contact_group_tags_contact_group_id_contact_groups_id_fk FOREIGN KEY (contact_group_id) REFERENCES public.contact_groups(id) ON DELETE CASCADE;


--
-- Name: contact_group_tags contact_group_tags_tag_id_tags_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_group_tags
    ADD CONSTRAINT contact_group_tags_tag_id_tags_id_fk FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: deletion_request deletion_request_processed_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deletion_request
    ADD CONSTRAINT deletion_request_processed_by_user_id_fk FOREIGN KEY (processed_by) REFERENCES public."user"(id);


--
-- Name: deletion_request deletion_request_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.deletion_request
    ADD CONSTRAINT deletion_request_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: directory_analytics directory_analytics_contact_id_directory_contact_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_analytics
    ADD CONSTRAINT directory_analytics_contact_id_directory_contact_id_fk FOREIGN KEY (contact_id) REFERENCES public.directory_contact(id) ON DELETE SET NULL;


--
-- Name: directory_analytics directory_analytics_entry_id_directory_entry_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_analytics
    ADD CONSTRAINT directory_analytics_entry_id_directory_entry_id_fk FOREIGN KEY (entry_id) REFERENCES public.directory_entry(id) ON DELETE SET NULL;


--
-- Name: directory_analytics directory_analytics_tag_id_directory_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_analytics
    ADD CONSTRAINT directory_analytics_tag_id_directory_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.directory_tag(id) ON DELETE SET NULL;


--
-- Name: directory_contact directory_contact_entry_id_directory_entry_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_contact
    ADD CONSTRAINT directory_contact_entry_id_directory_entry_id_fk FOREIGN KEY (entry_id) REFERENCES public.directory_entry(id) ON DELETE CASCADE;


--
-- Name: directory_contact_tag directory_contact_tag_contact_id_directory_contact_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_contact_tag
    ADD CONSTRAINT directory_contact_tag_contact_id_directory_contact_id_fk FOREIGN KEY (contact_id) REFERENCES public.directory_contact(id) ON DELETE CASCADE;


--
-- Name: directory_contact_tag directory_contact_tag_tag_id_directory_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_contact_tag
    ADD CONSTRAINT directory_contact_tag_tag_id_directory_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.directory_tag(id) ON DELETE CASCADE;


--
-- Name: directory_entry directory_entry_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry
    ADD CONSTRAINT directory_entry_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE SET NULL;


--
-- Name: directory_entry_stats directory_entry_stats_entry_id_directory_entry_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry_stats
    ADD CONSTRAINT directory_entry_stats_entry_id_directory_entry_id_fk FOREIGN KEY (entry_id) REFERENCES public.directory_entry(id) ON DELETE CASCADE;


--
-- Name: directory_entry_tag directory_entry_tag_entry_id_directory_entry_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry_tag
    ADD CONSTRAINT directory_entry_tag_entry_id_directory_entry_id_fk FOREIGN KEY (entry_id) REFERENCES public.directory_entry(id) ON DELETE CASCADE;


--
-- Name: directory_entry_tag directory_entry_tag_tag_id_directory_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_entry_tag
    ADD CONSTRAINT directory_entry_tag_tag_id_directory_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.directory_tag(id) ON DELETE CASCADE;


--
-- Name: directory_schedule directory_schedule_entry_id_directory_entry_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_schedule
    ADD CONSTRAINT directory_schedule_entry_id_directory_entry_id_fk FOREIGN KEY (entry_id) REFERENCES public.directory_entry(id) ON DELETE CASCADE;


--
-- Name: directory_tag_stats directory_tag_stats_tag_id_directory_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.directory_tag_stats
    ADD CONSTRAINT directory_tag_stats_tag_id_directory_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.directory_tag(id) ON DELETE CASCADE;


--
-- Name: email_verification_token email_verification_token_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_verification_token
    ADD CONSTRAINT email_verification_token_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: entrance entrance_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrance
    ADD CONSTRAINT entrance_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_assigned_to_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_assigned_to_id_user_id_fk FOREIGN KEY (assigned_to_id) REFERENCES public."user"(id);


--
-- Name: feedback feedback_deleted_by_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_deleted_by_id_user_id_fk FOREIGN KEY (deleted_by_id) REFERENCES public."user"(id);


--
-- Name: feedback_history feedback_history_assigned_to_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_history
    ADD CONSTRAINT feedback_history_assigned_to_id_user_id_fk FOREIGN KEY (assigned_to_id) REFERENCES public."user"(id);


--
-- Name: feedback_history feedback_history_changed_by_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_history
    ADD CONSTRAINT feedback_history_changed_by_id_user_id_fk FOREIGN KEY (changed_by_id) REFERENCES public."user"(id);


--
-- Name: feedback_history feedback_history_feedback_id_feedback_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback_history
    ADD CONSTRAINT feedback_history_feedback_id_feedback_id_fk FOREIGN KEY (feedback_id) REFERENCES public.feedback(id) ON DELETE CASCADE;


--
-- Name: feedback feedback_responded_by_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_responded_by_id_user_id_fk FOREIGN KEY (responded_by_id) REFERENCES public."user"(id);


--
-- Name: feedback feedback_submitted_by_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feedback
    ADD CONSTRAINT feedback_submitted_by_user_id_user_id_fk FOREIGN KEY (submitted_by_user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: floor floor_entrance_id_entrance_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floor
    ADD CONSTRAINT floor_entrance_id_entrance_id_fk FOREIGN KEY (entrance_id) REFERENCES public.entrance(id) ON DELETE CASCADE;


--
-- Name: knowledge_base_article knowledge_base_article_author_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base_article
    ADD CONSTRAINT knowledge_base_article_author_id_user_id_fk FOREIGN KEY (author_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: knowledge_base_article knowledge_base_article_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base_article
    ADD CONSTRAINT knowledge_base_article_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE SET NULL;


--
-- Name: knowledge_base_article_tag knowledge_base_article_tag_article_id_knowledge_base_article_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base_article_tag
    ADD CONSTRAINT knowledge_base_article_tag_article_id_knowledge_base_article_id FOREIGN KEY (article_id) REFERENCES public.knowledge_base_article(id) ON DELETE CASCADE;


--
-- Name: knowledge_base_article_tag knowledge_base_article_tag_tag_id_directory_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge_base_article_tag
    ADD CONSTRAINT knowledge_base_article_tag_tag_id_directory_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.directory_tag(id) ON DELETE CASCADE;


--
-- Name: listing listing_apartment_id_apartment_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_apartment_id_apartment_id_fk FOREIGN KEY (apartment_id) REFERENCES public.apartment(id) ON DELETE CASCADE;


--
-- Name: listing listing_archived_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_archived_by_user_id_fk FOREIGN KEY (archived_by) REFERENCES public."user"(id);


--
-- Name: listing listing_moderated_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_moderated_by_user_id_fk FOREIGN KEY (moderated_by) REFERENCES public."user"(id);


--
-- Name: listing listing_parking_spot_id_parking_spot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_parking_spot_id_parking_spot_id_fk FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spot(id) ON DELETE CASCADE;


--
-- Name: listing_photo listing_photo_listing_id_listing_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing_photo
    ADD CONSTRAINT listing_photo_listing_id_listing_id_fk FOREIGN KEY (listing_id) REFERENCES public.listing(id) ON DELETE CASCADE;


--
-- Name: listing listing_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.listing
    ADD CONSTRAINT listing_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: media media_uploaded_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uploaded_by_user_id_fk FOREIGN KEY (uploaded_by) REFERENCES public."user"(id);


--
-- Name: message_attachment message_attachment_message_id_message_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_attachment
    ADD CONSTRAINT message_attachment_message_id_message_id_fk FOREIGN KEY (message_id) REFERENCES public.message(id) ON DELETE CASCADE;


--
-- Name: message_complaint message_complaint_message_id_message_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_complaint
    ADD CONSTRAINT message_complaint_message_id_message_id_fk FOREIGN KEY (message_id) REFERENCES public.message(id) ON DELETE CASCADE;


--
-- Name: message_complaint message_complaint_reporter_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_complaint
    ADD CONSTRAINT message_complaint_reporter_id_user_id_fk FOREIGN KEY (reporter_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: message_complaint message_complaint_reviewed_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_complaint
    ADD CONSTRAINT message_complaint_reviewed_by_user_id_fk FOREIGN KEY (reviewed_by) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: message message_moderated_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_moderated_by_user_id_fk FOREIGN KEY (moderated_by) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: message_quota message_quota_blocked_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_quota
    ADD CONSTRAINT message_quota_blocked_by_user_id_fk FOREIGN KEY (blocked_by) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: message_quota message_quota_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_quota
    ADD CONSTRAINT message_quota_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: message_recipient message_recipient_message_id_message_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_recipient
    ADD CONSTRAINT message_recipient_message_id_message_id_fk FOREIGN KEY (message_id) REFERENCES public.message(id) ON DELETE CASCADE;


--
-- Name: message_recipient message_recipient_recipient_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_recipient
    ADD CONSTRAINT message_recipient_recipient_id_user_id_fk FOREIGN KEY (recipient_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: message message_sender_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_sender_id_user_id_fk FOREIGN KEY (sender_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_apartment_id_apartment_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_apartment_id_apartment_id_fk FOREIGN KEY (apartment_id) REFERENCES public.apartment(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_created_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_created_by_user_id_fk FOREIGN KEY (created_by) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_entrance_id_entrance_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_entrance_id_entrance_id_fk FOREIGN KEY (entrance_id) REFERENCES public.entrance(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_floor_id_floor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_floor_id_floor_id_fk FOREIGN KEY (floor_id) REFERENCES public.floor(id) ON DELETE CASCADE;


--
-- Name: message message_thread_id_message_thread_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message
    ADD CONSTRAINT message_thread_id_message_thread_id_fk FOREIGN KEY (thread_id) REFERENCES public.message_thread(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_parking_floor_id_parking_floor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_parking_floor_id_parking_floor_id_fk FOREIGN KEY (parking_floor_id) REFERENCES public.parking_floor(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_parking_id_parking_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_parking_id_parking_id_fk FOREIGN KEY (parking_id) REFERENCES public.parking(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_parking_spot_id_parking_spot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_parking_spot_id_parking_spot_id_fk FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spot(id) ON DELETE CASCADE;


--
-- Name: message_thread message_thread_recipient_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.message_thread
    ADD CONSTRAINT message_thread_recipient_id_user_id_fk FOREIGN KEY (recipient_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: news news_author_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT news_author_id_user_id_fk FOREIGN KEY (author_id) REFERENCES public."user"(id);


--
-- Name: news_tag news_tag_news_id_news_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_tag
    ADD CONSTRAINT news_tag_news_id_news_id_fk FOREIGN KEY (news_id) REFERENCES public.news(id) ON DELETE CASCADE;


--
-- Name: news_tag news_tag_tag_id_directory_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.news_tag
    ADD CONSTRAINT news_tag_tag_id_directory_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.directory_tag(id) ON DELETE CASCADE;


--
-- Name: notification notification_from_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_from_user_id_user_id_fk FOREIGN KEY (from_user_id) REFERENCES public."user"(id) ON DELETE SET NULL;


--
-- Name: notification notification_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: organization organization_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT organization_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE CASCADE;


--
-- Name: organization_to_tag organization_to_tag_organization_id_organization_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_to_tag
    ADD CONSTRAINT organization_to_tag_organization_id_organization_id_fk FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: organization_to_tag organization_to_tag_tag_id_organization_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_to_tag
    ADD CONSTRAINT organization_to_tag_tag_id_organization_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.organization_tag(id) ON DELETE CASCADE;


--
-- Name: parking parking_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking
    ADD CONSTRAINT parking_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE CASCADE;


--
-- Name: parking_floor parking_floor_parking_id_parking_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_floor
    ADD CONSTRAINT parking_floor_parking_id_parking_id_fk FOREIGN KEY (parking_id) REFERENCES public.parking(id) ON DELETE CASCADE;


--
-- Name: parking_spot parking_spot_floor_id_parking_floor_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.parking_spot
    ADD CONSTRAINT parking_spot_floor_id_parking_floor_id_fk FOREIGN KEY (floor_id) REFERENCES public.parking_floor(id) ON DELETE CASCADE;


--
-- Name: password_reset_token password_reset_token_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_token
    ADD CONSTRAINT password_reset_token_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: post post_created_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_created_by_user_id_fk FOREIGN KEY (created_by) REFERENCES public."user"(id);


--
-- Name: properties properties_group_id_property_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_group_id_property_groups_id_fk FOREIGN KEY (group_id) REFERENCES public.property_groups(id) ON DELETE CASCADE;


--
-- Name: property_claim property_claim_apartment_id_apartment_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_claim
    ADD CONSTRAINT property_claim_apartment_id_apartment_id_fk FOREIGN KEY (apartment_id) REFERENCES public.apartment(id) ON DELETE CASCADE;


--
-- Name: property_claim property_claim_organization_id_organization_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_claim
    ADD CONSTRAINT property_claim_organization_id_organization_id_fk FOREIGN KEY (organization_id) REFERENCES public.organization(id) ON DELETE CASCADE;


--
-- Name: property_claim property_claim_parking_spot_id_parking_spot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_claim
    ADD CONSTRAINT property_claim_parking_spot_id_parking_spot_id_fk FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spot(id) ON DELETE CASCADE;


--
-- Name: property_claim property_claim_reviewed_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_claim
    ADD CONSTRAINT property_claim_reviewed_by_user_id_fk FOREIGN KEY (reviewed_by) REFERENCES public."user"(id);


--
-- Name: property_claim property_claim_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_claim
    ADD CONSTRAINT property_claim_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: property_groups property_groups_contact_group_id_contact_groups_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_groups
    ADD CONSTRAINT property_groups_contact_group_id_contact_groups_id_fk FOREIGN KEY (contact_group_id) REFERENCES public.contact_groups(id) ON DELETE CASCADE;


--
-- Name: publication_attachment publication_attachment_publication_id_publication_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_attachment
    ADD CONSTRAINT publication_attachment_publication_id_publication_id_fk FOREIGN KEY (publication_id) REFERENCES public.publication(id) ON DELETE CASCADE;


--
-- Name: publication_attachment publication_attachment_uploaded_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_attachment
    ADD CONSTRAINT publication_attachment_uploaded_by_user_id_fk FOREIGN KEY (uploaded_by) REFERENCES public."user"(id);


--
-- Name: publication publication_author_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_author_id_user_id_fk FOREIGN KEY (author_id) REFERENCES public."user"(id);


--
-- Name: publication publication_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id);


--
-- Name: publication_history publication_history_changed_by_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_history
    ADD CONSTRAINT publication_history_changed_by_id_user_id_fk FOREIGN KEY (changed_by_id) REFERENCES public."user"(id);


--
-- Name: publication_history publication_history_publication_id_publication_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_history
    ADD CONSTRAINT publication_history_publication_id_publication_id_fk FOREIGN KEY (publication_id) REFERENCES public.publication(id) ON DELETE CASCADE;


--
-- Name: publication publication_moderated_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication
    ADD CONSTRAINT publication_moderated_by_user_id_fk FOREIGN KEY (moderated_by) REFERENCES public."user"(id);


--
-- Name: publication_moderation_vote publication_moderation_vote_moderator_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_moderation_vote
    ADD CONSTRAINT publication_moderation_vote_moderator_id_user_id_fk FOREIGN KEY (moderator_id) REFERENCES public."user"(id);


--
-- Name: publication_moderation_vote publication_moderation_vote_publication_id_publication_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_moderation_vote
    ADD CONSTRAINT publication_moderation_vote_publication_id_publication_id_fk FOREIGN KEY (publication_id) REFERENCES public.publication(id) ON DELETE CASCADE;


--
-- Name: publication_tag publication_tag_publication_id_publication_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_tag
    ADD CONSTRAINT publication_tag_publication_id_publication_id_fk FOREIGN KEY (publication_id) REFERENCES public.publication(id) ON DELETE CASCADE;


--
-- Name: publication_tag publication_tag_tag_id_directory_tag_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_tag
    ADD CONSTRAINT publication_tag_tag_id_directory_tag_id_fk FOREIGN KEY (tag_id) REFERENCES public.directory_tag(id) ON DELETE CASCADE;


--
-- Name: publication_target publication_target_publication_id_publication_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.publication_target
    ADD CONSTRAINT publication_target_publication_id_publication_id_fk FOREIGN KEY (publication_id) REFERENCES public.publication(id) ON DELETE CASCADE;


--
-- Name: session session_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user_apartment user_apartment_apartment_id_apartment_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_apartment
    ADD CONSTRAINT user_apartment_apartment_id_apartment_id_fk FOREIGN KEY (apartment_id) REFERENCES public.apartment(id) ON DELETE CASCADE;


--
-- Name: user_apartment user_apartment_revoked_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_apartment
    ADD CONSTRAINT user_apartment_revoked_by_user_id_fk FOREIGN KEY (revoked_by) REFERENCES public."user"(id);


--
-- Name: user_apartment user_apartment_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_apartment
    ADD CONSTRAINT user_apartment_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_block user_block_blocked_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_block
    ADD CONSTRAINT user_block_blocked_by_user_id_fk FOREIGN KEY (blocked_by) REFERENCES public."user"(id);


--
-- Name: user_block user_block_unblocked_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_block
    ADD CONSTRAINT user_block_unblocked_by_user_id_fk FOREIGN KEY (unblocked_by) REFERENCES public."user"(id);


--
-- Name: user_block user_block_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_block
    ADD CONSTRAINT user_block_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_interest_building user_interest_building_building_id_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interest_building
    ADD CONSTRAINT user_interest_building_building_id_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(id) ON DELETE CASCADE;


--
-- Name: user_interest_building user_interest_building_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_interest_building
    ADD CONSTRAINT user_interest_building_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_parking_spot user_parking_spot_parking_spot_id_parking_spot_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_parking_spot
    ADD CONSTRAINT user_parking_spot_parking_spot_id_parking_spot_id_fk FOREIGN KEY (parking_spot_id) REFERENCES public.parking_spot(id) ON DELETE CASCADE;


--
-- Name: user_parking_spot user_parking_spot_revoked_by_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_parking_spot
    ADD CONSTRAINT user_parking_spot_revoked_by_user_id_fk FOREIGN KEY (revoked_by) REFERENCES public."user"(id);


--
-- Name: user_parking_spot user_parking_spot_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_parking_spot
    ADD CONSTRAINT user_parking_spot_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- Name: user_profile user_profile_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profile
    ADD CONSTRAINT user_profile_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user_role user_role_user_id_user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 2yDCr5JfWDpu9E4IahfvP2QWGYA2OMWJWMkRfFZspr1zFst8J5Vp7g3v7cR8hIc

