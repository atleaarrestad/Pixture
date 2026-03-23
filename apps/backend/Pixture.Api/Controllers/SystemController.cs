using Microsoft.AspNetCore.Mvc;
using Pixture.Api.Models;

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
