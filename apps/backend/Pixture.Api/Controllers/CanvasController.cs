using Microsoft.AspNetCore.Mvc;
using Pixture.Api.Models;
using Pixture.Api.Services;

namespace Pixture.Api.Controllers;

[ApiController]
[Route("api/canvas")]
public sealed class CanvasController(ICanvasBoardService canvasBoardService) : ControllerBase
{
    [HttpGet]
    public ActionResult<CanvasSummaryResponse> GetCanvas()
    {
        var summary = canvasBoardService.GetCanvasSummary();
        var imageUrl = $"{Request.Scheme}://{Request.Host}/api/canvas/image?version={summary.RenderVersion}";

        return Ok(new CanvasSummaryResponse(
            summary.Width,
            summary.Height,
            imageUrl,
            summary.RenderVersion,
            summary.UpdatedAt,
            summary.ReservationCount));
    }

    [HttpGet("reservations")]
    public ActionResult<IReadOnlyList<CanvasReservationResponse>> GetReservations()
    {
        return Ok(canvasBoardService.GetReservations());
    }

    [HttpGet("image")]
    public IActionResult GetImage()
    {
        var bytes = canvasBoardService.GetRenderedCanvasPng();
        return File(bytes, "image/png");
    }
}
