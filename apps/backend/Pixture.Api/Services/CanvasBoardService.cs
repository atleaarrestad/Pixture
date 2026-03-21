using Pixture.Api.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace Pixture.Api.Services;

public interface ICanvasBoardService
{
    CanvasSummarySnapshot GetCanvasSummary();
    IReadOnlyList<CanvasReservationResponse> GetReservations();
    byte[] GetRenderedCanvasPng();
    ReservationEditorResponse? GetReservationEditor(Guid reservationId);
    UpdateReservationPixelsResponse? UpdateReservationPixels(
        Guid reservationId,
        UpdateReservationPixelsRequest request);
}

public sealed class CanvasBoardService : ICanvasBoardService
{
    private const int ReservationGridSize = 10;
    private const int CanvasWidth = 200;
    private const int CanvasHeight = 200;
    private const int PublicRenderScale = 5;

    private readonly object syncRoot = new();
    private readonly List<ReservationRecord> reservations;
    private readonly Dictionary<Guid, string[]> reservationPixels;

    private int renderVersion = 1;
    private DateTimeOffset updatedAt = DateTimeOffset.UtcNow;

    public CanvasBoardService()
    {
        reservations =
        [
            new ReservationRecord(
                Guid.Parse("9A648CB8-8B30-42AE-B917-F91C20A1A001"),
                "North launch banner",
                "Atle",
                "https://github.com/",
                0,
                0,
                50,
                50,
                "#b9b2ff"),
            new ReservationRecord(
                Guid.Parse("9A648CB8-8B30-42AE-B917-F91C20A1A002"),
                "Skyline teaser",
                "Mia",
                "https://angular.dev/",
                50,
                50,
                30,
                10,
                "#8ed8f8"),
            new ReservationRecord(
                Guid.Parse("9A648CB8-8B30-42AE-B917-F91C20A1A003"),
                "Footer callout",
                "Noah",
                "https://dotnet.microsoft.com/",
                70,
                70,
                100,
                100,
                "#b9f2cf"),
        ];

        ValidateSeedReservations(reservations);

        reservationPixels = reservations.ToDictionary(
            reservation => reservation.Id,
            CreateInitialPixels);
    }

    public CanvasSummarySnapshot GetCanvasSummary()
    {
        lock (syncRoot)
        {
            return new CanvasSummarySnapshot(
                CanvasWidth,
                CanvasHeight,
                $"v{renderVersion}",
                updatedAt,
                reservations.Count);
        }
    }

    public IReadOnlyList<CanvasReservationResponse> GetReservations()
    {
        lock (syncRoot)
        {
            return reservations
                .Select(reservation => new CanvasReservationResponse(
                    reservation.Id,
                    reservation.Title,
                    reservation.OwnerDisplayName,
                    reservation.LinkUrl,
                    reservation.X,
                    reservation.Y,
                    reservation.Width,
                    reservation.Height,
                    reservation.AccentColor,
                    true))
                .ToArray();
        }
    }

    public byte[] GetRenderedCanvasPng()
    {
        lock (syncRoot)
        {
            var composedPixels = ComposeCanvasPixels();
            using var image = new Image<Rgba32>(
                CanvasWidth * PublicRenderScale,
                CanvasHeight * PublicRenderScale,
                ParseHexColor("#fffaf1"));

            for (var y = 0; y < CanvasHeight; y++)
            {
                for (var x = 0; x < CanvasWidth; x++)
                {
                    var color = ParseHexColor(composedPixels[(y * CanvasWidth) + x]);

                    for (var scaleY = 0; scaleY < PublicRenderScale; scaleY++)
                    {
                        for (var scaleX = 0; scaleX < PublicRenderScale; scaleX++)
                        {
                            image[(x * PublicRenderScale) + scaleX, (y * PublicRenderScale) + scaleY] = color;
                        }
                    }
                }
            }

            using var stream = new MemoryStream();
            image.SaveAsPng(stream);
            return stream.ToArray();
        }
    }

    public ReservationEditorResponse? GetReservationEditor(Guid reservationId)
    {
        lock (syncRoot)
        {
            var reservation = reservations.FirstOrDefault(item => item.Id == reservationId);
            if (reservation is null)
            {
                return null;
            }

            return new ReservationEditorResponse(
                reservation.Id,
                reservation.Title,
                reservation.OwnerDisplayName,
                reservation.LinkUrl,
                CanvasWidth,
                CanvasHeight,
                reservation.X,
                reservation.Y,
                reservation.Width,
                reservation.Height,
                $"v{renderVersion}",
                reservationPixels[reservation.Id].ToArray());
        }
    }

    public UpdateReservationPixelsResponse? UpdateReservationPixels(
        Guid reservationId,
        UpdateReservationPixelsRequest request)
    {
        lock (syncRoot)
        {
            var reservation = reservations.FirstOrDefault(item => item.Id == reservationId);
            if (reservation is null)
            {
                return null;
            }

            var normalizedLinkUrl = NormalizeLinkUrl(request.LinkUrl);
            reservation.LinkUrl = normalizedLinkUrl;

            var pixels = reservationPixels[reservationId];
            var appliedChanges = 0;

            foreach (var change in request.Changes)
            {
                if (change.X < 0 || change.X >= reservation.Width || change.Y < 0 || change.Y >= reservation.Height)
                {
                    throw new ArgumentOutOfRangeException(nameof(request), "Pixel change lies outside the reservation bounds.");
                }

                if (!IsValidColor(change.ColorHex))
                {
                    throw new ArgumentException($"Invalid color '{change.ColorHex}'. Use #RRGGBB.", nameof(request));
                }

                var pixelIndex = (change.Y * reservation.Width) + change.X;
                pixels[pixelIndex] = change.ColorHex;
                appliedChanges++;
            }

            renderVersion++;
            updatedAt = DateTimeOffset.UtcNow;

            return new UpdateReservationPixelsResponse(
                reservationId,
                $"v{renderVersion}",
                updatedAt,
                appliedChanges,
                normalizedLinkUrl);
        }
    }

