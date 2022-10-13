using FM.ContactBook.Server.Data;
using FM.ContactBook.Server.Dto;
using Microsoft.EntityFrameworkCore;

namespace FM.ContactBook.Server.Services
{
    public interface IUserRepository
    {
        public Task<UserDto> GetUser(string username, string password);
    }

    public class UserRepository : IUserRepository
    {
        private readonly ContactsContext _context;

        public UserRepository(ContactsContext contactsContext)
        {
            _context = contactsContext;
        }

        public async Task<UserDto> GetUser(string username, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(user => user.Username.Equals(username) && user.Password.Equals(password));
        }
    }
}
