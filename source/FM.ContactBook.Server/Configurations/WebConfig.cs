namespace FM.ContactBook.Server.Configurations
{
    public class WebConfig
    {
        public List<WebAppConfig> WebApps { get; set; } = new List<WebAppConfig>();
    }

    public class WebAppConfig
    {
        public string Path { get; set; }
        public string Description { get; set; }
        public string Directory { get; set; }
    }
}
