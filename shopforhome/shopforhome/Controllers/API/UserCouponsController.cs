using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shopforhome.Data;

namespace shopforhome.Controllers.API
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserCouponsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public UserCouponsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/UserCoupons/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserCoupons(int userId)
        {
            var coupons = await _context.UserCoupons
                .Include(c => c.Coupon)
                .Where(c => c.UserId == userId)
                .ToListAsync();
            return Ok(coupons);
        }
    }
}