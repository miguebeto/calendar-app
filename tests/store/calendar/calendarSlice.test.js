import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";


describe('Pruebas en calendarSlice', () => {

    test('debe de regresar el estado por defecto', () => {
        const state = calendarSlice.getInitialState();
        // console.log(state);
        expect( state ).toEqual( initialState ); // se espera recibir el estado inicial igual al del fixture
    });

    test('onSetActiveEvent debe de activar el evento', () => {
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) );
        // console.log(state);
        expect(state.activeEvent).toEqual( events[0] ); // se espera que el metodo onSetActiveEvent setee la propiedad active con el evento enviado de los fixtures
    });

    test('onAddNewEvent debe de agregar el evento', ()=> {

        const newEvent = {
            id: '3',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'Cumpleaños de Fernando!!',
            notes: 'Alguna nota!!'
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent ) );
        // console.log(state)
        expect( state.events ).toEqual([ ...events, newEvent ]); // se espera que al llamar el reducer con el metodo onAddNewEvent devuelve el arreglo de eventos de los fixtures + el nuevo evento

    });

    test('onUpdateEvent debe de actualizar el evento', ()=> {

        const updatedEvent = {
            id: '1',
            start: new Date('2020-10-21 13:00:00'),
            end: new Date('2020-10-21 15:00:00'),
            title: 'Cumpleaños de Fernando actualizado',
            notes: 'Alguna nota actualizada'
        };

        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent ) );
        // console.log(state);
        expect( state.events ).toContain( updatedEvent ) // se espera que el arreglo de eventos contenga el nuevo evento actualizado pasado en el metodo updatedEvent

    });


    test('onDeleteEvent debe de borrar el evento activo', () => {
        // calendarWithActiveEventState
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        // console.log(state)
        expect( state.activeEvent ).toBe( null ); // se espera que el evento activo sea borrado y quedao en null
        expect( state.events ).not.toContain( events[0] )  // se espera que el evento activo[0]  sea borrado no se encuentre en el arreglo
    });


    test('onLoadEvents debe de establecer los eventos', () => {
        // initialState
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) );
        // console.log(state)
        expect( state.isLoadingEvents ).toBeFalsy(); // se espera que el loading esté en flase luego de cargar los eventos con onLoadEvents
        expect( state.events ).toEqual(events); // se espera que  esten agregados los eventos mandados como parámetros en los eventos del store

        const newState = calendarSlice.reducer( state, onLoadEvents( events ) );
        // console.log(newState);
        expect( state.events.length ).toBe( events.length ); // se espera que tengan el mismo tamaño al arreglo de eventos enviado en onLoadEvents luego de intentar cargar los mismo que ya estaban
    });

    test('onLogoutCalendar debe de limpiar el estado', () => {
        // calendarWithActiveEventState
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        // console.log(state);
        expect( state ).toEqual( initialState ); // Se espera que el estado sea igual al estado inicial luego de llamar al metodo onLogoutCalendar y ser limpiado
    });

    
});