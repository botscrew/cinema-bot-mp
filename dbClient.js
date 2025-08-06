import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient('https://coyayltqmxcudqbtihww.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNveWF5bHRxbXhjdWRxYnRpaHd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNDgwNzEsImV4cCI6MjA2NzgyNDA3MX0.EmbxBhdfVW3VoTa_PVvBtF51aoVo4QG_BqRUhluDs4I')

export async function getAllMovies(){
    const { data, error } = await supabase
        .from('movies')
        .select()
    if (error) throw error;
    return data
}

export async function getMovieSessionsByMovieId(movie_id){
    const { data, error } = await supabase
        .from('sessions')
        .select()
        .eq('movie_id', movie_id)
    if (error) throw error;
    return data
}

export async function createTicket(userName, phoneNumber, amount, movie_id){
    await supabase.from('tickets').insert({
        user_name: userName,
        phone_number: phoneNumber,
        amount: amount,
        movie_id: movie_id,
    })
}

