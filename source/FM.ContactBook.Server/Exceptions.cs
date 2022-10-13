namespace FM.ContactBook.Server
{
    public class ErrorCodes
    {
        public const int END_USER = 300;
        public const int CLIENT_PROGRAMMER = 400;
        public const int ACCESS_DENIED = 403;
        public const int SERVER = 500;
        public const int INVALID_TOKEN = 711;
    }

    public class EndUserException : Exception
    {
        public EndUserException(string message) : base(message)
        {
        }
        public EndUserException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }

    public class ClientProgrammerException : Exception
    {
        public ClientProgrammerException(string message) : base(message)
        {
        }
        public ClientProgrammerException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }

    public class AccessDeniedException : Exception
    {
        public AccessDeniedException(string message) : base(message)
        {
        }
        public AccessDeniedException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }

    public class ServerException : Exception
    {
        public ServerException(string message) : base(message)
        {
        }
        public ServerException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }

    public class InvalidTokenException : Exception
    {
        public InvalidTokenException() : base("Invalid token")
        {
        }
        public InvalidTokenException(string message) : base(message)
        {
        }
        public InvalidTokenException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
