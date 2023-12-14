using BoxTesting.Server.Model;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BoxTesting.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        // GET: api/<BookController>
        [HttpGet("categories")]
        public List<BookCategory> GetCategory()
        {
            return new List<BookCategory>() {
                new BookCategory (){ Id = 1, Name = "Novel", Description = "Novel" },
                new BookCategory (){ Id = 2, Name = "Biography", Description = "Biography" },
                new BookCategory (){ Id = 3, Name = "History", Description = "History" },
                new BookCategory (){ Id = 4, Name = "Politics", Description = "Politics" },
                new BookCategory (){ Id = 5, Name = "NonFiction", Description = "NonFiction" }
            };
        }
    }
}
