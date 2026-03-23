import * as migration_20260320_052803 from './20260320_052803';
import * as migration_20260321_124402_youtube_block from './20260321_124402_youtube_block';
import * as migration_20260323_120000_youtube_block_columns from './20260323_120000_youtube_block_columns';
import * as migration_20260323_234546___name from './20260323_234546___name';

export const migrations = [
  {
    up: migration_20260320_052803.up,
    down: migration_20260320_052803.down,
    name: '20260320_052803',
  },
  {
    up: migration_20260321_124402_youtube_block.up,
    down: migration_20260321_124402_youtube_block.down,
    name: '20260321_124402_youtube_block',
  },
  {
    up: migration_20260323_120000_youtube_block_columns.up,
    down: migration_20260323_120000_youtube_block_columns.down,
    name: '20260323_120000_youtube_block_columns',
  },
  {
    up: migration_20260323_234546___name.up,
    down: migration_20260323_234546___name.down,
    name: '20260323_234546___name'
  },
];
