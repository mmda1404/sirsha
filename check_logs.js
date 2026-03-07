import { createClient } from '@supabase/supabase-js';

const url = "https://sevghzicjmyhvbahqvck.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldmdoemljam15aHZiYWhxdmNrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjU3ODA3MSwiZXhwIjoyMDg4MTU0MDcxfQ.PqPGHRLiTsoe7thGW1M8YJuNhBlRgwNyqDVSzvvxgg4";
const supabase = createClient(url, key);

async function checkLogs() {
    const { data, error } = await supabase.from('agent_logs').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) {
        console.error("Error:", error);
    } else {
        data.forEach(row => {
            console.log(`[${row.created_at}] [${row.event_type}]: ${row.description}`);
        });
    }
}

checkLogs();
