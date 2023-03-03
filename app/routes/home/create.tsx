import { json, type ActionFunction } from '@remix-run/node'
import { useActionData } from '@remix-run/react'
import React from 'react'
import { redirect } from 'react-router-dom'
import { FormField } from '~/components/form-field'
import { Modal } from '~/components/modal'
import { requireUserId } from '~/utils/auth.server'
import { createPokemon } from '~/utils/pokemon.server'

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const userId = await requireUserId(request)
  const name = form.get('name')
  const height = form.get('height')
  const weight = form.get('weight')

  if (
    typeof name !== 'string' ||
    typeof height !== 'string' ||
    typeof weight !== 'string'
  ) {
    return json({ error: 'Invalid form data' }, { status: 400 })
  }
  if (!name.length) {
    return json({ error: 'Please provide a name' }, { status: 400 })
  }

  if (parseInt(weight) <= 0) {
    return json({ error: 'Please provide a positive weight' }, { status: 400 })
  }

  await createPokemon(name, height, weight, userId)
  return redirect('/home')
}

export default function PokemonModal() {
  const actionData = useActionData()
  const [formError] = React.useState(actionData?.error || '')
  const [formData, setFormData] = React.useState({
    name: '',
    height: '',
    weight: '',
  })
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData((form) => ({ ...form, [field]: e.target.value }))
  }

  return (
    <Modal isOpen={true} className="w-2/3 p-10">
      {formError ? (
        <div className="mb-2 w-full text-center text-xs font-semibold tracking-wide text-red-500">
          {formError}
        </div>
      ) : null}

      <form method="post">
        <FormField
          htmlFor="name"
          label="Name"
          value={formData.name}
          onChange={(e) => handleChange(e, 'name')}
        />
        <FormField
          htmlFor="height"
          label="Height"
          value={formData.height}
          onChange={(e) => handleChange(e, 'height')}
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
          className="mt-4 rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
        >
          Create
        </button>
      </form>
    </Modal>
  )
}
