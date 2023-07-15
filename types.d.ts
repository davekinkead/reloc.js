/**
 * An options object for functions in the core.js library
 */
export type Options = {
	dictionary: string;			// all the characters for the target encoding
	length: number;					// minimum length for the encoded UID
	key: string;						// a secret key for unique encoding (generated)
}
