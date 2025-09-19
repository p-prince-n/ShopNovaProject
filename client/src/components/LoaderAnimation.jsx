import React from 'react'
import { Loader } from 'lucide-react'

const LoaderAnimation = () => {
  return (
    <div className="flex justify-center mt-3">
            <Loader className="w-6 h-6 animate-spin dark:text-green-400 text-blue-600" />
          </div>
  )
}

export default LoaderAnimation