namespace FM.ContactBook.Server.Utils
{
    public static class DateTimeUtils
    {
        public static int GetAge(string birthDateString)
        {
            ArgumentNullException.ThrowIfNull(birthDateString);

            if(!DateTime.TryParse(birthDateString, out DateTime resDate))
            {
                throw new ArgumentException("Argument is not a valid DateOnly.");
            }

            return GetAge(resDate);
        }

        public static int GetAge(DateTime birthDate)
        {
            ArgumentNullException.ThrowIfNull(birthDate);

            var today = DateTime.Today;
            var age = today.Year - birthDate.Year;

            // Go back to the year in which the person was born in case of a leap year
            if (birthDate > today.AddYears(-age))
            {
                age--;
            }

            return age;
        }
    }

    public static class DateTimeExtensions
    {
        public static string ToDateString(this DateTime? dateTime)
        {
            if(!dateTime.HasValue)
            {
                return null;
            }

            return dateTime.Value.ToString("yyyy-MM-dd");
        }

        public static DateTime? ToDateTime(this string dateTimeString)
        {
            if(DateTime.TryParse(dateTimeString, out DateTime res))
            {
                return res;
            }

            return null;
        }
    }
}
