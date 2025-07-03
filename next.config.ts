/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://lenfsqoajrfouxfnpxmg.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlbmZzcW9hanJmb3V4Zm5weG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjI2NDksImV4cCI6MjA2NzA5ODY0OX0.GLjeOxMJknLz8Sp1HAUw-V1O5NTR6bcsLceli5BbX1s',
  }
};

export default nextConfig;
