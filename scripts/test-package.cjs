// Test the published layout in an isolated consumer. Keep it for debugging.
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { mkdtempSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { resolve, join } = require('node:path');

const root = resolve(__dirname, '..');
const consumer = mkdtempSync(join(tmpdir(), 'featbit-react-package-'));
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run with npm run test:package after building');
function run(args, cwd = consumer) {
  try {
    return execFileSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (error) {
    process.stderr.write(error.stdout || '');
    process.stderr.write(error.stderr || '');
    throw error;
  }
}
console.log(`Package consumer: ${consumer}`);
const packed = JSON.parse(run([npmCli, 'pack', '--ignore-scripts', '--json', '--pack-destination', consumer], root));
writeFileSync(join(consumer, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
console.log(run([npmCli, 'install', '--ignore-scripts', '--no-audit', '--no-fund',
  join(consumer, packed[0].filename), 'react@19', 'react-dom@19', '@types/react@19', '@types/react-dom@19',
  '@types/hoist-non-react-statics@3', '@types/lodash.camelcase@4']));

writeFileSync(join(consumer, 'smoke.mjs'), `
import assert from 'node:assert/strict';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { FbProvider, FbClientBuilder, useFlags, useFbClient, withFbProvider, withFbConsumer, asyncWithFbProvider } from '@featbit/react-client-sdk';
const sdk = await import('@featbit/react-client-sdk');
assert.equal(sdk.FbProvider, FbProvider);
for (const exported of [FbClientBuilder, useFlags, useFbClient, withFbProvider, withFbConsumer, asyncWithFbProvider]) {
  assert.equal(typeof exported, 'function');
}
function Child() {
  assert.deepEqual(useFlags(), {});
  assert.equal(useFbClient(), undefined);
  return React.createElement('span', null, 'SSR works');
}
assert.equal(renderToString(React.createElement(FbProvider, { deferInitialization: true }, React.createElement(Child))), '<span>SSR works</span>');
`);
run(['smoke.mjs']);
writeFileSync(join(consumer, 'consumer.mts'), `
import { FbProvider, useFlags, IOptions, IFlagBase } from '@featbit/react-client-sdk';
export const Provider: typeof FbProvider = FbProvider;
export const flagsHook: typeof useFlags = useFlags;
export type Options = IOptions;
export type Flag = IFlagBase;
`);
run([join(root, 'node_modules/typescript/bin/tsc'), '--noEmit', '--strict', '--target', 'ES2020',
  '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'consumer.mts']);
console.log('Passed: packed static/dynamic ESM imports, public JS SDK re-exports, React SSR with hooks, NodeNext declarations.');
