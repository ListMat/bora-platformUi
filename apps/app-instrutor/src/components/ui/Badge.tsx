import { View, styled, Text } from 'tamagui'

export const Badge = styled(View, {
    backgroundColor: '$primary',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',

    variants: {
        variant: {
            outline: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '$primary',
            },
            secondary: {
                backgroundColor: '$muted',
            },
            destructive: {
                backgroundColor: '#EF4444',
            }
        }
    }
})

export const BadgeText = styled(Text, {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    variants: {
        variant: {
            outline: {
                color: '$primary',
            },
            secondary: {
                color: '$color',
            },
            destructive: {
                color: 'white',
            }
        }
    }
})
