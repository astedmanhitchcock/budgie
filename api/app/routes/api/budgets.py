from flask import Blueprint, jsonify, request

from app import db, services
from app.models import MonthlyFixedBudget

budget_api_bp = Blueprint("api", __name__, url_prefix="/budgets")

@budget_api_bp.route('/')
def get_all():
  budgets_service = services.BudgetsService()
  budgets = budgets_service.get_all()

  return jsonify(budgets)

@budget_api_bp.route('/<id>', methods=['GET', 'POST'])
def get_one(id):
  budgets_service = services.BudgetsService()
  budget = budgets_service.get_by_id(id)

  return jsonify(budget)

@budget_api_bp.route('/create-budget', methods=['POST'])
def create_budget():
  body = request.get_json()
  print('body :', body)
  budgets = get_all()
  return budgets
