import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add columns field to pages youtube block table
    ALTER TABLE "pages_blocks_youtube_block"
      ADD COLUMN "columns" varchar NOT NULL DEFAULT '1';

    -- Create videos sub-table for pages
    CREATE TABLE "pages_blocks_youtube_block_videos" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      "caption" varchar
    );

    ALTER TABLE "pages_blocks_youtube_block_videos"
      ADD CONSTRAINT "pages_blocks_youtube_block_videos_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."pages_blocks_youtube_block"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "pages_blocks_youtube_block_videos_order_idx"
      ON "pages_blocks_youtube_block_videos" USING btree ("_order");
    CREATE INDEX "pages_blocks_youtube_block_videos_parent_id_idx"
      ON "pages_blocks_youtube_block_videos" USING btree ("_parent_id");

    -- Migrate existing url/caption data into the new videos sub-table
    INSERT INTO "pages_blocks_youtube_block_videos" ("_order", "_parent_id", "id", "url", "caption")
    SELECT
      1,
      "id",
      "id" || '_v1',
      "url",
      "caption"
    FROM "pages_blocks_youtube_block"
    WHERE "url" IS NOT NULL;

    -- Drop old columns from pages table
    ALTER TABLE "pages_blocks_youtube_block"
      DROP COLUMN "url",
      DROP COLUMN "caption";

    -- ---- versions table ----

    ALTER TABLE "_pages_v_blocks_youtube_block"
      ADD COLUMN "columns" varchar NOT NULL DEFAULT '1';

    CREATE TABLE "_pages_v_blocks_youtube_block_videos" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "url" varchar,
      "caption" varchar,
      "_uuid" varchar
    );

    ALTER TABLE "_pages_v_blocks_youtube_block_videos"
      ADD CONSTRAINT "_pages_v_blocks_youtube_block_videos_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_pages_v_blocks_youtube_block"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "_pages_v_blocks_youtube_block_videos_order_idx"
      ON "_pages_v_blocks_youtube_block_videos" USING btree ("_order");
    CREATE INDEX "_pages_v_blocks_youtube_block_videos_parent_id_idx"
      ON "_pages_v_blocks_youtube_block_videos" USING btree ("_parent_id");

    INSERT INTO "_pages_v_blocks_youtube_block_videos" ("_order", "_parent_id", "url", "caption")
    SELECT
      1,
      "id",
      "url",
      "caption"
    FROM "_pages_v_blocks_youtube_block"
    WHERE "url" IS NOT NULL;

    ALTER TABLE "_pages_v_blocks_youtube_block"
      DROP COLUMN "url",
      DROP COLUMN "caption";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Restore columns to pages table
    ALTER TABLE "pages_blocks_youtube_block"
      ADD COLUMN "url" varchar,
      ADD COLUMN "caption" varchar;

    -- Restore data from first video of each block
    UPDATE "pages_blocks_youtube_block" b
    SET
      "url" = v."url",
      "caption" = v."caption"
    FROM (
      SELECT DISTINCT ON ("_parent_id") "_parent_id", "url", "caption"
      FROM "pages_blocks_youtube_block_videos"
      ORDER BY "_parent_id", "_order"
    ) v
    WHERE b."id" = v."_parent_id";

    DROP TABLE "pages_blocks_youtube_block_videos" CASCADE;

    ALTER TABLE "pages_blocks_youtube_block"
      DROP COLUMN "columns";

    -- Restore versions table
    ALTER TABLE "_pages_v_blocks_youtube_block"
      ADD COLUMN "url" varchar,
      ADD COLUMN "caption" varchar;

    UPDATE "_pages_v_blocks_youtube_block" b
    SET
      "url" = v."url",
      "caption" = v."caption"
    FROM (
      SELECT DISTINCT ON ("_parent_id") "_parent_id", "url", "caption"
      FROM "_pages_v_blocks_youtube_block_videos"
      ORDER BY "_parent_id", "_order"
    ) v
    WHERE b."id" = v."_parent_id";

    DROP TABLE "_pages_v_blocks_youtube_block_videos" CASCADE;

    ALTER TABLE "_pages_v_blocks_youtube_block"
      DROP COLUMN "columns";
  `)
}
