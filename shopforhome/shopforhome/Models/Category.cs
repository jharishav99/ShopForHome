using System.ComponentModel.DataAnnotations;

namespace shopforhome.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;

        // Navigation property for 1-to-many relationship

        public virtual ICollection<Product> Products { get; set; } = new List<Product>();
    }
}