import {useThemeStore} from '../Store/useThemeStore';

const Input = ({icon: Icon, ...props}) => {
  const {theme}=useThemeStore();
  return (
    <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
            <Icon className={`size-5 ${theme==='dark' ? 'text-green-500': 'text-blue-600'}  `} />
        </div>
        <input {...props} className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${theme==='dark'?'bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400': 'bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45'} `} />

    </div>
  )
}

export default Input