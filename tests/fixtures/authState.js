export const initialState = {
    status: 'checking', //'authenticated', 'no-authenticated'
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = {
    status: 'checking', //'authenticated', 'no-authenticated'
    user: {
        uid: 'abc',
        name: 'Miguel'
    },
    errorMessage: undefined,
}

export const notAuthenticatedState = {
    status: 'no-authenticated', //'authenticated', 'no-authenticated'
    user: {},
    errorMessage: undefined,
}