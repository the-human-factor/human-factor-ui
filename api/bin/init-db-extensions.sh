#!/bin/bash

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

"psql" --dbname=human_factor <<-'EOSQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EOSQL
