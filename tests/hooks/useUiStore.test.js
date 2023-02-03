import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import { useUiStore } from "../../src/hooks/useUiStore";
import { uiSlice } from "../../src/store";

const getMockStore = (initialState) => {
  return configureStore({
    reducer: {
      ui: uiSlice.reducer,
    },
    preloadedState: {
      ui: { ...initialState },
    },
  });
}; // se crea un nuevo store donde se le asigna mediante el parametro un initial state con los cambio que deseamos probar en los test

describe("Pruebas en useUiStore", () => {
  test("debe de regresar los valores por defecto", () => {
    const mockStore = getMockStore({ isDateModalOpen: false });

    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    }); // se renderiza el hook usando un wrapper con el provider del mock creado para el store

    // console.log(result.current);

    expect(result.current).toEqual({
      isDateModalOpen: false,
      closeDateModal: expect.any(Function),
      openDateModal: expect.any(Function),
      toggleDateModal: expect.any(Function),
    }); // se espera que muestre los valores por defecto cuando mandamos mendiante el store el estado inicial
  });

  test("openDateModal debe de colocar true en el isDateModalOpen", () => {
    const mockStore = getMockStore({ isDateModalOpen: false });
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    // console.log(result);

    const { openDateModal, isDateModalOpen } = result.current;

    act(() => {
      openDateModal();
    }); // cuando se ejecuta un funcion que produzca cambios en el store dentro del test debe estar dentro de act
    // console.log({ result: result.current, isDateModalOpen });  // no usar la función directamente en los test porque no cambia por refencia luego de llamado el metodo dentro del act (log para ver la diferencia)
    expect(result.current.isDateModalOpen).toBeTruthy(); // se espera que cambie el estado a true cuando se abre el modal
  });

  test("closeDateModal debe de colocar false en isDateModalOpen", () => {
    const mockStore = getMockStore({ isDateModalOpen: true });
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.closeDateModal();
    });

    // console.log(result.current.isDateModalOpen);
    expect(result.current.isDateModalOpen).toBeFalsy(); // se espera que cambie el estado a false cuando se cierra el modal
  });

  test("toggleDateModal debe de cambiar el estado respectivamente", () => {
    const mockStore = getMockStore({ isDateModalOpen: true });
    const { result } = renderHook(() => useUiStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });

    act(() => {
      result.current.toggleDateModal();
    });
    // console.log(result.current);
    expect(result.current.isDateModalOpen).toBeFalsy(); // se espera que cambie el estado a false cuando se cierra el modal
    
    act(() => {
        result.current.toggleDateModal();
    });
    // console.log(result.current);
    expect(result.current.isDateModalOpen).toBeTruthy(); // se espera que cambie el estado a true cuando se abre el modal
  });
});
