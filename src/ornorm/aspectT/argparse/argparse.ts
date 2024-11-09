import { argparse, argparse_option, argparse_option_type, argparse_option_flags, argparse_flag } from '@ornorm/argparse';

function prefix_skip(str: string, prefix: string): string | null {
    const len: number = prefix.length;
    return str.startsWith(prefix) ? str.slice(len) : null;
}

function prefix_cmp(str: string, prefix: string): number {
    for (let i: number = 0; i < str.length && i < prefix.length; i++) {
        if (str[i] !== prefix[i]) {
            return str.charCodeAt(i) - prefix.charCodeAt(i);
        }
    }
    return 0;
}

function argparse_error(self: argparse, opt: argparse_option, reason: string, flags: number): void {
    if (flags & argparse_option_flags.OPT_LONG) {
        console.error(`error: option \`--${opt.long_name}\` ${reason}`);
    } else {
        console.error(`error: option \`-${opt.short_name}\` ${reason}`);
    }
    process.exit(1);
}

function argparse_getvalue(self: argparse, opt: argparse_option, flags: number): number {
    let s: string | null = null;
    if (!opt.value) return 0;

    switch (opt.type) {
        case argparse_option_type.ARGPARSE_OPT_BOOLEAN:
            if (flags & argparse_option_flags.OPT_UNSET) {
                opt.value--;
            } else {
                opt.value++;
            }
            if (opt.value < 0) opt.value = 0;
            break;
        case argparse_option_type.ARGPARSE_OPT_BIT:
            if (flags & argparse_option_flags.OPT_UNSET) {
                opt.value &= ~opt.data;
            } else {
                opt.value |= opt.data;
            }
            break;
        case argparse_option_type.ARGPARSE_OPT_STRING:
            if (self.optvalue) {
                opt.value = self.optvalue;
                self.optvalue = null;
            } else if (self.argc > 1) {
                self.argc--;
                opt.value = self.argv.shift() as string;
            } else {
                argparse_error(self, opt, "requires a value", flags);
            }
            break;
        case argparse_option_type.ARGPARSE_OPT_INTEGER:
            let errno: number = 0;
            if (self.optvalue) {
                opt.value = parseInt(self.optvalue, 10);
                self.optvalue = null;
            } else if (self.argc > 1) {
                self.argc--;
                opt.value = parseInt(self.argv.shift() as string, 10);
            } else {
                argparse_error(self, opt, "requires a value", flags);
            }
            if (errno === ERANGE) {
                argparse_error(self, opt, "numerical result out of range", flags);
            }
            if (isNaN(opt.value)) {
                argparse_error(self, opt, "expects an integer value", flags);
            }
            break;
        case argparse_option_type.ARGPARSE_OPT_FLOAT:
            errno = 0;
            if (self.optvalue) {
                opt.value = parseFloat(self.optvalue);
                self.optvalue = null;
            } else if (self.argc > 1) {
                self.argc--;
                opt.value = parseFloat(self.argv.shift() as string);
            } else {
                argparse_error(self, opt, "requires a value", flags);
            }
            if (errno === ERANGE) {
                argparse_error(self, opt, "numerical result out of range", flags);
            }
            if (isNaN(opt.value)) {
                argparse_error(self, opt, "expects a numerical value", flags);
            }
            break;
        default:
            throw new Error("Invalid option type");
    }

    if (opt.callback) {
        return opt.callback(self, opt);
    }
    return 0;
}

function argparse_options_check(options: argparse_option[]): void {
    options.forEach((option: argparse_option) => {
        switch (option.type) {
            case argparse_option_type.ARGPARSE_OPT_END:
            case argparse_option_type.ARGPARSE_OPT_BOOLEAN:
            case argparse_option_type.ARGPARSE_OPT_BIT:
            case argparse_option_type.ARGPARSE_OPT_INTEGER:
            case argparse_option_type.ARGPARSE_OPT_FLOAT:
            case argparse_option_type.ARGPARSE_OPT_STRING:
            case argparse_option_type.ARGPARSE_OPT_GROUP:
                break;
            default:
                throw new Error(`wrong option type: ${option.type}`);
        }
    });
}

function argparse_short_opt(self: argparse, options: argparse_option[]): number {
    for (const option of options) {
        if (option.type === argparse_option_type.ARGPARSE_OPT_END) break;
        if (option.short_name === self.optvalue[0]) {
            self.optvalue = self.optvalue.slice(1);
            return argparse_getvalue(self, option, 0);
        }
    }
    return -2;
}

