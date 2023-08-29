from app.models import ExpenseCategory

class CategoriesService():
    
  # -------------------------
  # Transaction

  def get_all(self):
    all_categories = ExpenseCategory.query.order_by(ExpenseCategory.title).all()

    return all_categories