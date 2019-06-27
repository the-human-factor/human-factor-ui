"""Adds initial models

Revision ID: 6e159345b189
Revises: 
Create Date: 2019-06-27 16:26:38.826635

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '6e159345b189'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('responder',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Unicode(length=255), nullable=True),
    sa.Column('email', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('video',
    sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), nullable=False),
    sa.Column('name', sa.Unicode(length=255), nullable=True),
    sa.Column('url', sa.String(length=512), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('challenge',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Unicode(length=255), nullable=False),
    sa.Column('description', sa.UnicodeText(), nullable=False),
    sa.Column('grading_rubric', sa.UnicodeText(), nullable=False),
    sa.Column('notes', sa.UnicodeText(), nullable=False),
    sa.Column('video_id', postgresql.UUID(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['video_id'], ['video.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('response',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('challenge_id', sa.Integer(), nullable=False),
    sa.Column('responder_id', sa.Integer(), nullable=False),
    sa.Column('video_id', postgresql.UUID(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['challenge_id'], ['challenge.id'], ),
    sa.ForeignKeyConstraint(['responder_id'], ['responder.id'], ),
    sa.ForeignKeyConstraint(['video_id'], ['video.id'], ),
    sa.PrimaryKeyConstraint('id', 'challenge_id', 'responder_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('response')
    op.drop_table('challenge')
    op.drop_table('video')
    op.drop_table('responder')
    # ### end Alembic commands ###