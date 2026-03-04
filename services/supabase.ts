import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://cvibsdkgsytqcfmevcnj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aWJzZGtnc3l0cWNmbWV2Y25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODM3NTEsImV4cCI6MjA4NTc1OTc1MX0.VCgTJFfItmkZ0qN6if015Y9IgPd8JMW5dyFt_7vltjE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
