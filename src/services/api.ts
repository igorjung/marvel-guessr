export const getCharacter = async (id: number) => {
  const api = `http://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${process.env.NEXT_PUBLIC_KEY}&hash=${process.env.NEXT_PUBLIC_HASH}`
  const request = await fetch(api)
  const { data } = await request.json()
  return data.results;
};