'use client'
import react from 'react'
import { useEffect } from 'react'
import * as klouds from 'klouds'

import palette from "./../../styles/utils.module.scss";

import styles from './KloudsBackground.module.scss'

const KloudsBackground = () => {
  
  const hexToRgb = (hex : string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return [ r, g, b ];
}

  const themeColor = hexToRgb(palette.themeColor)
  const backgroundColor = hexToRgb(palette.backgroundColor)

  useEffect(() => {
      klouds.create({
        selector: '#klouds',
        layerCount: 5,
        speed: 1,
        bgColor: [backgroundColor[0], backgroundColor[1], backgroundColor[2]],
        cloudColor1: [themeColor[0], themeColor[1], themeColor[2]],
        cloudColor2: [backgroundColor[0], backgroundColor[1], backgroundColor[2]]
      })
    })

  return(
      <div className={styles['klouds-wrapper']}>
          <canvas id='klouds' className='p-0'></canvas>
      </div>
  )
}

export default KloudsBackground