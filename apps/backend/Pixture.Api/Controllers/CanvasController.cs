using Microsoft.AspNetCore.Mvc;
using Pixture.Api.Infrastructure;
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
        var imageUrl = Request.ToAbsoluteUrl($"/api/canvas/image?version={summary.RenderVersion}");

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
        var reservations = canvasBoardService.GetReservations()
            .Select(reservation => new CanvasReservationResponse(
                reservation.Id,
                reservation.Title,
                reservation.OwnerDisplayName,
                reservation.LinkUrl,
                reservation.LinkDisplayName,
                Request.ToAbsoluteUrlOrNull(reservation.LinkLogoUrl),
                reservation.X,
                reservation.Y,
                reservation.Width,
                reservation.Height,
                reservation.AccentColor,
                true))
            .ToArray();

        return Ok(reservations);
    }

    [HttpGet("image")]
    public IActionResult GetImage()
    {
        var bytes = canvasBoardService.GetRenderedCanvasPng();
        return File(bytes, "image/png");
    }
}
