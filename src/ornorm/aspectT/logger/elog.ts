import { EasyLogger } from '@ornorm/aspectT';

const LOG_TAG: string = 'elog';

if (!process.env.ELOG_OUTPUT_LVL) {
    throw new Error(`Please configure static output log level (in elog_cfg.h)`);
}
if (!process.env.ELOG_LINE_NUM_MAX_LEN) {
    throw new Error(`Please configure output line number max length (in elog_cfg.h)`);
}
if (!process.env.ELOG_LINE_BUF_SIZE) {
    throw new Error(`Please configure buffer size for every line's log (in elog_cfg.h)`);
}
if (!process.env.ELOG_FILTER_TAG_MAX_LEN) {
    throw new Error(`Please configure output filter's tag max length (in elog_cfg.h)`);
}
if (!process.env.ELOG_FILTER_KW_MAX_LEN) {
    throw new Error(`Please configure output filter's keyword max length (in elog_cfg.h)`);
}
if (!process.env.ELOG_NEWLINE_SIGN) {
    throw new Error(`Please configure output newline sign (in elog_cfg.h)`);
}

export const ELOG_FILTER_TAG_LVL_MAX_NUM: number  = 4

if (process.env.ELOG_COLOR_ENABLE) {
   /**
     * CSI(Control Sequence Introducer/Initiator) sign
     * more information on https://en.wikipedia.org/wiki/ANSI_escape_code
     */
    EasyLogger.CSI_START = `\x1b[`;
    EasyLogger.CSI_END = `\x1b[0m`;
    /* output log front color */
    EasyLogger.F_BLACK = `30;`;
    EasyLogger.F_RED = `31;`;
    EasyLogger.F_GREEN = `32;`;
    EasyLogger.F_YELLOW = `33;`;
    EasyLogger.F_BLUE = `34;`;
    EasyLogger.F_MAGENTA = `35;`;
    EasyLogger.F_CYAN = `36;`;
    EasyLogger.F_WHITE = `37;`;
    /* output log background color */
    EasyLogger.B_NULL = ``;
    EasyLogger.B_BLACK = `40;`;
    EasyLogger.B_RED = `41;`;
    EasyLogger.B_GREEN = `42;`;
    EasyLogger.B_YELLOW = `43;`;
    EasyLogger.B_BLUE = `44;`;
    EasyLogger.B_MAGENTA = `45;`;
    EasyLogger.B_CYAN = `46;`;
    EasyLogger.B_WHITE = `47;`;
    /* output log fonts style */
    EasyLogger.S_BOLD = `1m`;
    EasyLogger.S_UNDERLINE = `4m`;
    EasyLogger.S_BLINK = `5m`;
    EasyLogger.S_NORMAL = `22m`;
    /* output log default color definition: [front color] + [background color] + [show style] */
    EasyLogger.ELOG_COLOR_ASSERT = `${EasyLogger.F_MAGENTA}${EasyLogger.B_NULL}${EasyLogger.S_NORMAL}`;
    EasyLogger.ELOG_COLOR_ERROR = `${EasyLogger.F_RED}${EasyLogger.B_NULL}${EasyLogger.S_NORMAL}`;
    EasyLogger.ELOG_COLOR_WARN = `${EasyLogger.F_YELLOW}${EasyLogger.B_NULL}${EasyLogger.S_NORMAL}`;
    EasyLogger.ELOG_COLOR_INFO = `${EasyLogger.F_CYAN}${EasyLogger.B_NULL}${EasyLogger.S_NORMAL}`;
    EasyLogger.ELOG_COLOR_DEBUG = `${EasyLogger.F_GREEN}${EasyLogger.B_NULL}${EasyLogger.S_NORMAL}`;
    EasyLogger.ELOG_COLOR_VERBOSE = `${EasyLogger.F_BLUE}${EasyLogger.B_NULL}${EasyLogger.S_NORMAL}`;
}

/* EasyLogger object */
const  elog: EasyLogger = { ...EasyLogger };
