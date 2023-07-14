from flask import current_app as app, redirect, render_template, url_for
from flask_login import login_required
from datetime import datetime
from app.forms import BudgetSelect
from app.models import User, MonthlyFixedBudget, Transaction, ExpenseCategory
from sqlalchemy.sql import extract

@app.route('/')
@app.route('/index')
def index():

    return render_template('index.html')


@app.route('/dashboard', defaults={'budget_id': None}, methods=['GET', 'POST'])
@app.route('/dashboard/<budget_id>', methods=['GET', 'POST'])
@login_required
def dashboard(budget_id):
    all_budgets = MonthlyFixedBudget.query.all()
    curr_budget = None
    curr_month_str = None

    budget_select_form = BudgetSelect()
    budget_choices = [(0, 'Select Monthly Budget')] + [(budget.id, budget.month.strftime('%m/%Y')) for budget in all_budgets]
    budget_select_form.month.choices = budget_choices
    
    if budget_select_form.validate_on_submit():
        return redirect(url_for('dashboard', budget_id=budget_select_form.month.data))
    
    if all_budgets:
        if budget_id:
            curr_budget = MonthlyFixedBudget.query.filter_by(id=int(budget_id)).first_or_404()     
        else:
            curr_date = datetime.today()
            formatted_date = datetime(curr_date.year, curr_date.month, 1)
            curr_budget = MonthlyFixedBudget.query.filter_by(month=formatted_date).first()
            if curr_budget is None:
                curr_budget = MonthlyFixedBudget.query.one()
    
    # Sanitize for the FE
    # Sets date string and establishes selected budget in select field.
    if curr_budget:
        curr_month_str = curr_budget.month.strftime('%m/%Y')
        budget_select_form.month.data = curr_budget.id
        income_in_dollars = None

        if curr_budget.income_cents is not None:
            income_in_dollars = curr_budget.income_cents/100

        projected = dict()
        fixed_expenses = []
        flexible_expenses = []
        total_expenses = 0
        total_savings = 0

        if curr_budget.fixed_expenses_cents:
            fixed_expenses = [(f'{key}', f'{val/100:.2f}') for key, val in curr_budget.fixed_expenses_cents.items()]
        if curr_budget.flex_expenses_cents:
            flexible_expenses = [(f'{key}', f'{val/100:.2f}') for key, val in curr_budget.flex_expenses_cents.items()]
        total_expenses = sum([(float(expense[1])) for expense in fixed_expenses] + [(float(expense[1])) for expense in flexible_expenses])
        total_savings = income_in_dollars - total_expenses

        projected = {
            'income': f'{income_in_dollars:.2f}',
            'fixed expenses': fixed_expenses,
            'flexible expenses': flexible_expenses,
            'total expenses': f'{total_expenses:.2f}',
            'savings': f'{total_savings:.2f}'
        }
        print(curr_budget.month.month)
        # Get actual income for month
        income_transactions = Transaction.query.filter(Transaction.is_income == True, extract('month', Transaction.date) == curr_budget.month.month).all()
        total_income_in_dollars = sum([(float(transaction.amount_cents/100)) for transaction in income_transactions])
       
        # Get actual fixed expenses
        fixed_expenses_all = ExpenseCategory.query.filter_by(is_fixed=True).all()
        fixed_expense_category_titles = [(category.title) for category in fixed_expenses_all]
        actual_fixed_expenses_all = Transaction.query.filter(Transaction.category.in_(fixed_expense_category_titles), extract('month', Transaction.date) == curr_budget.month.month, Transaction.is_income == False).all()
        actual_fixed_expenses = []
        for title in fixed_expense_category_titles:
            for expense in actual_fixed_expenses_all:
                if expense.category == title:
                    key = f'{title}'
                    value = f'{expense.amount_cents/100:.2f}'
                else:
                    key = f'{title}'
                    value = 0

                actual_fixed_expenses.append([key, value])

        # Get actual flexible expenses
        flex_expenses_all = ExpenseCategory.query.filter_by(is_fixed=False).all()
        flex_expense_category_titles = [(category.title) for category in flex_expenses_all]
        actual_flex_expenses_all = Transaction.query.filter(Transaction.category.in_(flex_expense_category_titles), extract('month', Transaction.date) == curr_budget.month.month, Transaction.is_income == False).all()
        actual_flex_expenses = []
        for title in flex_expense_category_titles:
            key = f'{title}'
            values = []
            for actual_expense in actual_flex_expenses_all:
                if actual_expense.category == title:
                    values.append(actual_expense.amount_cents)
            value = f'{sum(values)/100:.2f}'
            actual_flex_expenses.append([key, value])

        # Get actual totals
        actual_total_expense =  sum([(float(expense[1])) for expense in actual_fixed_expenses] + [(float(expense[1])) for expense in actual_flex_expenses])
        actual_savings = total_income_in_dollars - actual_total_expense
        actual = {
            'income': f'{total_income_in_dollars:.2f}',
            'fixed expenses': actual_fixed_expenses,
            'flexible expenses': actual_flex_expenses,
            'total expenses': f'{actual_total_expense:.2f}',
            'savings': f'{actual_savings:.2f}'
        }
    
    return render_template('dashboard.html', title='dashboard', budget_select_form=budget_select_form, budget=curr_budget, month_str=curr_month_str, projected=projected, actual=actual)


@app.route('/budgie/user/<username>')
@login_required
def user(username):
    user = User.query.filter_by(username=username).first_or_404()
    posts = user.posts.all()
    transactions = user.transactions.all()

    # Sanitize transaction data for frontend - this is getting duplicative.
    # @TODO: refactor this and the above version into helper.
    data = []
    for t in transactions:
        amount_in_dollars = float("%0.2f" % (t.amount_cents / 100,))

        if not t.is_income:
            amount_in_dollars = -1 * amount_in_dollars

        el = {}
        el['id'] = t.id
        el['date'] = datetime.date(t.date).strftime("%m/%d/%Y")
        el['amount'] = amount_in_dollars 
        el['source'] = t.source
        el['category'] = t.category
        el['notes'] = t.notes
        el['created_by'] = t.created_by
        el['is_income'] = t.is_income

        data.append(el)

    return render_template('user.html', user=user, posts=posts, transactions=data)
