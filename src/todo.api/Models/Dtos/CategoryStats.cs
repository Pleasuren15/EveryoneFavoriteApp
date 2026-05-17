namespace todo.api.Models.Dtos
{
    public class CategoryStats
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int TotalTodos { get; set; }
        public int CompletedTodos { get; set; }
    }
}
