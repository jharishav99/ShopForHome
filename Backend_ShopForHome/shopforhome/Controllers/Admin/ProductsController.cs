using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shopforhome.Data;
using shopforhome.Models;
using Microsoft.AspNetCore.Authorization;

namespace shopforhome.Controllers.Admin
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;

        public ProductsController(ShopForHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/Products - Public
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive == true)
                .ToListAsync();
            return Ok(products);
        }

        // GET: api/Products/5 - Public
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductId == id);

            if (product == null) return NotFound();
            return Ok(product);
        }

        // POST: api/Products - Admin only
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product product)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            product.IsActive = true;
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return Ok(product);
        }

        // PUT: api/Products/5 - Admin only
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Product product)
        {
            var existing = await _context.Products.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = product.Name;
            existing.Description = product.Description;
            existing.Price = product.Price;
            existing.Stock = product.Stock;
            existing.Rating = product.Rating;
            existing.ImageUrl = product.ImageUrl;
            existing.CategoryId = product.CategoryId;
            existing.IsActive = product.IsActive;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Update successful" });
        }

        // DELETE: api/Products/5 - Admin only
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Product deleted" });
        }

        // POST: api/Products/UploadCsv - Admin only
        [HttpPost("UploadCsv")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

            var productsList = new List<Product>();

            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                bool isFirstLine = true;
                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    if (isFirstLine) { isFirstLine = false; continue; }

                    var values = line!.Split(',');
                    try
                    {
                        productsList.Add(new Product
                        {
                            Name = values[0].Trim(),
                            Description = values[1].Trim(),
                            Price = decimal.Parse(values[2].Trim()),
                            Stock = int.Parse(values[3].Trim()),
                            CategoryId = int.Parse(values[4].Trim()),
                            ImageUrl = values.Length > 5 ? values[5].Trim() : "",
                            IsActive = true
                        });
                    }
                    catch { continue; }
                }
            }

            if (productsList.Any())
            {
                _context.Products.AddRange(productsList);
                await _context.SaveChangesAsync();
                return Ok(new { count = productsList.Count, message = "Bulk upload successful!" });
            }

            return BadRequest(new { message = "No valid data found in CSV." });
        }

        // GET: api/Products/search - Public
        [AllowAnonymous]
        [HttpGet("search")]
        public async Task<IActionResult> Search(
            [FromQuery] string? query = "",
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] int? categoryId = null)
        {
            var products = _context.Products
                .Include(p => p.Category)
                .Where(p => p.IsActive == true)
                .AsQueryable();

            if (!string.IsNullOrEmpty(query))
                products = products.Where(p =>
                    p.Name.Contains(query) ||
                    p.Description.Contains(query));

            if (minPrice.HasValue)
                products = products.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                products = products.Where(p => p.Price <= maxPrice.Value);

            if (categoryId.HasValue)
                products = products.Where(p => p.CategoryId == categoryId.Value);

            return Ok(await products.ToListAsync());
        }
        // POST: api/Products/UploadImage
        [HttpPost("UploadImage")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded." });

             //save to wwwroot/assets/images as per project instructions
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "assets", "images");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            //URL now points to /assets/images/
            var imageUrl = $"https://localhost:7213/assets/images/{fileName}";
            return Ok(new { imageUrl });
        }
        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}