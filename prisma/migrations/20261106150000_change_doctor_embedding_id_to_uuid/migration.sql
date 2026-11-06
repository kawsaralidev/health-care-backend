ALTER TABLE "doctor_embeddings"
ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "doctor_embeddings"
ALTER COLUMN "id" TYPE UUID
USING "id"::uuid;

ALTER TABLE "doctor_embeddings"
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();