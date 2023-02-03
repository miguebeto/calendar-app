import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar";
import { useAuthStore } from "../../src/hooks/useAuthStore";

import { AppRouter } from "../../src/router/AppRouter";

jest.mock("../../src/hooks/useAuthStore");

jest.mock("../../src/calendar", () => ({
  CalendarPage: () => <h1>CalendarPage</h1>,
}));

describe("Pruebas en <AppRouter />", () => {
  const mockCheckAuthToken = jest.fn();

  beforeEach(() => jest.clearAllMocks()); // limpia la funcion antes de cada test

  test("debe de mostrar la pantalla de carga y llamar checkAuthToken", () => {
    useAuthStore.mockReturnValue({
      status: "checking",
      checkAuthToken: mockCheckAuthToken,
    }); // utilizo el mock con los parametros que recibe (status, metodo = jest.fn)

    render(<AppRouter />);
    // screen.debug();
    expect(screen.getByText("Cargando...")).toBeTruthy(); // se espera que aparezca un texto cargando...
    expect(mockCheckAuthToken).toHaveBeenCalled(); // se espera que el metodo del hook fué llamado
  });

  test("debe de mostrar el login en caso de no estar autenticado", () => {
    useAuthStore.mockReturnValue({
      status: "not-authenticated",
      checkAuthToken: mockCheckAuthToken,
    });

    const { container } = render(
      <MemoryRouter initialEntries={["/auth2/algo/otracosa"]}>
        <AppRouter />
      </MemoryRouter>
    );

    // screen.debug();

    expect(screen.getByText("Ingreso")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  test('debe de mostrar el calendario si estamos autenticados', () => {

      useAuthStore.mockReturnValue({
          status: 'authenticated',
          checkAuthToken: mockCheckAuthToken
      });

      render(
          <MemoryRouter>
              <AppRouter />
          </MemoryRouter>
      );

    //   screen.debug(),
      expect( screen.getByText('CalendarPage') ).toBeTruthy(); // se espera que devuelva lo que especificamos en el mock

  });
});
