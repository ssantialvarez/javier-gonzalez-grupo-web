import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_youtube_block_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum_pages_hero_media_position_mobile" AS ENUM('top', 'center', 'bottom', 'left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_youtube_block_columns" AS ENUM('1', '2', '3');
  CREATE TYPE "public"."enum__pages_v_version_hero_media_position_mobile" AS ENUM('top', 'center', 'bottom', 'left', 'right');
  CREATE TABLE "pages_blocks_youtube_block_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"caption" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_youtube_block_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_youtube_block" ADD COLUMN "columns" "enum_pages_blocks_youtube_block_columns" DEFAULT '1';
  ALTER TABLE "pages" ADD COLUMN "hero_media_position_mobile" "enum_pages_hero_media_position_mobile";
  ALTER TABLE "pages" ADD COLUMN "hero_media_mobile_id" integer;
  ALTER TABLE "_pages_v_blocks_youtube_block" ADD COLUMN "columns" "enum__pages_v_blocks_youtube_block_columns" DEFAULT '1';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_position_mobile" "enum__pages_v_version_hero_media_position_mobile";
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_mobile_id" integer;
  ALTER TABLE "pages_blocks_youtube_block_videos" ADD CONSTRAINT "pages_blocks_youtube_block_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_youtube_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_youtube_block_videos" ADD CONSTRAINT "_pages_v_blocks_youtube_block_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_youtube_block"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_youtube_block_videos_order_idx" ON "pages_blocks_youtube_block_videos" USING btree ("_order");
  CREATE INDEX "pages_blocks_youtube_block_videos_parent_id_idx" ON "pages_blocks_youtube_block_videos" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_youtube_block_videos_order_idx" ON "_pages_v_blocks_youtube_block_videos" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_youtube_block_videos_parent_id_idx" ON "_pages_v_blocks_youtube_block_videos" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_mobile_id_media_id_fk" FOREIGN KEY ("hero_media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_mobile_id_media_id_fk" FOREIGN KEY ("version_hero_media_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_media_mobile_idx" ON "pages" USING btree ("hero_media_mobile_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_mobile_idx" ON "_pages_v" USING btree ("version_hero_media_mobile_id");
  ALTER TABLE "pages_blocks_youtube_block" DROP COLUMN "url";
  ALTER TABLE "pages_blocks_youtube_block" DROP COLUMN "caption";
  ALTER TABLE "_pages_v_blocks_youtube_block" DROP COLUMN "url";
  ALTER TABLE "_pages_v_blocks_youtube_block" DROP COLUMN "caption";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_youtube_block_videos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_youtube_block_videos" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_youtube_block_videos" CASCADE;
  DROP TABLE "_pages_v_blocks_youtube_block_videos" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_media_mobile_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_media_mobile_id_media_id_fk";
  
  DROP INDEX "pages_hero_hero_media_mobile_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_media_mobile_idx";
  ALTER TABLE "pages_blocks_youtube_block" ADD COLUMN "url" varchar;
  ALTER TABLE "pages_blocks_youtube_block" ADD COLUMN "caption" varchar;
  ALTER TABLE "_pages_v_blocks_youtube_block" ADD COLUMN "url" varchar;
  ALTER TABLE "_pages_v_blocks_youtube_block" ADD COLUMN "caption" varchar;
  ALTER TABLE "pages_blocks_youtube_block" DROP COLUMN "columns";
  ALTER TABLE "pages" DROP COLUMN "hero_media_position_mobile";
  ALTER TABLE "pages" DROP COLUMN "hero_media_mobile_id";
  ALTER TABLE "_pages_v_blocks_youtube_block" DROP COLUMN "columns";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_position_mobile";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_mobile_id";
  DROP TYPE "public"."enum_pages_blocks_youtube_block_columns";
  DROP TYPE "public"."enum_pages_hero_media_position_mobile";
  DROP TYPE "public"."enum__pages_v_blocks_youtube_block_columns";
  DROP TYPE "public"."enum__pages_v_version_hero_media_position_mobile";`)
}
