namespace Pixture.Domain.Canvas;

public sealed record CanvasSummarySnapshot(
    int Width,
    int Height,
    string RenderVersion,
    DateTimeOffset UpdatedAt,
    int ReservationCount);
