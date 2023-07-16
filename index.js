// @ts-check
import { createHash } from 'node:crypto'

const DEFAULT_DICTIONARY = '0123456789abcdefghijklmnopqrstuvwxyz'
const DEFAULT_MIN_LENGTH = 5
const DEFAULT_DOMAIN = 'you-should-specify-a-domain-string-so-your-uids-are-unique-to-you'

/**
 * Object for generating reversable, short, hard to guess, non-sequential UIDs
 * @constructor
 * @param {object} opts
 * @param {string} opts.dictionary
 * @param {string} opts.domain
 * @param {number} opts.length
 */
export default function Reloc (opts) {

	const options = {
		dictionary: opts?.dictionary || DEFAULT_DICTIONARY,
		length: opts?.length || DEFAULT_MIN_LENGTH,
		key: ''
	}

	options.key = getKey(opts?.domain || DEFAULT_DOMAIN, options.dictionary)

	/**
	 * Encodes a number
	 * @param {number} number - the number to encode
	 * @return {string} - the encoded number
	 */
	this.encode = (number) => {
		return shift(pad(baseX(number, options), options), options)
	}

	/**
	 * Decodes an encoded number
	 * @param {string} number
	 * @return {number}
	 */
	this.decode = (number) => {
		return base10(unpad(unshift(number, options), options), options)
	}
}

/**
 * Generates a key to ensure different outputs from different domains
 *  - keys cant contain characters that are not in the dictionary
 * @param {string} domain - a domain to seed the key generation
 * @param {string} dict - the dictionary to form the base of the key
 * @return {string}
 */
export const getKey = (domain, dict) => {
	const hash = createHash('sha256').update(domain).digest('hex')
	const size = Math.ceil(hash.length / dict.length)
	const salt = hash.repeat(size) //.split('')
	const arr = dict.split('')

	//	perform a fisher-yates shuffle with the seed as the randomizer
	for (let i = 0; i < arr.length; i++) {
		// @ts-ignore
		let j = Math.round(parseInt(salt[i], 16) / 16 * i)
		let tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp
	}

	return arr.join('')
}

/**
 * Pads a string representation of a baseX number with leading 0s
 * @param {string} number - the baseX number to pad
 * @param {import('./types').Options} opts - an options object
 * @return {string}
 */
export const pad = (number, opts) => {
	const dict = opts.dictionary
	return (number.length >= opts.length - 1) ? number : pad(dict[0] + number, opts)
}

/**
 * Unpads all leading 0s from a string
 * @param {string} number - the baseX number to unpad
 * @param {import('./types').Options} opts - an options object
 * @return {string}
 */
export const unpad = (number, opts) => {
	const dict = opts.dictionary
	const regex = new RegExp(`^${dict[0]}+`)
	return number.replace(regex, '')
}

/**
 * Converts a decimal number into a baseX string where X is the dictionary length
 * @param {number} number - the decimal to convert
 * @param {import('./types').Options} opts
 * @return {string}
 */
export const baseX = (number, opts) => {
	const div = Math.floor(number / opts.dictionary.length)
	const rem = number % opts.dictionary.length

	return (div > 0) ? baseX(div, opts) + opts.dictionary[rem] : opts.dictionary[rem]
}

/**
 * Converts a baseX string into a decimal number
 * @param {string} number
 * @param {import('./types').Options} opts
 * @return {number}
 */
export const base10 = (number, opts) => {
	return number.split('').reverse()
		.map((c, i) => opts.dictionary.indexOf(c) * (opts.dictionary.length)**i)
		.reduce((acc, cur) => acc + cur, 0)
}

/**
 * Translates a baseX number with a substitution cypher
 * @param {string} number
 * @param {import('./types').Options} opts
 * @return {string}
 */
export const shift = (number, opts) => {
	const dict = opts.dictionary
	const base = base10(number, opts) % dict.length

	return opts.key[base] + number.split('').map((c, i) => {
		const offset = dict.indexOf(c) + dict.indexOf(opts.key[i]) + base
		return dict[offset % dict.length]
	}).join('')
}

/**
 * Translates a baseX number with a substitution cypher
 * @param {string} number
 * @param {import('./types').Options} opts
 * @return {string}
 */
export const unshift = (number, opts) => {
	const dict = opts.dictionary
	const base = opts.key.indexOf(number[0])

	return number.slice(1).split('').map((c, i) => {
		const offset = dict.indexOf(c) - dict.indexOf(opts.key[i]) - base + dict.length * 2
		return dict[offset % dict.length]
	}).join('')
}
