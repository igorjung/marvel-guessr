import IOption from '../interfaces/option'

export const getAlphabeticalList = (options: IOption[]) => {
  const list = [...options]
  list.sort((a, b) => {
    if(a.name.toLowerCase() < b.name.toLowerCase()) return -1
    if(a.name.toLowerCase() > b.name.toLowerCase()) return 1
    return 0
  })
  return list
}

export const getNameById = (options: IOption[], id: number) => {
  const list = [...options]
  const index = list.map((x: IOption) => x.id).indexOf(id)
  const name = list[index].name
  return name
}