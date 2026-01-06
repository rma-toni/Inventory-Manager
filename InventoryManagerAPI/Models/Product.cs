using System.ComponentModel.DataAnnotations;

namespace InventoryManagerAPI.Models
{
    public class Product
    {
        [Required(ErrorMessage = "ID is required")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Product name is required")]
        public string Name { get; set; } = string.Empty;

        [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public int StockQuantity { get; set; }
    }
}
