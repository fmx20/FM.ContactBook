using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Options;
using System.Collections.Concurrent;

using FM.ContactBook.Server.Configurations;

namespace FM.ContactBook.Server.Middleware
{
    public class WebAppMiddleware
    {
        private readonly WebConfig _config;
        private readonly RequestDelegate _next;
        private readonly List<WebApp> _webApps;

        public WebAppMiddleware(RequestDelegate next, IOptions<WebConfig> config)
        {
            _next = next;
            _config = config.Value;
            _webApps = new List<WebApp>();

            foreach (var appConfig in _config.WebApps)
            {
                var webApp = new WebApp(appConfig);

                if (webApp.IsConfigured)
                {
                    _webApps.Add(webApp);
                }
            }
        }

        public async Task Invoke(HttpContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }

            if (context.Request.Method != HttpMethods.Get || context.Request.Path.StartsWithSegments("/api"))
            {
                await _next.Invoke(context);
                return;
            }

            var (webapp, route) = GetWebApp(context);
            if (webapp != null)
            {
                await webapp.HandleRequest(context, route);
            }
            else
            {
                await _next.Invoke(context);
            }
        }

        private (WebApp, string) GetWebApp(HttpContext context)
        {
            if (context.Request.Path.HasValue)
            {
                foreach (var webapp in _webApps)
                {
                    PathString path = webapp.Config.Path == "/" ? PathString.Empty : new PathString(webapp.Config.Path);

                    if (context.Request.Path.StartsWithSegments(path, out PathString remaining))
                    {
                        if (context.Request.QueryString.HasValue)
                        {
                            remaining += context.Request.QueryString.Value;
                        }
                        return (webapp, remaining);
                    }
                }
            }
            return (null, null);
        }

        private sealed class FileCache
        {
            private readonly ConcurrentDictionary<string, FileData> _Cache = new();

            public FileData GetItem(string aKey)
            {
                if (_Cache.TryGetValue(aKey, out FileData res) == true)
                {
                    return res;
                }

                return null;
            }

            public FileData AddItem(string aKey, FileData aItem)
            {
                return _Cache.AddOrUpdate(aKey, aItem, (id, existingItem) => aItem);
            }
        }

        private sealed class FileData
        {
            public string ContentType { get; set; }
            public byte[] Content { get; set; }
        }

        private sealed class WebApp
        {
            private readonly FileCache _Cache = new();
            private readonly FileExtensionContentTypeProvider _ContentTypeProvider = new();
            private readonly FileData _Default;
            private readonly PhysicalFileProvider _FileProvider;
            
            public readonly WebAppConfig Config;
            public readonly bool IsConfigured;

            public WebApp(WebAppConfig config)
            {
                Config = config;

                if (Config != null && !string.IsNullOrEmpty(Config.Directory))
                {
                    _Default = _Cache.GetItem("/index.html");

                    if (_Default == null)
                    {
                        if (File.Exists(Path.Combine(AppContext.BaseDirectory, Config.Directory, "index.html")) == true)
                        {
                            _Default = new FileData
                            {
                                ContentType = "text/html",
                                Content = File.ReadAllBytes(Path.Combine(AppContext.BaseDirectory, Config.Directory, "index.html"))
                            };
                        }
                    }

                    IsConfigured = _Default != null;

                    if (IsConfigured)
                    {
                        _FileProvider = new PhysicalFileProvider(Path.Combine(AppContext.BaseDirectory, Config.Directory));
                    }
                }
            }

            public async Task HandleRequest(HttpContext context, PathString path)
            {
                if (context.Request.Path.HasValue)
                {
                    FileData result = _Cache.GetItem(path);

                    if (result == null)
                    {
                        var fileInfo = _FileProvider.GetFileInfo(path);
                        if (fileInfo.Exists)
                        {
                            if (!_ContentTypeProvider.TryGetContentType(fileInfo.PhysicalPath, out string contentType))
                            {
                                contentType = "application/octet-stream";
                            }

                            result = new FileData
                            {
                                ContentType = contentType,
                                Content = await File.ReadAllBytesAsync(fileInfo.PhysicalPath)
                            };
                        }
                    }

                    result ??= _Default;

                    if(result != null)
                    {
                        context.Response.ContentType = result.ContentType;
                        await context.Response.Body.WriteAsync(result.Content.AsMemory(0, result.Content.Length));
                    }
                }
            }
        }
    }

    public static class WebAppMiddlewareExtensions
    {
        public static IApplicationBuilder UseWebAppMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<WebAppMiddleware>();
        }
    }
}
