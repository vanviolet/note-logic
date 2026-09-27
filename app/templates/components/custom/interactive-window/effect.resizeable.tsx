import React from 'react'
import { useFwCtx } from './context'
import interact from 'interactjs'
import { embedMetadata$, embedStyle$, extractMetadata, px, translate } from './util'

const FwEffectResize = React.forwardRef<HTMLDivElement, {}>(() => {
  const { refFw, minHeight, minWidth, isFullscreen } = useFwCtx()

  React.useEffect(() => {
    if (!refFw?.current) return
    const fwElement = refFw.current
    if (isFullscreen) {
      interact(fwElement).resizable({ enabled: false })
      return
    }
    interact(fwElement).resizable({
      ignoreFrom: '.no-drag',
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          event.preventDefault()
          const { dx, dy } = extractMetadata(fwElement)
          const x = (parseFloat(dx) || 0) + event.deltaRect.left
          const y = (parseFloat(dy) || 0) + event.deltaRect.top

          embedStyle$(refFw, {
            transition: 'none',
            width: px(event.rect.width),
            height: px(event.rect.height),
            transform: translate(x, y),
          })

          embedMetadata$(refFw, {
            dw: event.rect.width.toString(),
            dh: event.rect.height.toString(),
            dx: x.toString(),
            dy: y.toString(),
            dpw: event.rect.width.toString(),
            dph: event.rect.height.toString(),
          })
        },
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: minWidth, height: minHeight },
          max: { width: window.innerWidth, height: window.innerHeight },
        }),
      ],
    })
  }, [isFullscreen, minHeight, minWidth])
  return undefined
})

FwEffectResize.displayName = 'FwEffectResize'
export { FwEffectResize }
