import { createClient } from '@supabase/supabase-js';

// Coloca aquí tus datos reales de la consola de Supabase (Project Settings > API)
const SUPABASE_URL = "https://uwhugujsrzkcqsybadcj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3aHVndWpzcnprY3FzeWJhZGNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3MDY0ODAsImV4cCI6MjA5OTI4MjQ4MH0.3EmmdWpHDRBEZ9MapydPnNq0eFK_tJ5xPi21CKrdp6I";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
