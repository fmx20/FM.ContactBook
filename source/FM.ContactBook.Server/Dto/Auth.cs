using System.ComponentModel.DataAnnotations;

namespace FM.ContactBook.Server.Dto
{
    public class UserDto
    {
        [Key]
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Forename { get; set; }
        public string Surname { get; set; }
    }

    public class UserLoginDto
    {
        public int UserId { get; set; }
        public string Username { get; set; }
        public string Forename { get; set; }
        public string Surname { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class LoginResponse : ResponseBase
    {
        public string SessionToken { get; set; }
        public UserLoginDto User { get; set; }
    }

    public class LogoutResponse : ResponseBase
    {
    }
}
