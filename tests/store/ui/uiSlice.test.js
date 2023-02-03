import {
  onCloseDateModal,
  onOpenDateModal,
  uiSlice,
} from "../../../src/store/ui/uiSlice";

describe("Pruebas en uiSlice", () => {
  test("debe de regresar el estado por defecto", () => {
    // console.log(uiSlice.getInitialState());
    expect(uiSlice.getInitialState()).toEqual({ isDateModalOpen: false }); // se espera que el estado inicial sea falso
  });

  test("debe de cambiar el isDateModalOpen correctamente", () => {
    let state = uiSlice.getInitialState();
    state = uiSlice.reducer(state, onOpenDateModal());
    // console.log(state);
    expect(state.isDateModalOpen).toBeTruthy(); // se espera que al pasarle la funcion onOpenDateModal() el estado isDateModalOpen pase a true

    state = uiSlice.reducer(state, onCloseDateModal());
    expect(state.isDateModalOpen).toBeFalsy(); // se espera que al pasarle la funcion onCloseDateModal() el estado isDateModalOpen pase a false 
  });
});
