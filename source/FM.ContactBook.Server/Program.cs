using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting.WindowsServices;
using System.Net;
using Serilog;
using Serilog.Events;

using FM.ContactBook.Server.Configurations;
using FM.ContactBook.Server.Data;
using FM.ContactBook.Server.Dto;
using FM.ContactBook.Server.Middleware;
using FM.ContactBook.Server.Services;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Error()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Error)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        Path.Combine(AppContext.BaseDirectory, "logs", "server.log"),
        rollingInterval: RollingInterval.Day,
        fileSizeLimitBytes: 10 * 1024 * 1024,
        rollOnFileSizeLimit: true,
        flushToDiskInterval: TimeSpan.FromMinutes(1))
    .CreateLogger();

var builder = WebApplication.CreateBuilder(new WebApplicationOptions()
{
    Args = args,
    ContentRootPath = WindowsServiceHelpers.IsWindowsService() ? AppContext.BaseDirectory : default
});

builder.Host
    .ConfigureHostOptions(o => o.ShutdownTimeout = TimeSpan.FromMinutes(2))
    .UseSerilog()
    .UseWindowsService(o => o.ServiceName = "FM Contact Book Server");

builder.WebHost
    .ConfigureKestrel(o =>
    {
        o.Listen(IPAddress.Any, builder.Configuration.GetValue<int>("Server:ListenPort"));
        o.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(10);
    });

// Add services to the container.
builder.Services
    .Configure<WebConfig>(builder.Configuration.GetSection("WebConfig"))
    .AddScoped<IContactRepository, ContactRepository>()
    .AddScoped<IUserRepository, UserRepository>()
    .AddSingleton<ISessionService, SessionService>()
    .AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context => new ValidationErrorResult();
    })
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

builder.Services.AddDbContext<ContactsContext>(options =>
{
    options.UseSqlite("Name=ContactsDB");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseWebAppMiddleware();
app.UseApiMiddleware();
app.MapControllers();

try
{
    Console.WriteLine("Server running on 9085...");

    // Run app
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Stopped server because of unhandled exception!");
}
finally
{
    Log.CloseAndFlush();
}