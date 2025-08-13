-- Run this script in your Neon SQL Editor to set up the database tables.

-- Drop tables if they exist to start fresh
DROP TABLE IF EXISTS "reports";
DROP TABLE IF EXISTS "clients";
DROP TABLE IF EXISTS "templates";
DROP TABLE IF EXISTS "calendar_events";

-- Create Clients Table
CREATE TABLE "clients" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "avatar_key" TEXT, -- Stores the key from Netlify Blob Store
    "last_visit" TIMESTAMPTZ NOT NULL,
    "next_appointment" TIMESTAMPTZ,
    "health_protocol" TEXT NOT NULL,
    "adherence_score" REAL NOT NULL,
    "progress_score" REAL NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create Reports Table
CREATE TABLE "reports" (
    "id" TEXT PRIMARY KEY,
    "client_id" TEXT NOT NULL REFERENCES "clients"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "deadline" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "last_modified" TIMESTAMPTZ NOT NULL,
    "template_name" TEXT NOT NULL,
    "completion_percentage" INTEGER NOT NULL
);

-- Create Templates Table
CREATE TABLE "templates" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "last_modified" TIMESTAMPTZ NOT NULL,
    "usage_count" INTEGER NOT NULL,
    "sections" JSONB NOT NULL -- Store sections/fields as JSON
);

-- Create Calendar Events Table
CREATE TABLE "calendar_events" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "client_id" TEXT REFERENCES "clients"("id") ON DELETE SET NULL,
    "date" TIMESTAMPTZ NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "location" TEXT
);

-- Insert some sample data to get started

-- Sample Clients
INSERT INTO "clients" ("id", "name", "email", "last_visit", "next_appointment", "health_protocol", "adherence_score", "progress_score") VALUES
('1', 'Sarah Johnson', 'sarah.johnson@email.com', '2024-12-15T00:00:00Z', '2024-12-30T00:00:00Z', 'Metabolic Optimization Protocol', 92.5, 87.3),
('2', 'Michael Chen', 'michael.chen@email.com', '2024-12-18T00:00:00Z', '2025-01-02T00:00:00Z', 'Athletic Performance Enhancement', 89.2, 91.8),
('3', 'Dr. Emily Rodriguez', 'emily.rodriguez@email.com', '2024-12-12T00:00:00Z', '2024-12-28T00:00:00Z', 'Hormone Balance Program', 95.8, 93.4);

-- Sample Reports
INSERT INTO "reports" ("id", "client_id", "type", "status", "deadline", "last_modified", "template_name", "completion_percentage") VALUES
('R001', '1', 'monthly', 'review', '2024-12-25T00:00:00Z', '2024-12-20T00:00:00Z', 'Comprehensive Wellness Assessment', 85),
('R002', '2', 'weekly', 'sent', '2024-12-22T00:00:00Z', '2024-12-21T00:00:00Z', 'Athletic Performance Review', 100);

-- Sample Templates
INSERT INTO "templates" ("id", "name", "description", "category", "last_modified", "usage_count", "sections") VALUES
('T001', 'Comprehensive Wellness Assessment', 'Complete holistic health evaluation', 'assessment', '2024-12-10T00:00:00Z', 45, '[]'),
('T002', 'Athletic Performance Review', 'Specialized assessment for athletes', 'progress', '2024-12-05T00:00:00Z', 28, '[]');

-- Sample Calendar Events
INSERT INTO "calendar_events" ("id", "title", "type", "client_id", "date", "start_time", "end_time", "status", "location") VALUES
('E001', 'Sarah Johnson - Wellness Consultation', 'appointment', '1', '2024-12-30T00:00:00Z', '09:00', '10:00', 'scheduled', 'Wellness Center - Room 101');
