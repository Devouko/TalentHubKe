-- Create UserType enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "UserType" AS ENUM ('CLIENT', 'FREELANCER', 'AGENCY', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify the enum exists
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserType');