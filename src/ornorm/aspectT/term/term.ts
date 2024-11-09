export const ASPECT_T_ACII_HEADER: string = `
  ___           _        _______ _______ 
 / _ \\         | |      |__   __|__   __|
/ /_\\ \\_ __ ___| |_ ___    | |     | |   
|  _  | '__/ __| __/ _ \\   | |     | |   
| | | | |  \\__ \\ || (_) |  | |     | |   
\\_| |_/_|  |___/\\__\\___/   |_|     |_|   
`;

export class Term {
    /**
     * Gets the ASCII header for the ASPECT_T.
     * @returns {string} The ASCII header string.
     */
    public static get header(): string {
        return ASPECT_T_ACII_HEADER;
    }
}
