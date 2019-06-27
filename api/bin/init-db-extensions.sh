#!/bin/bash

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

"psql" --dbname=human_factors <<-'EOSQL'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL