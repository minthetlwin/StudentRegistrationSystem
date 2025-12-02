import React from 'react'
import { useForm } from 'react-hook-form'

export default function StudentRegisterForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(data)
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl h-fit max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">ကျောင်းသားမှတ်ပုံတင်ခြင်း</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ကျောင်းဝင်ခွင့်နံပတ်
              </label>
              <input
                {...register('admissionNumber', { required: 'လိုအပ်သည်' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="ကျောင်းဝင်ခွင့်နံပတ်"
              />
              {errors.admissionNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.admissionNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                မှတ်ပုံတင်နံပတ်
              </label>
              <input
                {...register('nrcNumber', { required: 'လိုအပ်သည်' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="မှတ်ပုံတင်နံပတ်"
              />
              {errors.nrcNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.nrcNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                မွေးသက္ကရာဇ်
              </label>
              <input
                {...register('dateOfBirth', { required: 'လိုအပ်သည်' })}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                အဖအမည်
              </label>
              <input
                {...register('fatherName', { required: 'လိုအပ်သည်' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="အဖအမည်"
              />
              {errors.fatherName && (
                <p className="mt-1 text-xs text-red-600">{errors.fatherName.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                တက္ကသိုလ်ဝင်တန်းခုံနံပတ်
              </label>
              <input
                {...register('matriculationRollNumber', { required: 'လိုအပ်သည်' })}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="တက္ကသိုလ်ဝင်တန်းခုံနံပတ်"
              />
              {errors.matriculationRollNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.matriculationRollNumber.message}</p>
              )}
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              >
                မှတ်ပုံတင်ရန်
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}