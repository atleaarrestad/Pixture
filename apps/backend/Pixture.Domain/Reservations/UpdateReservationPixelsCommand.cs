namespace Pixture.Domain.Reservations;

public sealed record UpdateReservationPixelsCommand(
    IReadOnlyList<PixelChange> Changes,
    string? LinkUrl);
