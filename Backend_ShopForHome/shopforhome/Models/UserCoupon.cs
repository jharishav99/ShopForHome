using shopforhome.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class UserCoupon
{
    [Key]
    public int UserCouponId { get; set; }

    public int UserId { get; set; }
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;

    public int CouponId { get; set; }
    [ForeignKey("CouponId")]
    public virtual Coupon Coupon { get; set; } = null!;

    public bool IsUsed { get; set; } = false;
    public DateTime AssignedAt { get; set; } = DateTime.Now;
}