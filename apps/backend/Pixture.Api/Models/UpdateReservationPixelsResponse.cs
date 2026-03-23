namespace Pixture.Api.Models;

public sealed record UpdateReservationPixelsResponse(
    Guid ReservationId,
    string RenderVersion,
    DateTimeOffset UpdatedAt,
    int AppliedChanges,
    string? LinkUrl);
