from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask import current_app as app
from flask_login import current_user, login_required
from werkzeug.urls import url_parse
from datetime import datetime

from app import db, services
from app.models import User, ExpenseCategory, Transaction
from app.forms import TransactionForm


transactions_bp = Blueprint("transactions", __name__, url_prefix="/transactions")

def get_form(obj=None):
    form = TransactionForm(obj=obj)
    # Populate dynamic fields
    categories = ExpenseCategory.query.order_by(ExpenseCategory.title).all()
    category_choices = [(0, 'Select category')] + [(category.id, category.title) for category in categories]
    form.category.choices = category_choices

    users = User.query.all()
    user_choices = [(0, 'Select user')] + [(user.id, user.username) for user in users]
    form.user.choices = user_choices
    form.user.data = current_user.id

    # If an obj is defined, this is an update form. change form submit text.
    if obj:
        form.submit.label.text = 'update transaction'
    else:
        form.date.data = datetime.now()

    return form

@transactions_bp.route('/')
@transactions_bp.route('/index')
@transactions_bp.route('/all')
@login_required
def all():
    transaction_service = services.TransactionService()
    transactions = transaction_service.get_all()
    
    # Sanitize transaction data for frontend
    data = transaction_service.sanitize_for_client(transactions)

    return render_template('transactions.html', title='transactions',  transactions=data)

@transactions_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create():
    form = get_form()

    if form.validate_on_submit():
        form = TransactionForm()
        user_id = form.user.data
        user = User.query.filter_by(id=user_id).first()
        is_income = form.is_income.data == 'True'
        date = form.date.data
        amount_cents = int(form.amount.data * 100)
        source = form.source.data
        category = db.session.query(ExpenseCategory).get(form.category.data).title
        notes = form.notes.data

        transaction = Transaction(
            is_income=is_income,
            date=date,
            amount_cents=amount_cents,
            source=source, 
            category=category,
            notes=notes,
            created_by=user
        )

        db.session.add(transaction)
        db.session.commit()

        flash(f'transaction created :: {form.source.data} for ${form.amount.data}')
        return redirect(url_for('transactions.all'))

    return render_template('transaction-detail.html', title='create transaction', form=form)

@transactions_bp.route('/update/<id>', methods=['GET', 'POST'])
@login_required
def update(id):
    data = Transaction.query.filter_by(id=int(id)).first_or_404()
    form = get_form(obj=data)

    # Translate data to match forms where needed.
    form.user.data = data.user_id
    form.category.data = ExpenseCategory.query.filter_by(title=data.category).first().id
    form.amount.data = float("%0.2f" % (data.amount_cents / 100,))

    if form.validate_on_submit() and data is not None:
        form = TransactionForm()
        date = form.date.data
        user_id = form.user.data
        is_income = form.is_income.data == 'True'
        amount_cents = int(form.amount.data * 100)
        source = form.source.data
        category = db.session.query(ExpenseCategory).get(form.category.data).title
        notes = form.notes.data

        updates = {
            'date': date,
            'is_income': is_income,
            'user_id': user_id,
            'amount_cents': amount_cents,
            'source': source,
            'category': category,
            'notes': notes
        }

        db.session.query(Transaction).filter_by(id=int(id)).update(updates)
        db.session.commit()

        flash(f'updated transaction #{id}')
        return redirect(url_for('transactions.all'))

    return render_template('transaction-detail.html', title='update transaction', form=form, transaction=data)

@transactions_bp.route('/delete/<id>', methods=['GET', 'POST'])
@login_required
def delete(id):
    transaction = db.session.query(Transaction).get(id)
    db.session.delete(transaction)
    db.session.commit()
    
    flash(f'deleted transaction #{id}')
    return redirect(url_for('transactions.all'))
