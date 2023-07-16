import * as reloc from '../index.js'
import Reloc from '../index.js'
import assert from 'assert'

const base10 = '0123456789'
const base36 = '0123456789abcdefghijklmnopqrstuvwxyz'
const hash = '2c386f51b3af003cc118cec7364b50f42da71d158eed67bccd03f0637a4d8f9d'

const opts = {
	dictionary: base36,
	key: 'q7clfs8i69y54hk3zmno21ptge0ajbudwvxr',
	length: 6
}

describe('Reloc', function () {
	describe('#pad()', function () {
		it('pads a baseX string to the minimum amount minus one', function () {

			assert.equal(reloc.pad('0s5', opts), '000s5')
		})
	})

	describe('#unpad()', function () {
		it('unpads a baseX string', function () {
			assert.equal(reloc.unpad('00000x7'), 'x7')
		})
	})

	describe('#baseX()', function () {
		it('converts a decimal into decimal string when given base10 dict', function () {
			assert.equal(reloc.baseX(1234, { dictionary: base10 }), '1234')
		})

		it('converts a decimal into base36 string when given base36 dict', function () {
			assert.equal(reloc.baseX(1234, opts), 'ya')
		})
	})

	describe('#base10()', function () {
		it('converts a base10 string into a decimal number', function () {
			assert.equal(reloc.base10('1234', { dictionary: base10 }), 1234)
		})

		it('converts a base36 string into a decimal number', function () {
			assert.equal(reloc.base10('ya', opts), 1234)
		})
	})

	describe('#shift()', function () {
		it('garbles a baseX string', function () {
			assert.equal(reloc.shift('00001', opts), '7r8dmh')
		})

		it('prefixes the encrypted string with an offset character', function () {
			const number = '00001'
			const cypher = reloc.shift(number, opts)
			const base = reloc.base10(number, opts) % opts.dictionary.length

			assert.equal(cypher.length, number.length + 1)
			assert.equal(cypher[0], opts.key[base])
		})

		it('ensures leading characters of similar strings are not the same', function () {
			const one = reloc.shift('00001', opts)
			const two = reloc.shift('00002', opts)

			assert.ok(one !== two)
		})
	})

	describe('#unshift()', function () {
		it('converts encrypted numbers back to baseX', function () {
			const number = '00hf7z'
			const cypher = reloc.shift(number, opts)
			const plain = reloc.unshift(cypher, opts)

			assert.ok(cypher != plain)
			assert.equal(number, plain)
		})
	})

	describe('#getKey()', function () {
		it('generates a key with only contain elements from the dictionary', function () {
			const key10 = reloc.getKey('example.com', base10)
			const key36 = reloc.getKey('example.com', base36)

			assert.equal(key10.length, base10.length)
			assert.deepEqual(key10.split('').sort(), base10.split('').sort())
			assert.equal(key36.length, base36.length)
			assert.deepEqual(key36.split('').sort(), base36.split('').sort())
		})

		it('generates the same key for the same domain & dictionary', function () {
			assert.equal(reloc.getKey('hello', base36), reloc.getKey('hello', base36))
		})

		it('generates different keys for different domains', function () {
			assert.ok(reloc.getKey('bonjour', base36) != reloc.getKey('goddag', base36))
		})

		it('generates different keys for different dictionaries', function () {
			assert.ok(reloc.getKey('servus', base36) != reloc.getKey('servus', base10))
		})
	})

	describe('#encode()', function () {
		it('uniquely encodes numbers', function () {
			const re = new Reloc()

			assert.equal(typeof re.encode(1), 'string')
			assert.ok(re.encode(1) != re.encode(2))
		})
	})

	describe('#decode()', function () {
		it('decodes baseX strings to numbers', function () {
			const re = new Reloc()

			assert.equal(re.decode('iujafy'), 1)
		})
	})

	describe('Readme', function () {
		it('creates reversible deterministic hard-to-guess short IDs from numbers', function () {
			const re = new Reloc()

			assert.equal(re.encode(690420), 'gjmb2')
			assert.equal(re.decode('gjmb2'), 690420)
		})

		it('generates different codes for different domains', function () {
			const ex = new Reloc({ domain: 'www.example.com' })
			const an = new Reloc({ domain: 'www.another.com' })

			assert.equal(ex.encode(10027), 'diyci')
			assert.equal(an.encode(10027), '9cqq3')
		})

		it('permits different minium length codes', function () {
			const short = new Reloc({ length: 3 })
			const long = new Reloc({ length: 10 })

			assert.equal(short.encode(1), 'iuk')
			assert.equal(long.encode(1), 'iujafxpbrx')
		})

		it('ensures different minimum lengths remain compatible within domains', function () {
			const short = new Reloc({ length: 3 })
			const long = new Reloc({ length: 10 })

			assert.equal(long.decode('iujafxpbrx'), 1)
			assert.equal(short.decode('iujafxpbrx'), 1)
		})

		it('accepts any alphabet to encode with', function () {
			const base36 = new Reloc()
			assert.equal(base36.encode(10027), 'rc8ig')
			assert.equal(base36.decode('rc8ig'), 10027)

			const base16 = new Reloc({ dictionary: '0123456789abcdef' })
			assert.equal(base16.encode(10027), 'fa364')
			assert.equal(base16.decode('fa364'), 10027)
		})
	})
})
