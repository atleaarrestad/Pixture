namespace Pixture.Api.Models;

public sealed record SystemInfoResponse(
    string Service,
    string Environment,
    DateTimeOffset UtcNow);
