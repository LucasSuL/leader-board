import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://tapipvcvgnwdpsdctlek.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcGlwdmN2Z253ZHBzZGN0bGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgxNDE1NTcsImV4cCI6MjAyMzcxNzU1N30.04PXulyL45vQ8LqBPnT5prQx49Ju7bgNg23-gwhtHAw";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
