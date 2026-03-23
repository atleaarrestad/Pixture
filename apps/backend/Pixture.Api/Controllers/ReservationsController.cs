using Microsoft.AspNetCore.Mvc;
using Pixture.Api.Models;
using Pixture.Api.Services;
using Pixture.Domain.Reservations;

namespace Pixture.Api.Controllers;

[ApiController]
[Route("api/reservations")]
public sealed class ReservationsController(ICanvasBoardService canvasBoardService) : ControllerBase
{
    [HttpGet("{reservationId:guid}/editor")]
    public ActionResult<ReservationEditorResponse> GetEditor(Guid reservationId)
    {
        var editor = canvasBoardService.GetReservationEditor(reservationId);
        if (editor is null)
        {
            return NotFound();
        }

        return Ok(new ReservationEditorResponse(
            editor.ReservationId,
            editor.Title,
            editor.OwnerDisplayName,
            editor.LinkUrl,
            editor.CanvasWidth,
            editor.CanvasHeight,
            editor.X,
            editor.Y,
            editor.Width,
            editor.Height,
            editor.RenderVersion,
            editor.Pixels));
    }

    [HttpPut("{reservationId:guid}/pixels")]
    public ActionResult<UpdateReservationPixelsResponse> UpdatePixels(
        Guid reservationId,
        [FromBody] UpdateReservationPixelsRequest request)
    {
        try
        {
            var command = new UpdateReservationPixelsCommand(
                request.Changes
                    .Select(change => new PixelChange(change.X, change.Y, change.ColorHex))
                    .ToArray(),
                request.LinkUrl);

            var result = canvasBoardService.UpdateReservationPixels(reservationId, command);
            if (result is null)
            {
                return NotFound();
            }

            return Ok(new UpdateReservationPixelsResponse(
                result.ReservationId,
                result.RenderVersion,
                result.UpdatedAt,
                result.AppliedChanges,
                result.LinkUrl));
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { error = exception.Message });
        }
    }
}
