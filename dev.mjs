#!/usr/bin/env zx

await $`yarn build`;
await $`concurrently "yarn preview" "yarn serve_data"`
