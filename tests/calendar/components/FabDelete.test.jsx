import { fireEvent, render, screen } from "@testing-library/react";
import { FabDelete } from "../../../src/calendar/components/FabDelete";
import { useCalendarStore } from "../../../src/hooks/useCalendarStore";

jest.mock("../../../src/hooks/useCalendarStore");

describe("Pruebas en <FabDelete />", () => {
  const mockStartDeletingEvent = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  test("debe de mostrar el componente correctamente", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: false,
    });

    render(<FabDelete />);

    // screen.debug()
    const btn = screen.getByLabelText("btn-delete");
    // console.log(btn.classList.toString());
    expect(btn.classList).toContain("btn");
    expect(btn.classList).toContain("btn-danger");
    expect(btn.classList).toContain("fab-danger");
    expect(btn.style.display).toBe("none"); // se espera que los estilos sean los correctos
  });

  test("debe de mostrar el botón si hay un evento activo", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
    });

    render(<FabDelete />);
    // screen.debug();
    const btn = screen.getByLabelText("btn-delete");
    // console.log(btn.classList.toString());
    expect(btn.style.display).toBe(""); // se espera que no se aplique el estilo del display: none cuando el hasEventSelected está en true
  });

  test("debe de llamar startDeletingEvent si hay evento activo", () => {
    useCalendarStore.mockReturnValue({
      hasEventSelected: true,
      startDeletingEvent: mockStartDeletingEvent,
    });

    render(<FabDelete />);

    const btn = screen.getByLabelText("btn-delete");
    fireEvent.click(btn);

    expect(mockStartDeletingEvent).toHaveBeenCalledWith(); // se espera que el metodo mock sea llamado cuando se da clicl en el botón
  });
});
