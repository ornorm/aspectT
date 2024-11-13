import { errno, fprintf, get_print_context, printf, print_format, print_formatted, print_main, print_man, print_usage, put_char, sprintf } from '@ornorm/aspectT';
describe('printf module', () => {
    describe('errno', () => {
        it('should write formatted error message to stderr', () => {
            const context = get_print_context();
            const error = new Error('Test error');
            const format = 'Error: %s';
            const result = errno.call(context, error, format, 'Test error');
            expect(result).toBeGreaterThan(0);
        });
    });
    describe('fprintf', () => {
        it('should write formatted output to a file', () => {
            const context = get_print_context();
            const file = 'test.txt';
            const format = 'Hello, %s!';
            const result = fprintf.call(context, file, format, 'world');
            expect(result).toBeGreaterThan(0);
        });
    });
    describe('get_print_context', () => {
        it('should return a new print context', () => {
            const context = get_print_context();
            expect(context).toBeDefined();
        });
    });
    describe('printf', () => {
        it('should format and print the given arguments', () => {
            const context = get_print_context();
            const format = 'Hello, %s!';
            const result = printf.call(context, format, 'world');
            expect(result).toBeGreaterThan(0);
        });
    });
    describe('print_format', () => {
        it('should format the data according to the given format string', () => {
            const context = get_print_context();
            const format = 'Hello, %s!';
            const result = print_format.call(context, format, 'world');
            expect(result).toBe('Hello, world!');
        });
    });
    describe('print_formatted', () => {
        it('should print formatted text using the given format and arguments', () => {
            const context = get_print_context();
            const format = 'Hello, %s!';
            const result = print_formatted.call(context, format, 1, 'world');
            expect(result).toBe(1);
        });
    });
    describe('print_main', () => {
        it('should execute the main printf-like functionality', () => {
            const result = print_main();
            expect(result).toBe(0);
        });
    });
    describe('print_man', () => {
        it('should display the manual page for the program', () => {
            const context = get_print_context();
            const result = print_man.call(context);
            expect(result).toBeGreaterThan(0);
        });
    });
    describe('print_usage', () => {
        it('should display the usage information for the program', () => {
            const context = get_print_context();
            const result = print_usage.call(context);
            expect(result).toBeGreaterThan(0);
        });
    });
    describe('put_char', () => {
        it('should write a character to the standard output', () => {
            const context = get_print_context();
            const char = 'A';
            const result = put_char.call(context, char);
            expect(result).toBe(1);
        });
    });
    describe('sprintf', () => {
        it('should format and store a series of characters and values in the buffer', () => {
            const context = get_print_context();
            const format = 'Hello, %s!';
            const buffer = [];
            context.buffer = buffer;
            const result = sprintf.call(context, format, 'world');
            expect(result).toBeGreaterThan(0);
            expect(buffer.join('')).toBe('Hello, world!');
        });
    });
});
