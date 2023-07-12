const dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' //.split('').reverse().join('')
const length = 6

const encode = (n, l) => {
	return shift(pad(baseX(n), l))
}

const decode = (n) => {
	return base10(unpad(unshift(n)))
}

const pad = (n, l) => {
	return (n.length >= l) ? n : pad(dict[0]+n, l)
}

const unpad = (n) => {
	const regex = new RegExp(`^${dict[0]}+`)
	return n.replace(regex, '')
}

const baseX = (n) => {
	const div = Math.floor(n / dict.length)
	const rem = n % dict.length

	return (div > 0) ? baseX(div) + dict[rem] : dict[rem]
}

const base10 = (n) => {
	return n.split('').reverse()
		.map((c, i) => dict.indexOf(c) * (dict.length)**i)
		.reduce((acc, cur) => acc + cur, 0)
}

const shift = (n) => {
	return n.split('').map((c, i) => {
		const loc = (dict.indexOf(c) + i)
		return dict[loc % dict.length]
	}).join('')
}

const unshift = (n) => {
	return n.split('').map((c, i) => {
		const loc = (dict.indexOf(c) - i + dict.length)
	return dict[loc % dict.length]
	}).join('')
}

const reverse = (str) => {
	return str.split('').reverse().join('')
}


[...Array(1000).keys()].map(num => console.log(`${num} > ${baseX(num)} > ${pad(baseX(num), length)} > ${encode(num, length)}  > ${unshift(encode(num, length))}  > ${unpad(unshift(encode(num, length)))} > ${decode(encode(num, length))}`))

const num = 3000000000
console.log(`${num} -> ${encode(num, length)}`)

console.log(decode('0123VV'))
