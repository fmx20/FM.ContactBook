using FM.ContactBook.Server.Dto;
using FM.ContactBook.Server.Services;

namespace FM.ContactBook.Server.Middleware
{
    public class ApiMiddleware
    {

        private readonly ILogger _logger;
        private readonly RequestDelegate _next;
        private readonly string[] _knownUnsecureRoutes = new string[] { "/api/auth/login" };
        private readonly ISessionService _sessionService;

        public ApiMiddleware(RequestDelegate next, ILogger<ApiMiddleware> logger, ISessionService sessionService)
        {
            _next = next;
            _logger = logger;
            _sessionService = sessionService;
        }

        public async Task Invoke(HttpContext context)
        {
            ArgumentNullException.ThrowIfNull(context);

            try
            {
                _sessionService.RemoveExpiredSessions();

                bool secure = context.Request.Headers.ContainsKey("t");
                if (secure)
                {
                    var ok = _sessionService.ExtendSession(context.Request.Headers["t"]);
                    if (!ok)
                    {
                        throw new InvalidTokenException();
                    }

                    await _next(context);
                }
                else if (_knownUnsecureRoutes.Contains<string>(context.Request.Path))
                {
                    await _next(context);
                }
                else
                {
                    throw new ClientProgrammerException("Missing Token");
                }

                if (context.Response.StatusCode != StatusCodes.Status200OK)
                {
                    if (context.Response.StatusCode == StatusCodes.Status404NotFound)
                    {
                        throw new ClientProgrammerException("Unknown route information");
                    }
                    else
                    {
                        throw new ServerException(string.Format("Internal server error ({0})", context.Response.StatusCode));
                    }
                }
            }
            catch(Exception ex)
            {
                HandleError(ex, context.Response);
            }
        }

        private void HandleError(Exception exception, HttpResponse response)
        {
            int errorCode;
            try
            {
                errorCode = exception switch
                {
                    EndUserException eu => Exceptions.END_USER,
                    ClientProgrammerException cp => Exceptions.CLIENT_PROGRAMMER,
                    AccessDeniedException ad => Exceptions.ACCESS_DENIED,
                    ServerException es => Exceptions.SERVER,
                    InvalidTokenException it => Exceptions.INVALID_TOKEN,
                    _ => 600
                };

                string errorMsg = exception.InnerException != null ? $"{exception.Message} - {exception.InnerException.Message}" : exception.Message;
                string trace = exception.ToString();

                var errResponse = new ResponseBase();
                errResponse.SetError(errorCode, errorMsg);

                response.WriteAsync(errResponse.ToJsonString().ToString());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "HandleError Exception");
            }
        }
    }

    public static class ApiMiddlewareExtensions
    {
        public static IApplicationBuilder UseApiMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ApiMiddleware>();
        }
    }
}
