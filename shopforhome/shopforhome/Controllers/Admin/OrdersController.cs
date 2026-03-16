using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shopforhome.Data;
using shopforhome.Models;

namespace shopforhome.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public OrdersController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // Admin only - see all orders
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
            return Ok(orders);
        }

        // Admin only - see specific order
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.OrderId == id);
            if (order == null) return NotFound();
            return Ok(order);
        }

        // Any logged in user - see own orders
        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetByUser(int userId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
            return Ok(orders);
        }

        // Any logged in user - place order
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PlaceOrder([FromBody] Order order)
        {
            if (order == null) return BadRequest();
            order.OrderDate = DateTime.Now;
            order.Status = "Pending";
            order.PaymentStatus = "Pending";
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                message = "Order placed successfully",
                orderId = order.OrderId
            });
        }

        // Admin only - update status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();
            order.Status = status;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Status updated" });
        }
    }
}