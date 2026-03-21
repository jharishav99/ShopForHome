using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shopforhome.Data;
using System.Linq;

namespace ShopForHome.Controllers.API
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public ReportsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        [HttpGet("sales")]
        public IActionResult GetSalesReport()
        {
            var report = _context.Orders
                .Select(o => new
                {
                    o.OrderId,
                    o.TotalAmount,
                    o.OrderDate
                }).ToList();

            return Ok(report);
        }
    }
}