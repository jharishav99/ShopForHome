using shopforhome.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class CartItem
{
    [Key]
    public int CartItemId { get; set; }

    public int CartId { get; set; }

    [ForeignKey("CartId")]
    public virtual Cart Cart { get; set; } = null!;
    public int UserId { get; set; }

    public int ProductId { get; set; }

    [ForeignKey("ProductId")]
    public virtual Product Product { get; set; } = null!;

    public int Quantity { get; set; }
}