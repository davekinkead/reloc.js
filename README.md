# 8FV65 - ND8SB - RELOC - 3ND0S - 0FU3M

Reloc is a zero dependency library for converting auto incrementing integers into reversable deterministic hard-to-guess short IDs.


## Usage

Reloc provides two functions - `encode` and `decode`.

```javascript

	const reloc = new Reloc()
	reloc.encode(10027) // => 'rc8ig'
	reloc.decode('rc8ig') // => 10027

```

You can set a domain so short IDs are unique to you.

```javascript

	const ex = new Reloc({ domain: 'www.example.com' })
	const an = new Reloc({ domain: 'www.another.com' })

	ex.encode(10027) // => 'diyci'
	an.encode(10027) // => '9cqq3'

```

Or set the minimum ID length (default is 5).  Note that larger lengths are backwards compatible.

```javascript

	const short = new Reloc({ length: 3 })
	const long = new Reloc({ length: 10 })

	short.encode(1)             // => 'iuk'
	long.encode(1)              // => 'iujafxpbrx'

	long.decode('iuk')          // => 1
	long.decode('iujafxpbrx')   // => 1
	short.decode('iuk')         // => 1
	short.decode('iujafxpbrx')  // => 1

```

You can even set the alphabet that will be used for encoding (default is base36 lowercase).


```javascript

	const baseJP = new Reloc({ dictionary: 'あかがただなはぱまやらわきぎじちぢにひびぴみゆりを' })
	baseJP.encode(10027)       // => 'やちわきひ'
	baseJP.decode('やちわきひ')  // => 10027

```
