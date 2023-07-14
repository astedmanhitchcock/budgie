from wtforms import StringField, PasswordField, BooleanField, SubmitField, DecimalField, SelectField, TextAreaField, DateField, RadioField, FieldList, FormField
from flask_wtf import FlaskForm
from wtforms.validators import DataRequired

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    remember_me = BooleanField('Remember Me')
    submit = SubmitField('Sign In')


class TransactionForm(FlaskForm):
    user = SelectField('user', coerce=int, validators=[DataRequired()])
    is_income = RadioField('is this income?', choices=[(True, 'yes'), (False, 'no')], validators=[DataRequired()])
    date = DateField('date of transaction')
    amount = DecimalField('amount', validators=[DataRequired()])
    source = StringField('source', validators=[DataRequired()])
    category = SelectField('category', coerce=int, validators=[DataRequired()])
    notes = TextAreaField('notes')
    submit = SubmitField('create new transaction')


class CategoryForm(FlaskForm):
    title = StringField('title', validators=[DataRequired()])
    is_fixed = RadioField('is this a fixed monthly?', choices=[(True, 'yes'), (False, 'no')], default=False)
    notes = TextAreaField('notes')
    submit = SubmitField('create new category')


class BudgetSelect(FlaskForm):
    month = SelectField('month', coerce=int, validators=[DataRequired()])
    submit = SubmitField('view budget')


class ExpenseEntryForm(FlaskForm):
    amount = DecimalField('amount')

class BudgetForm(FlaskForm):
    month = DateField('month', format='%Y-%m', validators=[DataRequired()])
    income = DecimalField('montly income', validators=[DataRequired()])
    submit = SubmitField('create new monthly budget')
    fixed_expenses = FieldList(FormField(ExpenseEntryForm))
    flex_expenses = FieldList(FormField(ExpenseEntryForm))
