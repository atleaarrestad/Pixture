using Pixture.Domain.Canvas;
using Pixture.Domain.Reservations;

namespace Pixture.Api.Services;

public interface ICanvasBoardService
{
    CanvasSummarySnapshot GetCanvasSummary();
    IReadOnlyList<Reservation> GetReservations();
    byte[] GetRenderedCanvasPng();
    ReservationEditorSnapshot? GetReservationEditor(Guid reservationId);
    ReservationUpdateResult? UpdateReservationPixels(
        Guid reservationId,
        UpdateReservationPixelsCommand command);
}
