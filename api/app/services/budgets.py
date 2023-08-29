
from app.models import MonthlyFixedBudget
from app import db

class BudgetsService():
    
  # -------------------------
  # Budgets

  def sanitize_budget(self, budget): 
    income_in_dollars = None

    if budget.income_cents is not None:
      income_in_dollars = f'{budget.income_cents/100:.2f}'

    el = {}
    el['id'] = budget.id
    el['name'] = budget.name
    el['month'] = budget.month.strftime('%m/%Y')
    el['income'] = income_in_dollars
    el['flex_expenses'] = budget.flex_expenses_cents
    el['fixed_expenses'] = budget.fixed_expenses_cents

    return el

  def get_all(self):
    all_budgets =  MonthlyFixedBudget.query.all()

    # Sanitize transaction data for frontend
    data = []
    for b in all_budgets:
      sanitized_budget = BudgetsService.sanitize_budget(self, budget=b)
      data.append(sanitized_budget)

    return data
  
  def get_by_id(self, id):
     budget = MonthlyFixedBudget.query.filter_by(id=int(id)).first_or_404()
     sanitized_budget = BudgetsService.sanitize_budget(self, budget=budget)

     return sanitized_budget