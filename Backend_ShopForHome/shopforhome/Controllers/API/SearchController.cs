using Microsoft.AspNetCore.Mvc;
using shopforhome.Data;
using System.Linq;

namespace ShopForHome.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public SearchController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult SearchProducts(string query)
        {
            var products = _context.Products
                .Where(p => p.Name.Contains(query))
                .ToList();

            return Ok(products);
        }
    }
}