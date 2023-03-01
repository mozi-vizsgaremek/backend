BEGIN;
ALTER TABLE shifts_taken DROP CONSTRAINT shifts_taken_user_id_fkey;
ALTER TABLE shifts_taken ADD CONSTRAINT shifts_taken_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

ALTER TABLE shifts_taken DROP CONSTRAINT shifts_taken_shift_id_fkey;
ALTER TABLE shifts_taken ADD CONSTRAINT shifts_taken_shift_id_fkey 
    FOREIGN KEY (shift_id) REFERENCES shifts (id) ON DELETE CASCADE;
COMMIT;