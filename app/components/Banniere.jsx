'use client'

import styles from '@/app/modules/banniere.module.css'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function Banniere(){

    const Images = ['/pub3.jpg', '/pub1.jpg', '/pub2.jpg' ]
    const [chosenImage, setChosenImage] = useState(0)

     function handleRight(){
        if(chosenImage === Images.length - 1){
            setChosenImage(0)
        }else{
            setChosenImage(chosenImage + 1)
        }
     }

     function handleLeft(){
        if(chosenImage === 0){
            setChosenImage(Images.length - 1)
        }else{
            setChosenImage(chosenImage - 1)
        }
     }

    return (
        <section className={styles.banniereSection} >
            <div className={styles.banniereContainer} >
                <button className={styles.leftBtn} onClick={handleLeft} ><ChevronLeft width={45} height={45} /></button>
    
                <div className={styles.banniereImage}>
                   <Image className={styles.image} alt='pub image' src={Images[chosenImage]} width={6500} height={2580} />
                </div>
    
                <button className={styles.rightBtn} onClick={handleRight} ><ChevronRight width={45} height={45} /></button>
            </div>

            <div className={styles.pagination} >
                {
                    Array.from({ length: Images.length }, (_, i) => (
                        <button 
                            key={i}
                            className={chosenImage === i ? styles.active : ""}
                            onClick={() => setChosenImage(i)}
                        >
                            
                        </button>
                    ))
                }         

            </div>
        </section>
    )
}