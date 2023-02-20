import React from 'react'

export const CustomImage:React.FC<{data:{classes:string,color:string,background:string,label:string,height:string}}> = ({data}) =>{
  return (
    <img  src={`https://ui-avatars.com/api/?background=${data.background}&color=${data.color}&name=${data.label}`} 
      style={{"maxHeight": (data.height != "") ? data.height : "auto"  }} 
      className={data.classes}
    />
  )
}

export default CustomImage