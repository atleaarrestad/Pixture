using Microsoft.AspNetCore.Mvc;
using Pixture.Api.Models;
using Pixture.Api.Services;

namespace Pixture.Api.Controllers;

[ApiController]
[Route("api/reservations")]
public sealed class ReservationsController(ICanvasBoardService canvasBoardService) : ControllerBase
{
    [HttpGet("{reservationId:guid}/editor")]
    public ActionResult<ReservationEditorResponse> GetEditor(Guid reservationId)
    {
        var response = canvasBoardService.GetReservationEditor(reservationId);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpPut("{reservationId:guid}/pixels")]
    public ActionResult<UpdateReservationPixelsResponse> UpdatePixels(
        Guid reservationId,
        [FromBody] UpdateReservationPixelsRequest request)
    {
        try
        {
            var response = canvasBoardService.UpdateReservationPixels(reservationId, request);
            return response is null ? NotFound() : Ok(response);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { error = exception.Message });
        }
    }
}
