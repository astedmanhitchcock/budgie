"""empty message

Revision ID: ba96162b8f64
Revises: bb28502bd4f8
Create Date: 2023-07-07 15:16:32.707138

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ba96162b8f64'
down_revision = 'bb28502bd4f8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('monthly_fixed_budget',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('month', sa.DateTime(), nullable=True),
    sa.Column('income', sa.PickleType(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('monthly_fixed_budget', schema=None) as batch_op:
        batch_op.create_index(batch_op.f('ix_monthly_fixed_budget_month'), ['month'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('monthly_fixed_budget', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_monthly_fixed_budget_month'))

    op.drop_table('monthly_fixed_budget')
    # ### end Alembic commands ###
