import { Input as TamaguiInput, styled } from 'tamagui'

export const Input = styled(TamaguiInput, {
    borderRadius: '$radius.true',
    borderWidth: 1,
    borderColor: '$borderColor',
    backgroundColor: '$background',
    color: '$color',
    paddingHorizontal: '$4',
    height: 48,
    focusStyle: {
        borderColor: '$primary',
        borderWidth: 2,
        outlineColor: 'transparent',
    },
    placeholderTextColor: '$muted',
})
