import {
  authSlice,
  clearErrorMessage,
  onLogin,
  onLogout,
} from "../../../src/store/auth/authSlice";
import {
  authenticatedState,
  initialState,
  notAuthenticatedState,
} from "../../fixtures/authState";
import { testUserCredentials } from "../../fixtures/testUser";

describe("Pruebas en authSlice", () => {
  test("debe de regresar el estado inicial", () => {
    expect(authSlice.getInitialState()).toEqual(initialState); // se espera que el estado inicial luzca como el enviado en los fixture
  });

  test("debe de realizar un login", () => {
    const state = authSlice.reducer(initialState, onLogin(testUserCredentials));
    // console.log(state);
    expect(state).toEqual({
      status: "authenticated",
      user: testUserCredentials,
      errorMessage: undefined,
    }); // se espera que devuelve los datos de usuarios mandandos como payload en la función onLogin
  });

  test("debe de realizar el logout", () => {
    const state = authSlice.reducer(authenticatedState, onLogout());
    // console.log(state);
    expect(state).toEqual({
      status: "not-authenticated",
      user: {},
      errorMessage: undefined,
    }); // se espera que devuelva los datos iniciales luego de ejecutar la función onLogout
  });

  test("debe de realizar el logout", () => {
    const errorMessage = "Credenciales no válidas";
    const state = authSlice.reducer( notAuthenticatedState, onLogout(errorMessage) );
    // console.log(state);
    expect(state).toEqual({
      status: "not-authenticated",
      user: {},
      errorMessage: errorMessage,
    }); // se espera que devuelva el estado incial con el error message cuando viene en el onLogout
  });

  test("debe de limpiar el mensaje de error", () => {
    const errorMessage = "Credenciales no válidas";
    const state = authSlice.reducer( notAuthenticatedState, onLogout(errorMessage) );
    // console.log(state);
    const newState = authSlice.reducer(state, clearErrorMessage());
    expect(newState.errorMessage).toBe(undefined); // se epera que el método clearErrorMessage del reducer limpie el mensaje de error luego de deslogearse con onLogout  mandando undefined
  });
});
