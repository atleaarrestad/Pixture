namespace Pixture.Api.Models;

public sealed record CanvasReservationResponse(
    Guid ReservationId,
    string Title,
    string OwnerDisplayName,
    string? LinkUrl,
    int X,
    int Y,
    int Width,
    int Height,
    string AccentColor,
    bool IsReserved);
