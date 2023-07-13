const dict = '0123456789abcdefghijklmnopqrstuvwxyz'//.split('').sort(() => Math.random() - 0.5).join('')
// const key = dict.split('').sort(() => Math.random() - 0.5).join('')
const key = 'q7clfs8i69y54hk3zmno21ptge0ajbudwvxr'
const length = 6



const encode = (n, l) => {
	return shift(pad(baseX(n), l))
}

const decode = (n) => {
	return base10(unpad(unshift(n)))
}

const pad = (n, l) => {
	return (n.length >= l-1) ? n : pad(dict[0]+n, l)
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
	const base = base10(n) % dict.length

	return key[base] + n.split('').map((c, i) => {
		const offset = dict.indexOf(c) + dict.indexOf(key[i]) + base
		return dict[offset % dict.length]
	}).join('')
}

const unshift = (n) => {
	const base = key.indexOf(n[0])

	return n.slice(1).split('').map((c, i) => {
		const offset = dict.indexOf(c) - dict.indexOf(key[i]) - base + dict.length * 2
		return dict[offset % dict.length]
	}).join('')
}

const shuffle = (str) => {
	return str.split('').sort(() => Math.random - 0.5)
}


const logger = (num) => {
	console.log(`${num} > ${baseX(num)} > ${pad(baseX(num), length)} > ${encode(num, length)}  > ${unshift(encode(num, length))}  > ${unpad(unshift(encode(num, length)))} > ${decode(encode(num, length))}`)
}

//	doesn't work when length is too low
[...Array(40).keys()].map(num => logger(num+1000000))

logger(933)
// logger(934)
// logger(935)
// logger(936)

