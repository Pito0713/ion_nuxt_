export default defineAppConfig({
  ui: {
    colors: {
      primary: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error:   '#EF4444',
      info:    '#3B82F6',
      muted:   '#6B7280',
    },
    colorMode: {
      classSuffix: '',   // 預設用 .dark
      storageKey: 'nuxt-color-mode',
      fallback: 'light',
      overrideSystem: false,
    },
    input: {
      slots: {
        base: ['w-full rounded-sm border-0 h-10 transition-colors'],
      },
      defaultVariants: {
        size: 'xl',
        color: 'primary',
        variant: 'subtle'
      },
      variant: {
        outline: 'text-highlighted bg-default ring ring-inset ring-accented',
        soft: 'text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50',
        subtle: 'text-highlighted bg-elevated ring ring-inset ring-accented',
        ghost: 'text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent',
        none: 'text-highlighted bg-transparent'
      },

    },
    button: {
      slots: {
        base: ['rounded-md inline-flex items-center justify-center font-semibold focus:outline-none'],
      },
      defaultVariants: {
        size: 'xl',
        variant: 'subtle'
      }
    },
    card: {
      slots: {
        root: 'rounded-m shadow-l',
        header: 'p-4 sm:px-4',
        body: 'p-4 sm:p-4',
        footer: 'p-4 sm:px-4'
      },
      defaultVariants: {
        variant: 'soft'
      },
    },
    select: {
      slots: {
        base: ['relative group rounded-md inline-flex items-center w-40',],
        content: 'max-h-60 w-(--reka-select-trigger-width) bg-default shadow-lg rounded-md flex flex-col',
      },
      defaultVariants: {
        size: 'xl',   // 假設 lg 對應到 text-lg + 更高的 h
      }
    },
    modal: {
      slots: {
        overlay: 'fixed inset-0 bg-elevated/75',
        content: 'fixed bg-default divide-y divide-default flex flex-col focus:outline-none',
        header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
        wrapper: '',
        body: 'flex-1 overflow-y-auto p-4 sm:p-6',
        footer: 'flex items-center gap-1.5 p-4 sm:px-6',
        title: 'text-highlighted font-semibold',
        description: 'mt-1 text-muted text-sm',
        close: 'absolute top-4 end-4'
      },
      variants: {
        transition: {
          true: {
            overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]',
            content: 'data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]'
          }
        },
        fullscreen: {
          true: {
            content: 'inset-0'
          },
          false: {
            content: 'top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] rounded-lg shadow-lg ring ring-default'
          }
        }
      }
    },
  }
})
