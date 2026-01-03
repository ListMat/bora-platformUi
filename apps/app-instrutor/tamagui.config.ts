import { createTamagui } from 'tamagui'
import { config as configBase } from '@tamagui/config/v3'
import { createMedia } from '@tamagui/react-native-media-driver'
import { animations } from '@tamagui/animations-react-native'

const config = createTamagui({
    ...configBase,
    animations,
    defaultTheme: 'light',
    shouldAddPrefersColorThemes: false,
    themeClassNameOnRoot: false,
    shorthands: configBase.shorthands,
    fonts: configBase.fonts,
    themes: {
        light: {
            background: '#FFFFFF',
            color: '#111827',
            primary: '#00C853',
            muted: '#F5F5F5',
            borderColor: '#E5E7EB',
            shadowColor: 'rgba(0,0,0,0.06)',
        },
        dark: {
            background: '#121212',
            color: '#F3F4F6',
            primary: '#00C853',
            muted: '#1E1E1E',
            borderColor: '#374151',
            shadowColor: 'rgba(0,0,0,0.3)',
        }
    },
    tokens: {
        ...configBase.tokens,
        radius: {
            ...configBase.tokens.radius,
            true: 12,
            md: 12,
        },
    },
    media: createMedia({
        xs: { maxWidth: 660 },
        gtXs: { minWidth: 660 + 1 },
        sm: { maxWidth: 800 },
        gtSm: { minWidth: 800 + 1 },
        md: { maxWidth: 1020 },
        gtMd: { minWidth: 1020 + 1 },
        lg: { maxWidth: 1280 },
        gtLg: { minWidth: 1280 + 1 },
        xl: { maxWidth: 1420 },
        xxl: { maxWidth: 1600 },
    }),
})

export type AppConfig = typeof config

declare module 'tamagui' {
    interface TamaguiCustomConfig extends AppConfig { }
}

export default config
