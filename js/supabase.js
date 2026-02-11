// Initialisation du client Supabase
const { createClient } = window.supabase;

const SUPABASE_URL = 'https://dlwwxqwoxrybesntuydl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd3d4cXdveHJ5YmVzbnR1eWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjUzMjcsImV4cCI6MjA4NjM0MTMyN30.vXaBzHs5qFYbnc6vHxBnpVXbrq-dab_UYtuc4MzGBho';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
