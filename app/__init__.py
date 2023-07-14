from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config
from flask_login import LoginManager
from flask_bootstrap import Bootstrap
from google.cloud import error_reporting

# Globally accessible libraries
db = SQLAlchemy()
migrate = Migrate()
login = LoginManager()
bootstrap = Bootstrap()

def create_app():
    print('creating app')

    app = Flask(__name__)
    app.config.from_object(Config)
    print(app.config['SECRET_KEY'])

    # Initialize Plugins
    db.init_app(app)
    migrate.init_app(app, db)
    login.init_app(app)
    login.login_view = 'auth.login'
    bootstrap.init_app(app)

    # Add an error handler that reports exceptions to Stackdriver Error
    # Reporting. Note that this error handler is only used when debug
    # is False
    # [START setup_error_reporting]
    @app.errorhandler(500)
    def server_error(e):
        client = error_reporting.Client(app.config['PROJECT_ID'])
        client.report_exception(
            http_context=error_reporting.build_flask_context(request))
        return """
        An internal error occurred.
        """, 500
    # [END setup_error_reporting]

    with app.app_context():
        from app.routes import routes
        from app.routes import auth_bp, transactions_bp, categories_bp, budgets_bp

        app.register_blueprint(auth_bp)
        app.register_blueprint(transactions_bp)
        app.register_blueprint(categories_bp)
        app.register_blueprint(budgets_bp)

        return app  
