/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/sedan.glb --transform --exportdefault -o public/models_build/sedan.jsx 
Files: public/models/sedan.glb [172.24KB] > /Users/toy/code/game-station/public/models_build/sedan-transformed.glb [12.58KB] (93%)
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/models_build/sedan-transformed.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.body.geometry} material={materials.colormap} position={[0, 0.15, -0.025]} />
    </group>
  )
}

useGLTF.preload('/models_build/sedan-transformed.glb')
