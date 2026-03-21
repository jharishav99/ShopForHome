using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shopforhome.Models
{
    public class Wishlist
    {
        [Key]
        public int WishlistId { get; set; }

        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;


        public int ProductId { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.Now;

        
        [ForeignKey("ProductId")]
        public virtual Product Product { get; set; } = null!;
    }
}