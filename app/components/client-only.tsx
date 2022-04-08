import type {ReactNode} from 'react'
import React from 'react'
import {useHydrated} from './use-hydrated'

type Props = {
  children(): ReactNode
  fallback?: ReactNode
}

export function ClientOnly({children, fallback = null}: Props) {
  return useHydrated() ? <>{children()}</> : <>{fallback}</>
}
