'use client'
import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config' // 注意这条相对路径

export default function StudioPage() {
  return <NextStudio config={config} />
}
