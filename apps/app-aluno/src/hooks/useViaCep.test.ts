import { renderHook, waitFor } from '@testing-library/react-native';
import { useViaCep } from './useViaCep';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock fetch global
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('useViaCep Hook', () => {
    beforeEach(() => {
        mockFetch.mockReset();
    });

    it('should fetch address successfully with valid CEP', async () => {
        const mockResponse = {
            logradouro: 'Praça da Sé',
            bairro: 'Sé',
            localidade: 'São Paulo',
            uf: 'SP',
            erro: false
        };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse
        });

        const { result } = renderHook(() => useViaCep());

        const address = await result.current.fetchAddress('01001-000');

        expect(mockFetch).toHaveBeenCalledWith('https://viacep.com.br/ws/01001000/json/');
        expect(address).toEqual({
            street: 'Praça da Sé',
            neighborhood: 'Sé',
            city: 'São Paulo',
            state: 'SP'
        });
    });

    it('should throw error when CEP is not found (erro: true)', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ erro: true })
        });

        const { result } = renderHook(() => useViaCep());

        await expect(result.current.fetchAddress('99999-999')).rejects.toThrow('CEP não encontrado');
    });

    it('should throw error when CEP format is invalid (length)', async () => {
        const { result } = renderHook(() => useViaCep());
        await expect(result.current.fetchAddress('123')).rejects.toThrow('CEP incompleto');
    });
});
