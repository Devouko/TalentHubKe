-- Add Application table
CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    job_id TEXT NOT NULL,
    applicant_id TEXT NOT NULL,
    cover_letter TEXT NOT NULL,
    skills TEXT NOT NULL,
    experience TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, applicant_id),
    FOREIGN KEY (job_id) REFERENCES gigs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add JobInterview table
CREATE TABLE IF NOT EXISTS job_interviews (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    scheduled_at TIMESTAMP NOT NULL,
    questions TEXT,
    duration INTEGER DEFAULT 30,
    type TEXT DEFAULT 'VIDEO',
    status TEXT DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Update notifications table to support new types
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata TEXT;