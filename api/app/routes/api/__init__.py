from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from datetime import datetime

from app import db, services
from app.models import ExpenseCategory, Transaction, User

from app.routes.api.budgets import budget_api_bp  # noqa

api_bp = Blueprint("api", __name__, url_prefix="/api/v0")
api_bp.register_blueprint(budget_api_bp)

@api_bp.route('/transactions')
def get_all_transactions():
    transaction_service = services.TransactionService()
    transactions = transaction_service.get_all()
    data = transaction_service.sanitize_for_client(transactions)

    return jsonify(data)

@api_bp.route('/transactions/<id>')
def get_transaction(id):
    transaction_service = services.TransactionService()
    transaction = transaction_service.get_one(id)
    data = transaction_service.sanitize_transaction(transaction)

    return jsonify(data)

@api_bp.route('/create-transaction', methods=['POST'])
def create_transaction():
    body = request.get_json()
    amount = body.get('amount')
    amount_cents = int(float(amount) * 100) if amount is not None else 0.00
    user = User.query.filter_by(id=body.get('created_by')).first()

    transaction = Transaction(
      is_income=body.get('is_income'),
      amount_cents=amount_cents,
      source=body.get('source'), 
      date=body.get('date'),
      created_by=user,
      category=body.get('category'),
      notes=body.get('notes'),
    )

    db.session.add(transaction)
    db.session.commit()
    
    transactions = get_all_transactions()

    return transactions

@api_bp.route('/update-transaction', methods=['POST'])
def update_transaction():
    body = request.get_json()
    id = body.get('id')
    amount = body.get('amount')
    amount_cents = int(float(amount) * 100) if amount is not None else 0.00

    updates = {
      'is_income': body.get('is_income'),
      'amount_cents': amount_cents,
      'source': body.get('source'),
      'date': body.get('date'),
      'user_id': body.get('created_by'),
      'category': body.get('category'),
      'notes': body.get('notes')
    }

    db.session.query(Transaction).filter_by(id=int(id)).update(updates)
    db.session.commit()

    transactions = get_all_transactions()

    return transactions


@api_bp.route('/delete-transaction', methods=['POST'])
def delete_transaction():
    body = request.get_json()
    id = body.get('id')
    
    if id is not None:
      transaction_service = services.TransactionService() 
      transaction_service.delete_transaction(id)
      transactions = get_all_transactions()

      return transactions

@api_bp.route('/users')
def get_all_users():
    users = User.query.all()
    data = []

    for u in users:
        user = {}
        user['id'] = u.id
        user['username'] = u.username

        data.append(user)

    return jsonify(data)

@api_bp.route('/categories')
def get_all_categories():
    categories = ExpenseCategory.query.order_by(ExpenseCategory.title).all()
    data = []

    for c in categories:
        category = {}
        category['id'] = c.id
        category['title'] = c.title
        category['is_fixed'] = c.is_fixed
        category['notes'] = c.notes

        data.append(category)

    return jsonify(data)

@api_bp.route('/create-category', methods=['POST'])
def create_category():
    body = request.get_json()
    category = ExpenseCategory(
        title=body.get('title'),
        is_fixed=body.get('is_fixed'),
        notes=body.get('notes')
    )
    db.session.add(category)
    db.session.commit()

    categories = get_all_categories()
    return categories

@api_bp.route('/update-category', methods=['POST'])
def update_category():
    body = request.get_json()
    id = body.get('id')
    print(id)

    if (id):
      updates = {
        'title': body.get('title'),
        'is_fixed': body.get('is_fixed'),
        'notes': body.get('notes')
      }
      print(updates)
      db.session.query(ExpenseCategory).filter_by(id=int(id)).update(updates)
      db.session.commit()

    categories = get_all_categories()
    return categories

@api_bp.route('/delete-category', methods=['POST'])
def delete_category():
    body = request.get_json()
    id = body.get('id')
    if (id):
      transaction = db.session.query(ExpenseCategory).get(id)
      db.session.delete(transaction)
      db.session.commit()

    categories = get_all_categories()
    return categories