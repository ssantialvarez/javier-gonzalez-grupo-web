import * as migration_20260320_052803 from './20260320_052803';
import * as migration_20260321_124402_youtube_block from './20260321_124402_youtube_block';

export const migrations = [
  {
    up: migration_20260320_052803.up,
    down: migration_20260320_052803.down,
    name: '20260320_052803',
  },
  {
    up: migration_20260321_124402_youtube_block.up,
    down: migration_20260321_124402_youtube_block.down,
    name: '20260321_124402_youtube_block'
  },
];
