"use client"
import Image from 'next/image'
import React, { useState } from 'react';

const sleep = (ms: any) => new Promise((r) => setTimeout(r, ms));

export default function Home() {
  const [prediction, setPrediction] = useState<any>(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({prediction})
      setPrediction(prediction);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className='flex flex-col w-full gap-4' onSubmit={handleSubmit}>
        <div className='flex w-full gap-4'>
          <div className='w-full flex flex-col items-start'>
            <label htmlFor="prompt">Prompt:</label>
            <input name="prompt" id="prompt" className='border border-gray-600 w-full rounded-lg caret-black outline-none px-4 py-3' />
          </div>

          <div className='w-1/3 flex gap-4'>
            <div className='w-full flex flex-col items-start'>
              <label htmlFor="seed">Seed:</label>
              <input name="seed" id="seed" type='number' className='border border-gray-600 w-full rounded-lg caret-black outline-none px-4 py-3' />
            </div>

            <div className='w-full flex flex-col items-start'>
              <label htmlFor="guidanceScale">Guidance Scale:</label>
              <input name="guidanceScale" id="guidanceScale" type='number' className='border border-gray-600 w-full rounded-lg caret-black outline-none px-4 py-3' />
            </div>
          </div>
        </div>

        <div className='w-52'>
          <button type='submit' className='w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors border-none rounded-md'>Gerar Imagem</button>
        </div>
      </form>

      {error && <div>{error}</div>}

      {prediction && (
        <div>
            {prediction.output && (
              <div className="w-full aspect-square relative">
                <Image
                  fill
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes='100vw'
                />
              </div>
            )}
            <p>status: {prediction.status}</p>
        </div>
      )}
    </main>
  )
}
