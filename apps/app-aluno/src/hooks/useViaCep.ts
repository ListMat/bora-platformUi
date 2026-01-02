import { useState } from 'react';

export type AddressResult = {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
};

export function useViaCep() {
    const [loading, setLoading] = useState(false);

    const fetchAddress = async (cep: string): Promise<AddressResult> => {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8) {
            // Se não tiver 8 dígitos, não faz a busca ou lança erro específico
            // O prompt pede "remove non-digit, validate length === 8"
            throw new Error('CEP incompleto');
        }

        setLoading(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                throw new Error('CEP não encontrado');
            }

            return {
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
            };
        } catch (error: any) {
            // Se for erro de rede ou o erro lançado acima
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { fetchAddress, loading };
}
