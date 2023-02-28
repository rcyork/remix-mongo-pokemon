import { json, type ActionFunction } from '@remix-run/node'
import { prisma } from '~/utils/prisma.server'
import { uploadAvatar } from '~/utils/s3.server'

export const action: ActionFunction = async ({ request, params }) => {
  const pokemonId = params.pokemonId
  const avatarUrl = await uploadAvatar(request)

  await prisma.pokemon.update({
    data: {
      avatar: avatarUrl,
    },
    where: {
      id: pokemonId,
    },
  })

  return json({ avatarUrl })
}
