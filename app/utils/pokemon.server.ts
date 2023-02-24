import { type Prisma } from '@prisma/client'
import { prisma } from './prisma.server'

export const createPokemon = async (
  name: string,
  weight: string,
  userId: string,
) => {
  await prisma.pokemon.create({
    data: {
      name,
      weight,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  })
}

export const getFilteredPokemon = async (
  userId: string,
  sortFilter: Prisma.PokemonOrderByWithRelationInput,
  whereFilter: Prisma.PokemonWhereInput,
) => {
  return await prisma.pokemon.findMany({
    where: {
      authorId: userId,
      ...whereFilter,
    },
    orderBy: sortFilter,
    select: {
      id: true,
      name: true,
      weight: true,
      author: {
        select: {
          profile: true,
        },
      },
    },
  })
}
