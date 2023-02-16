ALTER TABLE users ADD COLUMN hourly_wage NUMERIC,
                  ADD COLUMN manager_id UUID REFERENCES users (id),
                  ADD COLUMN registration_date TIMESTAMPTZ,
                  ADD COLUMN hire_date TIMESTAMPTZ;