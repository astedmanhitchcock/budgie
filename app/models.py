from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from flask_login import UserMixin
from app import db, login

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(128), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    transactions = db.relationship('Transaction', backref='created_by', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)
    

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    is_income = db.Column(db.Boolean, index=True)
    date = db.Column(db.DateTime, index=True)
    created_date = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    amount_cents = db.Column(db.Integer, index=True, nullable=False)
    source = db.Column(db.String(128), index=True, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(128), index=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Transaction {}>'.format(self.id)


class ExpenseCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), index=True, unique=True)
    is_fixed = db.Column(db.Boolean, index=True, nullable=True, default=False)
    notes = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return '<ExpenseCategory {}>'.format(self.title)


class MonthlyFixedBudget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    month = db.Column(db.DateTime, index=True)
    income_cents = db.Column(db.Integer)
    flex_expenses_cents = db.Column(db.PickleType)
    fixed_expenses_cents = db.Column(db.PickleType)

    def __repr__(self):
        return f"<MonthlyFixedBudget {self.month.strftime('%m/%Y')}>"
