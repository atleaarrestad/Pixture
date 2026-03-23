namespace Pixture.Domain.Reservations;

public sealed class ReservationPixelLayer
{
    public ReservationPixelLayer(Guid reservationId, string[] pixels)
    {
        ReservationId = reservationId;
        Pixels = pixels;
    }

    public Guid ReservationId { get; }
    public string[] Pixels { get; }
}
