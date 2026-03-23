using Microsoft.AspNetCore.Http;

namespace Pixture.Api.Infrastructure;

public static class HttpRequestUrlExtensions
{
    public static string ToAbsoluteUrl(this HttpRequest request, string pathOrUrl)
    {
        return Uri.TryCreate(pathOrUrl, UriKind.Absolute, out _)
            ? pathOrUrl
            : $"{request.Scheme}://{request.Host}{pathOrUrl}";
    }

    public static string? ToAbsoluteUrlOrNull(this HttpRequest request, string? pathOrUrl)
    {
        if (string.IsNullOrWhiteSpace(pathOrUrl))
        {
            return null;
        }

        return request.ToAbsoluteUrl(pathOrUrl);
    }
}
