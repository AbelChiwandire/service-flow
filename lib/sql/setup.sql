CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    "businessName" VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT fk_customers_user
        FOREIGN KEY ("userId")
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_customers_userId
    ON customers("userId");


CREATE TYPE job_status AS ENUM (
    'scheduled',
    'in_progress',
    'completed',
    'cancelled'
);

CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "customerId" UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    "scheduledDate" DATE,
    status job_status NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT FALSE,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT fk_jobs_user
        FOREIGN KEY ("userId")
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_jobs_customer
        FOREIGN KEY ("customerId")
        REFERENCES customers(id)
        ON DELETE RESTRICT
);

CREATE INDEX idx_jobs_userId
    ON jobs("userId");

CREATE INDEX idx_jobs_customerId
    ON jobs("customerId");