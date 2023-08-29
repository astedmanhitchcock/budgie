from flask import Blueprint, flash, redirect, render_template, url_for
from flask_login import login_required
from datetime import datetime

from app import db, services
from app.models import ExpenseCategory, MonthlyFixedBudget
from app.forms import BudgetForm


budgets_bp = Blueprint("budgets", __name__, url_prefix="/budgets")


def get_budget_form(obj=None):
    fixed_expenses_query = ExpenseCategory.query.filter_by(is_fixed=True).all()
    flex_expenses_query =  ExpenseCategory.query.filter_by(is_fixed=False).all()
    fixed_expenses = []
    flex_expenses = []

    if fixed_expenses_query:
        fixed_expenses = [{exp.title: 0} for exp in fixed_expenses_query]

    if flex_expenses_query:
        flex_expenses = [{exp.title: 0} for exp in flex_expenses_query]

    form = BudgetForm(obj=obj, fixed_expenses=fixed_expenses, flex_expenses=flex_expenses)

    return form


@budgets_bp.route('/')
@budgets_bp.route('/index')
@budgets_bp.route('/all')
@login_required
def all():
    budgets_service = services.BudgetsService()
    budgets =budgets_service.get_all()

    return render_template('budgets.html', title='budgets', budgets=budgets)


@budgets_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    form = get_budget_form()

    if form.validate_on_submit():
        fixed_expenses_cents = dict()
        for input in form.fixed_expenses:
            for el in input.object_data.items():
                fixed_expenses_cents[el[0]] = int(input.amount.data * 100)

        flex_expenses_cents = dict()
        for input in form.flex_expenses:
            for el in input.object_data.items():
                flex_expenses_cents[el[0]] = int(input.amount.data * 100)
        
        income_in_cents = int(form.income.data * 100)

        budget = MonthlyFixedBudget(
            name=form.name.data,
            month=form.month.data,
            income_cents=income_in_cents,
            fixed_expenses_cents=fixed_expenses_cents,
            flex_expenses_cents=flex_expenses_cents
        )
        db.session.add(budget)
        db.session.commit()

        flash(f"added new budget for the month of {budget.month.strftime('%m/%Y')}")
        return redirect(url_for('budgets.all'))

    return render_template('budget-detail.html', title='create budget', form=form)


@budgets_bp.route('/update/<id>', methods=['GET', 'POST'])
@login_required
def update(id):
    budget = MonthlyFixedBudget.query.filter_by(id=int(id)).first_or_404()
    form = get_budget_form(obj=budget)
    print('heloo!', id)

    if budget:
        month_str = budget.month.strftime('%m/%Y')

    # Translate data to match forms where needed.
    if budget.income_cents is not None:
        form.income.data = float("%0.2f" % (budget.income_cents / 100,))

    # Update form submit text.
    form.submit.label.text = 'update monthly budget'

    # Update dynamic fixed expenses input data.
    if budget.fixed_expenses_cents:
        for input in form.fixed_expenses:
            for el in input.object_data.items():
                if budget.fixed_expenses_cents.get(el[0]):
                    input.amount.data = float("%0.2f" % (budget.fixed_expenses_cents.get(el[0]) / 100,))

    # Update dynamic flexible expenses input data.
    if budget.flex_expenses_cents:
        for input in form.flex_expenses:
            for el in input.object_data.items():
                if budget.flex_expenses_cents.get(el[0]):
                    input.amount.data = float("%0.2f" % (budget.flex_expenses_cents.get(el[0]) / 100,))   

    if form.validate_on_submit():
        form = get_budget_form()
        print(form)
        # Gather data from dynamic fixed expenses fields.
        fixed_expenses_cents = dict()
        for input in form.fixed_expenses:
            for el in input.object_data.items():
                fixed_expenses_cents[el[0]] = int(input.amount.data * 100)

        # Gather data from dynamic flexible expenses fields.
        flex_expenses_cents = dict()
        for input in form.flex_expenses:
            for el in input.object_data.items():
                flex_expenses_cents[el[0]] = int(input.amount.data * 100)

        updates = {
            'name': form.name.data,
            'month': form.month.data,
            'income_cents': int(form.income.data * 100),
            'fixed_expenses_cents': fixed_expenses_cents,
            'flex_expenses_cents': flex_expenses_cents
        }
        print(updates)
        db.session.query(MonthlyFixedBudget).filter_by(id=int(id)).update(updates)
        db.session.commit()
        flash(f'updated budget #{id}')
        return redirect(url_for('budgets.all'))

    return render_template('budget-detail.html', title='update budget', form=form, budget=budget, month_str=month_str)


@budgets_bp.route('/delete/<id>', methods=['GET', 'POST'])
@login_required
def delete(id):
    budget = db.session.query(MonthlyFixedBudget).get(id)
    db.session.delete(budget)
    db.session.commit()
    
    flash(f"deleted budget for {budget.month.strftime('%Y-%d')}")
    return redirect(url_for('budgets.all'))
