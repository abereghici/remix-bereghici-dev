import * as React from 'react'
import clsx from 'clsx'

interface Props extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType
}

const ResponsiveContainer = React.forwardRef<HTMLElement, Props>(
  function ResponsiveContainer(
    {children, as: Component = 'div', className},
    ref,
  ) {
    return (
      <Component
        className={clsx(
          'px-8 md:box-border md:w-full md:max-w-2xl md:mx-auto',
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
