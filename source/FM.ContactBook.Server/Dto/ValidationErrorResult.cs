using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace FM.ContactBook.Server.Dto
{
    public class ValidationErrorResult : IActionResult
    {
        public async Task ExecuteResultAsync(ActionContext context)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

            var modelStateEntries = context.ModelState.Where(e => e.Value?.Errors.Count > 0)?.ToArray();

            var sb = new StringBuilder();
            sb.AppendLine("Validation errors:");

            if (modelStateEntries != null && modelStateEntries.Any())
            {
                foreach (var modelStateEntry in modelStateEntries)
                {
                    if(modelStateEntry.Value != null)
                    {
                        foreach (var modelStateError in modelStateEntry.Value.Errors)
                        {
                            sb.AppendLine(string.Format("{0}: {1}", modelStateEntry.Key, modelStateError.ErrorMessage));
                        }
                    }
                }
            }

            var response = new ResponseBase()
            {
                ErrorCode = ErrorCodes.CLIENT_PROGRAMMER,
                ErrorMsg = sb.ToString(),
                IsError = true
            };

            await context.HttpContext.Response.BodyWriter.WriteAsync(Encoding.UTF8.GetBytes(response.ToJsonString()));
        }
    }
}
