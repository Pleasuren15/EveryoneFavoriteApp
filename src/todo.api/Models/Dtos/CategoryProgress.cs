namespace todo.api.Models.Dtos
{
    public class CategoryProgress
    {
        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public int TotalTodos { get; set; }
        public int CompletedTodos { get; set; }
    }
}
