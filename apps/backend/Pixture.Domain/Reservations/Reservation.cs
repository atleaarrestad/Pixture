namespace Pixture.Domain.Reservations;

public sealed class Reservation
{
    public Reservation(
        Guid id,
        string title,
        string ownerDisplayName,
        string? linkUrl,
        string? linkDisplayName,
        string? linkLogoUrl,
        int x,
        int y,
        int width,
        int height,
        string accentColor)
    {
        Id = id;
        Title = title;
        OwnerDisplayName = ownerDisplayName;
        LinkUrl = linkUrl;
        LinkDisplayName = linkDisplayName;
        LinkLogoUrl = linkLogoUrl;
        X = x;
        Y = y;
        Width = width;
        Height = height;
        AccentColor = accentColor;
    }

    public Guid Id { get; }
    public string Title { get; }
    public string OwnerDisplayName { get; }
    public string? LinkUrl { get; private set; }
    public string? LinkDisplayName { get; }
    public string? LinkLogoUrl { get; }
    public int X { get; }
    public int Y { get; }
    public int Width { get; }
    public int Height { get; }
    public string AccentColor { get; }

    public void SetLinkUrl(string? linkUrl)
    {
        LinkUrl = linkUrl;
    }
}
