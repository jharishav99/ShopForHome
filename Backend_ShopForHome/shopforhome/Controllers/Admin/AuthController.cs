using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using shopforhome.Data;
using shopforhome.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace shopforhome.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ShopForHomeDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ShopForHomeDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
                return BadRequest("Email and Password are required.");

            var user = _context.Users
                .FirstOrDefault(u => u.Email == model.Email && u.PasswordHash == model.Password);

            if (user == null)
                return Unauthorized("Invalid credentials");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role ?? "User")
            };

            var jwtKey = _configuration["Jwt:Key"] ?? "A_VERY_LONG_BACKUP_SECRET_KEY_12345_DO_NOT_USE_IN_PROD";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "ShopForHome",
                audience: null,
                claims: claims,
               expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                userEmail = user.Email,
                role = user.Role
            });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            if (user == null) return BadRequest("User data is invalid.");

            if (_context.Users.Any(u => u.Email == user.Email))
                return BadRequest("User with this email already exists.");

            if (string.IsNullOrEmpty(user.Role))
                user.Role = "User";

            user.CreatedAt = DateTime.Now;
            user.IsActive = true;

            _context.Users.Add(user);
            _context.SaveChanges();
            return Ok(new { message = "User registered successfully" });
        }
    }

    public class LoginModel
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}