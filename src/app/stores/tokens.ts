type TTokens = {
    access: string,
    refresh: string
}

export const tokenStore = new Map<string, TTokens>()