-- Meraki Media Mission Control Schema

-- 1. Clients & CRM
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    ghl_contact_id TEXT UNIQUE,
    status TEXT DEFAULT 'lead', -- lead, active, past
    last_contact_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Projects & Builds
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'planning', -- planning, building, testing, live
    tech_stack TEXT[],
    github_url TEXT,
    vercel_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Health & Wellness
CREATE TABLE IF NOT EXISTS health_weight (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recorded_at DATE DEFAULT CURRENT_DATE,
    weight_kg DECIMAL(5,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_nutrition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recorded_at DATE DEFAULT CURRENT_DATE,
    meal_type TEXT, -- breakfast, lunch, dinner, snack
    description TEXT,
    calories INTEGER,
    protein_g INTEGER,
    carbs_g INTEGER,
    fat_g INTEGER,
    sugar_g INTEGER,
    carb_quality TEXT, -- simple, complex
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_wellness (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recorded_at DATE DEFAULT CURRENT_DATE,
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
    energy_score INTEGER CHECK (energy_score BETWEEN 1 AND 5),
    stress_score INTEGER CHECK (stress_score BETWEEN 1 AND 5),
    sleep_hours DECIMAL(4,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Content & Pipeline
CREATE TABLE IF NOT EXISTS content_calendar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL, -- linkedin, facebook, email
    title TEXT,
    content_body TEXT,
    status TEXT DEFAULT 'draft', -- draft, scheduled, published
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    engagement_stats JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Finance & Costs
CREATE TABLE IF NOT EXISTS api_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL, -- openai, anthropic, google, etc
    model TEXT,
    token_usage_prompt INTEGER,
    token_usage_completion INTEGER,
    estimated_cost_usd DECIMAL(10,6),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Agent Logic
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    category TEXT, -- content, product, business, etc
    promoted_to_project_id UUID REFERENCES projects(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT, -- heartbeat, task_start, task_end, error
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_name TEXT NOT NULL,
    recorded_at DATE DEFAULT CURRENT_DATE,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(habit_name, recorded_at)
);

-- 1.2 GHL Pipelines & Opportunities
CREATE TABLE IF NOT EXISTS ghl_pipelines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    stages JSONB, -- Array of stages
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ghl_opportunities (
    id TEXT PRIMARY KEY,
    pipeline_id TEXT REFERENCES ghl_pipelines(id),
    contact_id TEXT,
    name TEXT,
    status TEXT, -- open, won, lost, abandoned
    stage_id TEXT,
    monetary_value DECIMAL(10,2),
    ghl_contact_name TEXT,
    ghl_contact_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
