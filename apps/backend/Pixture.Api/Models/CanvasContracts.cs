namespace Pixture.Api.Models;

public sealed record CanvasSummaryResponse(
    int Width,
    int Height,
    string ImageUrl,
    string RenderVersion,
    DateTimeOffset UpdatedAt,
    int ReservationCount);

public sealed record CanvasReservationResponse(
    Guid ReservationId,
    string Title,
    string OwnerDisplayName,
    int X,
    int Y,
    int Width,
    int Height,
    string AccentColor,
    bool IsReserved);

public sealed record ReservationEditorResponse(
    Guid ReservationId,
    string Title,
    string OwnerDisplayName,
    int CanvasWidth,
    int CanvasHeight,
    int X,
    int Y,
    int Width,
    int Height,
    string RenderVersion,
    string[] Pixels);

public sealed record PixelChangeRequest(
    int X,
    int Y,
    string ColorHex);

public sealed record UpdateReservationPixelsRequest(
    IReadOnlyList<PixelChangeRequest> Changes);

public sealed record UpdateReservationPixelsResponse(
    Guid ReservationId,
    string RenderVersion,
    DateTimeOffset UpdatedAt,
    int AppliedChanges);
