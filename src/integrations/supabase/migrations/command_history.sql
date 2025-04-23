
-- Create a table to store command history
CREATE TABLE IF NOT EXISTS public.command_history (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    command TEXT NOT NULL,
    output TEXT,
    error TEXT,
    execution_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies
ALTER TABLE public.command_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert and view their own commands
CREATE POLICY "Users can view their own commands" 
    ON public.command_history 
    FOR SELECT 
    TO authenticated 
    USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to insert commands (with or without authentication)
CREATE POLICY "Anyone can insert commands" 
    ON public.command_history 
    FOR INSERT 
    TO public 
    WITH CHECK (true);

-- Add indexes
CREATE INDEX IF NOT EXISTS command_history_user_id_idx ON public.command_history(user_id);
CREATE INDEX IF NOT EXISTS command_history_created_at_idx ON public.command_history(created_at);
