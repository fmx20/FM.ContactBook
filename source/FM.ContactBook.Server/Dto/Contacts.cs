using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FM.ContactBook.Server.Dto
{
    public class ContactDto
    {
        [Key]
        public long ContactId { get; set; }
        public string Title { get; set; }
        public string Surname { get; set; }
        public string Forename { get; set; }
        public DateTime? BirthDate { get; set; }
        public string PhoneNumber { get; set; }
        public string Iban { get; set; }
        public ContactAddressDto Address { get; set; }
    }

    public class ContactListItemDto
    {
        public long ContactId { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public string FullAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Iban { get; set; }
    }

    [Owned]
    public class ContactAddressDto
    {
        public ContactAddressDto(string street, long? houseNumber, string district, string city, long? postCode, string country)
        {
            Street=street;
            HouseNumber=houseNumber;
            District=district;
            City=city;
            PostCode=postCode;
            Country=country;
        }

        public string Street { get; set; }
        public long? HouseNumber { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public long? PostCode { get; set; }
        public string Country { get; set; }

        public override string ToString()
        {
            StringBuilder sb = new();
            if(!string.IsNullOrEmpty(Street))
            {
                sb.Append(Street);

                if (HouseNumber.HasValue)
                {
                    sb.Append(" " + HouseNumber.ToString());
                }

                sb.AppendLine();
            }
            
            if(!string.IsNullOrEmpty(City))
            {
                if (PostCode.HasValue)
                {
                    sb.Append(PostCode.ToString() + ", ");
                }

                sb.Append(City);
                sb.AppendLine();
            }

            if(!string.IsNullOrEmpty(District))
            {
                sb.Append(District);
            }

            if (!string.IsNullOrEmpty(Country))
            {
                if (!string.IsNullOrEmpty(District))
                {
                    sb.Append(", ");
                }

                sb.Append(Country);
            }

            return sb.ToString().TrimEnd(Environment.NewLine.ToCharArray());
        }
    }

    public class CreateContactRequest
    {
        public ContactDto Contact { get; set; }
    }

    public class CreateContactResponse : ResponseBase
    {
        public ContactListItemDto ContactListItem { get; set; }
    }

    public class DeleteContactRequest
    {
        public long ContactId { get; set; }
    }

    public class DeleteContactResponse : ResponseBase
    {
    }

    public class LoadContactResponse : ResponseBase
    {
        public ContactDto Contact { get; set; }
    }

    public class LoadContactListResponse : ResponseBase
    {
        public List<ContactListItemDto> ContactList { get; set; }
    }

    public class UpdateContactRequest
    {
        public ContactDto Contact { get; set; }
    }

    public class UpdateContactResponse : ResponseBase
    {
        public ContactListItemDto ContactListItem { get; set; }
    }
}
