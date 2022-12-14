// <auto-generated />
using System;
using FM.ContactBook.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace FM.ContactBook.Server.Migrations
{
    [DbContext(typeof(ContactsContext))]
    [Migration("20221011072415_CityAddedMigration")]
    partial class CityAddedMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.9");

            modelBuilder.Entity("FM.ContactBook.Server.Models.Contact", b =>
                {
                    b.Property<long>("ContactId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("City")
                        .HasColumnType("TEXT");

                    b.Property<string>("Country")
                        .HasColumnType("TEXT");

                    b.Property<string>("DateOfBirth")
                        .HasColumnType("TEXT");

                    b.Property<string>("District")
                        .HasColumnType("TEXT");

                    b.Property<string>("Forename")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<long?>("HouseNumber")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Iban")
                        .IsRequired()
                        .HasColumnType("TEXT")
                        .HasColumnName("IBAN");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("TEXT");

                    b.Property<long?>("PostCode")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Street")
                        .HasColumnType("TEXT");

                    b.Property<string>("Surname")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("ContactId");

                    b.ToTable("Contact", (string)null);
                });
#pragma warning restore 612, 618
        }
    }
}
