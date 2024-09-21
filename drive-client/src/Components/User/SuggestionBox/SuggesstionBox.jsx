import React, { useContext } from 'react'
import { searchLocationContext } from '../../../Context/UserSearchContext';

function SuggesstionBox({suggestions,setSuggestions,setPickupSuggestion,setPickupLocation,setPickUpCoords}) {
     const {selectPickupLocation}= useContext(searchLocationContext)
    const selectLocation = (location)=>{
        setPickupLocation(location?.properties?.name);
        console.log('pickupcooooo',location?.geometry?.coordinates);
        // setPickUpCoords(location?.geometry?.coordinates)
        selectPickupLocation(location?.geometry?.coordinates)
        setSuggestions([]);
         setPickupSuggestion(null)
    }
  return (
<div className='absolute top-full left-0 mt-2 w-full border-2 border-gray-300 shadow-lg bg-white rounded-md z-20'>
            <ul>
            {(suggestions && suggestions.length > 0) && suggestions.map((location)=>{
                return<li className='hover:cursor-pointer' key={location.id} onClick={()=>{selectLocation(location)}}>{location?.properties?.name}</li> 
            })}  
              
            </ul>
</div>
  )
}

export default SuggesstionBox