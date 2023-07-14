"""empty message

Revision ID: 4d86770331a9
Revises: 383a22b454a7
Create Date: 2023-06-30 12:07:06.362959

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '4d86770331a9'
down_revision = '383a22b454a7'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transaction', schema=None) as batch_op:
        batch_op.add_column(sa.Column('is_income', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('created_date', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('notes', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.create_index(batch_op.f('ix_transaction_amount_cents'), ['amount_cents'], unique=False)
        batch_op.create_index(batch_op.f('ix_transaction_created_date'), ['created_date'], unique=False)
        batch_op.create_index(batch_op.f('ix_transaction_is_income'), ['is_income'], unique=False)
        batch_op.create_foreign_key(None, 'user', ['user_id'], ['id'])
        batch_op.drop_column('created')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('transaction', schema=None) as batch_op:
        batch_op.add_column(sa.Column('created', postgresql.TIMESTAMP(), autoincrement=False, nullable=True))
        batch_op.drop_constraint(None, type_='foreignkey')
        batch_op.drop_index(batch_op.f('ix_transaction_is_income'))
        batch_op.drop_index(batch_op.f('ix_transaction_created_date'))
        batch_op.drop_index(batch_op.f('ix_transaction_amount_cents'))
        batch_op.drop_column('user_id')
        batch_op.drop_column('notes')
        batch_op.drop_column('created_date')
        batch_op.drop_column('is_income')

    op.create_table('votes',
    sa.Column('vote_id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('time_cast', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('candidate', sa.VARCHAR(length=6), autoincrement=False, nullable=False),
    sa.PrimaryKeyConstraint('vote_id', name='votes_pkey')
    )
    # ### end Alembic commands ###
