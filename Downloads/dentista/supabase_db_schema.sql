-- Tabela patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  reason TEXT NOT NULL,
  reason_detail TEXT,
  is_existing_patient BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_time VARCHAR(100) NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  notes TEXT
);

-- Tabela patient_images
CREATE TABLE patient_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL
);

-- Tabela clinic_branding
CREATE TABLE clinic_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name VARCHAR(255) NOT NULL,
  logo_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#0ea5e9',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela social_media
CREATE TABLE social_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('facebook', 'instagram', 'youtube', 'other')),
  url TEXT NOT NULL,
  name VARCHAR(255),
  icon TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
