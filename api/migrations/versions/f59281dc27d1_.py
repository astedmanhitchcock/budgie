"""empty message

Revision ID: f59281dc27d1
Revises: 1268d4900090
Create Date: 2023-07-11 22:38:11.283249

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'f59281dc27d1'
down_revision = '1268d4900090'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('monthly_fixed_budget', schema=None) as batch_op:
        batch_op.add_column(sa.Column('flex_expenses_cents', sa.PickleType(), nullable=True))
        batch_op.add_column(sa.Column('fixed_expenses_cents', sa.PickleType(), nullable=True))
        batch_op.drop_column('expenses_cents')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('monthly_fixed_budget', schema=None) as batch_op:
        batch_op.add_column(sa.Column('expenses_cents', postgresql.BYTEA(), autoincrement=False, nullable=True))
        batch_op.drop_column('fixed_expenses_cents')
        batch_op.drop_column('flex_expenses_cents')

    # ### end Alembic commands ###