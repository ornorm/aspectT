#!/usr/bin/env ts-node
import { print_main } from '@ornorm/aspectT';

const exitCode: number = print_main();

process.exit(exitCode);
