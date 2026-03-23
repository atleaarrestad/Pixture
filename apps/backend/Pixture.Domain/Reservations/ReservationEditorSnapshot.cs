namespace Pixture.Domain.Reservations;

public sealed record ReservationEditorSnapshot(
    Guid ReservationId,
    string Title,
    string OwnerDisplayName,
    string? LinkUrl,
    int CanvasWidth,
    int CanvasHeight,
    int X,
    int Y,
    int Width,
    int Height,
    string RenderVersion,
    string[] Pixels);
