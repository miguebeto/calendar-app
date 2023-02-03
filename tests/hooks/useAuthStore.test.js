import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import calendarApi from "../../src/api/calendarApi";
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { authSlice } from "../../src/store/";
import { initialState, notAuthenticatedState } from "../fixtures/authStates";
import { testUserCredentials } from "../fixtures/testUser";

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState: {
      auth: { ...initialState },
    },
  });
}; // mock del store

describe("Pruebas en useAuthStore", () => {
  beforeEach(() => localStorage.clear()); // limpia el locarstorage antes de cada test

  test("debe de regresar los valores por defecto", () => {
    const mockStore = getMockStore({ ...initialState }); // se le manda el initialState como referencia para modificar el original

    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    // console.log(result.current)

    expect(result.current).toEqual({
      errorMessage: undefined,
      status: "checking",
      user: {},
      checkAuthToken: expect.any(Function),
      startLogin: expect.any(Function),
      startLogout: expect.any(Function),
      startRegister: expect.any(Function),
    }); // se espera recibir los valores por defecto como se encuentra en el store
  });

  test("startLogin debe de realizar el login correctamente", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    // console.log(result.current);
    await act(async () => {
      await result.current.startLogin(testUserCredentials);
    }); // ejecutamos el metodo mediante el act de manera asincrona con async/await
    // console.log(result.current);

    const { errorMessage, status, user } = result.current;
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: { name: "Test User", uid: "63d9e230c5c66587c2efb778" },
    }); // se espera recibir los mismos datos que mandamos en test user

    expect(localStorage.getItem("token")).toEqual(expect.any(String)); // se espera que el localstorage tenga guardado un string
    expect(localStorage.getItem("token-init-date")).toEqual(expect.any(String)); // se espera que el localstorage tenga guardado un string (todo en localstorage es un string)
  });

  test("startLogin debe de fallar la autenticación", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.startLogin({
        email: "algo@google.com",
        password: "123456789",
      });
    });

    //   console.log(result.current)

    const { errorMessage, status, user } = result.current;
    //   console.log(localStorage.getItem('token'))
    expect(localStorage.getItem("token")).toBe(null); // se espera que el localstorage no guarde información si falla la autenticación
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: "credenciales incorrectas",
      status: "not-authenticated",
      user: {},
    }); // se espera que devuelva la información establecida cuando el login falla

    await waitFor(
      () => expect(result.current.errorMessage).toBe(undefined) // espera a que se limpie el error message pasados 10 seg
    );
  });

  test("startRegister debe de crear un usuario", async () => {
    const newUser = {
      email: "algo@google.com",
      password: "123456789",
      name: "Test User 2",
    };

    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        ok: true,
        uid: "1263781293",
        name: "Test User",
        token: "ALGUN-TOKEN",
      },
    }); // manda la respuesta designada cuando se haga una petición evitando hacer cambios en el backend

    await act(async () => {
      await result.current.startRegister(newUser);
    });

    const { errorMessage, status, user } = result.current;
    // console.log({ errorMessage, status, user });

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: { name: "Test User", uid: "1263781293" },
    });

    spy.mockRestore(); // destruye el spy para que posteriomente se puedan usar post en los test sin que intervenga el spy
  });

  test("startRegister debe de fallar la creación", async () => {
    const mockStore = getMockStore({ ...notAuthenticatedState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.startRegister(testUserCredentials);
    });

    const { errorMessage, status, user } = result.current;

    expect({ errorMessage, status, user }).toEqual({
      errorMessage: "Un usuario ya existe con ese correo",
      status: "not-authenticated",
      user: {},
    }); // se espera que devuelva el estado de erro cuando ya se encuentra registrado el usuario y se intenta registrar nuevamente
  });

  test("checkAuthToken debe de fallar si no hay token", async () => {
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "not-authenticated",
      user: {},
    });
  });

  test("checkAuthToken debe de autenticar el usuario si hay un token", async () => {
    const { data } = await calendarApi.post("/auth", testUserCredentials); // se logea con el usuario del test
    localStorage.setItem("token", data.token); // agrega el token al localstorage

    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    await act(async () => {
      await result.current.checkAuthToken();
    });

    const { errorMessage, status, user } = result.current;
    0;
    console.log({ errorMessage, status, user });
    expect({ errorMessage, status, user }).toEqual({
      errorMessage: undefined,
      status: "authenticated",
      user: { name: "Test User", uid: "63d9e230c5c66587c2efb778" },
    });
  });
});
