using Microsoft.EntityFrameworkCore;
using FM.ContactBook.Server.Dto;
using FM.ContactBook.Server.Utils;

namespace FM.ContactBook.Server.Data
{
    public partial class ContactsContext : DbContext
    {
        public ContactsContext()
        {
        }

        public ContactsContext(DbContextOptions<ContactsContext> options)
            : base(options)
        {
        }

        public virtual DbSet<ContactDto> Contacts { get; set; }
        public virtual DbSet<UserDto> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ContactDto>(entity =>
            {
                entity.ToTable("Contact");
                
                entity.Property(e => e.Forename).IsRequired();

                entity.Property(e => e.Iban)
                    .IsRequired()
                    .HasColumnName("IBAN");

                entity.Property(e => e.Surname).IsRequired();

                entity.Property(e => e.BirthDate).HasConversion(f => f.ToDateString(), s => s.ToDateTime());

                entity.OwnsOne(e => e.Address);
            });

            modelBuilder.Entity<UserDto>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.Username).IsRequired();
                entity.Property(e => e.Password).IsRequired();
                entity.Property(e => e.Forename).IsRequired();
                entity.Property(e => e.Surname).IsRequired();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }

}
