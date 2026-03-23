namespace Pixture.Api.Models;

public sealed record CanvasSummaryResponse(
    int Width,
    int Height,
    string ImageUrl,
    string RenderVersion,
    DateTimeOffset UpdatedAt,
    int ReservationCount);
