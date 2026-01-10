import {React} from 'react'

function Container({children}) {
  return (
    <div className="max-w-1400px mx-auto px-4 md:px-6">
      {children}
    </div>
  )
}
export default Container