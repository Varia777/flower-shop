export type ProductType = {
  id: string,
  name: string,
  price: number,
  image: string,
  lightning: string,
  humidity: string,
  temperature: string,
  height: string,
  diameter: number,
  url: string,
  type: {
    id: string,
    name: string,
    url: string,
  },
  countInCart?: number,
  isInFavorite?: boolean,
}
