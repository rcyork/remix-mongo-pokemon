import { json, type LoaderFunction, type ActionFunction } from '@remix-run/node'
import { useActionData, useLoaderData } from '@remix-run/react'
import React from 'react'
import { redirect, useSubmit } from 'react-router-dom'
import { FormField } from '~/components/form-field'
import { ImageUploader } from '~/components/image-uploader'
import { Modal } from '~/components/modal'
import { getPokemonById, updatePokemon } from '~/utils/pokemon.server'

export const loader: LoaderFunction = async ({ params }) => {
  const { pokemonId } = params

  if (typeof pokemonId !== 'string') {
    return redirect('/home')
  }

  const pokemon = await getPokemonById(pokemonId)

  return json(pokemon)
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const name = form.get('name')
  const weight = form.get('weight')
  const id = form.get('id')

  if (
    typeof name !== 'string' ||
    typeof weight !== 'string' ||
    typeof id !== 'string'
  ) {
    return json({ error: 'Invalid form data' }, { status: 400 })
  }
  if (!name.length) {
    return json({ error: 'Please provide a name' }, { status: 400 })
  }

  if (parseInt(weight) <= 0) {
    return json({ error: 'Please provide a positive weight' }, { status: 400 })
  }

  await updatePokemon(name, weight, id)
  return redirect('/home')
}

export default function PokemonModal() {
  const actionData = useActionData()
  const [formError] = React.useState(actionData?.error || '')
  const pokemon = useLoaderData()

  const [formData, setFormData] = React.useState({
    name: actionData?.fields?.name || pokemon.name,
    weight: actionData?.fields?.weight || pokemon.weight,
    avatar: actionData?.fields?.avatar || pokemon.avatar || '',
  })

  const isValid =
    formData.name !== pokemon.name || formData.weight !== pokemon.weight

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData((form) => ({ ...form, [field]: e.target.value }))
  }

  const submit = useSubmit()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    data.set('id', pokemon.id)

    submit(data, { method: 'post' })
  }

  const handleFileUpload = async (file: File) => {
    let inputFormData = new FormData()
    inputFormData.append('avatar', file)

    const response = await fetch(`/avatar/${pokemon.id}`, {
      method: 'POST',
      body: inputFormData,
    })
    const { avatarUrl } = await response.json()

    setFormData({
      ...formData,
      avatar: avatarUrl,
    })
  }

  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      {formError ? (
        <div className="mb-2 w-full text-center text-xs font-semibold tracking-wide text-red-500">
          {formError}
        </div>
      ) : null}

      <form method="post" onSubmit={handleSubmit}>
        <div className="flex ">
          <div className="mr-8 flex items-center">
            <ImageUploader
              onChange={handleFileUpload}
              avatarUrl={formData.avatar || ''}
            />
          </div>
          <div className=" flex flex-1 flex-col">
            <FormField
              htmlFor="name"
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange(e, 'name')}
            />
            <FormField
              htmlFor="weight"
              label="Weight"
              value={formData.weight}
              onChange={(e) => handleChange(e, 'weight')}
              type="number"
            />
            <button
              type="submit"
              className={`mt-4 rounded-xl bg-yellow-300
              px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out  ${
                isValid
                  ? 'hover:-translate-y-1 hover:bg-yellow-400'
                  : 'bg-opacity-50 text-blue-400'
              }`}
              disabled={!isValid}
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
