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



export const updatePokemon = async (
  name: string,
  weight: string,
  avatar: string,
  id: string,
) => {
  await prisma.pokemon.update({
    where: {
      id,
    },
    data: {
      name,
      weight,
      avatar: avatar,
    },
  })
}

export const deletePokemonById = async (id: string) => {
  await prisma.pokemon.delete({
    where: {
      id,
    },
  })
}

export const getPokemonById = async (id: string) => {
  return await prisma.pokemon.findUnique({
    where: {
      id,
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
      avatar: true,
      author: {
        select: {
          profile: true,
        },
      },
    },
  })
}
