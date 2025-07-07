import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vzxlkptelorxdkbxxecx.supabase.co'; // replace with your Supabase URL
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6eGxrcHRlbG9yeGRrYnh4ZWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3NDg0ODgsImV4cCI6MjA2NDMyNDQ4OH0.uUz8nnj-hXsuLRUfw1cXkWyI4AD-8t9Cpw2RQo0wdqs'; // replace with your anon public key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
