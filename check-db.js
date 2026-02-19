const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://dlwwxqwoxrybesntuydl.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsd3d4cXdveHJ5YmVzbnR1eWRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA3NjUzMjcsImV4cCI6MjA4NjM0MTMyN30.vXaBzHs5qFYbnc6vHxBnpVXbrq-dab_UYtuc4MzGBho';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function check() {
    const { count, error } = await supabase
        .from('ebooks')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error:', error.message);
    } else {
        console.log('Total ebooks in database:', count);
    }
}

check();
