using Pixture.Api.Services;

var builder = WebApplication.CreateBuilder(args);
const string FrontendDevCorsPolicy = "FrontendDev";

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendDevCorsPolicy, policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddSingleton<ICanvasBoardService, CanvasBoardService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseCors(FrontendDevCorsPolicy);
}

app.UseAuthorization();

app.MapControllers();
app.MapGet("/health", () => Results.Ok(new
{
    status = "ok",
    service = "Pixture.Api",
    utcNow = DateTimeOffset.UtcNow
}))
    .WithName("Health");

app.Run();
