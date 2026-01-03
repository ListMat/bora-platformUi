import { Platform } from 'react-native';
import { Input as TamaguiInput, styled } from 'tamagui';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';
import { forwardRef } from 'react';
import { tokens } from '@/theme/tokens';

// Para Web, usar TextInput nativo do React Native que funciona melhor
const WebInput = forwardRef<RNTextInput, TextInputProps>((props, ref) => {
    return (
        <RNTextInput
            ref={ref}
            {...props}
            style={[
                styles.webInput,
                props.style,
            ]}
            placeholderTextColor={props.placeholderTextColor || tokens.colors.text.placeholder}
        />
    );
});

WebInput.displayName = 'WebInput';

const styles = StyleSheet.create({
    webInput: {
        borderRadius: tokens.radius.md,
        borderWidth: 1,
        borderColor: tokens.colors.border.secondary,
        backgroundColor: tokens.colors.background.secondary,
        color: tokens.colors.text.primary,
        paddingHorizontal: tokens.spacing.lg,
        height: 48,
        fontSize: tokens.typography.fontSize.base,
        outlineStyle: 'none', // Remove outline padrão do browser
    },
});

// Usar componente nativo na web, Tamagui no mobile
export const Input = Platform.OS === 'web'
    ? WebInput
    : styled(TamaguiInput, {
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
    });
