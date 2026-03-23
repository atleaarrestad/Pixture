namespace Pixture.Api.Models;

public sealed record PixelChangeRequest(
    int X,
    int Y,
    string ColorHex);
