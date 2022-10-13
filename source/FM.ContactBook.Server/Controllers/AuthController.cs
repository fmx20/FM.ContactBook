using FM.ContactBook.Server.Dto;
using FM.ContactBook.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace FM.ContactBook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
        private readonly IUserRepository _repo;
        private readonly ISessionService _sessionService;

        public AuthController(IUserRepository repo, ISessionService sessionService)
        {
            _repo = repo;
            _sessionService = sessionService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            var user = await _repo.GetUser(request.Username, request.Password);
            if (user == null)
            {
                throw new EndUserException("Benutzername und/oder Passwort sind falsch.");
            }

            return new LoginResponse()
            {
                SessionToken = _sessionService.AddSession(),
                User = new UserLoginDto()
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Forename = user.Forename,
                    Surname = user.Surname
                }
            };
        }

        [HttpPost("logout")]
        public ActionResult<LogoutResponse> Logout()
        {
            if(!HttpContext.Request.Headers.ContainsKey("t"))
            {
                throw new ClientProgrammerException("Token missing");
            }

            _sessionService.RemoveSession(HttpContext.Request.Headers["t"]);

            return new LogoutResponse();
        }
    }
}
