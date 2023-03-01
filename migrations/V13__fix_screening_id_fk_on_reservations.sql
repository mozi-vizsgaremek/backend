BEGIN;
ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_screening_id_fkey;
ALTER TABLE reservations ADD CONSTRAINT reservations_screening_id_fkey 
    FOREIGN KEY (screening_id) REFERENCES screenings (id) ON DELETE CASCADE;
COMMIT;