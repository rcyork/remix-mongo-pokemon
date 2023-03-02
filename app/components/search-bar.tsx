import { useNavigate, useSearchParams } from '@remix-run/react'
import { SelectBox } from './select-box'
import { sortOptions } from '~/utils/constants'
import React from 'react'

export function SearchBar() {
  const navigate = useNavigate()
  let [searchParams] = useSearchParams()

  const clearFilters = () => {
    searchParams.delete('filter')
    searchParams.delete('sort')
    setFormData({
      filter: '',
      sort: '',
    })
    navigate('/home')
  }

  const [formData, setFormData] = React.useState({
    filter: searchParams.get('filter') ?? '',
    sort: searchParams.get('sort') ?? '',
  })

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData((form) => ({ ...form, [field]: event.target.value }))
  }

  return (
    <form className="mt-4 flex h-20 w-full items-center gap-x-4 border-b-4 border-b-blue-900 border-opacity-30 pb-8">
      <div className={`flex w-2/5 items-center`}>
        <input
          type="text"
          name="filter"
          className="w-full rounded-xl px-3 py-2"
          placeholder="Search"
          onChange={(e) => handleInputChange(e, 'filter')}
          value={formData.filter}
        />
        <svg
          className="-ml-8 h-4 w-4 fill-current text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </div>
      <SelectBox
        className="w-full rounded-xl px-3 py-2 text-gray-400"
        containerClassName="w-40"
        name="sort"
        options={sortOptions}
        value={formData.sort}
        onChange={(e) => handleInputChange(e, 'sort')}
      />
      <button
        type="submit"
        className="rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
      >
        Search
      </button>
      {searchParams.get('filter') && (
        <button
          onClick={clearFilters}
          className="rounded-xl bg-red-300 px-3 py-2 font-semibold text-blue-600 transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-yellow-400"
        >
          Clear Filters
        </button>
      )}
      <div className="flex-1" />
    </form>
  )
}
