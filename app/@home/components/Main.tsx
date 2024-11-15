"use client";
import React from 'react'
import { useState } from 'react';
import PopUp from './PopUp';
import { Button } from "@/components/ui/button"
const Main = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
return (
    <main className='grow relative' >
        <Button className='absolute bottom-0 right-0 mr-2 mb-2' onClick={() => setIsPopupOpen(!isPopupOpen)}>Toggle Popup</Button>
        {isPopupOpen && <PopUp setIsPopupOpen={setIsPopupOpen} />}
    </main>
)
}

export default Main