function argparse_long_opt(self: argparse, options: argparse_option[]): number {
    for (const option of options) {
        if (option.type === argparse_option_type.ARGPARSE_OPT_END) break;
        if (!option.long_name) continue;

        let rest: string | null = prefix_skip(self.argv[0].slice(2), option.long_name);
        if (!rest) {
            if (option.flags & argparse_option_flags.OPT_NONEG) continue;
            if (option.type !== argparse_option_type.ARGPARSE_OPT_BOOLEAN && option.type !== argparse_option_type.ARGPARSE_OPT_BIT) continue;
            if (!prefix_cmp(self.argv[0].slice(2), "no-")) continue;
            rest = prefix_skip(self.argv[0].slice(5), option.long_name);
            if (!rest) continue;
            option.flags |= argparse_option_flags.OPT_UNSET;
        }

        if (rest[0] === '=') {
            self.optvalue = rest.slice(1);
        }

        return argparse_getvalue(self, option, option.flags | argparse_option_flags.OPT_LONG);
    }
    return -2;
}

function argparse_init(self: argparse, options: argparse_option[], usages: string[], flags: number): number {
    self.options = options;
    self.usages = usages;
    self.flags = flags;
    self.description = null;
    self.epilog = null;
    self.argc = 0;
    self.argv = [];
    self.out = [];
    self.cpidx = 0;
    self.optvalue = null;
    return 0;
}

function argparse_describe(self: argparse, description: string, epilog: string): void {
    self.description = description;
    self.epilog = epilog;
}

function argparse_parse(self: argparse, argc: number, argv: string[]): number {
    self.argc = argc - 1;
    self.argv = argv.slice(1);
    self.out = argv;

    argparse_options_check(self.options);

    while (self.argc) {
        const arg: string = self.argv[0];
        if (arg[0] !== '-' || arg.length === 1) {
            if (self.flags & argparse_flag.ARGPARSE_STOP_AT_NON_OPTION) break;
            self.out[self.cpidx++] = self.argv.shift() as string;
            self.argc--;
            continue;
        }

        if (arg[1] !== '-') {
            self.optvalue = arg.slice(1);
            while (self.optvalue) {
                const result: number = argparse_short_opt(self, self.options);
                if (result === -2) {
                    console.error(`error: unknown option \`${arg}\``);
                    argparse_usage(self);
                    if (!(self.flags & argparse_flag.ARGPARSE_IGNORE_UNKNOWN_ARGS)) {
                        process.exit(1);
                    }
                }
            }
            continue;
        }

        if (arg === '--') {
            self.argv.shift();
            self.argc--;
            break;
        }

        const result: number = argparse_long_opt(self, self.options);
        if (result === -2) {
            console.error(`error: unknown option \`${arg}\``);
            argparse_usage(self);
            if (!(self.flags & argparse_flag.ARGPARSE_IGNORE_UNKNOWN_ARGS)) {
                process.exit(1);
            }
        }
        continue;
    }

    self.out = self.out.concat(self.argv);
    self.argv = self.out;
    self.argc = self.argv.length;

    return self.argc;
}

function argparse_usage(self: argparse): void {
    if (self.usages.length) {
        console.log(`Usage: ${self.usages.join('\n   or: ')}`);
    } else {
        console.log('Usage:');
    }

    if (self.description) {
        console.log(`${self.description}\n`);
    }

    let usage_opts_width: number = 0;
    for (const option of self.options) {
        let len: number = 0;
        if (option.short_name) len += 2;
        if (option.short_name && option.long_name) len += 2;
        if (option.long_name) len += option.long_name.length + 2;
        if (option.type === argparse_option_type.ARGPARSE_OPT_INTEGER) len += 6;
        if (option.type === argparse_option_type.ARGPARSE_OPT_FLOAT) len += 6;
        if (option.type === argparse_option_type.ARGPARSE_OPT_STRING) len += 6;
        len = (len + 3) & ~3;
        if (usage_opts_width < len) usage_opts_width = len;
    }
    usage_opts_width += 4;

    for (const option of self.options) {
        if (option.type === argparse_option_type.ARGPARSE_OPT_GROUP) {
            console.log(`\n${option.help}\n`);
            continue;
        }

        let line: string = '    ';
        if (option.short_name) line += `-${option.short_name}`;
        if (option.long_name && option.short_name) line += ', ';
        if (option.long_name) line += `--${option.long_name}`;
        if (option.type === argparse_option_type.ARGPARSE_OPT_INTEGER) line += '=int';
        if (option.type === argparse_option_type.ARGPARSE_OPT_FLOAT) line += '=flt';
        if (option.type === argparse_option_type.ARGPARSE_OPT_STRING) line += '=str';

        const pad: number = usage_opts_width - line.length;
        if (pad > 0) {
            line += ' '.repeat(pad);
        } else {
            console.log(line);
            line = ' '.repeat(usage_opts_width);
        }
        console.log(`${line}  ${option.help}`);
    }

    if (self.epilog) {
        console.log(`\n${self.epilog}`);
    }
}

function argparse_help_cb_no_exit(self: argparse, option: argparse_option): number {
    argparse_usage(self);
    return 0;
}

function argparse_help_cb(self: argparse, option: argparse_option): void {
    argparse_usage(self);
    process.exit(0);
}
