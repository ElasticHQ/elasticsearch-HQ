#!/bin/bash
#
# usage: run_tests [options]
#
# If no options are given, all tests are run and a code coverage report appears
# in tests/cover.
#
# [options] can be one or more of any combination of:
#   -h                              - Show this help
#   -v|-vv|-vvv                     - Run all tests with more verbose output
#   any valid py.test options       - see 'py.test --help'
#   directory                       - run all tests in a directory
#   filename                        - run all tests in filename
#   filename::classname             - run all tests for classname in filename
#   filename::classname::methodname - run methodname test for classname
#                                     in filename
#
# To run all tests and generate a code coverate report:
#   run_tests
#
# To list the available tests:
#   run_tests --collect-only
#
# To list the available tests in a directory or file:
#   run_tests --collect-only <directory-or-filename> [...[directory-or-filename]]
#

set -eu -o pipefail

script_dir=$(cd "$(dirname $0)"; pwd -P)
coverage_rc="$script_dir/tests/.coveragerc"

function create_coverage_rc {
  output_file=${1:?No coveragerc filepath given}

  cat >"$output_file" <<EOF
; vim: ft=dosini:
; Generated on $(date) from $script_dir/$(basename $0)
[run]
omit = $script_dir/tests/*

[html]
directory = $script_dir/tests/cover

[xml]
output = $script_dir/tests/coverage.xml
EOF
}


function run_all_tests {
  create_coverage_rc "$coverage_rc"

  py.test \
    -c "$script_dir/tests/pytest.ini" \
    --cov=elastichq \
    --cov-report xml \
    --cov-report html \
    --cov-config="$coverage_rc" \
    "$@" \
    "$script_dir/tests"
}

function run_some_tests {
  py.test \
    -c "$script_dir/tests/pytest.ini" \
    "$@"
}

if [ $# -eq 0 ]; then
  run_all_tests 
elif [ $# -gt 1 ]; then
  run_some_tests "$@"
else
  # Specialize the single arg version of the script

  case "$1" in
    --help|-h)
      py.test --help
      ;;
    --collect-only)
      # list the tests
      run_all_tests "$1"
      ;;
    -v|-vv|-vvv)
      # run all tests with various levels of verbosity
      run_all_tests "$1"
      ;;
    create_coverage_rc)
      # Create the test .coveragerc file
      create_coverage_rc "$coverage_rc"
      ;;
    *)
      run_some_tests "$@"
      ;;
  esac
fi
