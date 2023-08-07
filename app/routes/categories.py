from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required
from datetime import datetime

from app import db
from app.models import User, ExpenseCategory, Transaction
from app.forms import CategoryForm


categories_bp = Blueprint("categories", __name__, url_prefix="/categories")

@categories_bp.route('/')
@categories_bp.route('/index')
@categories_bp.route('/all')
@login_required
def all():
    form = CategoryForm()
    categories = ExpenseCategory.query.order_by(ExpenseCategory.title).all()

    return render_template('categories.html', title='categories', form=form, categories=categories)

@categories_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    form = CategoryForm()

    if form.validate_on_submit():
        category = ExpenseCategory(
            title=form.title.data,
            is_fixed=form.is_fixed.data == 'True',
            notes=form.notes.data
        )
        db.session.add(category)
        db.session.commit()
        
        flash(f'added new category :: {form.title.data}')
        return redirect(url_for('categories.all'))

    return render_template('category-detail.html', title='create category', form=form)

@categories_bp.route('/update/<id>', methods=['GET', 'POST'])
@login_required
def update(id):
    data = ExpenseCategory.query.filter_by(id=int(id)).first_or_404()
    form = CategoryForm(obj=data)

    # Update form submit text.
    form.submit.label.text = 'update category'

    if form.validate_on_submit():

        updates = {
            'title': form.title.data,
            'is_fixed': form.is_fixed.data == 'True',
            'notes': form.notes.data
        }

        db.session.query(ExpenseCategory).filter_by(id=int(id)).update(updates)
        db.session.commit()
        
        flash(f'updated category #{id}')
        return redirect(url_for('categories.all'))

    return render_template('category-detail.html', title='update category', form=form, category=data)

@categories_bp.route('/delete/<id>', methods=['GET', 'POST'])
@login_required
def delete(id):
    category = db.session.query(ExpenseCategory).get(id)
    db.session.delete(category)
    db.session.commit()
    
    flash(f'deleted category #{id}')
    return redirect(url_for('categories.all'))

@categories_bp.route('/transactions/<id>', methods=['GET', 'POST'])
@login_required
def transactions(id):
    category = ExpenseCategory.query.filter_by(id=int(id)).first_or_404()
    transactions = Transaction.query.filter_by(category=category.title).all()
    title = f'#{category.title} Transactions'

    # Sanitize transaction data for frontend
    data = []
    for t in transactions:
        amount_in_dollars = t.amount_cents / 100

        if not t.is_income:
            amount_in_dollars = -1 * amount_in_dollars

        el = {}
        el['id'] = t.id
        el['date'] = datetime.date(t.date).strftime("%m/%d/%Y") if t.date else None
        el['amount'] = f'{amount_in_dollars:.2f}'
        el['source'] = t.source
        el['category'] = t.category
        el['created_by'] = t.created_by
        el['notes'] = t.notes
        el['is_income'] = t.is_income

        data.append(el)

    return render_template('transactions.html', title=title,  transactions=data)
