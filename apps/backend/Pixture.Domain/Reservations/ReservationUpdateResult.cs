namespace Pixture.Domain.Reservations;

public sealed record ReservationUpdateResult(
    Guid ReservationId,
    string RenderVersion,
    DateTimeOffset UpdatedAt,
    int AppliedChanges,
    string? LinkUrl);
