import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

// CAS Lab: near-black with a navy glow, tree-blue accent, brain-green success.
const { theme, problems } = makeColors({
  label: 'CAS Lab',
  only: 'dark',
  roles: { accent: '#4aa3ff', danger: '#e5534b', success: '#3ef5a8', warning: '#e0a13a', pro: '#9b8cff' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#05090c',
        'surface-1': '#0a1117',
        'surface-2': '#0e171f',
        'surface-3': '#131e28',
        'text-primary': '#e8f1ec',
        'text-secondary': '#c3cec9',
        'text-muted': '#9aa7a2',
      },
    },
  },
})

// A drawn scene: traced logo and CAS LAB lettering, tree with lights climbing it. No frosting.
const LOOK: ThemeSetArgs = {
  colors: theme,
  // Medium frost: panels blur the scene, but less than the app's default (16).
  backdrop: { scene: 'cas-tree', glass: { blur: 8, tint: '#05090c', opacity: 0.45 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    if (e.props.scene !== 'cas-tree') {
      return next(e)
    }

    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={SCENE}
        alt="CAS Lab logo and lettering; points of light climb a neural tree from its roots into its brain"
        isInteractive
      />
    )
  })
}
