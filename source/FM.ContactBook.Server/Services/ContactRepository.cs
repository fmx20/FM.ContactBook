using Dapper;
using FM.ContactBook.Server.Data;
using FM.ContactBook.Server.Dto;
using FM.ContactBook.Server.Utils;
using Microsoft.EntityFrameworkCore;

namespace FM.ContactBook.Server.Services
{
    public interface IContactRepository
    {
        public bool ContactExists(long id);
        public Task<ContactListItemDto> CreateContact(ContactDto contact);
        public Task DeleteContactById(long id);
        public Task<List<ContactListItemDto>> GetContactList();
        public Task<ContactDto> GetContactById(long id);
        public Task<ContactListItemDto> UpdateContact(ContactDto contact);
    }

    public class ContactRepository : IContactRepository
    {
        private readonly ContactsContext _context;

        public ContactRepository(ContactsContext contactsContext)
        {
            _context = contactsContext;
        }

        public bool ContactExists(long id)
        {
            return _context.Contacts.Any(e => e.ContactId == id);
        }

        public async Task<ContactListItemDto> CreateContact(ContactDto contact)
        {
            _context.Contacts.Add(contact);
            await _context.SaveChangesAsync();

            ContactListItemDto listItemDto = new()
            {
                ContactId = contact.ContactId,
                FullName = string.Join(' ', new string[] { contact.Title, contact.Forename, contact.Surname }.Where(i => !string.IsNullOrEmpty(i))),
                FullAddress = new ContactAddressDto(
                    contact.Address.Street,
                    contact.Address.HouseNumber,
                    contact.Address.District,
                    contact.Address.City,
                    contact.Address.PostCode,
                    contact.Address.Country).ToString(),
                PhoneNumber = contact.PhoneNumber,
                Iban = contact.Iban
            };

            if(contact.BirthDate.HasValue)
            {
                listItemDto.Age = DateTimeUtils.GetAge(contact.BirthDate.Value);
            }

            return listItemDto;
        }

        public async Task DeleteContactById(long id)
        {
            var contact = await _context.Contacts.FindAsync(id);
            if (contact == null)
            {
                throw new EndUserException("Contact not found.");
            }

            _context.Contacts.Remove(contact);
            await _context.SaveChangesAsync();
        }

        public async Task<ContactDto> GetContactById(long id)
        {
            return await _context.Contacts.FindAsync(id);
        }

        public async Task<List<ContactListItemDto>> GetContactList()
        {
            string query =
                @"SELECT ContactId, Title, Forename, Surname, Address_Street, Address_HouseNumber, Address_District, Address_City, Address_PostCode, Address_Country, BirthDate, PhoneNumber, IBAN
                  FROM Contact;";

            using var connection = _context.Database.GetDbConnection();

            var result = await connection.QueryAsync(query);
            if(result.Any())
            {
                List<ContactListItemDto> itemDtoList = new();

                foreach (var item in result)
                {
                    ContactListItemDto listItem = new()
                    {
                        ContactId = item.ContactId,
                        FullName = string.Join(' ', new string[] { item.Title, item.Forename, item.Surname }.Where(i => !string.IsNullOrEmpty(i))),
                        FullAddress = new ContactAddressDto(
                            item.Address_Street,
                            item.Address_HouseNumber,
                            item.Address_District,
                            item.Address_City,
                            item.Address_PostCode,
                            item.Address_Country).ToString(),
                        PhoneNumber = item.PhoneNumber,
                        Iban = item.IBAN
                    };

                    if (item.BirthDate != null)
                    {
                        listItem.Age = DateTimeUtils.GetAge(item.BirthDate);
                    }

                    itemDtoList.Add(listItem);
                }

                return itemDtoList;
            }
           
            return null;
        }

        public async Task<ContactListItemDto> UpdateContact(ContactDto contact)
        {
            _context.Entry(contact).State = EntityState.Modified;
            _context.Entry(contact.Address).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            ContactListItemDto listItemDto = new()
            {
                ContactId = contact.ContactId,
                FullName = string.Join(' ', new string[] { contact.Title, contact.Forename, contact.Surname }.Where(i => !string.IsNullOrEmpty(i))),
                FullAddress = new ContactAddressDto(
                    contact.Address.Street,
                    contact.Address.HouseNumber,
                    contact.Address.District,
                    contact.Address.City,
                    contact.Address.PostCode,
                    contact.Address.Country).ToString(),
                PhoneNumber = contact.PhoneNumber,
                Iban = contact.Iban
            };

            if (contact.BirthDate.HasValue)
            {
                listItemDto.Age = DateTimeUtils.GetAge(contact.BirthDate.Value);
            }

            return listItemDto;
        }
    }
}
