using Microsoft.AspNetCore.Mvc;
using InventoryManagerAPI.Controllers.Models;

namespace InventoryManagerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // La ruta será: api/inventario

    public class InventoryController : ControllerBase
    {
        private static List<Product> products = new List<Product>
        {
            new Product { Id = 1, Name = "Laptop", StockQuantity = 10 }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            return Ok(products);
        }

        [HttpPost]
        public ActionResult PostProduct(Product newProduct)
        {
            products.Add(newProduct);
            return CreatedAtAction(nameof(GetProducts), new { id = newProduct.Id }, newProduct);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = products.Find(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            products.Remove(product);
            return NoContent();
        }
    }
}