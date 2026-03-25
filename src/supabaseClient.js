import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://zwxokgptnqwjdpraigaf.supabase.co"
const supabaseKey = "sb_publishable_u26KLi3o3iOvvY1M6PYG-Q_47Lxbt0o"
export const supabase = createClient(supabaseUrl, supabaseKey)