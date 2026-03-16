using System.ComponentModel.DataAnnotations;
public class Coupon
{
    [Key]
    public int CouponId { get; set; }
    [Required]
    public string Code { get; set; } = string.Empty;
    public decimal DiscountPct { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public bool IsActive { get; set; } = true;

    public virtual ICollection<UserCoupon> UserCoupons { get; set; } = new List<UserCoupon>();
}