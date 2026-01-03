import { Avatar as TamaguiAvatar, styled } from 'tamagui'

export const Avatar = styled(TamaguiAvatar, {
    circular: true,
    size: '$5',
    borderWidth: 1,
    borderColor: '$borderColor',
})

export const AvatarImage = TamaguiAvatar.Image
export const AvatarFallback = styled(TamaguiAvatar.Fallback, {
    backgroundColor: '$muted',
    justifyContent: 'center',
    alignItems: 'center',
})
