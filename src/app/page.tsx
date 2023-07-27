'use client'
import Image from 'next/image'
import { useForm } from "react-hook-form";
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const saveSketchMutation = useMutation(api.sketches.saveSketch)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<{prompt: string}>();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className='flex flex-col w-full gap-4' onSubmit={handleSubmit(async (formData) => {
        const results = await saveSketchMutation(formData)
        console.log(results)
      })}>
        <div className='w-full flex flex-col items-start'>
          <label htmlFor="prompt">Prompt:</label>
          <input id="prompt" className='border border-gray-600 w-full rounded-lg caret-black outline-none px-4 py-3' {...register('prompt', {required: true})} />
          {errors.prompt && <small className='text-red-500'>Este campo é obrigatório!</small>}
        </div>

        <div className='w-52'>
          <button type='submit' className='w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors border-none rounded-md'>Gerar Imagem</button>
        </div>
      </form>
    </main>
  )
}