    private string[] ComposeCanvasPixels()
    {
        var pixels = Enumerable.Repeat("#fffdf8", CanvasWidth * CanvasHeight).ToArray();

        foreach (var reservation in reservations)
        {
            var layer = reservationPixels[reservation.Id];

            for (var localY = 0; localY < reservation.Height; localY++)
            {
                for (var localX = 0; localX < reservation.Width; localX++)
                {
                    var canvasX = reservation.X + localX;
                    var canvasY = reservation.Y + localY;
                    pixels[(canvasY * CanvasWidth) + canvasX] = layer[(localY * reservation.Width) + localX];
                }
            }
        }

        return pixels;
    }

    private static string[] CreateInitialPixels(ReservationRecord reservation)
    {
        var pixels = new string[reservation.Width * reservation.Height];

        for (var y = 0; y < reservation.Height; y++)
        {
            for (var x = 0; x < reservation.Width; x++)
            {
                var useAccent = (x + y) % 3 == 0;
                var useDark = y == 0 || y == reservation.Height - 1 || x == 0 || x == reservation.Width - 1;

                pixels[(y * reservation.Width) + x] = useDark
                    ? "#1f1633"
                    : useAccent
                        ? reservation.AccentColor
                        : "#fffdf8";
            }
        }

        return pixels;
    }

    private static bool IsValidColor(string colorHex)
    {
        return !string.IsNullOrWhiteSpace(colorHex)
            && colorHex.Length == 7
            && colorHex[0] == '#'
            && colorHex[1..].All(Uri.IsHexDigit);
    }

    private static Rgba32 ParseHexColor(string colorHex)
    {
        return new Rgba32(
            Convert.ToByte(colorHex[1..3], 16),
            Convert.ToByte(colorHex[3..5], 16),
            Convert.ToByte(colorHex[5..7], 16));
    }

    private static string? NormalizeLinkUrl(string? linkUrl)
    {
        if (string.IsNullOrWhiteSpace(linkUrl))
        {
            return null;
        }

        var candidateUrl = linkUrl.Trim();
        if (!candidateUrl.Contains("://", StringComparison.Ordinal))
        {
            candidateUrl = $"https://{candidateUrl}";
        }

        if (!Uri.TryCreate(candidateUrl, UriKind.Absolute, out var parsedUri)
            || (parsedUri.Scheme != Uri.UriSchemeHttp && parsedUri.Scheme != Uri.UriSchemeHttps))
        {
            throw new ArgumentException("Link URL must be a valid absolute http or https address.", nameof(linkUrl));
        }

        return parsedUri.ToString();
    }

    private static void ValidateSeedReservations(IEnumerable<ReservationRecord> seededReservations)
    {
        var reservationList = seededReservations.ToArray();

        foreach (var reservation in reservationList)
        {
            EnsureReservationFitsGrid(reservation);
        }

        for (var index = 0; index < reservationList.Length; index++)
        {
            for (var compareIndex = index + 1; compareIndex < reservationList.Length; compareIndex++)
            {
                if (ReservationsOverlap(reservationList[index], reservationList[compareIndex]))
                {
                    throw new InvalidOperationException(
                        $"Seed reservations '{reservationList[index].Title}' and '{reservationList[compareIndex].Title}' overlap.");
                }
            }
        }
    }

    private static void EnsureReservationFitsGrid(ReservationRecord reservation)
    {
        if (reservation.Width < ReservationGridSize || reservation.Height < ReservationGridSize)
        {
            throw new InvalidOperationException(
                $"Reservation '{reservation.Title}' must be at least {ReservationGridSize}x{ReservationGridSize}.");
        }

        if (!IsGridAligned(reservation.X)
            || !IsGridAligned(reservation.Y)
            || !IsGridAligned(reservation.Width)
            || !IsGridAligned(reservation.Height))
        {
            throw new InvalidOperationException(
                $"Reservation '{reservation.Title}' must align to the {ReservationGridSize}x{ReservationGridSize} reservation grid.");
        }

        if (reservation.X < 0
            || reservation.Y < 0
            || reservation.X + reservation.Width > CanvasWidth
            || reservation.Y + reservation.Height > CanvasHeight)
        {
            throw new InvalidOperationException(
                $"Reservation '{reservation.Title}' must fit within the canvas bounds.");
        }
    }

    private static bool IsGridAligned(int value)
    {
        return value % ReservationGridSize == 0;
    }

    private static bool ReservationsOverlap(ReservationRecord left, ReservationRecord right)
    {
        return left.X < right.X + right.Width
            && left.X + left.Width > right.X
            && left.Y < right.Y + right.Height
            && left.Y + left.Height > right.Y;
    }

    private sealed class ReservationRecord(
        Guid id,
        string title,
        string ownerDisplayName,
        string? linkUrl,
        int x,
        int y,
        int width,
        int height,
        string accentColor)
    {
        public Guid Id { get; } = id;
        public string Title { get; } = title;
        public string OwnerDisplayName { get; } = ownerDisplayName;
        public string? LinkUrl { get; set; } = linkUrl;
        public int X { get; } = x;
        public int Y { get; } = y;
        public int Width { get; } = width;
        public int Height { get; } = height;
        public string AccentColor { get; } = accentColor;
    }
}

public sealed record CanvasSummarySnapshot(
    int Width,
    int Height,
    string RenderVersion,
    DateTimeOffset UpdatedAt,
    int ReservationCount);
