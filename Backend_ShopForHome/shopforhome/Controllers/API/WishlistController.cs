using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shopforhome.Data;
using shopforhome.Models;
using System.Security.Claims;

namespace shopforhome.Controllers.API
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public WishlistController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetWishlist(int userId)
        {
            var wishlistItems = await _context.Wishlists
                .Include(w => w.Product)
                .Where(w => w.UserId == userId)
                .ToListAsync();
            return Ok(wishlistItems);
        }

        [HttpPost]
        public async Task<IActionResult> ToggleWishlist([FromBody] WishlistRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            int userId = int.Parse(userIdClaim.Value);

            var exists = await _context.Wishlists
                .FirstOrDefaultAsync(w => w.UserId == userId
                    && w.ProductId == request.ProductId);

            if (exists != null)
            {
                _context.Wishlists.Remove(exists);
                await _context.SaveChangesAsync();
                return Ok(new { status = "removed" });
            }

            var newItem = new Wishlist
            {
                UserId = userId,
                ProductId = request.ProductId,
                AddedAt = DateTime.Now
            };

            _context.Wishlists.Add(newItem);
            await _context.SaveChangesAsync();
            return Ok(new { status = "added" });
        }
    }

    public class WishlistRequest
    {
        public int ProductId { get; set; }
    }
}