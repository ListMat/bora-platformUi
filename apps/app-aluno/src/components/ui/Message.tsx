import { View, Text, styled } from 'tamagui'

export const MessageBubble = styled(View, {
    padding: '$3',
    borderRadius: '$radius.true',
    maxWidth: '80%',
    marginVertical: 4,

    variants: {
        isMe: {
            true: {
                backgroundColor: '$primary',
                alignSelf: 'flex-end',
                borderBottomRightRadius: 2,
            },
            false: {
                backgroundColor: '$muted',
                alignSelf: 'flex-start',
                borderBottomLeftRadius: 2,
            },
        }
    }
})

export const MessageText = styled(Text, {
    fontSize: 15,
    lineHeight: 22,
    variants: {
        isMe: {
            true: { color: 'white' },
            false: { color: '$color' }
        }
    }
})

export const MessageTime = styled(Text, {
    fontSize: 11,
    marginTop: 4,
    variants: {
        isMe: {
            true: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
            false: { color: '$color', opacity: 0.6 }
        }
    }
})
