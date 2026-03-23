using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shopforhome.Data;
using shopforhome.Models;

namespace shopforhome.Controllers.Admin
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public CouponsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var coupons = await _context.Coupons.ToListAsync();
            return Ok(coupons);
        }

        [HttpGet("{userId}")]
        [Authorize]
        public async Task<IActionResult> GetUserCoupons(int userId)
        {
            var coupons = await _context.UserCoupons
                .Include(c => c.Coupon)
                .Where(c => c.UserId == userId)
                .ToListAsync();
            return Ok(coupons);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] Coupon coupon)
        {
            if (coupon == null) return BadRequest();
            coupon.IsActive = true;
            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();
            return Ok(coupon);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] Coupon coupon)
        {
            var existing = await _context.Coupons.FindAsync(id);
            if (existing == null) return NotFound();
            existing.Code = coupon.Code;
            existing.DiscountPct = coupon.DiscountPct;
            existing.ValidFrom = coupon.ValidFrom;
            existing.ValidTo = coupon.ValidTo;
            existing.IsActive = coupon.IsActive;
            await _context.SaveChangesAsync();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null) return NotFound();
            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Deleted" });
        }

        [HttpPost("assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignToUser([FromBody] AssignCouponRequest request)
        {
            if (request == null) return BadRequest();

            var exists = await _context.UserCoupons
                .AnyAsync(uc => uc.UserId == request.UserId
                    && uc.CouponId == request.CouponId);

            if (exists)
                return BadRequest(new { message = "Coupon already assigned to this user." });

            var userCoupon = new UserCoupon
            {
                UserId = request.UserId,
                CouponId = request.CouponId,
                IsUsed = false,
                AssignedAt = DateTime.Now
            };

            _context.UserCoupons.Add(userCoupon);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Coupon assigned successfully" });
        }
    }

    public class AssignCouponRequest
    {
        public int UserId { get; set; }
        public int CouponId { get; set; }
    }
}