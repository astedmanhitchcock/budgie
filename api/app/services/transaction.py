from datetime import datetime

from app.models import Transaction
from app import db

class TransactionService():
    
  # -------------------------
  # Transaction

  def get_all(self):
    all_transactions = Transaction.query.order_by(Transaction.date.desc()).all()

    return all_transactions
  
  def get_one(self, id):
    transaction = Transaction.query.filter_by(id=int(id)).first_or_404()

    return transaction
  
  def delete_transaction(self, id):
    transaction = db.session.query(Transaction).get(id)
    db.session.delete(transaction)
    db.session.commit()

    return id
  
  def sanitize_transaction(self, transaction):
    amount_in_dollars = transaction.amount_cents / 100

    # if not transaction.is_income:
    #   amount_in_dollars = -1 * amount_in_dollars

    el = {}
    el['id'] = transaction.id
    el['date'] = datetime.date(transaction.date).strftime("%m/%d/%Y") if transaction.date else None
    el['amount'] = f'{amount_in_dollars:.2f}'
    el['source'] = transaction.source
    el['category'] = transaction.category
    el['created_by'] = transaction.created_by
    el['notes'] = transaction.notes
    el['is_income'] = transaction.is_income
    el['created_by'] = transaction.created_by.username

    return el
    
  def sanitize_for_client(self, transactions):
    data = []
    for t in transactions:
        el = TransactionService.sanitize_transaction(self, t)

        data.append(el)
    
    return data
