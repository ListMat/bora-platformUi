import { Card as TamaguiCard, styled } from 'tamagui'

export const Card = styled(TamaguiCard, {
    backgroundColor: '$background',
    borderRadius: '$radius.true',
    elevation: 2, // Android
    shadowColor: '$shadowColor',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, // handled by shadowColor alpha
    shadowRadius: 8,
    padding: '$4',
    borderWidth: 0,
    borderColor: '$borderColor',

    variants: {
        bordered: {
            true: {
                borderWidth: 1,
                shadowOpacity: 0,
                elevation: 0,
            }
        }
    }
})
