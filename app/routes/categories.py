from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import current_user, login_required

from app import db
from app.models import User, ExpenseCategory
from app.forms import CategoryForm


categories_bp = Blueprint("categories", __name__, url_prefix="/categories")

@categories_bp.route('/')
@categories_bp.route('/index')
@categories_bp.route('/all')
@login_required
def all():
    form = CategoryForm()
    categories = ExpenseCategory.query.order_by(ExpenseCategory.title).all()

    return render_template('categories.html', title='add category', form=form, categories=categories)

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

    return render_template('category-detail.html', form=form)

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

    return render_template('category-detail.html', form=form, category=data)

@categories_bp.route('/delete/<id>', methods=['GET', 'POST'])
@login_required
def delete(id):
    category = db.session.query(ExpenseCategory).get(id)
    db.session.delete(category)
    db.session.commit()
    
    flash(f'deleted category #{id}')
    return redirect(url_for('categories.all'))
