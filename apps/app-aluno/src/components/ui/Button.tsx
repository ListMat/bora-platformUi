import { Button as TamaguiButton, styled } from 'tamagui'

export const Button = styled(TamaguiButton, {
    backgroundColor: '$primary',
    borderRadius: '$radius.true', // 12
    color: 'white',
    fontWeight: '600',
    height: 48,
    pressStyle: {
        opacity: 0.9,
        scale: 0.98,
    },
    variants: {
        variant: {
            secondary: {
                backgroundColor: '$muted',
                color: '$color',
            },
            destructive: {
                backgroundColor: '#EF4444',
                color: 'white',
            },
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$borderColor',
                color: '$color',
            },
            ghost: {
                backgroundColor: 'transparent',
                color: '$color',
            }
        },
        fullWidth: {
            true: {
                width: '100%',
            }
        }
    },
    defaultVariants: {
        variant: undefined, // primary
    }
})
