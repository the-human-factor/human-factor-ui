#!/bin/bash

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

"psql" <<- 'EOSQL'
CREATE DATABASE human_factor;
EOSQL

"psql" --dbname=human_factor <<-'EOSQL'
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
EOSQL
