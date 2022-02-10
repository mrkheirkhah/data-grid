#!/usr/bin/env zx

await $`npm run build`;
await Promise.all([$`npm run serve_data`, $`npm run preview`]);
