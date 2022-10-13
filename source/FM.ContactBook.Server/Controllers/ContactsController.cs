using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FM.ContactBook.Server.Dto;
using FM.ContactBook.Server.Services;

namespace FM.ContactBook.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly IContactRepository _repo;

        public ContactsController(IContactRepository repo)
        {
            _repo = repo;
        }

        [HttpPost]
        public async Task<ActionResult<CreateContactResponse>> CreateContact([FromBody] CreateContactRequest request)
        {
            return new CreateContactResponse()
            {
                ContactListItem = await _repo.CreateContact(request.Contact)
            };
        }

        [HttpDelete]
        public async Task<ActionResult<DeleteContactResponse>> DeleteContact([FromBody] DeleteContactRequest request)
        {
            await _repo.DeleteContactById(request.ContactId);

            return new DeleteContactResponse();
        }

        [HttpGet]
        public async Task<ActionResult<LoadContactListResponse>> LoadContactList()
        {
            return new LoadContactListResponse()
            {
                ContactList = await _repo.GetContactList()
            };
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LoadContactResponse>> LoadContact(long id)
        {
            var contact = await _repo.GetContactById(id);
            if (contact == null)
            {
                throw new ClientProgrammerException("Contact not found.");
            }

            return new LoadContactResponse()
            {
                Contact = contact
            };
        }

        [HttpPut]
        public async Task<ActionResult<UpdateContactResponse>> UpdateContact([FromBody] UpdateContactRequest request)
        {
            ContactListItemDto listItem;
            try
            {
                listItem = await _repo.UpdateContact(request.Contact);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_repo.ContactExists(request.Contact.ContactId))
                {
                    throw new ClientProgrammerException("Contact not found.");
                }
                else
                {
                    throw;
                }
            }

            return new UpdateContactResponse()
            {
                ContactListItem = listItem
            };
        }

    }
}
