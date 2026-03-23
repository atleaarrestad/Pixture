namespace Pixture.Api.Models;

public sealed record ReservationEditorResponse(
    Guid ReservationId,
    string Title,
    string OwnerDisplayName,
    string? LinkUrl,
    string? LinkDisplayName,
    string? LinkLogoUrl,
    int CanvasWidth,
    int CanvasHeight,
    int X,
    int Y,
    int Width,
    int Height,
    string RenderVersion,
    string[] Pixels);
