from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from datetime import datetime

from app import db, services
from app.models import Transaction

api_bp = Blueprint("api", __name__, url_prefix="/api/v0")

@api_bp.route('/transactions')
def transactions():
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

@api_bp.route('/update-transaction', methods=['POST'])
def update_transaction():
    print('updating??')
    body = request.get_json()
    id = body.get('id')
    amount = body.get('amount')
    print('body : ', body)
    print(float(amount))
    amount_cents = int(float(amount) * 100) if amount is not None else 0.00
    print(amount_cents)
    updates = {
      'is_income': body.get('is_income'),
      'amount_cents': amount_cents
    }
    # print(updates)
    db.session.query(Transaction).filter_by(id=int(id)).update(updates)
    db.session.commit()

    return jsonify({'success': True})


@api_bp.route('/delete-transaction', methods=['POST'])
def delete_transaction():
    body = request.get_json()
    id = body.get('id')
    
    if id is not None:
      transaction_service = services.TransactionService() 
      deleted_transaction = transaction_service.delete_transaction(id)

      if deleted_transaction is not None:
          return jsonify({'success': True})

    return jsonify({'success': False})