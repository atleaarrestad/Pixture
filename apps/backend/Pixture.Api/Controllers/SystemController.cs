using Microsoft.AspNetCore.Mvc;

namespace Pixture.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class SystemController(IHostEnvironment hostEnvironment) : ControllerBase
{
    [HttpGet("info")]
    public ActionResult<SystemInfoResponse> GetInfo()
    {
        return Ok(new SystemInfoResponse(
            "Pixture.Api",
            hostEnvironment.EnvironmentName,
            DateTimeOffset.UtcNow));
    }
}

public sealed record SystemInfoResponse(
    string Service,
    string Environment,
    DateTimeOffset UtcNow);
