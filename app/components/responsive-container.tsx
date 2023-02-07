import * as React from 'react'
import clsx from 'clsx'

interface Props {
  as?: React.ElementType | string
  className?: string
  children?: React.ReactNode
}
const ResponsiveContainer = React.forwardRef<HTMLElement, Props>(
  function ResponsiveContainer(
    {children, as: Component = 'div', className},
    ref,
  ) {
    return (
      <Component
        className={clsx(
          'px-8 md:mx-auto md:w-full md:max-w-2xl md:box-border',
          className,
        )}
        ref={ref}
      >
        {children}
      </Component>
    )
  },
)

export default ResponsiveContainer
