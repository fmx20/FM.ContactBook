using FM.ContactBook.Server.Utils;

namespace FM.ContactBook.Server.Services
{
    public interface ISessionService
    {
        public string AddSession();
        public bool ExtendSession(string token);
        public void RemoveExpiredSessions();
        public void RemoveSession(string token);
    }

    public class SessionService : ISessionService
    {
        private readonly ThreadSafeList<Session> _Sessions = new();
        private readonly TimeSpan _Timeout = TimeSpan.FromMinutes(60);

        public string AddSession()
        {
            var session = new Session
            {
                Expired = DateTime.Now + _Timeout,
                Token = Guid.NewGuid().ToString()
            };

            _Sessions.Add(session);

            return session.Token;
        }

        public bool ExtendSession(string token)
        {
            var session = _Sessions.FirstOrDefault(s => s.Token == token);
            if (session == null)
            {
                return false;
            }

            session.Expired = DateTime.Now + _Timeout;

            return true;
        }

        public void RemoveExpiredSessions()
        {
            // TODO: add timeout to only remove sessions every 30 min. instead of every request
            if (_Sessions.Count > 0)
            {
                _Sessions.RemoveAll((s) => s.Expired < DateTime.Now);
            }
        }

        public void RemoveSession(string token)
        {
            var session = _Sessions.FirstOrDefault(s => s.Token == token);
            if (session != null)
            {
                _Sessions.Remove(session);
            }
        }

        private class Session
        {
            public DateTime Expired { get; set; }
            public string Token { get; set; }
        }
    }
}
