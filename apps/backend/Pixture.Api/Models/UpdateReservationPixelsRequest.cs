namespace Pixture.Api.Models;

public sealed record UpdateReservationPixelsRequest(
    IReadOnlyList<PixelChangeRequest> Changes,
    string? LinkUrl);
