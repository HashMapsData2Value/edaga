function getShortenedBase32(input) {
  return input.slice(0, 7) + '...' + input.slice(-3)
}

export default getShortenedBase32;