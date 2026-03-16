using shopforhome.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Cart
{
    [Key]
    public int CartId { get; set; }
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}