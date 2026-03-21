using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shopforhome.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, 999999.99)]
        public decimal Price { get; set; }
        public double Rating { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; } 
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public virtual Category? Category { get; set; } 
    }
}