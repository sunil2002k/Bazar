import React from 'react'
import categories from './CategoriesList'

const Productcat = (props) => {
  return (
    <>
    <span className='cursor-pointer pl-3'>All categories</span>
       {categories && categories.length > 0 && categories.map((item, index)=>{
        return (
          
          <span onClick={()=>props.handleCategory && props.handleCategory(item)} key={index} className='gap-6 pl-3 cursor-pointer sticky text-'> {item}</span>
        )
       })}
    </>
  )
}

export default Productcat